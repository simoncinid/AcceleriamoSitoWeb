import type { MetadataRoute } from "next";
import { aiCrawlers, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/ai-workmap/analisi", "/ai-workmap/risultato"] },
      { userAgent: [...aiCrawlers], allow: "/", disallow: ["/api/", "/ai-workmap/analisi", "/ai-workmap/risultato"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: new URL(siteUrl).host,
  };
}
