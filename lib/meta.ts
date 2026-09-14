import { createHash } from "node:crypto";

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

export async function sendMetaLead({ request, body, eventId }: { request: Request; body: Record<string, unknown>; eventId: string }) {
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const token = process.env.META_CONVERSIONS_ACCESS_TOKEN;
  const version = process.env.META_GRAPH_API_VERSION;
  const consent = request.headers.get("cookie")?.split(/;\s*/).includes("acceleriamo_marketing=accepted");
  if (!pixel || !/^\d+$/.test(pixel) || !token || !version || !/^v\d+\.\d+$/.test(version) || !consent || body.marketingConsent !== true) return;
  const string = (key: string) => typeof body[key] === "string" ? body[key].trim() : "";
  const userData: Record<string, unknown> = { ph: [hash(string("phone").replace(/\D/g, ""))] };
  if (string("email")) userData.em = [hash(string("email").toLowerCase())];
  const agent = request.headers.get("user-agent");
  if (agent) userData.client_user_agent = agent;
  // Only use the platform's trusted client-IP header on Vercel.
  const ip = process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() : undefined;
  if (ip) userData.client_ip_address = ip;
  for (const key of ["fbp", "fbc"]) if (/^fb\.\d+\.\d+\.[\w.-]+$/.test(string(key)) && string(key).length <= 500) userData[key] = string(key);
  try {
    const response = await fetch(`https://graph.facebook.com/${version}/${pixel}/events`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ data: [{ event_name: "Lead", event_time: Math.floor(Date.now() / 1000), event_id: eventId, action_source: "website",
        event_source_url: new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "https://acceleriamo.it").toString(), user_data: userData }],
        ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
      }), signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) console.error("Meta Lead: invio non riuscito", response.status);
  } catch { console.error("Meta Lead: servizio temporaneamente non disponibile"); }
}
