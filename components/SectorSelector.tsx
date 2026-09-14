"use client";

import { useEffect, useState } from "react";
import { sectors, sectorFromSearch } from "@/lib/sectors";
import { WhatsAppLink } from "./WhatsAppLink";

export function SectorSelector() {
  const [selected, setSelected] = useState<string>(sectors[0].id);
  useEffect(() => {
    const sync = () => setSelected(sectorFromSearch(window.location.search));
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const sector = sectors.find(item => item.id === selected) ?? sectors[0];
  return <div className="sector-selector">
    <div className="sector-pills" role="group" aria-label="Scegli il tuo settore">
      {sectors.map(item => <button key={item.id} type="button" aria-pressed={selected === item.id} aria-controls="sector-panel" onClick={() => {
        setSelected(item.id);
        const url = new URL(window.location.href);
        url.searchParams.set("settore", item.id);
        window.history.replaceState(null, "", url);
      }}>{item.label}</button>)}
    </div>
    <article className="sector-card" id="sector-panel" aria-live="polite" aria-atomic="true">
      <div className="sector-card__intro">
        <span className={`case-badge${sector.real ? " case-badge--real" : ""}`}>{sector.real ? "Caso reale" : "Esempio"}</span>
        <h3>{sector.problem}</h3>
        <p>{sector.description}</p>
      </div>
      <ol className="sector-steps">{sector.steps.map((step, index) => <li key={step}><span aria-hidden="true">{index + 1}</span>{step}</li>)}</ol>
      <div className="button-row sector-actions">
        <WhatsAppLink className="button button--whatsapp button--small" source={`settore-${sector.id}`} />
        <a className="button button--small button--primary" href="#contatti">
          <span className="sector-cta-desktop">Richiedi la valutazione gratuita</span>
          <span className="sector-cta-mobile">Richiedi valutazione</span>
        </a>
      </div>
    </article>
  </div>;
}
