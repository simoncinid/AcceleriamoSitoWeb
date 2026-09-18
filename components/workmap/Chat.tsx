"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { stages } from "@/lib/workmap/config";
import { contactAttribution } from "@/lib/tracking";
import { trackWorkMap, type WorkMapEvent } from "./tracking";
import type { view } from "@/lib/workmap/service";
type View = ReturnType<typeof view>;
const EMAIL_PROMPT =
  "A che indirizzo mail devo inviare l'analisi completa?";
function StepWait({ label }: { label: string }) {
  return (
    <section className="wm-step wm-step--wait" role="status" aria-live="polite">
      <span className="wm-spinner" aria-hidden />
      <p>{label}</p>
    </section>
  );
}
function useMaxQuickChoices() {
  const [max, setMax] = useState(8);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setMax(w <= 360 ? 4 : w <= 430 ? 5 : w <= 600 ? 6 : 8);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return max;
}
async function api(
  action: string,
  body?: object,
): Promise<View> {
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
    [email, setEmail] = useState(""),
    [editing, setEditing] = useState(false),
    [previewStep, setPreviewStep] = useState(0),
    [waitKind, setWaitKind] = useState<null | "qualify" | "confirm">(null),
    [replyPending, setReplyPending] = useState(false);
  const maxQuickChoices = useMaxQuickChoices();
  const input = useRef<HTMLTextAreaElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const pending = useRef<{ answer: string; id: string } | null>(null),
    events = useRef(new Set<string>()),
    initialized = useRef(false);
  const emit = (
    name: WorkMapEvent,
    extra?: { workflow_count?: number },
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
      const height = Math.round(viewport?.height ?? innerHeight);
      document.documentElement.style.setProperty("--wm-app-height", `${height}px`);
      document.documentElement.style.setProperty(
        "--wm-keyboard-offset",
        `${Math.max(0, innerHeight - height - (viewport?.offsetTop ?? 0))}px`,
      );
    };
    window.addEventListener("workmap-consent-saved", sync);
    window.addEventListener("resize", reposition);
    viewport?.addEventListener("resize", reposition);
    viewport?.addEventListener("scroll", reposition);
    reposition();
    return () => {
      window.removeEventListener("workmap-consent-saved", sync);
      window.removeEventListener("resize", reposition);
      viewport?.removeEventListener("resize", reposition);
      viewport?.removeEventListener("scroll", reposition);
      document.documentElement.style.removeProperty("--wm-app-height");
      document.documentElement.style.removeProperty("--wm-keyboard-offset");
    };
  }, []);
  useEffect(() => {
    const field = input.current;
    if (field) {
      field.style.height = "auto";
      field.style.height = `${Math.min(72, Math.max(44, field.scrollHeight + 2))}px`;
      field.scrollTop = 0;
    }
  }, [answer, data?.question?.id, editing]);
  useEffect(() => {
    const log = thread.current;
    if (!log || log.classList.contains("wm-thread--step")) return;
    log.scrollTop = log.scrollHeight;
  }, [data?.messages.length, busy, data?.question?.id]);
  useEffect(() => {
    if (!data) return;
    if (data.state === "qualified") emit("AnalysisCompleted");
    if (data.confirmed) {
      emit("PreviewViewed", { workflow_count: data.workflowCount });
    }
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
    const loading: null | "qualify" | "confirm" =
      action === "qualify" ? "qualify" : action === "confirm" ? "confirm" : null;
    if (loading) setWaitKind(loading);
    setBusy(true);
    setError("");
    try {
      const next = await api(action, body);
      setData(previous => previous && previous.version > next.version ? previous : next);
      if (event) emit(event);
      return next;
    } catch (e) {
      if (["answer", "generate", "qualify"].includes(action))
        try {
          setData(await api("session"));
        } catch {}
      if (action === "generate") return;
      setError(
        e instanceof Error ? e.message : "Connessione interrotta. Riprova.",
      );
    } finally {
      setBusy(false);
      if (loading) setWaitKind(null);
    }
  }
  async function submit(value: string) {
    if (!data || !value.trim() || busy) return;
    const text = value.trim();
    const field = data.question?.field;
    const isEdit = editing;
    setReplyPending(true);
    try {
      if (!pending.current || pending.current.answer !== text)
        pending.current = { answer: text, id: crypto.randomUUID() };
      setAnswer("");
      setEditing(false);
      setError("");
      setData((previous) =>
        previous
          ? {
              ...previous,
              messages: [...previous.messages, { role: "user", text }],
              question: isEdit ? previous.question : null,
            }
          : previous,
      );
      const next = await perform(
        isEdit ? "edit" : "answer",
        isEdit
          ? { answer: text }
          : {
              answer: text,
              version: data.version,
              requestId: pending.current.id,
            },
      );
      if (next) {
        pending.current = null;
        if (field === "role") emit("RoleProvided");
        if (field === "mainTasks") emit("TasksProvided");
        if (field === "repetitiveTasks") emit("PainPointProvided");
        if (
          isEdit &&
          next.state === "lead" &&
          next.email &&
          next.workflowCount === 0
        ) {
          const again = await perform(
            "qualify",
            { email: next.email },
            "EmailCaptured",
          );
          if (again?.state === "profile_complete")
            await perform("generate", {}, "GenerationStarted");
        }
        if (next.state === "profile_complete")
          await perform("generate", {}, "GenerationStarted");
      }
    } finally {
      setReplyPending(false);
    }
  }
  async function qualify() {
    await perform("qualify", { email }, "EmailCaptured");
  }
  async function retryDelivery() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      setData(await api("email", {}));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invio non riuscito. Riprova.");
    } finally {
      setBusy(false);
    }
  }
  async function restart() {
    setBusy(true);
    setError("");
    try {
      const next = await api("reset", contactAttribution());
      setData(next);
      setAnswer("");
      setEmail("");
      setEditing(false);
      setPreviewStep(0);
      setReplyPending(false);
      pending.current = null;
      events.current = new Set();
      emit("AnalysisStarted");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Non riesco a ricominciare. Riprova.",
      );
    } finally {
      setBusy(false);
    }
  }
  const live = Boolean(data && (["generating", "reviewing"].includes(data.state) || (data.state === "failed" && (data.job?.attempts ?? 5) < 5)));
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
  const showDock = Boolean(
    data && (question || editing) && !generating && data.state !== "ready",
  );
  const funnelScreen = Boolean(
    data &&
      !generating &&
      !question &&
      !editing &&
      !replyPending &&
      (waitKind ||
        (data.state === "lead" &&
          (!data.email || busy || waitKind === "qualify")) ||
        (data.state === "qualified" && !data.confirmed) ||
        (data.confirmed && data.state === "qualified")),
  );
  const awaitingReply = Boolean(
    busy && replyPending && !generating && !waitKind,
  );
  const loadingStep = Boolean(waitKind && !generating);
  const apps = data?.opportunities ?? [];
  const previewing = Boolean(data?.confirmed && data.state === "qualified" && !generating);
  const previewTotal = Math.max(1, apps.length + 1);
  const step = Math.min(previewStep, previewTotal - 1);
  const onOffer = previewing && step >= apps.length;
  const currentApp =
    previewing && !onOffer ? apps[Math.max(0, step)] : undefined;
  const showLog = Boolean(
    data &&
      !generating &&
      !funnelScreen &&
      (question ||
        editing ||
        awaitingReply),
  );
  const showEmailCapture = Boolean(
    funnelScreen &&
      !loadingStep &&
      data?.state === "lead" &&
      !question &&
      !data.email &&
      !replyPending &&
      !awaitingReply,
  );
  return (
    <div className="wm-shell">
      <header className="wm-shell-header">
        <Link href="/" aria-label="ACCELERIAMO, homepage">
          <Brand />
        </Link>
        <div>
          <button
            type="button"
            className="wm-reset"
            onClick={() => void restart()}
          >
            Ricomincia
          </button>
          <Link href="/ai-workmap">← AI WorkMap</Link>
        </div>
      </header>
      {data?.state === "ready" ? (
        <main id="contenuto" className="wm-thanks">
          <p className="eyebrow">Analisi completata</p>
          <h1>Grazie.</h1>
          {data.emailDelivered ? (
            <p>
              Abbiamo inviato la tua AI WorkMap in PDF a <strong>{data.email}</strong>.
              Controlla anche la cartella spam.
            </p>
          ) : (
            <p>
              La tua AI WorkMap è pronta, ma l’email non è ancora partita.
              Puoi riprovare l’invio adesso.
            </p>
          )}
          {error && <p className="wm-alert" role="alert">{error}</p>}
          <div className="wm-thanks-actions">
            {!data.emailDelivered && (
              <button
                className="button"
                disabled={busy}
                onClick={() => void retryDelivery()}
              >
                Invia di nuovo il PDF
              </button>
            )}
            <Link className="button button--primary" href="/">
              Vai alla home
            </Link>
          </div>
        </main>
      ) : (
        <main id="contenuto" className="wm-chat">
          <nav className="wm-progress" aria-label="Avanzamento dell’analisi">
            <span className={data?.profile.role ? "active" : ""}>Profilo</span>
            <span className={data?.profile.mainTasks.length ? "active" : ""}>
              Attività
            </span>
            <span
              className={
                data?.profile.timeConsumingTasks.length ? "active" : ""
              }
            >
              Priorità
            </span>
            <span
              className={data?.workflowCount || data?.confirmed ? "active" : ""}
            >
              Analisi
            </span>
          </nav>
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
          <div
            ref={thread}
            className={showLog ? "wm-thread" : "wm-thread wm-thread--step"}
          >
            {!data && !error && (
              <p role="status" className="wm-micro">
                Apro la tua conversazione…
              </p>
            )}
            {data && !generating && (
              <>
                {showLog && (
                  <div
                    className="wm-messages"
                    role="log"
                    aria-label="Conversazione"
                  >
                    {data.messages.map((m, i) => (
                      <div
                        key={`${m.role}-${i}-${m.text.slice(0, 24)}`}
                        className={`wm-message${m.role === "user" ? " wm-message-user" : ""}${m.tone === "highlight" ? " wm-message-highlight" : ""}`}
                      >
                        <p>{m.text}</p>
                      </div>
                    ))}
                    {awaitingReply && (
                      <div
                        className="wm-message wm-message-pending"
                        role="status"
                        aria-live="polite"
                      >
                        <span className="wm-typing" aria-label="Sto scrivendo">
                          <i />
                          <i />
                          <i />
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {loadingStep && waitKind === "qualify" && (
                  <StepWait label="Preparo la tua analisi…" />
                )}
                {loadingStep && waitKind === "confirm" && (
                  <StepWait label="Preparo le opportunità per te…" />
                )}
                {showEmailCapture && (
                  <section className="wm-step">
                    <p className="eyebrow">Analisi gratuita</p>
                    <h2>{EMAIL_PROMPT}</h2>
                    <p className="wm-offer-line">
                      {data.insight ||
                        (data.profile.timeConsumingTasks[0]
                          ? `Parto da ${data.profile.timeConsumingTasks.slice(0, 2).join(" e ")}.`
                          : "Parto dalle attività che hai indicato.")}
                    </p>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        void qualify();
                      }}
                    >
                      <label htmlFor="wm-email">{EMAIL_PROMPT}</label>
                      <input
                        id="wm-email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={254}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <button
                        className="button button--primary"
                        disabled={busy}
                      >
                        Mostra la mia analisi gratuita
                      </button>
                      <p className="wm-micro">
                        Nessuna iscrizione marketing.{" "}
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
                {data.state === "qualified" &&
                  !data.confirmed &&
                  !editing &&
                  !loadingStep && (
                  <section className="wm-step">
                    <p className="eyebrow">Profilo individuato</p>
                    <h2>Ecco cosa ho capito del tuo lavoro.</h2>
                    <div className="wm-step-card">
                      <ProfileSummary data={data} />
                    </div>
                    <div className="wm-actions">
                      <button
                        className="button button--primary"
                        disabled={busy}
                        onClick={() => {
                          setPreviewStep(0);
                          void perform("confirm", {}, "ProfileConfirmed");
                        }}
                      >
                        Sì, è corretto
                      </button>
                      <button
                        className="button"
                        onClick={() => setEditing(true)}
                      >
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
                {data.confirmed && data.state === "qualified" && currentApp && (
                  <section className="wm-step">
                    <p className="eyebrow">
                      Applicazione {step + 1} di {apps.length}
                    </p>
                    <h2>
                      Ho individuato {data.workflowCount} applicazioni AI utili.
                    </h2>
                    <article className="wm-card wm-step-card">
                      <span className="eyebrow">
                        0{step + 1} · {currentApp.priority}
                      </span>
                      <h3>{currentApp.title}</h3>
                      <p>{currentApp.reason}</p>
                      <span className="wm-tag">{currentApp.difficulty}</span>
                    </article>
                  </section>
                )}
                {data.confirmed && data.state === "qualified" && onOffer && (
                  <section className="wm-step wm-step--delivery">
                    <div className="wm-delivery-copy">
                      <p className="eyebrow">La tua AI WorkMap</p>
                      <h2>
                        Hai visto le prime {apps.length}. Nel PDF trovi la mappa
                        completa.
                      </h2>
                      <p className="wm-delivery-contents">
                        {data.workflowCount} workflow personalizzati, prompt
                        pronti da copiare e un piano di 30 giorni.
                      </p>
                    </div>
                    <div className="wm-delivery-box">
                      <strong>È gratuita.</strong>
                      <span>Te la inviamo via email in formato PDF.</span>
                    </div>
                    <div className="wm-delivery-actions">
                      <button
                        className="button button--primary"
                        disabled={busy}
                        onClick={() => void perform("complete")}
                      >
                        Continua e ricevi il PDF
                      </button>
                      <Link href="/ai-workmap/condizioni" target="_blank">
                        Condizioni del servizio e privacy
                      </Link>
                    </div>
                  </section>
                )}
                {data.state === "profile_complete" && (
                  <section className="wm-step">
                    <p className="eyebrow">Pronto per generare</p>
                    <h2>Adesso posso costruire la tua AI WorkMap.</h2>
                    <div className="wm-step-card">
                      <ProfileSummary data={data} />
                    </div>
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
              <section className="wm-step">
                <p className="eyebrow">Generazione</p>
                <h2>
                  {data.state === "failed"
                    ? "Riprendiamo da dove eravamo."
                    : "Sto costruendo la tua WorkMap."}
                </h2>
                <p className="wm-offer-line">
                  Puoi lasciare la pagina: il risultato resta qui e arriva via
                  email in PDF.
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
            {data?.mailErrors.length && !previewing ? (
              <p className="wm-alert">
                L’email non è stata ancora consegnata. L’analisi resta
                accessibile da questo browser.{" "}
                <button
                  className="wm-copy"
                  disabled={busy}
                  onClick={() => void perform("email", {})}
                >
                  Riprova l’invio
                </button>
              </p>
            ) : null}
            <div className="wm-chat-end" />
          </div>
          {previewing && (
            <div className="wm-dock">
              <div className="wm-step-nav">
                <button
                  type="button"
                  className="button"
                  disabled={step === 0}
                  onClick={() => setPreviewStep(Math.max(0, step - 1))}
                >
                  Indietro
                </button>
                <span>
                  {step + 1} di {previewTotal}
                </span>
                {onOffer ? (
                  <span className="wm-step-nav-end">PDF gratuito</span>
                ) : (
                  <button
                    type="button"
                    className="button button--primary"
                    onClick={() =>
                      setPreviewStep(Math.min(previewTotal - 1, step + 1))
                    }
                  >
                    Avanti
                  </button>
                )}
              </div>
            </div>
          )}
          {showDock && (
            <div className="wm-dock">
              {question && !editing && question.options.length > 0 && (
                <div className="wm-choices" aria-label="Risposte rapide">
                  {question.options
                    .filter(
                      (option) =>
                        !answer ||
                        option.toLowerCase().includes(answer.toLowerCase()),
                    )
                    .slice(0, maxQuickChoices)
                    .map((option) => (
                      <button
                        disabled={busy}
                        className="wm-choice"
                        key={option}
                        onClick={() => void submit(option)}
                      >
                        {option}
                      </button>
                    ))}
                </div>
              )}
              <div className="wm-composer">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void submit(answer);
                  }}
                >
                  <textarea
                    id="wm-answer"
                    ref={input}
                    rows={1}
                    maxLength={4000}
                    value={answer}
                    aria-label={editing ? "Correggi il profilo" : "Messaggio"}
                    enterKeyHint="send"
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
                      e.preventDefault();
                      if (!busy && answer.trim()) void submit(answer);
                    }}
                    placeholder={
                      question?.kind === "text"
                        ? "Bastano poche parole…"
                        : "Oppure scrivi la tua risposta…"
                    }
                    required
                  />
                  <button
                    className="button button--primary"
                    disabled={!answer.trim()}
                  >
                    Invia
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
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
