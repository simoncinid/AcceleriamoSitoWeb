"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CookiePreferences } from "@/components/MarketingConsent";
import { Brand } from "@/components/Brand";
import { product, professions, stages } from "@/lib/workmap/config";
import { contactAttribution } from "@/lib/tracking";
import { trackWorkMap, type WorkMapEvent } from "./tracking";
import type { view } from "@/lib/workmap/service";
import { WorkMapResult } from "./Result";
type View = ReturnType<typeof view>;
async function api(
  action: string,
  body?: object,
): Promise<View & { url?: string }> {
  const response = await fetch(`/api/workmap/${action}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok)
    throw Error(
      result.error ||
        "Connessione interrotta. Riprova: il tuo lavoro è salvato.",
    );
  return result;
}
export function WorkMapChat() {
  const [data, setData] = useState<View | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [answer, setAnswer] = useState(""),
    [selected, setSelected] = useState<string[]>([]),
    [email, setEmail] = useState(""),
    [editing, setEditing] = useState(false),
    [terms, setTerms] = useState(false),
    [cancelled, setCancelled] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const bottom = useRef<HTMLDivElement>(null),
    pending = useRef<{ answer: string; id: string } | null>(null),
    events = useRef(new Set<string>()),
    initialized = useRef(false);
  const emit = (
    name: WorkMapEvent,
    extra?: { workflow_count?: number; price?: number; currency?: string },
    eventId?: string,
  ) => {
    const key = eventId || name;
    if (events.current.has(key)) return;
    events.current.add(key);
    if (eventId) {
      try {
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");
      } catch {}
    }
    trackWorkMap(name, extra, eventId);
  };
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    async function start() {
      setBusy(true);
      try {
        const hash = new URLSearchParams(location.hash.slice(1));
        const token = hash.get("resume");
        history.replaceState(null, "", location.pathname + location.search);
        let next: View;
        if (token) next = await api("resume", { token });
        else next = await api("start", contactAttribution());
        const payment = new URLSearchParams(location.search).get("payment");
        setCancelled(payment === "cancel");
        if (payment === "success" || next.state === "checkout_started")
          next = await api("payment", {});
        setData(previous => previous && previous.version > next.version ? previous : next);
        setEmail(next.email);
        emit("AnalysisStarted");
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Connessione non disponibile.",
        );
      } finally {
        setBusy(false);
      }
    }
    void start();
  }, []);
  useEffect(() => {
    const sync = () => {
      void api("session")
        .then(setData)
        .catch(() => {});
    };
    const viewport = window.visualViewport;
    const reposition = () => {
      document.documentElement.style.setProperty(
        "--wm-keyboard-offset",
        `${Math.max(0, innerHeight - (viewport?.height ?? innerHeight) - (viewport?.offsetTop ?? 0))}px`,
      );
    };
    window.addEventListener("workmap-consent-saved", sync);
    viewport?.addEventListener("resize", reposition);
    reposition();
    return () => {
      window.removeEventListener("workmap-consent-saved", sync);
      viewport?.removeEventListener("resize", reposition);
      document.documentElement.style.removeProperty("--wm-keyboard-offset");
    };
  }, []);
  useEffect(() => {
    const field = input.current;
    if (field) {
      field.style.height = "auto";
      field.style.height = `${Math.min(120, Math.max(50, field.scrollHeight + 2))}px`;
      field.scrollTop = 0;
    }
  }, [answer, data?.question?.id, editing]);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [data?.messages.length, busy]);
  useEffect(() => {
    if (!data) return;
    if (data.state === "qualified") emit("AnalysisCompleted");
    if (data.confirmed) {
      emit("PreviewViewed", { workflow_count: data.workflowCount });
      if (!data.paid) emit("PaywallViewed");
    }
    if (data.paid) {
      emit("PremiumChatStarted");
      if (data.purchaseEventId)
        emit(
          "Purchase",
          {
            price: product.amount / 100,
            currency: product.currency.toUpperCase(),
          },
          data.purchaseEventId,
        );
    }
    if (data.state === "profile_complete") emit("PremiumChatCompleted");
    if (data.state === "ready") {
      emit("GenerationCompleted");
      emit("WorkMapViewed");
    }
  }, [data]);
  async function perform(
    action: string,
    body: object = {},
    event?: WorkMapEvent,
  ) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const next = await api(action, body);
      if (next.url) {
        trackWorkMap("CheckoutStarted");
        location.assign(next.url);
        return;
      }
      setData(previous => previous && previous.version > next.version ? previous : next);
      if (event) emit(event);
      return next;
    } catch (e) {
      if (["answer", "generate", "qualify", "payment"].includes(action))
        try {
          setData(await api("session"));
        } catch {}
      if (action === "generate") return;
      setError(
        e instanceof Error ? e.message : "Connessione interrotta. Riprova.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function submit(value: string) {
    if (!data || !value.trim()) return;
    const field = data.question?.field;
    if (!pending.current || pending.current.answer !== value)
      pending.current = { answer: value, id: crypto.randomUUID() };
    const next = await perform(
      editing ? "edit" : "answer",
      editing
        ? { answer: value }
        : {
            answer: value,
            version: data.version,
            requestId: pending.current.id,
          },
    );
    if (next) {
      setAnswer("");
      setSelected([]);
      setEditing(false);
      pending.current = null;
      if (field === "role") emit("RoleProvided");
      if (field === "mainTasks") emit("TasksProvided");
      if (field === "repetitiveTasks") emit("PainPointProvided");
    }
  }
  async function qualify() {
    const next = await perform("qualify", { email }, "EmailCaptured");
    if (next) await perform("email", {});
  }
  const live = Boolean(data && (["generating", "reviewing", "checkout_started"].includes(data.state) || (data.state === "failed" && (data.job?.attempts ?? 5) < 5)));
  const advancing = Boolean(data && ["generating", "reviewing"].includes(data.state));
  useEffect(() => {
    if (!advancing || busy) return;
    const timer = window.setTimeout(() => {
      setBusy(true);
      void api("generate", {})
        .then((next) => {
          setData((previous) =>
            previous && previous.version > next.version ? previous : next,
          );
        })
        .catch(() =>
          api("session")
            .then(setData)
            .catch(() => {}),
        )
        .finally(() => setBusy(false));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [advancing, busy, data?.job?.step, data?.job?.cursor, data?.version]);
  useEffect(() => {
    if (!live) return;
    const source = new EventSource("/api/workmap/events");
    source.onmessage = event => {
      try {
        const next: View = JSON.parse(event.data);
        setData(previous => previous && previous.version > next.version ? previous : next);
        if (next.state === "ready" || (next.state === "failed" && (next.job?.attempts ?? 5) >= 5)) source.close();
      } catch { /* Reconnection provides a new validated server snapshot. */ }
    };
    return () => source.close();
  }, [live]);
  const question = data?.question;
  const generating =
    data && ["generating", "reviewing", "failed"].includes(data.state);
  return (
    <div className="wm-shell">
      <header className="wm-shell-header">
        <Link href="/" aria-label="ACCELERIAMO, homepage">
          <Brand />
        </Link>
        <div>
          <Link href="/ai-workmap">← AI WorkMap</Link>
          <CookiePreferences />
        </div>
      </header>
      {data?.state === "ready" ? (
        <WorkMapResult data={data} />
      ) : (
        <main id="contenuto" className="wm-chat">
          <nav className="wm-progress" aria-label="Avanzamento dell’analisi">
            <span className={data?.profile.role ? "active" : ""}>
              Profilo {data?.profile.role ? "✓" : ""}
            </span>
            <span className={data?.profile.mainTasks.length ? "active" : ""}>
              Attività {data?.profile.mainTasks.length ? "✓" : ""}
            </span>
            <span
              className={
                data?.profile.timeConsumingTasks.length ? "active" : ""
              }
            >
              Priorità {data?.profile.timeConsumingTasks.length ? "✓" : ""}
            </span>
            <span
              className={data?.workflowCount || data?.confirmed ? "active" : ""}
            >
              {data?.paid ? "WorkMap" : "Analisi"}
            </span>
          </nav>
          {cancelled && !data?.paid && (
            <p className="wm-alert">
              Pagamento annullato. L’analisi è salvata: puoi riprendere quando
              vuoi.
            </p>
          )}
          {error && (
            <div className="wm-alert" role="alert">
              <p>{error}</p>
              {!data ? (
                <button className="button" onClick={() => location.reload()}>
                  Riprova
                </button>
              ) : generating && data.state !== "failed" ? (
                <button
                  className="button"
                  disabled={busy}
                  onClick={() => void perform("generate", {})}
                >
                  Riprendi generazione
                </button>
              ) : null}
            </div>
          )}
          {data?.state === "checkout_started" && !data.paid && (
            <div className="wm-alert">
              <p>
                Se hai completato il pagamento, attendiamo la conferma del
                servizio.
              </p>
              <button
                className="button"
                disabled={busy}
                onClick={() => void perform("payment", {})}
              >
                Verifica pagamento
              </button>
            </div>
          )}
          {!data && !error && <p role="status">Apro la tua conversazione…</p>}
          {data && !generating && (
            <>
              {(!data.confirmed || data.paid || editing) && (
                <div
                  className="wm-messages"
                  role="log"
                  aria-label="Conversazione"
                >
                  {data.messages.map((m, i) => (
                    <div
                      key={i}
                      className={`wm-message ${m.role === "user" ? "wm-message-user" : ""}`}
                    >
                      {m.role === "assistant" && (
                        <small>CONSULENTE AI · ACCELERIAMO</small>
                      )}
                      <p>{m.text}</p>
                    </div>
                  ))}
                </div>
              )}
              {question && !editing && (
                <>
                  <div className="wm-choices" aria-label="Risposte rapide">
                    {question.options.map((option) => (
                      <button
                        disabled={busy}
                        className="wm-choice"
                        key={option}
                        aria-pressed={selected.includes(option)}
                        onClick={() =>
                          question.kind === "single"
                            ? void submit(option)
                            : setSelected((previous) =>
                                previous.includes(option)
                                  ? previous.filter((v) => v !== option)
                                  : question.field === "timeConsumingTasks" &&
                                      previous.length >= 3
                                    ? previous
                                    : [...previous, option],
                              )
                        }
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {question.kind === "multi" && selected.length > 0 && (
                    <button
                      className="button button--primary"
                      disabled={busy}
                      onClick={() => void submit(selected.join("; "))}
                    >
                      Conferma{" "}
                      {selected.length === 1
                        ? "la scelta"
                        : `le ${selected.length} scelte`}
                    </button>
                  )}
                  {question.field === "role" && (
                    <div className="wm-choices">
                      {professions
                        .filter(
                          (p) =>
                            !answer ||
                            p.toLowerCase().includes(answer.toLowerCase()),
                        )
                        .slice(0, 6)
                        .map((p) => (
                          <button
                            className="wm-choice"
                            key={p}
                            disabled={busy}
                            onClick={() => void submit(p)}
                          >
                            {p}
                          </button>
                        ))}
                    </div>
                  )}
                </>
              )}
              {!question && !data.email && (
                <section className="wm-card">
                  <h2>Ho individuato un primo punto da approfondire.</h2>
                  <p>
                    {data.insight ||
                      `Le attività che hai indicato (${data.profile.timeConsumingTasks.slice(0, 2).join(", ")}) sono il punto da cui partire: valuterò input disponibili e controlli necessari.`}
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void qualify();
                    }}
                  >
                    <label htmlFor="wm-email">
                      Dove vuoi che salvi la tua analisi?
                    </label>
                    <input
                      id="wm-email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="button button--primary" disabled={busy}>
                      Mostra la mia analisi gratuita
                    </button>
                    <p className="wm-micro">
                      Ti invieremo il risultato e potrai riprenderlo se chiudi
                      la pagina. Nessuna iscrizione marketing.{" "}
                      <Link
                        href="/ai-workmap/condizioni#privacy"
                        target="_blank"
                      >
                        Informativa privacy
                      </Link>
                      .
                    </p>
                  </form>
                </section>
              )}
              {!question && data.email && data.state === "lead" && (
                <button
                  className="button button--primary"
                  disabled={busy}
                  onClick={() => void qualify()}
                >
                  Prepara la mia analisi
                </button>
              )}
              {data.state === "qualified" && !data.confirmed && !editing && (
                <section className="wm-card">
                  <h2>Ecco cosa ho capito del tuo lavoro.</h2>
                  <ProfileSummary data={data} />
                  <p>È corretto?</p>
                  <div className="wm-actions">
                    <button
                      className="button button--primary"
                      disabled={busy}
                      onClick={() =>
                        void perform("confirm", {}, "ProfileConfirmed")
                      }
                    >
                      Sì, è corretto
                    </button>
                    <button className="button" onClick={() => setEditing(true)}>
                      Modifica
                    </button>
                  </div>
                </section>
              )}
              {editing && (
                <p className="wm-alert">
                  Scrivi cosa vuoi correggere. Aggiornerò il profilo e le
                  opportunità.
                </p>
              )}
              {data.confirmed && !data.paid && (
                <>
                  <h1 style={{ marginTop: 32 }}>
                    Ho individuato {data.workflowCount} applicazioni AI utili
                    per il tuo profilo.
                  </h1>
                  <p>Ecco le prime 3 da considerare.</p>
                  {data.opportunities?.map((w, i) => (
                    <article className="wm-card" key={w.id}>
                      <span className="eyebrow">
                        0{i + 1} · {w.priority}
                      </span>
                      <h2>{w.title}</h2>
                      <p>{w.reason}</p>
                      <span className="wm-tag">{w.difficulty}</span>
                    </article>
                  ))}
                  <p className="wm-alert">{data.notRecommended}</p>
                  <section className="wm-card">
                    <p className="eyebrow">AI WORKMAP COMPLETA</p>
                    <h2>
                      Queste sono le prime 3.
                      <br />
                      La tua mappa continua.
                    </h2>
                    <ul>
                      <li>{data.workflowCount} workflow personali</li>
                      <li>
                        {data.workflowCount * 2} prompt operativi e di revisione
                      </li>
                      <li>3 assistenti AI</li>
                      <li>Strumenti, procedure e checklist</li>
                      <li>Privacy e piano 30 giorni</li>
                      <li>PDF e versione web privata</li>
                    </ul>
                    <p className="wm-price">{product.priceLabel}</p>
                    <p>IVA inclusa. Pagamento una tantum.</p>
                    <label className="wm-terms">
                      <input
                        type="checkbox"
                        checked={terms}
                        onChange={(e) => setTerms(e.target.checked)}
                      />
                      <span>
                        Ho letto le{" "}
                        <Link href="/ai-workmap/condizioni" target="_blank">
                          condizioni di acquisto
                        </Link>{" "}
                        e richiedo la preparazione del documento personalizzato.
                      </span>
                    </label>
                    <button
                      className="button button--primary"
                      disabled={busy || !terms || !data.checkoutEnabled}
                      onClick={() =>
                        void perform("checkout", { acceptTerms: terms })
                      }
                    >
                      Genera la mia AI WorkMap
                    </button>
                    {!data.checkoutEnabled && (
                      <p className="wm-micro">
                        L’acquisto sarà disponibile a breve. La tua analisi è
                        salvata.
                      </p>
                    )}
                    <div className="wm-actions">
                      <Link className="text-link" href="/ai-workmap">
                        Continua più tardi
                      </Link>
                    </div>
                  </section>
                </>
              )}
              {data.state === "profile_complete" && (
                <section className="wm-card">
                  <h2>
                    Adesso ho abbastanza informazioni per costruire la tua AI
                    WorkMap.
                  </h2>
                  <ProfileSummary data={data} />
                  <button
                    className="button button--primary"
                    disabled={busy}
                    onClick={() =>
                      void perform("generate", {}, "GenerationStarted")
                    }
                  >
                    Genera la WorkMap
                  </button>
                </section>
              )}
            </>
          )}
          {generating && (
            <section className="wm-card">
              <h1>
                {data.state === "failed"
                  ? "Riprendiamo da dove eravamo."
                  : "Sto costruendo la tua WorkMap."}
              </h1>
              <p>
                Puoi lasciare questa pagina. Il risultato sarà disponibile qui e
                riceverai il collegamento via email.
              </p>
              <ol className="wm-status-list">
                {stages.map((label, i) => (
                  <li
                    key={label}
                    className={data.job?.step === i ? "active" : ""}
                  >
                    {i < (data.job?.step ?? 0)
                      ? "✓ "
                      : i === data.job?.step
                        ? "→ "
                        : ""}
                    {label}
                    {i === 2 && data.job?.step === 2
                      ? ` (${data.job.cursor} di ${data.workflowCount})`
                      : ""}
                  </li>
                ))}
              </ol>
              {data.state === "failed" && (
                <>
                  <p role="alert">{data.job?.error}</p>
                  <button
                    className="button button--primary"
                    disabled={busy}
                    onClick={() => void perform("generate", { retry: true })}
                  >
                    Riprova dal punto salvato
                  </button>
                </>
              )}
            </section>
          )}
          {data?.mailErrors.length ? (
            <p className="wm-alert">
              L’email non è stata ancora consegnata. L’analisi resta accessibile
              da questo browser.{" "}
              <button
                className="wm-copy"
                disabled={busy}
                onClick={() => void perform("email", {})}
              >
                Riprova l’invio
              </button>
            </p>
          ) : null}
          {busy && (
            <p role="status" aria-live="polite" className="wm-micro">
              {generating
                ? stages[data?.job?.step ?? 0]
                : data?.question
                  ? "Leggo la tua risposta…"
                  : "Preparo la tua analisi…"}
            </p>
          )}
          <div className="wm-chat-end" ref={bottom} />
        </main>
      )}
      {data &&
        (question || editing) &&
        !generating &&
        data.state !== "ready" && (
          <div className="wm-composer">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submit(answer);
              }}
            >
              <label htmlFor="wm-answer">
                <span>
                  {editing ? "Correggi il profilo" : "La tua risposta"}
                </span>
                <textarea
                  id="wm-answer"
                  ref={input}
                  rows={1}
                  maxLength={4000}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={
                    question?.kind === "text"
                      ? "Bastano poche parole…"
                      : "Oppure scrivi la tua risposta…"
                  }
                  required
                  disabled={busy}
                />
              </label>
              <button
                className="button button--primary"
                disabled={busy || !answer.trim()}
              >
                Invia
              </button>
            </form>
            <p className="wm-micro">
              Non inserire password, segreti aziendali o dati sensibili dei tuoi
              clienti.
            </p>
          </div>
        )}
    </div>
  );
}
function ProfileSummary({ data }: { data: View }) {
  return (
    <dl>
      {[
        ["Ruolo", data.profile.role],
        [
          "Contesto",
          [
            data.profile.companyType,
            data.profile.teamContext,
            data.profile.teamSize,
          ]
            .filter(Boolean)
            .join(" · "),
        ],
        ["Attività principali", data.profile.mainTasks.join(", ")],
        ["Priorità", data.profile.timeConsumingTasks.join(", ")],
        ["Attività ripetitive", data.profile.repetitiveTasks.join(", ")],
        ["Livello AI", data.profile.aiLevel],
      ]
        .filter(([, v]) => v)
        .map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
    </dl>
  );
}
