"use client";

import { FormEvent, useState } from "react";
import { Icon } from "./Icons";
import { LEGAL_VERSION } from "@/lib/legal";

type FormState = "idle" | "sending" | "success" | "error";

function RequiredDot() {
  return <span className="req-dot" aria-hidden="true" />;
}

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? "Invio non riuscito");
      setState("success");
      setMessage(result.message);
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Qualcosa non ha funzionato. Riprova.");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} aria-label="Richiedi una consulenza gratuita">
      <div className="form-row">
        <label><span>Nome e cognome <RequiredDot /></span><input name="name" autoComplete="name" required /></label>
        <label><span>Azienda <RequiredDot /></span><input name="company" autoComplete="organization" required /></label>
      </div>
      <div className="form-row">
        <label><span>Email di lavoro <RequiredDot /></span><input name="email" type="email" autoComplete="email" required /></label>
        <label><span>Il tuo ruolo</span><input name="role" autoComplete="organization-title" placeholder="Es. Titolare" /></label>
      </div>
      <label><span>Quale problema vuoi risolvere? <RequiredDot /></span><input name="activity" required placeholder="Es. Preventivi a mano" /></label>
      <label><span>Come lavorate oggi? <RequiredDot /></span><textarea name="currentProcess" required rows={4} placeholder="Es. Copiamo gli ordini dalle email al gestionale." /></label>
      <details className="optional-fields">
        <summary>Aggiungi qualche dettaglio <span>Opzionale</span></summary>
        <div className="form-row">
          <label><span>Quante persone se ne occupano?</span><select name="people" defaultValue=""><option value="" disabled>Seleziona</option><option>1</option><option>2–3</option><option>4–6</option><option>Più di 6</option></select></label>
          <label><span>Quanto spesso svolgete questa attività?</span><select name="frequency" defaultValue=""><option value="" disabled>Seleziona</option><option>Più volte al giorno</option><option>Ogni giorno</option><option>Ogni settimana</option><option>Ogni mese</option></select></label>
        </div>
        <label><span>Quali strumenti usate?</span><input name="tools" placeholder="Es. Excel, Outlook" /></label>
      </details>
      <p className="form-privacy-note">Useremo i tuoi dati per gestire la richiesta e ricontattarti. Nessuna iscrizione a newsletter. Non inserire dati sensibili, password o dati personali di terzi non necessari.</p>
      <label className="privacy-check"><input type="checkbox" name="privacy" value="accepted" required /><span>Ho letto l’<a href="/privacy-policy" target="_blank" rel="noopener noreferrer">informativa privacy</a> e chiedo di essere ricontattato per la consulenza gratuita.</span></label>
      <label className="privacy-check"><input type="checkbox" name="terms" value="accepted" required /><span>Ho letto e accetto i <a href="/termini-e-condizioni" target="_blank" rel="noopener noreferrer">termini e le condizioni</a> del sito e della richiesta di consulenza gratuita.</span></label>
      <input type="hidden" name="legalVersion" value={LEGAL_VERSION} />
      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-submit">
        <button className="button button--primary" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Invio in corso…" : "Richiedi una consulenza gratuita"}<Icon name="arrow" size={19} />
        </button>
      </div>
      {message && <p className={`form-message form-message--${state}`} role="status">{message}</p>}
    </form>
  );
}
