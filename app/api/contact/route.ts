import { NextResponse } from "next/server";

type ContactBody = Record<string, unknown>;

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Dati non validi." }, { status: 400 });
  }

  if (body.website) return NextResponse.json({ message: "Richiesta ricevuta." });
  if (!body.name || !body.company || !body.email || !body.activity || !body.currentProcess || body.privacy !== "accepted") {
    return NextResponse.json({ message: "Completa i campi obbligatori." }, { status: 422 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({
      message: "Il modulo è temporaneamente non disponibile. La richiesta non è stata inviata. Riprova più tardi.",
    }, { status: 503 });
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, source: "acceleriamo.it", submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Webhook non disponibile");
    return NextResponse.json({ message: "Grazie! Abbiamo ricevuto la tua richiesta di consulenza gratuita. Ti ricontatteremo per concordare un appuntamento." });
  } catch {
    return NextResponse.json({ message: "Invio temporaneamente non disponibile. Riprova tra poco." }, { status: 502 });
  }
}
