import { after } from "next/server";
import { z } from "zod";
import {
  getSession,
  listSessions,
} from "./store";
import { runGenerationStep } from "./pipeline";
import { deliverPending, safeEqual } from "./service";
import { baseUrl } from "./config";
import type { Session } from "./schema";
export const workKindSchema = z.enum(["generate", "email"]);
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
      s.confirmed &&
      (s.job?.attempts ?? 5) < 5)
  )
    return "generate";
  if (s.mailErrors.length || (s.state === "ready" && !s.mail.ready)) return "email";

}
const GENERATION_BUDGET_MS = 170_000;
const STEP_GUARD_MS = [50_000, 95_000, 80_000, 95_000, 95_000, 30_000, 50_000];
const REVIEW_MODEL_MS = 30_000;

export function workerOrigin() {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (site?.startsWith("https://")) return site;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return baseUrl();
}

export function scheduleWork(id: string, kind: WorkKind, delay = 0) {
  if (
    process.env.NODE_ENV === "test" ||
    process.env.VERCEL !== "1" ||
    !process.env.CRON_SECRET
  )
    return;
  const origin = workerOrigin();
  if (!origin) return;
  const run = async () => {
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    const response = await fetch(`${origin}/api/workmap/worker`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, kind }),
      cache: "no-store",
    });
    if (!response.ok)
      console.error("workmap-worker-schedule-failed", response.status, kind);
  };
  const start = () =>
    run().catch((error) => {
      console.error(
        "workmap-worker-schedule-failed",
        kind,
        error instanceof Error ? error.message : "unknown",
      );
    });
  try {
    after(start);
  } catch {
    void start();
  }
  if (!delay) void start();
}
export async function deliverEmails(id: string) {
  const delivered = await deliverPending(id);
  const s = await getSession(id);
  if (
    !delivered ||
    s?.mailErrors.length ||
    (s?.state === "ready" && !s.mail.ready)
  )
    scheduleWork(id, "email", 8000);
}
async function continueGeneration(id: string) {
  const started = Date.now();
  while (Date.now() - started < GENERATION_BUDGET_MS) {
    const current = await getSession(id);
    if (!current || workKind(current) !== "generate") return true;
    const step = current.job?.step ?? 0;
    const remaining = GENERATION_BUDGET_MS - (Date.now() - started);
    if (step !== 5 && remaining < (STEP_GUARD_MS[step] ?? 50_000)) {
      scheduleWork(id, "generate");
      return true;
    }
    const advanced = await runGenerationStep(id, current.job?.runId, {
      skipModelReview: step === 5 && remaining < REVIEW_MODEL_MS,
    });
    if (!advanced) {
      scheduleWork(id, "generate", 5000);
      return false;
    }
    const s = await getSession(id);
    if (!s) return true;
    if (
      s.job?.error &&
      ["generating", "reviewing"].includes(s.state)
    ) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    if (s.state === "ready") {
      if (!s.mail.ready) {
        scheduleWork(id, "email");
        if (!s.mailErrors.includes("ready")) await deliverEmails(id);
      }
      return true;
    }
    if (s.state === "failed") {
      if ((s.job?.attempts ?? 5) < 5) scheduleWork(id, "generate", 4000);
      return true;
    }
    if (!["generating", "reviewing"].includes(s.state)) return true;
  }
  const s = await getSession(id);
  if (s && workKind(s) === "generate") scheduleWork(id, "generate");
  return true;
}
export function kickGeneration(id: string) {
  scheduleWork(id, "generate");
  if (process.env.NODE_ENV === "test") return;
  const run = () => void processWork(id, "generate").catch(() => {});
  if (process.env.VERCEL === "1") {
    try {
      after(run);
    } catch {
      run();
    }
    return;
  }
  run();
}
export async function processWork(id: string, kind: WorkKind) {
  if (kind === "generate") return continueGeneration(id);
  if (kind === "email") {
    await deliverEmails(id);
    return;
  }
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
