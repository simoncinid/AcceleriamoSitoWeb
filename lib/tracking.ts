"use client";

export const CONSENT_COOKIE = "acceleriamo_marketing";
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;
export const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? "";
export const metaConfigured = /^\d+$/.test(pixelId);

type Pixel = ((...args: unknown[]) => void) & { queue: unknown[][]; callMethod?: (...args: unknown[]) => void; push?: Pixel; loaded?: boolean; version?: string };
declare global { interface Window { fbq?: Pixel; _fbq?: Pixel } }

export function readCookie(name: string) {
  const value = document.cookie.split("; ").find(row => row.startsWith(`${name}=`))?.slice(name.length + 1);
  return value ? decodeURIComponent(value) : "";
}
export function marketingAllowed() { return metaConfigured && readCookie(CONSENT_COOKIE) === "accepted"; }

export function startPixel() {
  if (!marketingAllowed()) return;
  if (window.fbq) { window.fbq("consent", "grant"); return; }
  const pixel: Pixel = Object.assign((...args: unknown[]) => {
    if (pixel.callMethod) pixel.callMethod(...args); else pixel.queue.push(args);
  }, { queue: [] as unknown[][], loaded: true, version: "2.0" });
  pixel.push = pixel;
  window.fbq = window._fbq = pixel;
  pixel("consent", "grant");
  pixel("set", "autoConfig", false, pixelId);
  pixel("init", pixelId);
  pixel("track", "PageView");
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  script.id = "meta-pixel";
  document.head.appendChild(script);
}

export function setMarketingConsent(accepted: boolean) {
  document.cookie = `${CONSENT_COOKIE}=${accepted ? "accepted" : "rejected"}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  window.dispatchEvent(new Event("marketing-consent-change"));
  if (accepted) startPixel();
  else {
    window.fbq?.("consent", "revoke");
    for (const cookie of ["_fbp", "_fbc"]) {
      const domains = ["", location.hostname, `.${location.hostname}`];
      const parts = location.hostname.split(".");
      if (parts.length > 2) domains.push(`.${parts.slice(-2).join(".")}`);
      for (const domain of domains) document.cookie = `${cookie}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ""}`;
    }
  }
}

const trackedLeads = new Set<string>();
export function trackLead(eventId: string) {
  if (!eventId || !marketingAllowed() || trackedLeads.has(eventId)) return;
  startPixel();
  window.fbq?.("track", "Lead", {}, { eventID: eventId });
  trackedLeads.add(eventId);
}
export function trackWhatsApp(source: string) {
  if (!marketingAllowed()) return;
  startPixel();
  window.fbq?.("trackCustom", "WhatsAppClick", { placement: source }, { eventID: crypto.randomUUID() });
}

export function contactAttribution() {
  const params = new URLSearchParams(location.search);
  const utm = Object.fromEntries(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id"].map(key => [key, params.get(key)?.slice(0, 250) ?? ""]));
  const consent = marketingAllowed();
  return { ...utm, sector: params.get("settore") ?? params.get("sector") ?? "", marketingConsent: consent,
    ...(consent ? { fbp: readCookie("_fbp"), fbc: readCookie("_fbc") } : {}),
  };
}
