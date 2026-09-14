"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { CONSENT_COOKIE, metaConfigured, readCookie, setMarketingConsent, startPixel } from "@/lib/tracking";

function subscribe(onChange: () => void) {
  window.addEventListener("marketing-consent-change", onChange);
  return () => window.removeEventListener("marketing-consent-change", onChange);
}
const getChoice = () => readCookie(CONSENT_COOKIE);
const getServerChoice = () => "pending";

export function MarketingConsent() {
  const [editing, setEditing] = useState(false);
  const choice = useSyncExternalStore(subscribe, getChoice, getServerChoice);
  useEffect(() => {
    if (choice === "accepted") startPixel();
  }, [choice]);
  useEffect(() => {
    const show = () => setEditing(true);
    window.addEventListener("open-cookie-preferences", show);
    return () => window.removeEventListener("open-cookie-preferences", show);
  }, []);
  if (!metaConfigured || (!editing && choice !== "")) return null;
  function choose(accepted: boolean) { setMarketingConsent(accepted); setEditing(false); }
  return <aside className="cookie-banner" aria-label="Preferenze cookie">
    <strong>Possiamo misurare le campagne?</strong>
    <p>Con il tuo consenso usiamo Meta Pixel per capire quali annunci portano contatti. Puoi rifiutare e usare comunque il sito. <a href="/cookie-policy">Cookie Policy</a></p>
    <div className="button-row"><button className="button button--dark" onClick={() => choose(false)}>Rifiuta</button><button className="button button--dark" onClick={() => choose(true)}>Accetta</button></div>
  </aside>;
}
export function CookiePreferences() {
  if (!metaConfigured) return null;
  return <button type="button" className="cookie-preferences" onClick={() => window.dispatchEvent(new Event("open-cookie-preferences"))}>Preferenze cookie</button>;
}
