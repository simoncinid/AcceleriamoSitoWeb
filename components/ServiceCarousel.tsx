"use client";

import { Children, useEffect, useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import styles from "./ServiceCarousel.module.css";

function slideLeft(scroller: HTMLDivElement, index: number) {
  const slide = scroller.children[index] as HTMLElement | undefined;
  if (!slide) return 0;
  return slide.offsetLeft - scroller.clientLeft;
}

function activeIndex(scroller: HTMLDivElement) {
  const center = scroller.scrollLeft + scroller.clientWidth / 2;
  let index = 0;
  for (let i = 0; i < scroller.children.length; i += 1) {
    const slide = scroller.children[i] as HTMLElement;
    if (slide.offsetLeft + slide.offsetWidth / 2 <= center) index = i;
  }
  return index;
}

type ServiceCarouselProps = {
  children: ReactNode;
  className?: string;
  label?: string;
  variant?: "dots" | "story";
};

export function ServiceCarousel({
  children,
  className = "service-stack",
  label = "Servizi",
  variant = "dots",
}: ServiceCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const lock = useRef<number | null>(null);
  const pointer = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const count = Children.count(children);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const mobile = window.matchMedia("(max-width: 820px)");

    const sync = () => {
      if (!mobile.matches) {
        setActive(0);
        return;
      }
      if (lock.current !== null) return;
      setActive(Math.min(count - 1, Math.max(0, activeIndex(scroller))));
    };

    sync();
    scroller.addEventListener("scroll", sync, { passive: true });
    mobile.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      scroller.removeEventListener("scroll", sync);
      mobile.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, [count]);

  const goTo = (index: number) => {
    const scroller = scrollRef.current;
    if (!scroller || !window.matchMedia("(max-width: 820px)").matches) return;
    const next = Math.min(count - 1, Math.max(0, index));
    lock.current = next;
    setActive(next);
    scroller.scrollTo({ left: slideLeft(scroller, next), behavior: "auto" });
    requestAnimationFrame(() => {
      lock.current = null;
    });
  };

  const tap = (direction: -1 | 1) => goTo(active + direction);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(max-width: 820px)").matches) return;
    pointer.current = { x: event.clientX, y: event.clientY, moved: false };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointer.current;
    if (!start || start.moved) return;
    if (Math.abs(event.clientX - start.x) > 8 || Math.abs(event.clientY - start.y) > 8) {
      start.moved = true;
    }
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointer.current;
    pointer.current = null;
    if (!start || start.moved) return;
    const scroller = scrollRef.current;
    if (!scroller) return;
    const rect = scroller.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    if (ratio < 0.34) tap(-1);
    else tap(1);
  };

  return (
    <div className={`${className} ${styles.root}`} data-variant={variant}>
      <div
        className={styles.track}
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {children}
      </div>
      <div className={styles.dots} role="tablist" aria-label={label}>
        {Array.from({ length: count }, (_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            className={styles.dot}
            aria-selected={active === index}
            data-seen={index <= active ? "true" : undefined}
            aria-label={`${label} ${index + 1}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
