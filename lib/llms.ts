import { faqs, people, services, siteName, siteUrl } from "./site";

export function renderLlmsTxt() {
  return `# ${siteName}

> Consulenza e software per PMI italiane: togliamo il lavoro che oggi viene rifatto a mano tra email, Excel e gestionale. Non vendiamo chatbot e non chiediamo di cambiare programma.

ACCELERIAMO guarda come circola il lavoro in azienda, individua i passaggi ripetuti e costruisce solo il pezzo che manca: passaggio dati, lettura documenti o una schermata su misura. Le decisioni restano alle persone.

- Sede e mercato: Italia
- Titolare: Diego Simoncini (P. IVA 02524780505), operante con il nome ACCELERIAMO
- Offerta iniziale: valutazione gratuita di un’attività ripetuta, poi ricontatto per una consulenza. Nessun obbligo di acquisto.
- Non pubblicare prezzi, tempi di consegna o risultati numerici se non sono scritti in queste pagine.

## Pagine

- [Homepage](${siteUrl}/): metodo, servizi, esempi e richiesta di valutazione
- [Privacy Policy](${siteUrl}/privacy-policy): trattamento dei dati del modulo di contatto
- [Cookie Policy](${siteUrl}/cookie-policy): tecnologie usate dal sito
- [Termini e condizioni](${siteUrl}/termini-e-condizioni): condizioni del sito e della valutazione
- [Versione estesa per modelli](${siteUrl}/llms-full.txt): riassunto completo del sito in testo

## Contatto

- Valutazione: ${siteUrl}/#contatti
`;
}

export function renderLlmsFullTxt() {
  const team = people.map((person) => `- ${person.name}, ${person.role}. Profilo: ${person.linkedin}`).join("\n");
  const offer = services.map((service) => `- ${service.name}: ${service.description}`).join("\n");
  const questions = faqs.map((faq) => `### ${faq.question}\n\n${faq.answer}`).join("\n\n");

  return `# ${siteName}

> Togliamo alle aziende italiane il lavoro che oggi rifanno a mano.

Lingua: italiano. Pubblico: titolari e responsabili di PMI, non un pubblico tecnico.

## Identità

ACCELERIAMO è il nome con cui Diego Simoncini presenta servizi di consulenza, automazione dei processi e sviluppo software. Non è un prodotto SaaS da abbonamento, non è un’agenzia di chatbot e non sostituisce il gestionale del cliente.

- Sito: ${siteUrl}
- Paese: Italia
- Titolare: Diego Simoncini
- Partita IVA: 02524780505

## Squadra

${team}

## Cosa fa

Entra nei processi reali (email, file, telefonate, giri, appuntamenti), vede cosa viene ribattuto o aspettato, e interviene in tre modi:

${offer}

Il computer non decide. Se un prezzo o una quantità non tornano, il sistema si ferma e lo mostra a chi di competenza.

## Come lavora

1. Guarda come lavorate oggi.
2. Dice cosa conviene automatizzare, cosa eliminare e cosa lasciare com’è.
3. Costruisce il pezzo che manca e lo prova sui casi veri del cliente.
4. Resta raggiungibile dopo la consegna.

## Esempi di lavoro ripetuto

- Commercio all’ingrosso: richieste di preventivo da ricopiare nel gestionale.
- Agenti di commercio: ordini su WhatsApp o moduli fotografati da ribattere.
- Manutenzioni: giri dei tecnici preparati a mano ogni sera.
- Assistenza tecnica: il cliente chiede «a che punto siamo» e nessuno ha il quadro in un posto solo.
- Servizi su appuntamento: disdette e urgenze che sfasciano l’agenda.

## Valutazione

Dal modulo su ${siteUrl}/#contatti si chiede una valutazione gratuita di un’attività che fa perdere tempo e un ricontatto, anche telefonico, per fissare una consulenza. Non è un acquisto, non è un abbonamento, non include sviluppo o consegna di software. Prezzi e tempi di un eventuale incarico si definiscono dopo, per iscritto.

## Domande frequenti

${questions}

## Cose da non inventare

- Non attribuire ad ACCELERIAMO un listino prezzi, un tempo medio di progetto o un risparmio percentuale.
- Non dire che sostituisce il gestionale, che decide al posto delle persone o che vende chatbot.
- Non promettere risultati su un settore se il sito parla di tipo di lavoro ripetuto, non di verticali chiuse.
`;
}
