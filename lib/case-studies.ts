export type CaseStudy = {
  id: string;
  client: string;
  clientUrl?: string;
  region: string;
  title: string;
  highlights: string[];
  outcome: string;
  logo?: { src: string; alt: string; width: number; height: number };
  icon?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "immobiliare-toscana",
    client: "Megaron Immobiliare",
    clientUrl: "https://megaronimmobiliare.it",
    region: "Toscana",
    title: "Cento richieste al giorno, smistate a mano.",
    highlights: [
      "Circa 100 richieste al giorno via mail, da leggere e girare all’agente immobiliare giusto.",
      "Ora ogni richiesta viene smistata automaticamente all’agente di quella zona ed il cliente riceve una mail di conferma di presa in carico.",
    ],
    outcome: "Circa 8 ore al giorno recuperate.",
    logo: { src: "/clients/megaron-logo.png", alt: "Logo Megaron Servizi Immobiliari", width: 200, height: 200 },
  },
  {
    id: "cuormio",
    client: "Cuormio.it",
    clientUrl: "https://cuormio.it",
    region: "Toscana",
    title: "Magazzino e spedizioni, senza ricopiare.",
    highlights: [
      "Ordini, scarico magazzino e spedizioni collegati tra loro.",
      "Procedure interne automatizzate al posto del lavoro manuale.",
    ],
    outcome: "Circa 10 ore a settimana risparmiate.",
    logo: { src: "/clients/cuormio-logo.jpg", alt: "Logo Cuor Mio", width: 120, height: 120 },
  },
];
