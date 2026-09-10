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
    <form className="contact-form" onSubmit={handleSubmit} aria-label="Richiedi valutazione">
      <div className="form-row">
        <label><span>Nome e cognome <RequiredDot /></span><input name="name" autoComplete="name" required /></label>
        <label><span>Azienda <RequiredDot /></span><input name="company" autoComplete="organization" required /></label>
      </div>
      <div className="form-row">
        <label><span>Email di lavoro <RequiredDot /></span><input name="email" type="email" autoComplete="email" required /></label>
        <label><span>Telefono <RequiredDot /></span><input name="phone" type="tel" autoComplete="tel" inputMode="tel" required placeholder="Es. +39 333 123 4567" /></label>
      </div>
      <div className="form-row">
        <label><span>Il tuo ruolo <em>Facoltativo</em></span><input name="role" autoComplete="organization-title" placeholder="Es. Titolare" /></label>
        <label><span>Cosa vi fa perdere più tempo? <RequiredDot /></span>
          <select name="activity" required defaultValue="">
            <option value="" disabled>Seleziona</option>
            <option>Fare i preventivi</option>
            <option>Ribattere ordini e documenti</option>
            <option>Organizzare giri e appuntamenti</option>
            <option>Rispondere a «a che punto siamo»</option>
            <option>Controllare fatture e bolle</option>
            <option>Altro</option>
          </select>
        </label>
      </div>
      <label><span>Raccontacelo in due righe <em>Facoltativo</em></span><textarea name="currentProcess" rows={3} placeholder="Es. Gli ordini arrivano via email e li ribattiamo nel gestionale." /></label>
      <details className="optional-fields">
        <summary>Aggiungi qualche dettaglio <span>Facoltativo</span></summary>
        <div className="form-row">
          <label><span>Quante persone se ne occupano?</span><select name="people" defaultValue=""><option value="" disabled>Seleziona</option><option>1</option><option>2–3</option><option>4–6</option><option>Più di 6</option></select></label>
          <label><span>Quanto spesso lo fate?</span><select name="frequency" defaultValue=""><option value="" disabled>Seleziona</option><option>Più volte al giorno</option><option>Ogni giorno</option><option>Ogni settimana</option><option>Ogni mese</option></select></label>
        </div>
        <label><span>Che programmi usate?</span><input name="tools" placeholder="Es. Excel, Outlook, Danea" /></label>
      </details>
      <label className="privacy-check"><input type="checkbox" name="privacy" value="accepted" required /><span>Ho letto l’<a href="/privacy-policy" target="_blank" rel="noopener noreferrer">informativa privacy</a> e chiedo di essere ricontattato, anche per telefono, per la valutazione del caso e per fissare una consulenza.</span></label>
      <label className="privacy-check"><input type="checkbox" name="terms" value="accepted" required /><span>Ho letto e accetto i <a href="/termini-e-condizioni" target="_blank" rel="noopener noreferrer">termini e le condizioni</a> del sito e della richiesta di valutazione.</span></label>
      <input type="hidden" name="legalVersion" value={LEGAL_VERSION} />
      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-submit">
        <button className="button button--primary" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Invio in corso…" : "Richiedi valutazione"}<Icon name="arrow" size={19} />
        </button>
      </div>
      {message && <p className={`form-message form-message--${state}`} role="status">{message}</p>}
    </form>
  );
}
