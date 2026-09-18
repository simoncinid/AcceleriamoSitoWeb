import nodemailer from "nodemailer";
import { createHmac } from "node:crypto";
import type { Session } from "./schema";
export type MailKind = "ready";
export function recoveryToken(id: string) {
  if ((process.env.WORKMAP_ACCESS_SECRET?.length ?? 0) < 32)
    throw Error("Accesso via email non configurato.");
  return `${id}.${createHmac("sha256", process.env.WORKMAP_ACCESS_SECRET!).update(`resume:${id}`).digest("hex")}`;
}
export async function sendWorkMapEmail(s: Session, kind: MailKind) {
  if (!s.email || s.mail[kind]) return;
  if (!process.env.ARUBA_USER || !process.env.ARUBA_PASS)
    throw Error("Invio email non configurato.");
  if (kind === "ready" && !s.pdf) throw Error("PDF non disponibile per l’invio.");
  const subjects = {
    ready: "La tua AI WorkMap personalizzata è pronta",
  };
  const transport = nodemailer.createTransport({
    host: "smtps.aruba.it",
    port: 465,
    secure: true,
    auth: { user: process.env.ARUBA_USER, pass: process.env.ARUBA_PASS },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 45000,
  });
  await transport.sendMail({
    from: { name: "ACCELERIAMO", address: process.env.ARUBA_USER },
    to: s.email,
    subject: subjects[kind],
    attachments: kind === "ready" ? [{ filename: "AI-WorkMap.pdf", content: Buffer.from(s.pdf!, "base64"), contentType: "application/pdf" }] : undefined,
    messageId: `<workmap-${s.id}-${kind}@acceleriamo.it>`,
    text: `Ciao${s.profile.name ? ` ${s.profile.name}` : ""},\n\nla tua AI WorkMap personalizzata è pronta.\n\nIn allegato trovi il PDF con le 5 applicazioni AI prioritarie per il tuo lavoro, i prompt da copiare e un piano pratico di 30 giorni.\n\nBuon lavoro,\nACCELERIAMO`,
  });
  s.mail[kind] = new Date().toISOString();
}
