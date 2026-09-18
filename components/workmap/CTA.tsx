"use client";
import Link from "next/link";
import { Icon } from "@/components/Icons";
import { trackWorkMap } from "./tracking";
export function WorkMapCTA({ sticky = false }: { sticky?: boolean }) {
  return (
    <Link
      className={`button button--primary${sticky ? " wm-sticky" : ""}`}
      href="/ai-workmap/analisi"
      onClick={() => trackWorkMap("HeroCTA")}
    >
      Richiedi l&apos;analisi gratuitamente{" "}
      <Icon name="arrow" size={18} />
    </Link>
  );
}
