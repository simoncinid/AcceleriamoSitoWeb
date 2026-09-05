import localFont from "next/font/local";

export const degularDisplay = localFont({
  src: [
    {
      path: "./fonts/degular-accents/DegularDisplay-Regular-accents.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/degular-accents/DegularDisplay-Medium-accents.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/degular-accents/DegularDisplay-Semibold-accents.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/degular-accents/DegularDisplay-Bold-accents.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-degular-display",
  display: "swap",
});
