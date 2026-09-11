import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource-variable/inter";
import "@fontsource-variable/mona-sans";
import { degularDisplay } from "./fonts";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { siteGraph } from "@/lib/structured-data";
import {
  defaultDescription,
  defaultTitle,
  keywords,
  people,
  siteName,
  siteUrl,
  socialDescription,
  socialTitle,
} from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: `%s | ${siteName}` },
  description: defaultDescription,
  applicationName: siteName,
  category: "business",
  keywords,
  authors: people.map(({ name, linkedin }) => ({ name, url: linkedin })),
  creator: siteName,
  publisher: siteName,
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: "/",
    languages: { "it-IT": "/", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "/",
    siteName,
    title: socialTitle,
    description: socialDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Meno lavoro rifatto a mano`,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: { capable: true, title: siteName, statusBarStyle: "default" },
  other: {
    "geo.region": "IT",
    "geo.placename": "Italia",
    "content-language": "it",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFDF8",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={degularDisplay.variable}>
      <body suppressHydrationWarning>
        <a className="skip-link" href="#contenuto">Vai al contenuto</a>
        {children}
        <JsonLd data={siteGraph()} />
        <Analytics />
      </body>
    </html>
  );
}
