export const product = {
  name: "AI WorkMap",
  version: "2026-09-18",
} as const;
export const stages = [
  "Analizzo il profilo",
  "Seleziono i workflow",
  "Personalizzo i prompt",
  "Creo gli assistenti",
  "Preparo il piano",
  "Controllo il risultato",
  "Genero il documento",
];
export const sessionCookie = "acceleriamo_workmap";
export const professions = [
  "Commerciale",
  "Consulente",
  "Agente immobiliare",
  "Commercialista",
  "Avvocato",
  "Geometra",
  "Architetto",
  "Ingegnere",
  "HR",
  "Recruiter",
  "Marketing",
  "Imprenditore",
  "Manager",
  "Project Manager",
  "Amministrativo",
  "Customer Service",
  "Formatore",
  "Coach",
  "Freelance",
];
export const categories = [
  "Email e comunicazioni",
  "Clienti",
  "Documenti",
  "Preventivi e offerte",
  "Report",
  "Riunioni",
  "Excel e dati",
  "Ricerca",
  "CRM",
  "Contenuti",
  "Organizzazione",
];

export function baseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://acceleriamo.it").replace(/\/$/, "");
}
