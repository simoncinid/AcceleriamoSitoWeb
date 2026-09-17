import type { Session } from "./schema";
export async function sendPurchase(s: Session) {
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID,
    token = process.env.META_CONVERSIONS_ACCESS_TOKEN,
    version = process.env.META_GRAPH_API_VERSION;
  if (
    !s.marketing ||
    !s.order?.paidAt ||
    s.metaSent ||
    !pixel ||
    !token ||
    !version ||
    !/^v\d+\.\d+$/.test(version)
  )
    return;
  if (!s.fbp && !s.fbc) return; // No names, emails, chat content, or company information sent to Meta.
  const response = await fetch(
    `https://graph.facebook.com/${version}/${pixel}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          {
            event_name: "Purchase",
            event_time: Math.floor(new Date(s.order.paidAt).getTime() / 1000),
            event_id: `workmap-purchase-${s.order.id}`,
            action_source: "website",
            user_data: {
              ...(s.fbp ? { fbp: s.fbp } : {}),
              ...(s.fbc ? { fbc: s.fbc } : {}),
            },
            custom_data: {
              value: s.order.amount / 100,
              currency: s.order.currency.toUpperCase(),
            },
          },
        ],
        ...(process.env.META_TEST_EVENT_CODE
          ? { test_event_code: process.env.META_TEST_EVENT_CODE }
          : {}),
      }),
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) throw Error("Meta non disponibile");
  s.metaSent = true;
}
