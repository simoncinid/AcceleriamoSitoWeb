import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/mona-sans";
import { degularDisplay } from "./fonts";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://acceleriamo.it";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ACCELERIAMO | Soluzioni su misura per le PMI",
  description:
    "Preventivi, fatture e commesse: semplifichiamo il lavoro delle PMI. Consulenza gratuita, proposta, sviluppo su misura, supporto e manutenzione.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "/",
    siteName: "ACCELERIAMO",
    title: "Meno ore perse. Più tempo per la tua azienda.",
    description:
      "Richiedi una consulenza gratuita. Analizziamo il tuo caso, proponiamo e sviluppiamo la soluzione, poi ti seguiamo con supporto e manutenzione.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ACCELERIAMO | Consulenza gratuita per le PMI",
    description: "Dai preventivi alle commesse: consulenza gratuita, soluzioni su misura e supporto per la tua PMI.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFDF8",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "ACCELERIAMO",
  url: siteUrl,
  description:
    "Soluzioni su misura per le PMI italiane: consulenza gratuita per analizzare il caso, proposta, sviluppo, supporto e manutenzione. Automazione e intelligenza artificiale quando utili.",
  areaServed: { "@type": "Country", name: "Italia" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={degularDisplay.variable}>
      <body>
        <a className="skip-link" href="#contenuto">Vai al contenuto</a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
