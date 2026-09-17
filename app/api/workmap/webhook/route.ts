import { afterPaid } from "@/lib/workmap/jobs";
import { verifySignature, confirmPayment } from "@/lib/workmap/payments";
import { getSession, claimLease, releaseLease } from "@/lib/workmap/store";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: Request) {
  const raw = await request.text();
  if (
    raw.length > 100000 ||
    !verifySignature(raw, request.headers.get("stripe-signature") || "")
  )
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  try {
    const event = JSON.parse(raw);
    if (
      ![
        "checkout.session.completed",
        "checkout.session.async_payment_succeeded",
      ].includes(event.type)
    )
      return Response.json({ received: true });
    const checkout = event.data.object;
    const s = await getSession(checkout.client_reference_id);
    if (!s) return Response.json({ error: "Order missing" }, { status: 409 });
    const lease = await claimLease(s.id);
    if (!lease) return Response.json({ error: "Retry" }, { status: 409 });
    let paid = false;
    try {
      const latest = (await getSession(s.id))!;
      await confirmPayment(latest, checkout.id);
      paid = Boolean(latest.order?.paidAt);
    } finally {
      await releaseLease(s.id, lease);
    }
    if (paid) await afterPaid(s.id);
    return Response.json({ received: true });
  } catch {
    return Response.json({ error: "Retry" }, { status: 503 });
  }
}
