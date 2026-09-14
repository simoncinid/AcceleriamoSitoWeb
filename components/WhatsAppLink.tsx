"use client";

import type { ReactNode } from "react";
import { whatsappUrl } from "@/lib/contact";
import { trackWhatsApp } from "@/lib/tracking";

export function WhatsAppLink({ children = "Scrivici su WhatsApp", className = "button button--whatsapp", source = "pagina" }: { children?: ReactNode; className?: string; source?: string }) {
  return <a href={whatsappUrl} className={className} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp(source)}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.3-4.7a8.5 8.5 0 1 1 16.2-4Z"/><path d="M8 7.5c-.8.5-.8 2 0 3.6 1 2 2.6 3.4 4.8 4.3 1.5.5 2.7.2 3.2-.6l.3-1.1-2.7-1.3-.9 1c-1.4-.6-2.6-1.7-3.2-3l.8-1-1.2-2.3Z"/></svg>
    <span>{children}</span>
  </a>;
}
