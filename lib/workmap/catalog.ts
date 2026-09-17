export type Workflow = {
  id: string;
  title: string;
  description: string;
  roles: string[];
  industries: string[];
  taskCategories: string[];
  painPoints: string[];
  requiredInputs: string[];
  outputType: string;
  aiLevel: string;
  recommendedTools: string[];
  privacyLevel: string;
  humanReviewRequired: true;
  baseProcedure: string[];
  basePrompt: string;
  reviewPrompt: string;
  example: string;
  tags: string[];
};
// Editorial catalogue: specific inputs, transformations and outputs; no claimed integrations.
const entries: [string, string, string, string, string, string][] = [
  [
    "email",
    "Email clienti più chiare",
    "email",
    "Messaggio anonimizzato e risposta desiderata",
    "Bozza con risposta, prossima azione e tono coerente",
    "Separare le richieste, verificare ciò che è noto, preparare la bozza",
  ],
  [
    "documenti",
    "Prima bozza di documento",
    "documenti",
    "Obiettivo, destinatario e appunti verificati",
    "Documento organizzato con punti ancora da completare",
    "Definire indice, distribuire gli appunti, marcare informazioni mancanti",
  ],
  [
    "pdf",
    "Estrarre informazioni da un PDF",
    "PDF",
    "Testo estratto dal PDF e campi necessari",
    "Tabella con campo, valore e riferimento alla fonte",
    "Lavorare sul testo leggibile, estrarre campi, riportare pagina e ambiguità",
  ],
  [
    "ricerca",
    "Preparare una ricerca verificabile",
    "ricerca",
    "Domanda, fonti fornite e periodo",
    "Sintesi delle sole fonti disponibili con limiti",
    "Definire domande, confrontare fonti fornite, distinguere fatti e ipotesi",
  ],
  [
    "riunioni",
    "Dalle note alle prossime azioni",
    "riunioni",
    "Note autorizzate della riunione",
    "Verbale con decisioni, responsabili e scadenze dichiarate",
    "Separare decisioni e proposte, estrarre azioni, non inventare responsabili",
  ],
  [
    "followup",
    "Follow-up dopo un confronto",
    "follow-up",
    "Note dell'incontro, accordi e destinatario",
    "Email di riepilogo e prossime azioni",
    "Rileggere accordi, costruire riepilogo, chiedere conferma delle parti ambigue",
  ],
  [
    "appuntamenti",
    "Preparare un appuntamento cliente",
    "vendite",
    "Note cliente anonimizzate, obiettivo e precedenti",
    "Briefing con domande e punti da chiarire",
    "Riordinare cronologia, estrarre questioni aperte, preparare agenda",
  ],
  [
    "crm",
    "Riordinare le note del CRM",
    "CRM",
    "Esportazione ridotta e anonimizzata delle note",
    "Tabella di azioni e campi da aggiornare manualmente",
    "Uniformare note, identificare duplicati possibili, proporre aggiornamenti senza scrivere nel CRM",
  ],
  [
    "excel",
    "Preparare e verificare formule Excel",
    "Excel",
    "Nomi colonne fittizi, regola e righe di esempio",
    "Formula spiegata e casi di prova",
    "Definire logica, proporre formula per versione e lingua dichiarate, testare su copia",
  ],
  [
    "dati",
    "Leggere una tabella senza saltare ai giudizi",
    "analisi dati",
    "Dati aggregati verificati e domanda",
    "Osservazioni, anomalie da controllare e limiti",
    "Verificare unità e periodo, confrontare dati, separare correlazioni e spiegazioni",
  ],
  [
    "report",
    "Report da aggiornamenti sparsi",
    "report",
    "Aggiornamenti anonimizzati, periodo e modello di report",
    "Sintesi con criticità, evidenze e azioni",
    "Uniformare aggiornamenti, raggruppare temi, evidenziare assenze e contraddizioni",
  ],
  [
    "slide",
    "Dai contenuti alla scaletta di presentazione",
    "presentazioni",
    "Appunti, pubblico, durata e obiettivo",
    "Scaletta slide con messaggio e prove per slide",
    "Scegliere messaggio, costruire sequenza, ridurre testo e verificare dati",
  ],
  [
    "contenuti",
    "Trasformare competenze in contenuti",
    "contenuti",
    "Materiale originale approvato, destinatario e canale",
    "Bozza coerente con le informazioni fornite",
    "Estrarre tesi, proporre struttura, controllare promesse e tono",
  ],
  [
    "supporto",
    "Risposte di assistenza dalla base conoscenza",
    "customer service",
    "Domanda anonimizzata e procedura approvata",
    "Bozza di risposta con eventuale escalation",
    "Cercare nel materiale fornito, rispondere solo se coperto, segnalare mancanze",
  ],
  [
    "hr",
    "Preparare l'onboarding",
    "HR",
    "Ruolo, attività iniziali e procedure approvate",
    "Checklist di onboarding con referenti da confermare",
    "Ordinare prime attività, collegare materiali, identificare dipendenze",
  ],
  [
    "recruiting",
    "Preparare una job description",
    "recruiting",
    "Compiti effettivi e requisiti necessari",
    "Annuncio inclusivo da validare con HR",
    "Distinguere requisiti necessari e preferibili, descrivere attività, rivedere linguaggio",
  ],
  [
    "progetti",
    "Dagli aggiornamenti allo stato progetto",
    "project management",
    "Task, dipendenze e scadenze confermate",
    "Stato avanzamento con blocchi e decisioni aperte",
    "Confrontare piano e aggiornamenti, segnalare rischi, proporre domande",
  ],
  [
    "amministrazione",
    "Controllare la completezza dei documenti",
    "amministrazione",
    "Elenco documenti anonimizzato e requisiti approvati",
    "Checklist mancanti e richieste di integrazione",
    "Confrontare requisiti, elencare assenze, preparare richieste senza valutazioni fiscali",
  ],
  [
    "conoscenza",
    "Da appunti a una guida interna",
    "knowledge management",
    "Appunti e fonti aziendali autorizzate",
    "Guida consultabile con fonti e domande aperte",
    "Raggruppare argomenti, strutturare risposte, mantenere riferimenti",
  ],
  [
    "procedure",
    "Documentare una procedura ripetitiva",
    "procedure",
    "Passi attuali, eccezioni e responsabili",
    "Procedura con input, passi, eccezioni e controllo",
    "Ricostruire sequenza, individuare controlli, testare su un caso reale anonimizzato",
  ],
  [
    "clienti",
    "Preparare un aggiornamento al cliente",
    "gestione clienti",
    "Stato attività, accordi e criticità verificati",
    "Aggiornamento sintetico con azioni e questioni aperte",
    "Raccogliere fatti, distinguere completato e pianificato, formulare richieste",
  ],
  [
    "offerte",
    "Strutturare una proposta commerciale",
    "offerte",
    "Brief, perimetro, listino approvato e vincoli",
    "Bozza offerta con esclusioni e dati da validare",
    "Ricostruire bisogno, organizzare soluzione, usare solo prezzi forniti",
  ],
  [
    "preventivi",
    "Preparare il riepilogo di un preventivo",
    "preventivi",
    "Voci e prezzi approvati, quantità e condizioni",
    "Descrizione ordinata con controlli su voci mancanti",
    "Organizzare voci, segnalare incoerenze, verificare totali con il gestionale",
  ],
  [
    "organizzazione",
    "Organizzare una settimana realistica",
    "organizzazione",
    "Attività, impegni, scadenze e capacità dichiarata",
    "Piano di priorità con margine per imprevisti",
    "Separare urgenze e importanza, raggruppare attività, validare capacità",
  ],
  [
    "circolari",
    "Spiegare una comunicazione ai clienti",
    "documenti",
    "Fonte verificata e pubblico destinatario",
    "Bozza chiara con riferimento alla fonte e limiti",
    "Estrarre contenuti espliciti, tradurre il linguaggio, richiedere revisione professionale",
  ],
  [
    "immobili",
    "Preparare una scheda immobile",
    "vendite",
    "Caratteristiche confermate e dati pubblicabili",
    "Scheda ordinata priva di caratteristiche inventate",
    "Separare fatti e campi mancanti, organizzare descrizione, verificare ogni caratteristica",
  ],
];
export const catalog: Workflow[] = entries.map(
  ([id, title, category, input, output, procedure]) => ({
    id,
    title,
    description: `${procedure}. Output: ${output.toLowerCase()}.`,
    roles:
      id === "recruiting" || id === "hr"
        ? ["HR", "Recruiter", "Manager"]
        : id === "immobili"
          ? ["Agente immobiliare"]
          : ["Professionisti", "PMI"],
    industries: ["Da adattare al settore dichiarato"],
    taskCategories: [category],
    painPoints: [procedure.split(",")[0]],
    requiredInputs: [input],
    outputType: output,
    aiLevel: "Base",
    recommendedTools: ["ChatGPT", "Claude", "Gemini"],
    privacyLevel: "Usare dati anonimizzati e strumenti approvati",
    humanReviewRequired: true,
    baseProcedure: procedure.split(", "),
    basePrompt: `Usa [INPUT] e [CONTESTO] per ${procedure.toLowerCase()}. Restituisci: ${output}. Non inventare dati mancanti.`,
    reviewPrompt:
      "Verifica completezza, fonti, date, nomi, numeri e tono. Segnala prima i problemi; non modificare fatti senza avvisare.",
    example: `Esempio ipotetico: usa un campione fittizio di ${input.toLowerCase()} e controlla ${output.toLowerCase()}.`,
    tags: [category, id],
  }),
);
