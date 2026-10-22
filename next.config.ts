import type { NextConfig } from "next";
const config: NextConfig = {
  async redirects() {
    return [
      { source: "/ai-workmap", destination: "/", permanent: false },
      { source: "/ai-workmap/:path*", destination: "/", permanent: false },
    ];
  },
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
