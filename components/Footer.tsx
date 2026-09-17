import { WhatsAppLink } from "./WhatsAppLink";
import { CookiePreferences } from "./MarketingConsent";
import { whatsappDisplay } from "@/lib/contact";
import Link from "next/link";
import { Brand } from "./Brand";
import { legalIdentity, legalLinks } from "@/lib/legal";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div><Link href="/" aria-label="ACCELERIAMO, homepage"><Brand light /></Link><p>Meno tempo a ricopiare dati, più tempo per la tua azienda.</p>
            <WhatsAppLink className="footer-whatsapp" source="footer">{whatsappDisplay}</WhatsAppLink>
            {legalIdentity.email && <p><Link href={`mailto:${legalIdentity.email}`}>{legalIdentity.email}</Link></p>}
          </div>
          <nav className="footer-links" aria-label="Navigazione nel footer"><Link href="/#servizi">Cosa facciamo</Link><Link href="/ai-workmap">AI WorkMap</Link><Link href="/#metodo">Come lavoriamo</Link><Link href="/#chi-siamo">Chi siamo</Link><Link href="/#domande">Domande</Link><Link href="/#contatti">Richiedi la valutazione gratuita</Link></nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ACCELERIAMO è il marchio con cui opera {legalIdentity.name}{legalIdentity.address && ` · ${legalIdentity.address}`} · P.IVA {legalIdentity.vat}{legalIdentity.email && <> · <a href={`mailto:${legalIdentity.email}`}>{legalIdentity.email}</a></>}</span>
          <nav aria-label="Informazioni legali">{legalLinks.map(({ href, label }) => <Link key={href} href={href}>{label}</Link>)}<CookiePreferences /></nav>
        </div>
      </div>
    </footer>
  );
}
