import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { randomUUID } from "node:crypto";
import { sendMetaLead } from "@/lib/meta";
import { LEGAL_VERSION } from "@/lib/legal";

type ContactBody = Record<string, unknown>;

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  const compact = value.replace(/[\s./()-]/g, "");
  if (!/^\+?[0-9]{8,15}$/.test(compact)) return false;
  const digits = compact.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

function buildEmailText(body: ContactBody, eventId: string) {
  const optional = [
    ["Ruolo", asString(body.role)],
    ["Persone coinvolte", asString(body.people)],
    ["Frequenza", asString(body.frequency)],
    ["Strumenti usati", asString(body.tools)],
  ].filter(([, value]) => value);

  const currentProcess = asString(body.currentProcess);
  const lines = [
    "Nuova richiesta di valutazione da acceleriamo.it",
    "",
    `Nome: ${asString(body.name)}`,
    `Azienda: ${asString(body.company)}`,
    `Email: ${asString(body.email)}`,
    `Telefono: ${asString(body.phone)}`,
    `Cosa fa perdere più tempo: ${asString(body.activity)}`,
  ];

  if (currentProcess) lines.push("", "Come lavorano oggi:", currentProcess);

  if (optional.length) {
    lines.push("", "Dettagli aggiuntivi:");
    optional.forEach(([label, value]) => lines.push(`${label}: ${value}`));
  }

  lines.push("", "Provenienza della richiesta:");
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "sector"]) {
    const value = asString(body[key]).replace(/[\r\n]/g, " ").slice(0, 250);
    if (value) lines.push(`${key}: ${value}`);
  }
  lines.push("", "Informativa resa al momento dell’invio:",
    `Versione documenti: ${LEGAL_VERSION}`,
    "Documenti: /privacy-policy · /termini-e-condizioni",
    "Richiesta gratuita di ricontatto; nessuna accettazione contrattuale o iscrizione al marketing.",
    `Consenso misurazione Meta: ${body.marketingConsent === true ? "sì" : "no"}`,
    `ID richiesta / evento: ${eventId}`,
    `Ricevuto dal server il: ${new Date().toISOString()}`);
  return lines.join("\n");
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ message: "Dati non validi." }, { status: 400 });
    }
    body = parsed as ContactBody;
  } catch {
    return NextResponse.json({ message: "Dati non validi." }, { status: 400 });
  }

  if (body.website) return NextResponse.json({ message: "Richiesta ricevuta.", accepted: false });

  const name = asString(body.name);
  const company = asString(body.company);
  const email = asString(body.email);
  const phone = asString(body.phone);
  const activity = asString(body.activity);

  if (!name || !company || !phone || !activity) {
    return NextResponse.json({ message: "Completa i campi obbligatori." }, { status: 422 });
  }

  if (body.legalVersion !== LEGAL_VERSION) {
    return NextResponse.json({ message: "I documenti legali sono stati aggiornati. Ricarica la pagina e invia nuovamente la richiesta." }, { status: 409 });
  }

  if (email && !isValidEmail(email)) {
    return NextResponse.json({ message: "Inserisci un indirizzo email valido." }, { status: 422 });
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json({ message: "Inserisci un numero di telefono valido." }, { status: 422 });
  }

  const fromAddress = process.env.ARUBA_USER?.trim();
  const toAddress = process.env.LEAD_DEST?.trim();
  const arubaPassword = process.env.ARUBA_PASS;

  if (!fromAddress || !toAddress || !arubaPassword) {
    return NextResponse.json({
      message: "Il modulo è temporaneamente non disponibile. La richiesta non è stata inviata. Riprova più tardi.",
    }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: "smtps.aruba.it",
    port: 465,
    secure: true,
    auth: {
      user: fromAddress,
      pass: arubaPassword,
    },
    tls: {
      minVersion: "TLSv1.2",
      ciphers: "HIGH:MEDIUM:!aNULL:!eNULL:@STRENGTH:!DH:!kEDH",
    },
  });

  const eventId = randomUUID();
  try {
    await transporter.sendMail({
      from: `"ACCELERIAMO" <${fromAddress}>`,
      to: toAddress,
      ...(email ? { replyTo: { name, address: email } } : {}),
      subject: `Valutazione · ${company} · ${name}`,
      text: buildEmailText(body, eventId),
    });

    try { await sendMetaLead({ request, body, eventId }); }
    catch { console.error("Meta Lead: misurazione non disponibile; richiesta ricevuta"); }
    return NextResponse.json({
      accepted: true, eventId,
      message: "Grazie! Abbiamo ricevuto la tua richiesta. Ti chiamiamo entro un giorno lavorativo per approfondire e fissare una consulenza.",
    });
  } catch (error) {
    console.error("Contact SMTP failed:", error);
    return NextResponse.json({ message: "Invio temporaneamente non disponibile. Riprova tra poco." }, { status: 502 });
  }
}
