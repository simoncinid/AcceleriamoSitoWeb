import type { Metadata } from "next";
import { WorkMapChat } from "@/components/workmap/Chat";
export const metadata: Metadata = {
  title: "La tua analisi AI WorkMap",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
  alternates: { canonical: "/ai-workmap/analisi" },
};
export default function Analysis() {
  return <WorkMapChat />;
}
