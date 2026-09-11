import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource-variable/inter";
import "@fontsource-variable/mona-sans";
import { degularDisplay } from "./fonts";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://acceleriamo.it";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ACCELERIAMO | Meno lavoro rifatto a mano nella tua azienda",
  description:
    "Preventivi, ordini, documenti e giri dei tecnici: guardiamo come lavorate oggi e costruiamo il pezzo che vi toglie il lavoro ripetuto. Non dovete cambiare gestionale.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "/",
    siteName: "ACCELERIAMO",
    title: "Ogni giorno rifate a mano le stesse cose.",
    description:
      "Richiedi una valutazione: guardiamo un’attività che vi fa perdere tempo e ti chiamiamo per fissare una consulenza.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ACCELERIAMO | Meno lavoro rifatto a mano",
    description: "Preventivi, ordini, giri e appuntamenti: togliamo alle aziende italiane il lavoro ripetuto. Senza cambiare gestionale.",
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
    "Analizziamo il lavoro ripetuto delle aziende italiane e costruiamo il pezzo che lo toglie alle persone: lettura dei documenti, collegamento tra i programmi già in uso e software su misura quando manca lo strumento giusto.",
  areaServed: { "@type": "Country", name: "Italia" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={degularDisplay.variable}>
      <body suppressHydrationWarning>
        <a className="skip-link" href="#contenuto">Vai al contenuto</a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
