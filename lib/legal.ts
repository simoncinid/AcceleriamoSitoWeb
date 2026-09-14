// Incrementare la versione quando cambia il testo dei documenti o delle dichiarazioni.
export const LEGAL_VERSION = "2026-09-14";
export const LEGAL_DATE = "14 settembre 2026";

export const legalIdentity = {
  name: "Diego Simoncini",
  vat: "02524780505",
  address: process.env.LEGAL_BUSINESS_ADDRESS?.trim() ?? "",
  email: "info@acceleriamo.it",
};

export const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/termini-e-condizioni", label: "Termini e condizioni" },
];
