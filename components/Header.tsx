"use client";

import Link from "next/link";
import { useRef } from "react";
import { Brand } from "./Brand";
import { Icon } from "./Icons";

const links = [
  ["Cosa facciamo", "/#servizi"],
  ["Come lavoriamo", "/#metodo"],
  ["Settori", "/#esempi"],
  ["Chi siamo", "/#chi-siamo"],
  ["Domande", "/#domande"],
];

export function Header({ workmap = false }: { workmap?: boolean } = {}) {
  const ctaHref = workmap ? "/ai-workmap/analisi" : "/#contatti";
  const ctaLabel = workmap
    ? "Richiedi l'analisi gratuitamente"
    : "Richiedi la valutazione gratuita";
  const mobileMenu = useRef<HTMLDetailsElement>(null);

  function closeMobileMenu() {
    mobileMenu.current?.removeAttribute("open");
  }

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="logo-link" href="/#top" aria-label="ACCELERIAMO, torna all’inizio"><Brand /></Link>
        <nav className="desktop-nav" aria-label="Navigazione principale">
          {links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          {!workmap && <Link className="button button--small button--dark" href="/ai-workmap">AI WorkMap</Link>}
          <Link className="button button--small button--primary header-cta" href={ctaHref}>{ctaLabel} <Icon name="arrow" size={17} /></Link>
        </div>
        <div className="mobile-actions">
          <Link className="mobile-cta" href={ctaHref} onClick={closeMobileMenu}>{workmap ? "Analisi gratuita" : "Valutazione gratuita"}</Link>
          <details className="mobile-menu" ref={mobileMenu}>
            <summary aria-label="Apri o chiudi il menu"><Icon name="menu" size={20} /></summary>
            <nav aria-label="Navigazione mobile">
              {links.map(([label, href]) => <Link href={href} key={href} onClick={closeMobileMenu}>{label}</Link>)}
              {!workmap && <Link className="button button--small button--dark" href="/ai-workmap" onClick={closeMobileMenu}>AI WorkMap</Link>}
              <Link className="button button--small button--primary" href={ctaHref} onClick={closeMobileMenu}>{ctaLabel}</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
