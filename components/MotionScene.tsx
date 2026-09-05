"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./SiteMotion.module.css";

type SceneProps = { children: ReactNode; className?: string; label: string; duration?: number };

/** Mark the illustrated elements with data-motion and their entrance time in seconds. */
export function MotionScene({ children, className = "", label, duration = 11000 }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let animations: Animation[] = [];
    let visible = false;
    const update = () => {
      const active = visible && !document.hidden;
      element.dataset.running = String(active && !preference.matches);
      animations.forEach(animation => active ? animation.play() : animation.pause());
    };
    const build = () => {
      animations.forEach(animation => animation.cancel());
      animations = [];
      if (!preference.matches) {
        element.querySelectorAll<HTMLElement>("[data-motion]").forEach(target => {
          const at = Number(target.dataset.at ?? 0) * 1000 / duration;
          const mode = target.dataset.motion;
          const from = mode === "draw" ? "scaleX(0)" : mode === "rise" ? "translateY(28px) scale(.94)" : mode === "pop" ? "translateY(12px) scale(.65) rotate(-8deg)" : "translateY(16px) scale(.97)";
          const rest = mode === "draw" ? "scaleX(1)" : "translateY(0) scale(1) rotate(0deg)";
          let frames: Keyframe[];
          if (mode === "focus") {
            frames = [
              { offset: 0, boxShadow: "inset 0 0 0 1px transparent", backgroundColor: "#fffdf8" },
              { offset: at, boxShadow: "inset 0 0 0 1px transparent", backgroundColor: "#fffdf8" },
              { offset: at + .04, boxShadow: "inset 0 0 0 1px #ff5a1f", backgroundColor: "#fff0e2" },
              { offset: Math.min(at + .18, .87), boxShadow: "inset 0 0 0 1px transparent", backgroundColor: "#fffdf8" },
              { offset: 1, boxShadow: "inset 0 0 0 1px transparent", backgroundColor: "#fffdf8" },
            ];
          } else if (mode === "scan") {
            frames = [
              { offset: 0, opacity: 0, transform: "translateY(-100%)" },
              { offset: at, opacity: 0, transform: "translateY(-100%)" },
              { offset: at + .02, opacity: .8, transform: "translateY(-90%)" },
              { offset: at + .16, opacity: .8, transform: "translateY(350%)" },
              { offset: at + .2, opacity: 0, transform: "translateY(400%)" },
              { offset: 1, opacity: 0 },
            ];
          } else if (mode === "travel") {
            frames = [
              { offset: 0, opacity: 0, transform: "translateX(-20px) scale(.8)" },
              { offset: at, opacity: 0, transform: "translateX(-20px) scale(.8)" },
              { offset: at + .025, opacity: 1, transform: "translateX(-10px) scale(1)" },
              { offset: at + .14, opacity: 1, transform: "translateX(20px) scale(1)" },
              { offset: at + .17, opacity: 0, transform: "translateX(28px) scale(.8)" },
              { offset: 1, opacity: 0 },
            ];
          } else {
            frames = [
              { offset: 0, opacity: 0, transform: from },
              { offset: at, opacity: 0, transform: from, easing: "cubic-bezier(.16,1,.3,1)" },
              { offset: at + .065, opacity: 1, transform: mode === "pop" ? "translateY(-2px) scale(1.07) rotate(2deg)" : rest, easing: "ease-out" },
              { offset: at + .09, opacity: 1, transform: rest },
              { offset: .89, opacity: 1, transform: rest },
              { offset: .96, opacity: 0, transform: rest },
              { offset: 1, opacity: 0, transform: from },
            ];
          }
          const animation = target.animate(frames, { duration, iterations: Infinity, fill: "both" });
          animation.pause();
          animations.push(animation);
        });
      }
      update();
    };
    build();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { threshold: .3 });
    observer.observe(element.querySelector("[data-motion-viewport]") ?? element);
    preference.addEventListener("change", build);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", build);
      document.removeEventListener("visibilitychange", update);
      animations.forEach(animation => animation.cancel());
    };
  }, [duration]);

  return (
    <div ref={root} className={`${styles.scene} ${className}`} data-scene={label} role="group" aria-label={label}>
      {children}
    </div>
  );
}

/** Text enters once; focusable controls and the form remain available throughout. */
export function SectionEntrances() {
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (!preference.matches) animations.push(entry.target.animate([
        { opacity: .35, transform: "translateY(16px)" },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 650, easing: "cubic-bezier(.16,1,.3,1)" }));
    }), { threshold: .15 });
    document.querySelectorAll(".hero__copy, section:not(#confronto) .section-heading, .human-grid > div:first-child, .integrations__inner > div, .contact-copy, .footer-main").forEach(element => observer.observe(element));
    const stop = () => { if (preference.matches) animations.forEach(animation => animation.finish()); };
    preference.addEventListener("change", stop);
    return () => { observer.disconnect(); preference.removeEventListener("change", stop); animations.forEach(animation => animation.cancel()); };
  }, []);
  return null;
}
