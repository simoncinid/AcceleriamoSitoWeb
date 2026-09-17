import type { NextConfig } from "next";
const config: NextConfig = {
  outputFileTracingExcludes: {
    "/api/workmap/*": [
      "./.workmap-data/**/*",
      "./artifacts/**/*",
      "./tests/**/*",
      "./Istruzioni/**/*",
    ],
  },
  outputFileTracingIncludes: {
    "/api/workmap/*": [
      "./app/fonts/degular-accents/*.otf",
      "./node_modules/pdfkit/js/data/*.afm",
    ],
  },
};
export default config;
