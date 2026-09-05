"use client";

import Link from "next/link";
import { useRef } from "react";
import { Brand } from "./Brand";
import { Icon } from "./Icons";

const links = [
  ["Cosa facciamo", "/#servizi"],
  ["Come lavoriamo", "/#metodo"],
  ["Esempi", "/#esempi"],
  ["Chi siamo", "/#chi-siamo"],
];

export function Header() {
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
        <Link className="button button--small button--primary header-cta" href="/#contatti">Richiedi una consulenza gratuita <Icon name="arrow" size={17} /></Link>
        <div className="mobile-actions">
          <Link className="mobile-cta" href="/#contatti" onClick={closeMobileMenu}>Contattaci</Link>
          <details className="mobile-menu" ref={mobileMenu}>
            <summary aria-label="Apri o chiudi il menu"><Icon name="menu" size={24} /></summary>
            <nav aria-label="Navigazione mobile">
              {links.map(([label, href]) => <Link href={href} key={href} onClick={closeMobileMenu}>{label}</Link>)}
              <Link className="button button--small button--primary" href="/#contatti" onClick={closeMobileMenu}>Richiedi una consulenza gratuita</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
