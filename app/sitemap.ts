import type { MetadataRoute } from "next";
import { LEGAL_VERSION, legalLinks } from "@/lib/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://acceleriamo.it";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...legalLinks.map(({ href }) => ({ url: new URL(href, base).toString(), lastModified: new Date(LEGAL_VERSION), changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
