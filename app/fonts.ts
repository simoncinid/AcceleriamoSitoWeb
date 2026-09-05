import localFont from "next/font/local";

export const degularDisplay = localFont({
  src: [
    {
      path: "../Istruzioni/degular-font-family/DegularDisplayDemo-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../Istruzioni/degular-font-family/DegularDisplayDemo-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../Istruzioni/degular-font-family/DegularDisplayDemo-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../Istruzioni/degular-font-family/DegularDisplayDemo-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-degular-display",
  display: "swap",
});
