import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";
import { product } from "./config";
import type { Session } from "./schema";
import { saveSession } from "./store";
import { decideNextQuestion } from "./conversation";
import { aiConfigured } from "./ai";
export function baseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://acceleriamo.it").replace(
    /\/$/,
    "",
  );
}
export function checkoutConfigured() {
  return Boolean(
    process.env.WORKMAP_SALES_ENABLED === "true" &&
      process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_WEBHOOK_SECRET &&
      aiConfigured() &&
      process.env.ARUBA_USER &&
      process.env.ARUBA_PASS &&
      (process.env.WORKMAP_ACCESS_SECRET?.length ?? 0) >= 32,
  );
}
async function stripe(path: string, body?: URLSearchParams, key?: string) {
  if (!process.env.STRIPE_SECRET_KEY)
    throw Error("Il pagamento non è ancora disponibile.");
  const r = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
      ...(key ? { "Idempotency-Key": key } : {}),
    },
    body,
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  if (!r.ok)
    throw Error("Il servizio di pagamento è temporaneamente non disponibile.");
  return r.json();
}
export async function createCheckout(s: Session) {
  if (!checkoutConfigured())
    throw Error(
      "L’acquisto non è ancora disponibile. La tua analisi resta salvata.",
    );
  if (!s.confirmed || !s.selection || !s.email)
    throw Error("Completa e conferma prima l’analisi gratuita.");
  if (s.order?.paidAt) throw Error("La WorkMap è già stata acquistata.");
  if (
    s.order?.checkoutId &&
    s.order.expiresAt &&
    s.order.expiresAt < Date.now()
  ) {
    await confirmPayment(s, s.order.checkoutId);
    if (s.order.paidAt)
      throw Error(
        "Pagamento già ricevuto. Ricarica per continuare la conversazione.",
      );
  }
  // Persist the order/idempotency key before contacting Stripe, including crash recovery.
  if (!s.order || (s.order.expiresAt && s.order.expiresAt < Date.now())) {
    s.order = {
      id: randomUUID(),
      amount: product.amount,
      currency: product.currency,
      termsVersion: product.version,
      consentAt: new Date().toISOString(),
    };
    await saveSession(s, s.version);
  }
  if (s.order.url) return s.order.url;
  const params = new URLSearchParams({
    mode: "payment",
    success_url: `${baseUrl()}/ai-workmap/analisi?payment=success`,
    cancel_url: `${baseUrl()}/ai-workmap/analisi?payment=cancel`,
    customer_email: s.email,
    client_reference_id: s.id,
    "metadata[workmap_id]": s.id,
    "metadata[order_id]": s.order.id,
    "line_items[0][price_data][currency]": s.order.currency,
    "line_items[0][price_data][unit_amount]": String(s.order.amount),
    "line_items[0][price_data][tax_behavior]": "inclusive",
    "line_items[0][price_data][product_data][name]": product.name,
    "line_items[0][quantity]": "1",
    billing_address_collection: "required",
    "consent_collection[terms_of_service]": "required",
  });
  const result = await stripe(
    "checkout/sessions",
    params,
    `workmap-${s.order.id}`,
  );
  s.order.checkoutId = result.id;
  s.order.url = result.url;
  s.order.expiresAt = result.expires_at * 1000;
  s.state = "checkout_started";
  await saveSession(s, s.version);
  return result.url as string;
}
export function verifySignature(
  raw: string,
  signature: string,
  now = Date.now(),
) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return false;
  const parts = signature.split(",");
  const t = parts.find((p) => p.startsWith("t="))?.slice(2);
  if (!t || !/^\d+$/.test(t) || Math.abs(now / 1000 - Number(t)) > 300)
    return false;
  const expected = createHmac("sha256", secret).update(`${t}.${raw}`).digest();
  return parts
    .filter((p) => p.startsWith("v1="))
    .some((p) => {
      const supplied = Buffer.from(p.slice(3), "hex");
      return (
        supplied.length === expected.length &&
        timingSafeEqual(supplied, expected)
      );
    });
}
export async function confirmPayment(s: Session, checkoutId: string) {
  if (s.order?.paidAt) return false;
  if (!s.order) throw Error("Ordine non trovato.");
  const checkout = await stripe(
    `checkout/sessions/${encodeURIComponent(checkoutId)}`,
  );
  if (checkout.payment_status !== "paid") return false;
  if (
    checkout.mode !== "payment" ||
    checkout.client_reference_id !== s.id ||
    checkout.metadata?.order_id !== s.order.id ||
    checkout.amount_total !== s.order.amount ||
    checkout.currency !== s.order.currency ||
    (s.order.checkoutId && s.order.checkoutId !== checkout.id)
  )
    throw Error("Il pagamento non corrisponde all’ordine.");
  s.order.checkoutId = checkout.id;
  s.order.paidAt = new Date().toISOString();
  s.order.paymentId = String(checkout.payment_intent);
  s.state = "paid";
  s.messages.push({
    role: "assistant",
    text: "Perfetto. Adesso posso costruire la tua WorkMap completa. Ho già capito buona parte del tuo lavoro. Mi servono ancora alcune informazioni.",
  });
  s.question = await decideNextQuestion(s);
  if (s.question) s.messages.push({ role: "assistant", text: s.question.text });
  else s.state = "profile_complete";
  await saveSession(s, s.version);
  return true;
}
