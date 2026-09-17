"use client";
import { useState } from "react";
import { trackWorkMap } from "./tracking";
import type { view } from "@/lib/workmap/service";
function Copy({ text }: { text: string }) {
  const [state, setState] = useState("");
  return (
    <>
      <button
        className="wm-copy"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setState("Copiato");
          } catch {
            setState("Seleziona il testo per copiarlo.");
          }
        }}
      >
        Copia istruzioni
      </button>
      <span className="wm-micro" role="status">
        {" "}
        {state}
      </span>
      <pre>{text}</pre>
    </>
  );
}
export function WorkMapResult({ data }: { data: ReturnType<typeof view> }) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const content = data.content!;
  async function download() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/workmap/pdf", { cache: "no-store" });
      if (!r.ok) throw Error("Download non riuscito. Riprova.");
      const url = URL.createObjectURL(await r.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = "AI-WorkMap.pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      trackWorkMap("PDFDownloaded");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main id="contenuto" className="wm-result">
      <p className="eyebrow">
        <span className="signal-square" />
        IL TUO MANUALE OPERATIVO PERSONALE
      </p>
      <h1>
        AI WorkMap
        <br />
        di {data.profile.name}.
      </h1>
      <p className="wm-lead">
        {data.profile.role} · {content.workflows.length} workflow · 3 assistenti
        AI · Piano 30 giorni
      </p>
      <div className="wm-actions">
        <button
          className="button button--primary"
          onClick={() => void download()}
          disabled={busy || !data.pdfAvailable}
        >
          Scarica il PDF
        </button>
        <a className="button" href="mailto:info@acceleriamo.it">
          Assistenza
        </a>
      </div>
      {error && <p role="alert">{error}</p>}
      <nav className="wm-result-nav" aria-label="Indice WorkMap">
        {[
          "Profilo",
          "Opportunità",
          "Da dove partire",
          "Workflow",
          "Prompt Master",
          "Assistenti",
          "Strumenti",
          "Privacy",
          "Piano 30 giorni",
          "Checklist",
        ].map((name, i) => (
          <a href={`#wm-section-${i + 1}`} key={name}>
            {String(i + 1).padStart(2, "0")} {name}
          </a>
        ))}
      </nav>
      <section id="wm-section-1">
        <h2>01 / Il tuo profilo operativo</h2>
        <p>
          {[data.profile.role, data.profile.companyType, data.profile.industry]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <div className="wm-card">
          <h3>Le attività su cui concentrarti</h3>
          <p>{data.profile.mainTasks.join(", ")}</p>
          <h4>Dove passa il tuo tempo</h4>
          <p>{data.profile.timeConsumingTasks.join(", ")}</p>
          <h4>Strumenti disponibili</h4>
          <p>{data.profile.toolsUsed.join(", ")}</p>
        </div>
      </section>
      <section id="wm-section-2">
        <h2>02 / Le opportunità individuate</h2>
        <ol>
          {content.workflows.map((w) => (
            <li key={w.id}>
              <a className="text-link" href={`#workflow-${w.id}`}>
                {w.title}
              </a>
            </li>
          ))}
        </ol>
        <p>{data.notRecommended}</p>
      </section>
      <section id="wm-section-3">
        <h2>03 / Da dove partire</h2>
        <div className="wm-card">
          <h3>{content.workflows[0].title}</h3>
          <p>{content.workflows[0].relevance}</p>
          <p>
            Parti da un caso semplice, con dati fittizi o anonimizzati.
            Confronta il risultato con il tuo modo abituale di lavorare.
          </p>
        </div>
      </section>
      <section id="wm-section-4">
        <h2>04 / Workflow personalizzati</h2>
        {content.workflows.map((w, i) => (
          <article id={`workflow-${w.id}`} className="wm-card" key={w.id}>
            <p className="eyebrow">WORKFLOW {String(i + 1).padStart(2, "0")}</p>
            <h3>{w.title}</h3>
            <p>{w.relevance}</p>
            <h4>Quando usarlo</h4>
            <p>{w.whenToUse}</p>
            <h4>Input necessario</h4>
            <ul>
              {w.requiredInputs.map((v, j) => (
                <li key={j}>{v}</li>
              ))}
            </ul>
            <h4>Strumento consigliato</h4>
            <p>{w.tool}</p>
            <h4>Procedura</h4>
            <ol>
              {w.procedure.map((v, j) => (
                <li key={j}>{v}</li>
              ))}
            </ol>
            <h4>Esempio ipotetico</h4>
            <p>{w.example}</p>
            <h4>Output atteso</h4>
            <p>{w.output}</p>
            <h4>Checklist finale</h4>
            <ul>
              {w.checklist.map((v, j) => (
                <li key={j}>{v}</li>
              ))}
            </ul>
            <h4>Cosa controllare manualmente</h4>
            <p>{w.humanReview}</p>
            <h4>Errori frequenti</h4>
            <ul>
              {w.commonErrors.map((v, j) => (
                <li key={j}>{v}</li>
              ))}
            </ul>
            <h4>Privacy</h4>
            <p>{w.privacy}</p>
            <a className="text-link" href={`#prompt-${w.id}`}>
              Vai ai prompt di questo workflow →
            </a>
          </article>
        ))}
      </section>
      <section id="wm-section-5">
        <h2>05 / I tuoi Prompt Master</h2>
        {content.workflows.map((w) => (
          <article className="wm-card" id={`prompt-${w.id}`} key={w.id}>
            <h3>{w.title}</h3>
            <h4>Prompt Master</h4>
            <Copy text={w.masterPrompt} />
            <h4>Prompt di revisione</h4>
            <Copy text={w.reviewPrompt} />
          </article>
        ))}
      </section>
      <section id="wm-section-6">
        <h2>06 / I tuoi 3 assistenti AI</h2>
        {content.assistants.map((a) => (
          <article className="wm-card" key={a.name}>
            <h3>{a.name}</h3>
            <p>{a.purpose}</p>
            <h4>Quando usarlo</h4>
            <p>{a.whenToUse}</p>
            <h4>Input necessario</h4>
            <p>{a.requiredInputs.join("; ")}</p>
            <Copy text={a.systemPrompt} />
            <h4>Per iniziare</h4>
            <ul>
              {a.starterPrompts.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
            <h4>Regole e limiti</h4>
            <ul>
              {[...a.rules, ...a.limitations].map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
            <p>{a.humanReview}</p>
          </article>
        ))}
      </section>
      <section id="wm-section-7">
        <h2>07 / Strumenti consigliati</h2>
        <ul>
          {content.tools.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
        <p>
          Verifica piani, funzioni e condizioni aggiornate sul sito del
          fornitore prima di acquistare.
        </p>
      </section>
      <section id="wm-section-8">
        <h2>08 / Privacy e controlli</h2>
        <ul>
          {content.privacy.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      </section>
      <section id="wm-section-9">
        <h2>09 / Piano 30 giorni</h2>
        {content.weeks.map((w) => (
          <article className="wm-card" key={w.week}>
            <p className="eyebrow">SETTIMANA {w.week}</p>
            <h3>{w.goal}</h3>
            <ul>
              {w.actions.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
            <h4>Come verificare il risultato</h4>
            <p>{w.successCheck}</p>
          </article>
        ))}
      </section>
      <section id="wm-section-10">
        <h2>10 / Checklist finale</h2>
        <ul>
          {content.finalChecklist.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
