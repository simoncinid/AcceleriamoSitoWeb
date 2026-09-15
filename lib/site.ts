import { LEGAL_VERSION, legalIdentity, legalLinks } from "./legal";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://acceleriamo.it").replace(/\/$/, "");
export const siteName = "ACCELERIAMO";
export const siteUpdated = "2026-09-15";

export const defaultTitle = "ACCELERIAMO | Meno lavoro rifatto a mano nella tua azienda";
export const defaultDescription =
  "Ordini, preventivi e documenti da ricopiare ogni giorno? Con ACCELERIAMO puoi ridurre il lavoro ripetitivo nella tua azienda, senza cambiare gestionale.";
export const socialTitle = "Ogni giorno rifai a mano le stesse cose?";
export const socialDescription =
  "Quanto tempo ti portano via le stesse attività ogni giorno? Raccontaci la tua situazione e scopri cosa puoi semplificare, con una valutazione gratuita.";

export const keywords = [
  "automazione processi aziendali PMI",
  "lettura documenti aziendali",
  "integrazione gestionale",
  "preventivi automatici",
  "ordini da email e WhatsApp",
  "giri dei tecnici",
  "software su misura piccole aziende",
];

export const people = [
  {
    name: "Diego Simoncini",
    role: "Consulenza e sviluppo",
    jobTitle: "Consulente e sviluppatore",
    linkedin: "https://www.linkedin.com/in/diego-simoncini-019909223/",
    photo: "/team/diego-simoncini.webp",
    initials: "DS",
  },
  {
    name: "Tommaso Rovini",
    role: "Commerciale e marketing",
    jobTitle: "Commerciale e marketing",
    linkedin: "https://www.linkedin.com/in/tommasorovini/",
    photo: "/team/tommaso-rovini.webp",
    initials: "TR",
  },
];

export const services = [
  {
    name: "Passaggio dati tra i programmi già in uso",
    description: "L’ordine arriva via email e finisce nel gestionale. Nessuno lo ribatte.",
  },
  {
    name: "Lettura di documenti al posto tuo",
    description: "Fatture, bolle, ordini e PDF: il software tira fuori i dati e segnala solo le righe che non tornano.",
  },
  {
    name: "Software su misura quando manca lo strumento",
    description: "Quando nessun gestionale segue il tuo modo di lavorare, costruiamo la schermata che ti serve.",
  },
] as const;

export const faqs = [
  { question: "Cosa fa ACCELERIAMO?", answer: "Guardiamo come lavori oggi e costruiamo il software che semplifica i passaggi ripetuti tra email, documenti e programmi." },
  { question: "Devo cambiare gestionale?", answer: "No. Restano il tuo gestionale, i tuoi Excel e la tua casella email. Aggiungiamo solo il pezzo che li fa parlare tra loro." },
  { question: "Il software decide al posto mio?", answer: "Le regole le decidi tu: il sistema le applica e, quando un caso non torna, si ferma e te lo segnala." },
  { question: "Come capisco se fa al caso mio?", answer: "Nella tua piccola azienda gli ordini si ricopiano, i documenti si accumulano o le stesse attività portano via tempo ogni giorno? Sono situazioni da cui partire. Gli esempi qui sopra riguardano ingrosso, impianti e manutenzioni, officine, agenzie immobiliari, agenti di commercio e servizi su appuntamento. La valutazione gratuita serve a capire cosa conviene nel tuo caso." },
  { question: "Cos’è la valutazione e quanto costa?", answer: "Ci racconti l’attività e ti chiamiamo entro un giorno lavorativo. La valutazione e il primo confronto sono gratuiti e senza impegno. Prezzi e tempi di un eventuale incarico si concordano dopo, sul tuo caso." },
] as const;

export const aiCrawlers = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "Amazonbot",
  "Bytespider",
  "CCBot",
  "cohere-ai",
  "YouBot",
  "MistralAI-User",
  "meta-externalagent",
  "meta-externalfetcher",
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteUrl}/`).toString();
}

export const publicPages = [
  { path: "/", lastModified: siteUpdated, changeFrequency: "monthly" as const, priority: 1 },
  ...legalLinks.map(({ href }) => ({
    path: href,
    lastModified: LEGAL_VERSION,
    changeFrequency: "yearly" as const,
    priority: 0.2,
  })),
];

export const organizationId = `${siteUrl}/#organizzazione`;
export const websiteId = `${siteUrl}/#sito`;
export const webpageId = `${siteUrl}/#pagina`;
export const faqId = `${siteUrl}/#faq`;

export { legalIdentity };
