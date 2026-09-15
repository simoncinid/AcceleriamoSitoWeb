import type { MetadataRoute } from "next";
import { brandLogos } from "@/lib/brand";
import { defaultDescription, siteName } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: defaultDescription,
    start_url: "/",
    display: "browser",
    background_color: "#FFFDF8",
    theme_color: "#FFFDF8",
    lang: "it",
    icons: [
      { src: brandLogos.faviconSvg, sizes: "any", type: "image/svg+xml" },
      { src: brandLogos.faviconPng, sizes: "512x512", type: "image/png" },
      { src: brandLogos.appIcon, sizes: "1024x1024", type: "image/png" },
    ],
  };
}
