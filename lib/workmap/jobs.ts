import { after } from "next/server";
import { z } from "zod";
import {
  claimLease,
  getSession,
  listSessions,
  releaseLease,
  saveSession,
} from "./store";
import { runGenerationStep } from "./pipeline";
import { deliverPending, safeEqual } from "./service";
import { sendPurchase } from "./meta";
import type { Session } from "./schema";
export const workKindSchema = z.enum(["generate", "email", "meta"]);
export type WorkKind = z.infer<typeof workKindSchema>;
export const workTaskSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{64}$/),
  kind: workKindSchema,
});
export function verifyCron(request: Request) {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization") || "";
  return Boolean(secret && safeEqual(header, `Bearer ${secret}`));
}
export function workKind(s: Session): WorkKind | undefined {
  if (
    ["generating", "reviewing"].includes(s.state) ||
    (s.state === "failed" &&
      Boolean(s.order?.paidAt) &&
      (s.job?.attempts ?? 5) < 5)
  )
    return "generate";
  if (s.mailErrors.length) return "email";
  if (
    s.order?.paidAt &&
    s.marketing &&
    !s.metaSent &&
    (s.fbp || s.fbc) &&
    process.env.NEXT_PUBLIC_META_PIXEL_ID &&
    process.env.META_CONVERSIONS_ACCESS_TOKEN &&
    process.env.META_GRAPH_API_VERSION
  )
    return "meta";
}
export function scheduleWork(id: string, kind: WorkKind, delay = 0) {
  if (
    process.env.NODE_ENV === "test" ||
    process.env.VERCEL !== "1" ||
    !process.env.CRON_SECRET ||
    !process.env.VERCEL_URL
  )
    return;
  const run = async () => {
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    await fetch(`https://${process.env.VERCEL_URL}/api/workmap/worker`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, kind }),
      cache: "no-store",
    });
  };
  try {
    after(() => run().catch(() => {}));
  } catch {
    void run().catch(() => {});
  }
}
async function deliverMeta(id: string) {
  const lease = await claimLease(id);
  if (!lease) return;
  try {
    const s = await getSession(id);
    if (!s) return;
    try {
      await sendPurchase(s);
      if (s.metaSent) await saveSession(s, s.version);
    } catch {
      scheduleWork(id, "meta", 8000);
    }
  } finally {
    await releaseLease(id, lease);
  }
}
export async function afterPaid(id: string) {
  await deliverPending(id);
  const s = await getSession(id);
  if (s?.mailErrors.length) scheduleWork(id, "email", 8000);
  await deliverMeta(id);
}
async function continueGeneration(id: string) {
  const advanced = await runGenerationStep(id);
  if (!advanced) return false;
  const s = await getSession(id);
  if (!s) return true;
  if (["generating", "reviewing"].includes(s.state))
    scheduleWork(id, "generate");
  else if (s.state === "ready") await afterPaid(id);
  else if (s.state === "failed" && (s.job?.attempts ?? 5) < 5)
    scheduleWork(id, "generate", 4000);
  return true;
}
export async function processWork(id: string, kind: WorkKind) {
  if (kind === "generate") return continueGeneration(id);
  if (kind === "email") {
    await deliverPending(id);
    return;
  }
  await deliverMeta(id);
}
export async function processDueSessions() {
  let n = 0;
  for (const id of await listSessions()) {
    const s = await getSession(id);
    if (!s) continue;
    const kind = workKind(s);
    if (!kind) continue;
    if (n === 0 || process.env.VERCEL !== "1") await processWork(id, kind);
    else scheduleWork(id, kind);
    if (++n >= 10) break;
  }
  return n;
}
