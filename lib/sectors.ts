export const sectors = [
  {
    id: "ingrosso", label: "Ingrosso", real: false,
    problem: "Il cliente ordina 30 articoli per email.",
    description: "Oggi qualcuno in ufficio li ricopia uno per uno nel gestionale.",
    steps: ["Arriva l’email con codici e quantità", "Il sistema scrive la bozza nel gestionale", "Tu controlli la riga segnata e confermi"],
  },
  {
    id: "impianti-e-manutenzioni", label: "Impianti e manutenzioni", real: false,
    problem: "Il tecnico manda due foto e un vocale.",
    description: "Il rapportino resta da scrivere prima di poter fare la fattura.",
    steps: ["Il tecnico invia foto e vocale", "Il sistema prepara il rapportino la sera stessa", "Confermi il rapportino, pronto per la fattura"],
  },
  {
    id: "officine", label: "Officine", real: false,
    problem: "«È pronta la macchina?»", description: "Le telefonate per sapere a che punto è il lavoro interrompono l’officina.",
    steps: ["Aggiorni lo stato del lavoro", "Tocchi un bottone per avvisare il cliente", "Il cliente riceve il messaggio"],
  },
  {
    id: "agenzie-immobiliari", label: "Agenzie immobiliari", real: true,
    problem: "Cento richieste al giorno da girare a mano.",
    description: "Megaron, agenzia immobiliare in Toscana: oggi ogni nuova richiesta arriva all’agente della zona.",
    steps: ["Arriva la richiesta di info per mail", "Il sistema la assegna all’agente della zona", "Il cliente riceve subito la mail con il nome dell’agente"],
  },
  {
    id: "agenti-di-commercio", label: "Agenti di commercio", real: false,
    problem: "Ordini su WhatsApp tra foto e vocali.",
    description: "In ufficio qualcuno deve ascoltare, leggere e riscrivere tutto.",
    steps: ["L’agente invia foto e vocali", "Il sistema prepara l’ordine con codici e quantità", "In ufficio arrivano le righe scritte e quelle dubbie segnate"],
  },
  {
    id: "servizi-su-appuntamento", label: "Servizi su appuntamento", real: false,
    problem: "Una disdetta o un’urgenza cambia l’agenda.",
    description: "Il telefono squilla mentre lavori e il calendario è da rimettere in ordine.",
    steps: ["Arriva una disdetta o un’urgenza", "Il calendario libera il posto e propone un altro orario", "Confermi la soluzione e il cliente riceve l’aggiornamento"],
  },
] as const;

export function sectorFromSearch(search: string) {
  const params = new URLSearchParams(search);
  const value = params.get("settore") ?? params.get("sector") ?? params.get("utm_term");
  return sectors.find(sector => sector.id === value)?.id ?? sectors[0].id;
}
