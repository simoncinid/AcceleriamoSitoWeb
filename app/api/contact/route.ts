import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { LEGAL_VERSION, PRIVACY_ACKNOWLEDGEMENT, TERMS_ACKNOWLEDGEMENT } from "@/lib/legal";

type ContactBody = Record<string, unknown>;

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildEmailText(body: ContactBody) {
  const optional = [
    ["Ruolo", asString(body.role)],
    ["Persone coinvolte", asString(body.people)],
    ["Frequenza", asString(body.frequency)],
    ["Strumenti usati", asString(body.tools)],
  ].filter(([, value]) => value);

  const lines = [
    "Nuova richiesta di consulenza gratuita da acceleriamo.it",
    "",
    `Nome: ${asString(body.name)}`,
    `Azienda: ${asString(body.company)}`,
    `Email: ${asString(body.email)}`,
    `Problema: ${asString(body.activity)}`,
    "",
    "Come lavorano oggi:",
    asString(body.currentProcess),
  ];

  if (optional.length) {
    lines.push("", "Dettagli aggiuntivi:");
    optional.forEach(([label, value]) => lines.push(`${label}: ${value}`));
  }

  lines.push("", "Dichiarazioni del richiedente:",
    `Privacy: ${PRIVACY_ACKNOWLEDGEMENT}`,
    `Termini: ${TERMS_ACKNOWLEDGEMENT}`,
    `Versione documenti: ${LEGAL_VERSION}`,
    "Documenti: /privacy-policy · /termini-e-condizioni",
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

  if (body.website) return NextResponse.json({ message: "Richiesta ricevuta." });

  const name = asString(body.name);
  const company = asString(body.company);
  const email = asString(body.email);
  const activity = asString(body.activity);
  const currentProcess = asString(body.currentProcess);

  if (!name || !company || !email || !activity || !currentProcess) {
    return NextResponse.json({ message: "Completa i campi obbligatori." }, { status: 422 });
  }

  if (body.privacy !== "accepted" || body.terms !== "accepted") {
    return NextResponse.json({ message: "Conferma di aver letto l’informativa privacy e di accettare i termini e le condizioni." }, { status: 422 });
  }

  if (body.legalVersion !== LEGAL_VERSION) {
    return NextResponse.json({ message: "I documenti legali sono stati aggiornati. Ricarica la pagina, leggili e invia nuovamente la richiesta." }, { status: 409 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Inserisci un indirizzo email valido." }, { status: 422 });
  }

  const fromAddress = process.env.GMAIL_FROM_ADDRESS;
  const toAddress = process.env.GMAIL_TO_ADDRESS;
  const appPassword = process.env.GMAIL_APP_PASSWORD;

  if (!fromAddress || !toAddress || !appPassword) {
    return NextResponse.json({
      message: "Il modulo è temporaneamente non disponibile. La richiesta non è stata inviata. Riprova più tardi.",
    }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: fromAddress,
      pass: appPassword,
    },
  });

  try {
    await transporter.sendMail({
      from: `"ACCELERIAMO" <${fromAddress}>`,
      to: toAddress,
      replyTo: `"${name}" <${email}>`,
      subject: `Consulenza gratuita · ${company} · ${name}`,
      text: buildEmailText(body),
    });

    return NextResponse.json({
      message: "Grazie! Abbiamo ricevuto la tua richiesta di consulenza gratuita. Ti ricontatteremo per concordare un appuntamento.",
    });
  } catch {
    return NextResponse.json({ message: "Invio temporaneamente non disponibile. Riprova tra poco." }, { status: 502 });
  }
}
