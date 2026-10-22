import type { MetadataRoute } from "next";
import { aiCrawlers, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/ai-workmap"] },
      { userAgent: [...aiCrawlers], allow: "/", disallow: ["/api/", "/ai-workmap"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: new URL(siteUrl).host,
  };
}
