import type { MetadataRoute } from "next";
import { absoluteUrl, publicPages, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.map(({ path, lastModified, changeFrequency, priority }) => ({
    url: path === "/" ? siteUrl : absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
    ...(path === "/" ? { images: [absoluteUrl("/opengraph-image")] } : {}),
  }));
}
