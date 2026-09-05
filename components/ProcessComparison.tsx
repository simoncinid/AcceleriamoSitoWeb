"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { Icon } from "@/components/Icons";
import styles from "./ProcessComparison.module.css";

function Artwork({ kind }: { kind: "email" | "document" | "database" | "person" }) {
  return <span aria-hidden="true" className={`${styles.artwork} ${styles[kind]}`} />;
}

function Panel({ after = false, active = true, restartKey = 0, children }: { after?: boolean; active?: boolean; restartKey?: number; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const animations = useRef<Animation[]>([]);
  const running = useRef(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const panel = ref.current;
    if (!panel) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const build = () => {
      animations.current.forEach(animation => animation.cancel());
      animations.current = [];
      if (reducedMotion.matches) return;
      // One shared 11-second timeline: reveal, explain, hold, then reset together.
      const animate = (element: Element, frames: Keyframe[]) => {
        const animation = element.animate(frames, { duration: 11000, iterations: Infinity, easing: "linear", fill: "both" });
        animation.pause();
        animations.current.push(animation);
      };
      const reveal = (element: Element, start: number, from: string, to: string, peak = to) => {
        animate(element, [
          { offset: 0, opacity: 0, transform: from },
          { offset: start, opacity: 0, transform: from, easing: "cubic-bezier(.16,1,.3,1)" },
          { offset: start + .065, opacity: 1, transform: peak, easing: "ease-out" },
          { offset: start + .09, opacity: 1, transform: to },
          { offset: .9, opacity: 1, transform: to, easing: "ease-in" },
          { offset: .96, opacity: 0, transform: to },
          { offset: 1, opacity: 0, transform: from },
        ]);
      };
      panel.querySelectorAll<HTMLElement>(`.${styles.step}`).forEach((step, index) => {
        const start = after ? [.045, .2, .43][index] : .035 + index * .12;
        const shift = "translateX(var(--shift))";
        reveal(step, start, `${shift} translateY(22px) scale(.94)`, `${shift} translateY(0) scale(1)`, `${shift} translateY(-2px) scale(1.012)`);
        const icon = step.querySelector(`.${styles.artwork}`);
        if (icon) reveal(icon, start + .025, "translateY(8px) scale(.65) rotate(-8deg)", "translateY(0) scale(1)", "translateY(-2px) scale(1.1) rotate(2deg)");
        animate(step, [
          { offset: 0, borderColor: "#d7cec0", boxShadow: "0 4px 12px #37281907" },
          { offset: start, borderColor: "#d7cec0", boxShadow: "0 4px 12px #37281907" },
          { offset: start + .065, borderColor: "#ff5a1f", boxShadow: "0 8px 32px #ff5a1f30" },
          { offset: start + .16, borderColor: index === 2 && after ? "#ff5a1f" : "#d7cec0", boxShadow: "0 4px 12px #37281907" },
          { offset: 1, borderColor: index === 2 && after ? "#ff5a1f" : "#d7cec0", boxShadow: "0 4px 12px #37281907" },
        ]);
        const connector = step.querySelector(`.${styles.connector}`);
        if (connector) reveal(connector, start + .07, "scaleY(0)", "scaleY(1)");
        const check = step.querySelector("svg path");
        if (check) animate(check, [
          { offset: 0, strokeDasharray: "32", strokeDashoffset: "32" },
          { offset: start + .07, strokeDasharray: "32", strokeDashoffset: "32", easing: "ease-out" },
          { offset: start + .12, strokeDasharray: "32", strokeDashoffset: "0" },
          { offset: .93, strokeDasharray: "32", strokeDashoffset: "0" },
          { offset: 1, strokeDasharray: "32", strokeDashoffset: "32" },
        ]);
      });
      const handoff = panel.querySelector(`.${styles.handoff}`);
      if (handoff) reveal(handoff, .3, "translateY(-8px)", "translateY(0)");
      const packet = panel.querySelector(`.${styles.track} > span`);
      if (packet) animate(packet, [
        { offset: 0, opacity: 0, transform: "translateY(0) scaleY(.5)" },
        { offset: .32, opacity: 1, transform: "translateY(0) scaleY(1)" },
        { offset: .42, opacity: 1, transform: "translateY(25px) scaleY(1.8)" },
        { offset: .46, opacity: 0, transform: "translateY(30px) scaleY(.5)" },
        { offset: 1, opacity: 0 },
      ]);
      const sweep = panel.querySelector(`.${styles.sweep}`);
      if (sweep) animate(sweep, [
        { offset: 0, opacity: 0, transform: "translateY(-100%)" },
        { offset: .04, opacity: .8, transform: "translateY(-100%)" },
        { offset: .28, opacity: .8, transform: "translateY(420%)" },
        { offset: .32, opacity: 0, transform: "translateY(450%)" },
        { offset: 1, opacity: 0 },
      ]);
      const halo = panel.querySelector(`.${styles.halo}`);
      if (halo) animate(halo, [
        { offset: 0, opacity: 0, transform: "scale(.65)" },
        { offset: .44, opacity: 0, transform: "scale(.65)" },
        { offset: .54, opacity: .75, transform: "scale(1)" },
        { offset: .7, opacity: .3, transform: "scale(1.12)" },
        { offset: .9, opacity: .3, transform: "scale(1.12)" },
        { offset: 1, opacity: 0, transform: "scale(.65)" },
      ]);
      if (running.current && !document.hidden) animations.current.forEach(animation => animation.play());
    };
    const visibility = () => animations.current.forEach(animation => running.current && !document.hidden ? animation.play() : animation.pause());
    build();
    reducedMotion.addEventListener("change", build);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      animations.current.forEach(animation => animation.cancel());
      reducedMotion.removeEventListener("change", build);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [after]);
  useEffect(() => {
    running.current = visible && active;
    animations.current.forEach(animation => running.current && !document.hidden ? animation.play() : animation.pause());
  }, [visible, active]);
  useEffect(() => {
    if (restartKey === 0 || !active) return;
    running.current = true;
    animations.current.forEach(animation => {
      animation.currentTime = 0;
      if (!document.hidden) animation.play();
    });
  }, [restartKey, active]);
  return <article ref={ref} className={`${styles.card}${after ? ` ${styles.after}` : ""}`} data-running={visible && active}>{children}</article>;
}

const steps = [
  { icon: "email", label: "Apre email e allegati" },
  { icon: "document", label: "Cerca il listino del cliente" },
  { icon: "database", label: "Ricopia i campi nel gestionale" },
  { icon: "email", label: "Chiede i dati mancanti" },
  { icon: "person", label: "Scrive il preventivo" },
] as const;

export function ProcessComparison() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<"before" | "after">("before");
  const [restartKey, setRestartKey] = useState(0);
  const [mobile, setMobile] = useState(false);
  const activeLock = useRef<"before" | "after" | null>(null);
  const pointer = useRef<{
    id: number;
    x: number;
    y: number;
    scrollLeft: number;
    axis: "x" | "y" | null;
  } | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 820px)");
    const sync = () => setMobile(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const mobile = window.matchMedia("(max-width: 820px)");

    const syncFromScroll = () => {
      if (!mobile.matches) {
        setActive("before");
        return;
      }
      if (activeLock.current) return;
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      const slides = scroller.children;
      let index = 0;
      for (let i = 0; i < slides.length; i += 1) {
        const slide = slides[i] as HTMLElement;
        if (slide.offsetLeft + slide.offsetWidth / 2 <= center) index = i;
      }
      setActive(index > 0 ? "after" : "before");
    };

    syncFromScroll();
    scroller.addEventListener("scroll", syncFromScroll, { passive: true });
    mobile.addEventListener("change", syncFromScroll);
    window.addEventListener("resize", syncFromScroll);
    return () => {
      scroller.removeEventListener("scroll", syncFromScroll);
      mobile.removeEventListener("change", syncFromScroll);
      window.removeEventListener("resize", syncFromScroll);
    };
  }, []);

  const showPanel = (panel: "before" | "after") => {
    setActive(panel);
    setRestartKey(key => key + 1);
    const scroller = scrollRef.current;
    if (!scroller || !window.matchMedia("(max-width: 820px)").matches) return;
    activeLock.current = panel;
    const index = panel === "before" ? 0 : 1;
    const slide = scroller.children[index] as HTMLElement | undefined;
    scroller.scrollTo({ left: slide ? slide.offsetLeft - scroller.clientLeft : 0, behavior: "auto" });
    requestAnimationFrame(() => {
      activeLock.current = null;
    });
  };

  const endPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointer.current;
    const scroller = scrollRef.current;
    pointer.current = null;
    if (!start || start.id !== event.pointerId || !scroller) return;
    scroller.removeAttribute("data-dragging");
    if (start.axis !== "x") return;
    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    const after = scroller.children[1] as HTMLElement | undefined;
    showPanel(after && after.offsetLeft + after.offsetWidth / 2 <= center ? "after" : "before");
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(max-width: 820px)").matches) return;
    const scroller = scrollRef.current;
    if (!scroller) return;
    pointer.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      scrollLeft: scroller.scrollLeft,
      axis: null,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointer.current;
    const scroller = scrollRef.current;
    if (!start || start.id !== event.pointerId || !scroller) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!start.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      start.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (start.axis === "x") {
        scroller.dataset.dragging = "";
        scroller.setPointerCapture(event.pointerId);
      }
    }
    if (start.axis === "x") scroller.scrollLeft = start.scrollLeft - dx;
  };

  return (
    <div className={styles.comparison}>
      <div className={styles.toggle} role="tablist" aria-label="Confronto prima e dopo" data-active={active}>
        <span className={styles.toggleIndicator} aria-hidden="true" />
        <button
          type="button"
          role="tab"
          className={styles.toggleButton}
          aria-selected={active === "before"}
          onClick={() => showPanel("before")}
        >
          <span className={styles.toggleIcon}><Icon name="repeat" size={15} /></span>
          <span className={styles.toggleText}>Prima</span>
        </button>
        <button
          type="button"
          role="tab"
          className={styles.toggleButton}
          aria-selected={active === "after"}
          onClick={() => showPanel("after")}
        >
          <span className={styles.toggleIcon}><Icon name="shield" size={15} /></span>
          <span className={styles.toggleText}>Dopo</span>
        </button>
      </div>
      <div
        className={styles.grid}
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
      >
        <Panel active={!mobile || active === "before"} restartKey={restartKey}>
          <div className={styles.heading}>
            <span className={styles.label}>Prima</span>
            <h3>Ogni articolo va <span className="accent">ricopiato.</span></h3>
            <p>Il commerciale cerca codici e prezzi tra email, listino e gestionale.</p>
          </div>
          <div className={styles.stage}>
            <div className={styles.stageLabel}><span className={styles.dot} /> Esempio: richiesta di preventivo</div>
            <ol className={styles.manual} aria-label="Passaggi manuali">
              {steps.map((step, index) => (
                <li key={step.label} className={styles.step} style={{ "--shift": `${[0, 18, -8, 14, 0][index]}px` } as CSSProperties}>
                  <Artwork kind={step.icon} /><span>{step.label}</span><small aria-hidden="true">0{index + 1}</small>
                  {index < steps.length - 1 && <span className={styles.connector} aria-hidden="true" />}
                </li>
              ))}
            </ol>
          </div>
          <p className={styles.footer}><Icon name="repeat" size={18} /> Lo stesso percorso ricomincia con la richiesta successiva.</p>
        </Panel>
        <Panel after active={!mobile || active === "after"} restartKey={restartKey}>
          <div className={styles.heading}>
            <span className={styles.label}>Dopo</span>
            <h3>La bozza è pronta <span className="accent">da controllare.</span></h3>
            <p>Articoli, quantità e prezzi sono già nella bozza. I dati mancanti sono segnalati.</p>
          </div>
          <div className={styles.stage}>
            <span className={styles.halo} aria-hidden="true" />
            <div className={styles.stageLabel}><span className={styles.dot} /> Lo stesso caso, con gli strumenti collegati</div>
            <div className={styles.automatic}>
              <span className={styles.sweep} aria-hidden="true" />
              <div className={styles.systemLabel}><span>Il sistema</span><span className={styles.autoBadge}>Automatico</span></div>
              <ol className={styles.systemSteps} aria-label="Passaggi automatici">
                <li className={styles.step}><Artwork kind="document" /><span>Legge codici e quantità</span><Icon name="check" size={18} /></li>
                <li className={styles.step}><Artwork kind="database" /><span>Compila la bozza nel gestionale</span><Icon name="check" size={18} /></li>
              </ol>
            </div>
            <div className={styles.handoff} aria-hidden="true"><span className={styles.track}><span /></span><span>Bozza e dati da verificare</span><Icon name="arrow" size={18} /></div>
            <div className={`${styles.review} ${styles.step}`}>
              <Artwork kind="person" /><div><small>Il commerciale</small><strong>Valuta prezzo e condizioni</strong></div><span className={styles.reviewCheck}><Icon name="check" size={20} /></span>
            </div>
          </div>
          <p className={styles.footer}><Icon name="shield" size={18} /> Il commerciale controlla e approva prima dell’invio.</p>
        </Panel>
      </div>
    </div>
  );
}
