// Incrementare la versione quando cambia il testo dei documenti o delle dichiarazioni.
export const LEGAL_VERSION = "2026-09-05";
export const LEGAL_DATE = "5 settembre 2026";
export const PRIVACY_ACKNOWLEDGEMENT = "Ho letto l’informativa privacy e chiedo di essere ricontattato per la consulenza gratuita.";
export const TERMS_ACKNOWLEDGEMENT = "Ho letto e accetto i termini e le condizioni del sito e della richiesta di consulenza gratuita.";

export const legalIdentity = {
  name: "Diego Simoncini",
  vat: "02524780505",
  address: process.env.LEGAL_BUSINESS_ADDRESS?.trim() ?? "",
  email: process.env.LEGAL_CONTACT_EMAIL?.trim() ?? "",
};

export const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/termini-e-condizioni", label: "Termini e condizioni" },
];
