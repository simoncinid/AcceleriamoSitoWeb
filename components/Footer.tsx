import Link from "next/link";
import { Brand } from "./Brand";
import { legalIdentity, legalLinks } from "@/lib/legal";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div><Link href="/" aria-label="ACCELERIAMO, homepage"><Brand light /></Link><p>Soluzioni su misura, supporto e manutenzione per le PMI.</p>
            {legalIdentity.address && <p>{legalIdentity.address}</p>}
            {legalIdentity.email && <p><Link href={`mailto:${legalIdentity.email}`}>{legalIdentity.email}</Link></p>}
          </div>
          <nav className="footer-links" aria-label="Navigazione nel footer"><Link href="/#servizi">Cosa facciamo</Link><Link href="/#metodo">Come lavoriamo</Link><Link href="/#chi-siamo">Chi siamo</Link><Link href="/#contatti">Richiedi una consulenza gratuita</Link></nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ACCELERIAMO · {legalIdentity.name} · P. IVA {legalIdentity.vat}</span>
          <nav aria-label="Informazioni legali">{legalLinks.map(({ href, label }) => <Link key={href} href={href}>{label}</Link>)}</nav>
        </div>
      </div>
    </footer>
  );
}
