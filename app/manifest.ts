import type { MetadataRoute } from "next";
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
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
