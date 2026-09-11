import { LEGAL_VERSION, legalIdentity, legalLinks } from "./legal";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://acceleriamo.it").replace(/\/$/, "");
export const siteName = "ACCELERIAMO";
export const siteUpdated = "2026-09-11";

export const defaultTitle = "ACCELERIAMO | Meno lavoro rifatto a mano nella tua azienda";
export const defaultDescription =
  "Preventivi, ordini, documenti e giri dei tecnici: ACCELERIAMO guarda come lavorano le PMI italiane e costruisce il pezzo che toglie il lavoro ripetuto. Senza cambiare gestionale.";
export const socialTitle = "Ogni giorno rifate a mano le stesse cose.";
export const socialDescription =
  "Richiedi una valutazione: guardiamo un’attività che vi fa perdere tempo e ti chiamiamo per fissare una consulenza.";

export const keywords = [
  "automazione processi aziendali PMI",
  "lettura documenti aziendali",
  "integrazione gestionale",
  "preventivi automatici",
  "ordini da email e WhatsApp",
  "giri dei tecnici",
  "software su misura PMI italiane",
];

export const people = [
  {
    name: "Diego Simoncini",
    role: "Consulenza e sviluppo",
    jobTitle: "Consulente e sviluppatore",
    linkedin: "https://www.linkedin.com/in/diego-simoncini-019909223/",
    photo: "/team/diego-simoncini.jpg",
    initials: "DS",
  },
  {
    name: "Tommaso Rovini",
    role: "Commerciale e marketing",
    jobTitle: "Commerciale e marketing",
    linkedin: "https://www.linkedin.com/in/tommasorovini/",
    photo: "/team/tommaso-rovini.jpg",
    initials: "TR",
  },
];

export const services = [
  {
    name: "Passaggio dati tra i programmi già in uso",
    description: "L’ordine arriva via email e finisce nel gestionale. Nessuno lo ribatte.",
  },
  {
    name: "Lettura di documenti al posto vostro",
    description: "Fatture, bolle, ordini e PDF: il software tira fuori i dati e segnala solo le righe che non tornano.",
  },
  {
    name: "Software su misura quando manca lo strumento",
    description: "Quando nessun gestionale segue il vostro modo di lavorare, costruiamo la schermata che vi serve.",
  },
] as const;

export const faqs = [
  {
    question: "Cosa fa ACCELERIAMO?",
    answer:
      "Guardiamo come lavorate oggi — email, Excel, gestionale, telefonate — e costruiamo il pezzo che toglie il lavoro ripetuto alle persone. Non vendiamo un chatbot e non vi chiediamo di cambiare programma.",
  },
  {
    question: "Dobbiamo cambiare gestionale?",
    answer:
      "No. Restano il vostro gestionale, i vostri Excel e la vostra casella email. Aggiungiamo solo il pezzo che li fa parlare tra loro.",
  },
  {
    question: "Il software decide al posto nostro?",
    answer:
      "No. Quando un prezzo non torna o una quantità non corrisponde, il sistema si ferma e ve lo segnala. Lo vedete prima di mandare l’offerta, non quando arriva la fattura. Le decisioni restano vostre.",
  },
  {
    question: "Per quali aziende lavorate?",
    answer:
      "Aziende italiane dove il lavoro passa da email, documenti e telefonate: commercio all’ingrosso, agenti di commercio, manutenzioni, assistenza tecnica, servizi su appuntamento. Non conta il settore: conta cosa rifate ogni giorno.",
  },
  {
    question: "Cos’è la valutazione e quanto costa?",
    answer:
      "Raccontate un’attività che vi fa perdere tempo. La valutiamo e vi chiamiamo per fissare una consulenza. La richiesta, la valutazione e il primo confronto sono gratuiti e non comportano obblighi di acquisto. Prezzi e tempi di un eventuale lavoro si definiscono dopo, sul caso concreto: non pubblichiamo un listino perché ogni azienda lavora in modo diverso.",
  },
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
