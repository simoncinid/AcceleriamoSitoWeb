import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LEGAL_DATE, LEGAL_VERSION, legalIdentity, legalLinks } from "@/lib/legal";

export function legalMetadata(title: string, description: string, path: string): Metadata {
  return {
    title: `${title} | ACCELERIAMO`, description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", locale: "it_IT", siteName: "ACCELERIAMO" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function LegalIdentity() {
  return <dl className="legal-identity">
    <dt>Titolare</dt><dd>{legalIdentity.name}, operante con il nome ACCELERIAMO</dd>
    <dt>Partita IVA</dt><dd>{legalIdentity.vat}</dd>
    <dt>Sede</dt><dd>{legalIdentity.address || "Da completare prima della pubblicazione."}</dd>
    <dt>Email di contatto e privacy</dt><dd>{legalIdentity.email ? <Link href={`mailto:${legalIdentity.email}`}>{legalIdentity.email}</Link> : "Da completare prima della pubblicazione."}</dd>
  </dl>;
}

export function LegalPage({ title, intro, path, children }: { title: string; intro: string; path: string; children: ReactNode }) {
  return <><Header /><main id="contenuto" className="container legal-page">
    <Link className="legal-back" href="/">← Torna alla homepage</Link>
    <p className="eyebrow">Informazioni legali</p>
    <h1>{title}</h1><p className="legal-intro">{intro}</p>
    <p className="legal-date">Ultimo aggiornamento: <time dateTime={LEGAL_VERSION}>{LEGAL_DATE}</time></p>
    {(!legalIdentity.address || !legalIdentity.email) && <p className="legal-notice">Documento in preparazione: i recapiti del titolare devono essere completati prima della pubblicazione.</p>}
    <nav className="legal-nav" aria-label="Documenti legali">{legalLinks.map(({ href, label }) => <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>{label}</Link>)}</nav>
    <article className="legal-content">{children}</article>
  </main><Footer /></>;
}
