"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { product, stages } from "@/lib/workmap/config";
import { contactAttribution } from "@/lib/tracking";
import { trackWorkMap, type WorkMapEvent } from "./tracking";
import type { view } from "@/lib/workmap/service";
import { WorkMapResult } from "./Result";
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
    [email, setEmail] = useState(""),
    [editing, setEditing] = useState(false),
    [terms, setTerms] = useState(false),
    [cancelled, setCancelled] = useState(false),
    [previewStep, setPreviewStep] = useState(0),
    [waitKind, setWaitKind] = useState<null | "qualify" | "confirm">(null),
    [replyPending, setReplyPending] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const pending = useRef<{ answer: string; id: string } | null>(null),
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
    const loading: null | "qualify" | "confirm" =
      action === "qualify" ? "qualify" : action === "confirm" ? "confirm" : null;
    if (loading) setWaitKind(loading);
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
          if (again) await perform("email", {});
        }
      }
    } finally {
      setReplyPending(false);
    }
  }
  async function qualify() {
    const next = await perform("qualify", { email }, "EmailCaptured");
    if (next) await perform("email", {});
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
      setTerms(false);
      setCancelled(false);
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
        (data.confirmed && !data.paid)),
  );
  const awaitingReply = Boolean(
    busy && replyPending && !generating && !waitKind,
  );
  const loadingStep = Boolean(waitKind && !generating);
  const apps = data?.opportunities ?? [];
  const previewing = Boolean(data?.confirmed && !data.paid && !generating);
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
        awaitingReply ||
        (data.paid && data.state !== "profile_complete")),
  );
  return (
    <div
      className={
        data?.state === "ready" ? "wm-shell wm-shell--document" : "wm-shell"
      }
    >
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
        <WorkMapResult data={data} />
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
                        className={`wm-message ${m.role === "user" ? "wm-message-user" : ""}`}
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
                {!loadingStep &&
                  data.state === "lead" &&
                  !question &&
                  !data.email && (
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
                {data.confirmed && !data.paid && currentApp && (
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
                {data.confirmed && !data.paid && onOffer && (
                  <section className="wm-step">
                    <p className="eyebrow">AI WorkMap completa</p>
                    <h2>
                      Queste erano le prime {apps.length}. La mappa continua.
                    </h2>
                    <p className="wm-offer-line">
                      {data.workflowCount} workflow · prompt operativi · 3
                      assistenti · piano 30 giorni · PDF
                    </p>
                    {data.notRecommended ? (
                      <p className="wm-micro">{data.notRecommended}</p>
                    ) : null}
                    <p className="wm-price">{product.priceLabel}</p>
                    <p className="wm-micro">IVA inclusa. Pagamento una tantum.</p>
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
                        e richiedo la preparazione del documento
                        personalizzato.
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
                  email.
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
                  <span className="wm-step-nav-end">Checkout</span>
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
                    .slice(0, 8)
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
