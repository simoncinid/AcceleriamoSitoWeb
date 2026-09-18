import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { emptyProfile, type Session } from "./schema";
import { initialQuestion } from "./conversation";
import {
  getSession,
  hashToken,
  newToken,
  saveSession,
  claimLease,
  releaseLease,
} from "./store";
import { sessionCookie, product } from "./config";
import { recoveryToken, sendWorkMapEmail, type MailKind } from "./email";
import { catalog } from "./catalog";
export async function createSession(
  marketing: boolean,
  fbp?: string,
  fbc?: string,
) {
  const token = newToken(),
    id = hashToken(token),
    now = new Date().toISOString();
  const session: Session = {
    id,
    tokenHash: id,
    legalVersion: product.version,
    version: 0,
    createdAt: now,
    updatedAt: now,
    email: "",
    profile: emptyProfile(),
    messages: [{ role: "assistant", text: initialQuestion.text }],
    question: initialQuestion,
    answered: [],
    state: "lead",
    confirmed: false,
    followupUsed: false,
    insight: "",
    drafts: [],
    downloads: 0,
    mail: {},
    mailErrors: [],
    marketing,
    fbp,
    fbc,
    requestIds: [],
  };
  await saveSession(session, 0);
  return { session, token };
}
export function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a),
    bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
export async function authenticate(request: Request) {
  const token = request.headers
    .get("cookie")
    ?.split(/;\s*/)
    .find((c) => c.startsWith(`${sessionCookie}=`))
    ?.slice(sessionCookie.length + 1);
  if (!token || !/^([a-f0-9]{64}|[a-f0-9]{64}\.[a-f0-9]{64})$/.test(token))
    return null;
  if (token.includes(".")) {
    const id = token.split(".")[0];
    if (!safeEqual(token, recoveryToken(id))) return null;
    return getSession(id);
  }
  return getSession(hashToken(token));
}
export function cookie(token: string) {
  return `${sessionCookie}=${token}; HttpOnly; Path=/api/workmap; SameSite=Lax; Max-Age=31536000${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}
export function view(s: Session) {
  return {
    version: s.version,
    state: s.state,
    profile: s.profile,
    messages: s.messages,
    question: s.question,
    email: s.email,
    confirmed: s.confirmed,
    insight: s.insight,
    opportunities: s.selection?.workflows
      .slice(0, 3)
      .map((w) => ({ ...w, title: catalog.find((c) => c.id === w.id)?.title })),
    workflowCount: s.selection?.workflows.length ?? 0,
    notRecommended: s.selection?.notRecommended,
    job: s.job,
    content: s.state === "ready" ? s.content : undefined,
    pdfAvailable: s.state === "ready" && Boolean(s.pdf),
    mailErrors: s.mailErrors,
    emailDelivered: Boolean(s.mail.ready),
  };
}
export async function deliverPending(id: string) {
  const lease = await claimLease(id);
  if (!lease) return false;
  try {
    const s = await getSession(id);
    if (!s) return false;
    const kinds: MailKind[] = [];
    if (s.state === "ready") kinds.push("ready");
    const errors: string[] = [];
    for (const kind of kinds) {
      try {
        await sendWorkMapEmail(s, kind);
      } catch (error) {
        console.error(
          "workmap-email-failed",
          kind,
          error instanceof Error ? error.message : "unknown",
        );
        errors.push(kind);
      }
    }
    s.mailErrors = errors;
    await saveSession(s, s.version);
    return errors.length === 0;
  } finally {
    await releaseLease(id, lease);
  }
}
export async function requestBody(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 12000)
    throw Error("Richiesta troppo grande.");
  const raw = await request.text();
  if (raw.length > 12000) throw Error("Richiesta troppo grande.");
  return z.record(z.string(), z.unknown()).parse(JSON.parse(raw));
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return Boolean(origin && origin === new URL(request.url).origin);
}
