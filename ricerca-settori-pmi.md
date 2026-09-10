# Ricerca settori PMI italiane — materiale grezzo per copy
### Processi reali, terminologia di mestiere, punti di dolore, quantificazioni

---

## ⚠️ NOTA METODOLOGICA — LEGGERE PRIMA DI USARE QUALSIASI NUMERO

Durante la ricerca è emerso un problema di qualità delle fonti che va dichiarato apertamente, perché condiziona l'uso di questo materiale.

**Il web italiano su "software gestionale per [settore]" è oggi saturo di siti marketing di recentissima generazione** (molti chiaramente generati con AI nel 2025-2026) che pubblicano numeri estremamente specifici e credibili — "le chiamate calano del 70%", "1-2 ore al giorno di telefono", "sprechi ridotti del 15%", "i tempi di fatturazione scendono da 15-20 giorni a 1-3 giorni" — **senza alcuna fonte**. Esempi trovati: `radi.work`, `cantiericloud.com`, `archim.ai`, `invoox.io`, `teamlabsrl.com`, `alfaweberp.it`, `pillar.it`, `melawork.it`, `ediliziaincloud.com`, `rapportinismart.it`, `carsu.com`, `graffico.it`, `smartgomme.it`, `tiremanager.it`.

Questi siti sono **utilissimi per la terminologia e per la descrizione dei processi** (chi li ha scritti conosce il mestiere, o ha letto chi lo conosce), ma **i loro numeri non sono citabili**. Un caso emblematico: `graffico.it` attribuisce ad "una ricerca di Aberdeen Group" una riduzione dei costi operativi del 20% e un +25% di produttività dei tecnici — non ho trovato la ricerca originale.

Ho quindi classificato tutto con tre livelli:

| Sigla | Significato | Uso consigliato nel copy |
|---|---|---|
| **🟢 VERIFICATO** | Norma, associazione di categoria, Osservatorio universitario, ente pubblico | Citabile con fonte, anche con numero |
| **🟡 VENDOR** | Sito di software house / consulente di settore | Usa la terminologia e la descrizione del processo. **Non usare i numeri.** |
| **🔵 VERBATIM REALE** | Forum pubblico, recensione, post con autore identificabile | Citabile come voce, con attribuzione |

**Numero di citazioni verbatim autentiche trovate: sotto le 5 per settore su edilizia e manutenzione.** I forum di settore italiani sono in gran parte morti o chiusi (i gruppi Facebook, dove la conversazione reale è oggi, non sono indicizzati). Le recensioni Trustpilot sui gestionali sono invece abbondantissime e di ottima qualità — ma parlano del *software*, non del *processo*. Lo segnalo settore per settore.

**Verdetto sui 5 settori del sito ACCELERIAMO: tutti e 5 gli esempi sono realistici e verificati.** In 3 casi su 5 (edilizia, officine, gommisti) ho trovato materiale che permette di renderli molto più specifici.

---
---

# 1. GROSSISTI / DISTRIBUZIONE — il ciclo del preventivo e dell'ordine

**Verdetto sull'esempio del sito ("preventivi"): realistico, ma il vero collo di bottiglia è l'ORDINE, non il preventivo.** L'ordine è dove ci sono i numeri e dove il dolore è documentato meglio. Suggerirei di spostare o allargare il focus.

## 1.1 Il processo reale, passo per passo

**🟢 Il ciclo attivo** — La sequenza documentale canonica, confermata da manuali di gestionali indipendenti tra loro:

**Preventivo → Ordine cliente (OC) → Conferma d'ordine → [Packing list] → DDT / Bolla di vendita (BV) → Fattura (differita o immediata/accompagnatoria) → [Nota di credito]**

Fonti: [SIGLAkb — Gestione ordini (Delta Phi)](https://www.deltaphi.it/siglakb/index.php/Gestione_ordini) · [1C-ERP — Modulo Vendite](https://www.1c-erp.it/supporto/guida-utente-gestionale/modulo-vendite/) · [Genesys Software — Ciclo Attivo](https://gsdoc.genesyssoftware.eu/books/modl-pref27-ciclo-attivo/page/ciclo-attivo)

Il manuale SIGLA descrive **la procedura esatta con le sigle che l'addetto usa a voce**:

> «La procedura di evasione di un ordine cliente può essere descritta attraverso le seguenti fasi operative: 1. Immissione del documento **OC**, ORDINE CLIENTE; 2. Immissione del documento **BV**, bolla di vendita (scarico) per l'evasione parziale o totale dell'ordine, registrazione e relativa stampa; 3. Fatturazione della bolla di vendita. […] La **causale di magazzino** associata al documento di evasione come bolla o fattura deve **decrementare l'ordinato** e aumentare lo scarico per vendita.»
> — [SIGLAkb](https://www.deltaphi.it/siglakb/index.php/Gestione_ordini) 🟢

**Termini di mestiere confermati:** ciclo attivo / ciclo passivo, ordine cliente (OC), bolla di vendita (BV), causale di magazzino, evasione parziale, **impegno merce** ("impegnato"), ordinato, giacenza, disponibilità, **vuoti a rendere** e supporti (bancali), provvigioni su trasportato, backorder.

**🟢 RDA / RDO / ODA — verificati e distinti.** Attenzione: molte fonti li confondono. La catena corretta:

| Sigla | Cosa è | Chi la fa |
|---|---|---|
| **RdA** (Richiesta di Acquisto) | Documento **interno**: un reparto formalizza un fabbisogno e chiede l'approvazione | Il reparto che ha bisogno |
| **RdO** (Richiesta di Offerta) | Documento **esterno**: si invitano più fornitori qualificati a offrire, per confrontare | Ufficio acquisti |
| **ODA** (Ordine Diretto di Acquisto) | Documento **esterno**: impegno formale e vincolante, senza gara | Ufficio acquisti |

> «Da una richiesta di acquisto completa […] si genera un'eventuale **Richiesta di Offerta (RDO)** o direttamente l'**ordine di acquisto (ODA)** per i fornitori.»
> — [Collhuborate (Bluenext)](https://www.collhuborate.it/it/news/richiesta-di-acquisto-rda-il-percorso-completo-per-una-gestione-ottimale/) 🟢
> Tabella comparativa completa RdO/RdA/ODA: [OnlineProcurement](https://www.onlineprocurement.com/approfondimenti-e-procurement/richiesta-di-offerta-rdo-cose-come-utilizzarla-per-selezionare-fornitori-migliori/) 🟢

⚠️ **Segnalazione onesta:** RDA e RDO sono terminologia dell'**ufficio acquisti** (lato passivo). Un grossista li usa *quando compra*, non quando riceve una richiesta da un cliente. Se il copy li usa per descrivere una richiesta *entrante* di preventivo, è un errore che un addetto agli acquisti noterebbe. Per il lato entrante i termini giusti sono: **richiesta d'offerta del cliente, offerta, preventivo, ordine cliente**. Nell'edilizia/impiantistica invece RDO è usatissimo anche lato attivo (l'impresa manda RDO ai fornitori) — vedi Infominds sotto.

**🟢 DDT — la normativa esatta.** Il DDT è previsto dal **DPR 472/1996** e ha sostituito la soppressa **bolla di accompagnamento** (abrogato il DPR 627/1978). Serve a due scopi precisi:
1. avvalersi della **fatturazione differita** (fattura entro il **giorno 15 del mese successivo** alla consegna, codice **TD24** nell'XML, con numero e data di ogni DDT nel tracciato);
2. **vincere le presunzioni di cessione/acquisto** ex art. 53 DPR 633/1972 quando si movimentano beni **a titolo non traslativo della proprietà** — cioè conto lavorazione, deposito, comodato.

Deve contenere: data dell'operazione, generalità di cedente/cessionario/vettore, natura-qualità-quantità dei beni, **causale del trasporto**, numerazione progressiva. Nessun vincolo di forma o tracciato.

Fonti: [Camera di commercio di Torino](https://www.to.camcom.it/321-il-documento-di-trasporto-ddt) 🟢 · [Fiscomania](https://fiscomania.com/documento-di-trasporto-ddt/) 🟢 · [InfoCert — fattura differita e TD24](https://futurodigitale.infocert.it/professionista-digitale/fattura-differita-regole/) 🟢 · [Danea Blog](https://www.danea.it/blog/ddt-documento-di-trasporto/) 🟡

*Nota per il copy: "bolla" e "DDT" sono usati come sinonimi nel parlato ("mi manda la bolla"), ma formalmente la "bolla di accompagnamento" non esiste più dal 1996. Usare entrambi è corretto e suona naturale.*

**🟢 Listini e scontistica — la struttura reale.** I termini confermati e la loro gerarchia:
- **listino** (base, per canale, per stagione, per mercato) — un grossista ne ha tipicamente più di uno attivo contemporaneamente
- **prezzo netto** per singola referenza vs **sconto percentuale** generale
- **sconti a scaglioni / a quantità** (tiered pricing): il prezzo unitario scende al superamento di soglie di volume
- **scala sconti** differenziata per cliente
- **contratti quadro** / prezzi bloccati con data inizio e scadenza
- **fido** e **scadenzario** per cliente
- **date di decorrenza** dei nuovi listini
- **transcodifica** dei codici articolo fornitore ↔ codice articolo interno

> «Un motore di pricing sviluppato nativamente per il mercato aziendale deve essere in grado di governare la **coesistenza di più listini attivi simultaneamente**, risolvendo i **conflitti tariffari** attraverso un sistema **gerarchico di priorità** rigide preconfigurate a monte dall'operatore.»
> — [SAEP ICT](https://www.saep-ict.it/magazine/ecommerce-b2b-listini-personalizzati/) 🟡

**🟢 METEL — lo standard che il grossista di materiale elettrico nomina ogni giorno.** Questo è oro per il copy, perché è un termine settoriale specifico e verificabile:
- **listino Metel** (versioni 020 / 021 / **022**, quest'ultima rilasciata a metà giugno 2025)
- **METCOD**: codice univoco generato da algoritmo Metel, max 16 caratteri, che «permette di risolvere il problema transcodifiche interne e personalizzate per articoli più lunghi di 16 caratteri o contenenti caratteri non convenzionali»
- **CloudEDI**: scambia in EDI **ordine, conferma d'ordine, DDT e fattura** in tre formati (EDIFACT, FLAT FILE METEL, XML)
- **PDF2EDI**: servizio che trasforma un PDF in file EDI
- **PLC** (Piattaforma Logistica Collaborativa): prenotazione della **consegna in ribalta**

Fonti: [Metel — listino 022](https://www.metel.it/news/Metel-lancia-il-listino-metel-022) 🟢 · [Metel — Servizi EDI](https://www.metel.it/soluzioni/edi) 🟢

Altre filiere con standard propri, citate da Metel: **GS1** (largo consumo), **ANGAISA** (idrotermosanitario), EDIEL, ANSI X12. [Fonte](https://www.metel.it/soluzioni/progetti-custom) 🟢

## 1.2 Dove si perde tempo — con citazioni verbatim

### 🔵 LA CITAZIONE MIGLIORE DI TUTTA LA RICERCA — aggiornamento listini fornitori

Un utente di **ForumExcel.it** descrive il proprio processo reale, senza filtri commerciali. È lunga ma va letta tutta perché contiene il vocabolario esatto e il gesto fisico del lavoro:

> «Noi andiamo a calcolare il prezzo di vendita utilizzando i prezzi di acquisto che ci comunicano i nostri fornitori e questi vengono da dei **listini che ci vengono inviati in excel**. Di conseguenza dobbiamo procedere aggiornando i listini utilizzando delle tabelle. **Il problema è che questi listini hanno migliaia di articoli che non teniamo** e non possiamo inserire tutto nel gestionale sennò diventerebbe un caos oltre al fatto che le descrizioni degli articoli capita molto spesso che le andiamo a modificare rispetto a quelle del fornitore, quindi andiamo a lavorare questi listini "selezionando" solo gli articoli che ci interessano e che sono già inseriti nel gestionale.
>
> Esempio pratico della tabella in allegato: Foglio 1: un esempio di articoli di un fornitore con prezzo attualmente inserito (prezzi 2020), nel foglio 2 il listino inviato dal fornitore, messo già nel file con formattazioni analoghe al foglio 1, nel foglio 3 il **"match"** che facciamo solitamente ovvero: copiamo e incolliamo il nuovo listino nello stesso file degli articoli del fornitore già inseriti nel gestionale, facciamo la **condizionale/duplicato/errore sulla colonna del codice articolo fornitore** ed andiamo a sostituire il prezzo di acquisto nuovo con il vecchio semplicemente **tagliando/incollando** il prezzo di acquisto nuovo e messo sulla riga dell'articolo già esistente (quelli in colore nero), finita l'operazione si eliminano le righe degli articoli nuovi inseriti che non hanno valori duplicati (quindi articoli che non sono inseriti a sistema) e andiamo ad importare la tabella, in questo modo il gestionale aggiorna automaticamente i prezzi di acquisto e di conseguenza anche quelli di vendita essendo automatici.
>
> **Spero di essere stato chiaro anche se capisco che non è facile da spiegare.**»
>
> — [ForumExcel.it, thread "aggiornamento listini di vendita"](https://www.forumexcel.it/forum/threads/aggiornamento-listini-di-vendita.49988/) 🔵

**Perché è oro:** l'ultima frase ("capisco che non è facile da spiegare") è esattamente il sentimento che il copy deve intercettare. Chi fa questo lavoro sa che è assurdo, ma non sa nemmeno come raccontarlo.

### 🟡 La descrizione del ciclo di aggiornamento listini lato acquisti

> «In Italia le aziende della grande distribuzione ricevono listini da decine — a volte centinaia — di fornitori. Migliaia di referenze, **scale sconti differenziate, date di decorrenza diverse per ogni contratto**. E nella maggior parte dei casi, l'aggiornamento di questi listini avviene ancora così:
> → Il fornitore manda un file Excel o un PDF
> → Qualcuno in ufficio acquisti lo apre, lo confronta con il listino attuale
> → **Aggiorna le righe a mano nel gestionale, una per una**
> → Verifica che sconti, date di decorrenza e **codici EAN** siano corretti
> → Inoltra il listino aggiornato ai reparti vendite e logistica
> Quando i fornitori sono 10, 20 o 50 e i listini cambiano ogni mese, questo processo diventa un lavoro a tempo pieno. Con un rischio costante: **un prezzo sbagliato, una formula omessa, uno sconto non aggiornato — e il margine salta.** […] Senza versioni "FINALE_v3".»
>
> — [Reterea s.r.l., post LinkedIn](https://it.linkedin.com/posts/reterea-s-r-l_gdo-listiniprezzi-automazioneai-activity-7434272740305473536-aw04) 🟡
> *(Il post cita "fino all'80% del tempo risparmiato (fonte: GPC Italia)" — non ho verificato questa fonte.)*

### 🟡 Il PDF di listino a monte dell'ordine

> "Dimentica i PDF e file excel con i prezzi aggiornati ogni mese." · Tabella con/senza portale: ricezione ordini "Telefono, email, WhatsApp" → inserimento "Manuale, con rischio errori"; listini "PDF Excel statici, aggiornamento manuale"; situazione contabile cliente "Richieste all'ufficio amministrativo".
> — [RSoft webExpress](https://www.rsoft.it/soluzioni/settori/distribuzione-allingrosso-wholesale/) 🟡 *(dichiara "3-5% degli ordini" con errori di inserimento: numero non verificato)*

### 🟡 L'inferno dei portali fornitore — punto di dolore reale e poco raccontato

Fonte particolarmente attendibile perché Intesa (gruppo Kyndryl) è un provider EDI storico, non una startup:

> «Per queste aziende l'integrazione "diretta" tramite EDI standard con i partner potrebbe risultare economicamente challenging, ragion per cui le PMI si affidano più spesso a portali B2b specifici […] ai cui i loro clienti e fornitori possono accedere per scaricare o caricare manualmente ordini, bolle e fatture. Il risultato è, per tutti, **una pluralità di portali a cui accedere con diverse modalità, utenze e password, e nessuno dei quali integrato ai sistemi aziendali.**»
> — [Intesa (a Kyndryl Company)](https://www.intesa.it/edi-e-pmi-un-binomio-possibile/) 🟡

## 1.3 QUANTIFICAZIONE — la sezione più solida del report

### 🟢 GS1 Italy × School of Management Politecnico di Milano — Monitoraggio EDI nel largo consumo

**Questa è la fonte migliore in assoluto per quantificare il costo dell'ordine manuale in Italia.** Ricerca annuale, metodologia dichiarata, PDF pubblico.

**Risparmi per documento (Osservatorio Fatturazione Elettronica & eCommerce B2b, Polimi):**

| Chi | Cosa | Risparmio |
|---|---|---|
| **Azienda produttrice** | per singola fattura via EDI | **3–5 €** |
| **Azienda produttrice** | **per ordine ricevuto** | **10–14 €** |
| **Azienda produttrice** | a ciclo, se dematerializza tutto il ciclo dell'ordine | **fino a 42 €** |
| **Retailer** | per singola fattura ricevuta | 4–6 € |
| **Retailer** | per singolo ordine emesso | 5–7 € |
| **Retailer** | a ciclo completo | fino a 23 € |

Range generale per un **ciclo dell'ordine completamente dematerializzato: 25–65 € per ciclo, per singola organizzazione.**
Riduzione del **costo di processo fino all'80%**.

Fonti: [PDF GS1 Italy — Monitoraggio EDI 2025](https://gs1it.org/files/sharing/1770801281/3933/gs1-italy-monitoraggio-edi-2025.pdf) · [PDF edizione 2017](https://gs1it.org/content/public/e7/c0/e7c02ec9-b523-4ee6-8b8c-d57539ea7f53/gs1-italy_monitoraggio-edi_2017.pdf) · [Distribuzione Moderna](https://distribuzionemoderna.info/primo-piano/gs1-italy-i-documenti-elettronici-b2b-toccano-un-nuovo-record) · [CorCom/Polimi](https://www.corrierecomunicazioni.it/digital-economy/polimi-da-fattura-elettronica-risparmi-per-3-miliardi/) — tutte 🟢

### 🟢 **93 minuti → 20 minuti** — il numero più usabile del report

> «Nel processo procure-to-pay e order-to-cash, il passaggio da una gestione analogica a una completamente integrata tramite EDI **riduce il tempo medio di gestione di un ciclo d'ordine da 93 a 20 minuti**, con una diminuzione del [78%].»
> — [Tendenze Online / convegno GS1 Italy–Osservatorio Digital B2b Polimi, maggio 2026](https://tendenzeonline.info/articoli/2026/05/06/edi-nel-largo-consumo-la-supply-chain-digitale-oltre-la-fattura-elettronica/) 🟢
> Confermato su [GS1 Italy — Osservatorio EDI](https://gs1it.org/servizi/osservatorio-edi/): «i cicli order-to-cash e procure-to-pay si riducono del **78%, da 93 a 20 minuti medi**» e «**-78% per ciascun ciclo** rispetto al processo analogico». Il GDSN riduce «**fino all'87% il tempo di gestione di una SKU**».

### 🟢 **Metà del beneficio viene dagli errori, non dal tempo** — insight strategico

> «Circa **il 50% del valore dei benefici** sia dato dalla **riduzione dei costi di gestione delle inesattezze** che si creano nel processo tradizionale, come le **discrepanze tra quanto è consegnato e l'ordine effettuato, tra fatture e ordini, o tra fatture e pagamenti**. **Più in ritardo, e quindi più avanti lungo il ciclo dell'ordine, questi errori vengono individuati, maggiore è il costo del processo.**»
> — [Digital4, su studio Osservatorio Fatturazione Elettronica e Dematerializzazione Polimi](https://www.digital4.biz/procurement/strategie/ciclo-dell-ordine-in-digitale-tre-i-principali-benefici/) 🟢

*Questo è un argomento di vendita più forte del risparmio di tempo: il costo non è l'ora persa, è la discrepanza scoperta 45 giorni dopo.*

### 🟢 Quanto è arretrata la base — il TAM raccontato con dati

Osservatorio Digital B2b, Politecnico di Milano:
- **Lo scambio documentale avviene ancora per il 55% via email/PEC.**
- **EDI adottato dal 25% delle imprese** — ma **57% nelle grandi, 25% nelle PMI**
- Tra chi non ha EDI: **il 65% non ne ha nemmeno valutato l'opportunità**; solo l'8% prevede di introdurlo nei prossimi 3 anni
- Documenti più scambiati da chi ha EDI: **fattura 78%, ordine 70%, messaggi logistici solo 29%**
- **Più della metà delle aziende investe meno dell'1% del fatturato in digitalizzazione documentale**
- Solo il **13% delle imprese** impiega regolarmente AI/ML nei processi documentali (mentre il 50% dei fornitori la integra)
- Ostacoli: **resistenze interne al cambiamento 29%**, difficoltà di adattamento a esigenze/processi dei partner 23%
- Maturità PMI: **68% "Explorer", 18% Experimenter, 11% Adopter, solo 3% Strategic Deployer**
- Valore ordini B2b digitali 2024: **278 miliardi €** (+5%); mercato Digital B2B 2025: **4,9 mld €**
- **Risparmio stimato per il Sistema Paese dalla digitalizzazione dei soli messaggi logistici: 18 miliardi €**

Fonti: [Osservatori.net — gestione documentale](https://www.osservatori.net/comunicato/digital-b2b/gestione-digitale-documenti-aziendali-mercato-b2b/) · [Osservatori.net — B2b Digital Commerce](https://www.osservatori.net/comunicato/b2b-digital-commerce-experience/b2b-digital-commerce-italia/) · [Sintesi Metel](https://www.metel.it/news/report-ricerca-2024-2025-osservatorio-digital-b2b) — tutte 🟢

### 🟢 Volumi EDI 2024 (per dare la scala)
8.042 aziende del largo consumo hanno scambiato almeno un messaggio EDI con standard GS1 nel 2024 (−1% sul 2023, tasso di continuità 91%). **~55 milioni di messaggi**: fatture 14,5 mln (−8%), **ordini 13,4 mln** (−1%), avvisi di spedizione 13,3 mln (+2%). **Il 64% delle relazioni scambia un solo tipo di documento** (fatture 42%, ordini 38%, avvisi 13%) — cioè l'EDI c'è ma è usato al minimo.
Benefici percepiti da chi lo usa: velocizzazione processi **67%**, semplificazione integrazione partner 41%, controllo/previsione flussi 34%.
— [Mark Up](https://www.mark-up.it/edi-nel-largo-consumo-consolidato-ma-non-ancora-strategico/) · [PDF GS1 2025](https://gs1it.org/files/sharing/1770801281/3933/gs1-italy-monitoraggio-edi-2025.pdf) 🟢

### 🟢 Dimensione di un settore-esempio: idrotermosanitario (ANGAISA/Nomisma, dic. 2025)
- Filiera ITS 2024: **42,8 mld €** di fatturato, **23.762 imprese attive**, **125.721 addetti** (+6,4%), media **9 occupati per azienda**
- La sola **distribuzione specializzata ITS: 18,4 mld €**
- ANGAISA associa **245 aziende distributrici** con **oltre 1.000 punti vendita** = **40% del fatturato** della distribuzione ITS italiana; più 10 gruppi d'acquisto e ~147 industrie
- 74% del fatturato (società di capitali) generato al Nord

Fonti: [ANGAISA — Convegno](https://www.angaisa.it/tutti-i-numeri-della-filiera-idrotermosanitaria/) · [ANGAISA/Nomisma](https://www.angaisa.it/ldrotermosanitario-genera-93-miliardi-di-valore-1-su-2-fara-ristrutturazione-nel-2026-indagine-nomisma/) · [Confindustria Ceramica](https://confindustriaceramica.it/w/it/idrotermosanitario-dati-2024) · [ANGAISA — Chi siamo](https://www.angaisa.it/chi-siamo/) 🟢

### ⚠️ Numeri che ho scartato
- «Il tasso di errore del data entry manuale è del 5%, con conseguenze che possono costare fino al 3% del fatturato annuale» e «studio IDC: 60% in più di spesa» — [retica.ai](https://retica.ai/blog/il-data-entry-manuale-un-ostacolo-alla-crescita/) 🟡. Gli studi IDC/Gartner citati non sono linkati; questi numeri circolano da anni sul web anglosassone senza fonte primaria rintracciabile. **Non usare.**
- «Riduzione fino al 90% del tempo di inserimento» — [Punto Informatico](https://www.punto-informatico.it/come-ottimizzare-data-entry-con-intelligenza-artificiale/), è contenuto sponsorizzato. 🟡

## 1.4 Software realmente usati e limiti lamentati

**Gestionali confermati in uso nella distribuzione italiana:** Zucchetti (**Ad Hoc**), TeamSystem (**Enterprise / Enterprise Power-I**, **Gamma/Gamma Sprint** → **TS Azienda Cloud**), **Danea Easyfatt** (Standard/Professional/Enterprise), **Passepartout Mexal**, **Arca Evolution** (Wolters Kluwer), **Metodo**, **Mago.net** (Zucchetti/Microarea), **NTS Business** (via INTIT), **SIGLA** (Delta Phi), **eSOLVER** (Sistemi), **Panthera**, **Dylog / OpenFashion**, **Microsoft Dynamics 365 Business Central**, **Odoo** (in crescita come exit da TeamSystem), **Fatture in Cloud**, **Aruba Fatturazione**.

Un dato di market share va preso con le pinze: «Il **71% delle PMI italiane usa TeamSystem o Zucchetti** su contabilità ed ERP — la quota internazionale SAP/Oracle è intorno al 12%, Microsoft Dynamics 8%» — [zunapro.com](https://www.zunapro.com/italy/it/software-personalizzato) 🟡, **senza fonte**. Direzionalmente credibile, non citabile.

### 🔵 VERBATIM — Danea Easyfatt (Trustpilot: **2,4/5 su 440 recensioni**)

[Pagina fonte](https://it.trustpilot.com/review/danea.it) 🔵. Tutte «Non scritte su invito».

> «Uso **EasyFatt Standard** da anni e oltre ai continui aumenti, da quest'anno si sono inventati **il conteggio delle fatture elettroniche inviate e ricevute. Massimo 80 in un anno** (Sfido a trovare qual…»

> «Costi aumentati di molto negli ultimi anni. Continuamente ritocchi di prezzo. **Ora se ne escono pure con un limite a 400 fatture tra inviate e ricevute.** Già ero in dubbio l'anno scorso con il rinnovo a prezzi superiori. Adesso sono arrivati al limite della decenza. **CAMBIOOOOOO**»

> «Desidero manifestare il mio disappunto per la recente modifica delle condizioni di utilizzo. Dopo anni di rapporto commerciale, **il limite delle 400 fatture comporterà la cessazione del mio utilizzo del servizio.** Di conseguenza, procederò al passaggio alla fatturazione di Aruba. Ritengo questa scelta poco rispettosa nei confronti dei clienti storici.»

> «Sono cliente danea da molti anni, tutto sommato sempre soddisfatto. Ma ora i prezzi sono aumentati in modo assurdo. **L'easyfatt per l'anno 2022, costava 74 €; per il 2023 - 96 €, per il 2024 - 120 €.** Poi nel 20…»

> «Sono cliente **Danea Enterprise** da molti anni e penso che questo sarà l'ultimo. Nel tempo **accedere all'assistenza di un tecnico via telefono è diventata impresa titanica**; se fila tutto liscio, bene, altrimenti cominciano i guai e **se non trovi la soluzione nelle FAC sei spacciato.** Peccato perché il software risponde a molte esigenze aziendali.»

> «da anni che utilizzavo Easyfatt con soddisfazione, prodotto molto semplice ma altrettanto efficace. **Già sospettavo che con l'ingresso di TeamSystem la politica verso il cliente si sarebbe spostata ver…**»

> «sono **rivenditore Danea da oltre 10 anni**, software molto valido, ma purtroppo dopo l'ingresso di TeamSystem a livello commerciale una catastrofe, **i prezzi negli ultimi 4 anni sono quintuplicati**…»

> «mi hanno letteralmente **bloccato l'azienda**, ho effettuato il rinnovo nei tempi previsti, con carta di credito. il pagamento non si è agganciato, mi hanno chiuso il programma e **non posso aprire ticket di assistenza perché il programma è scaduto**»

> «**piccolo artigiano**: da forse venti anni ormai uso Easyfatt rapido, e ineguagliabile in praticita' **uno dei miei maggiori fattori di successo** mai alcun problema nella installazio…» *(recensione positiva — utile per capire cosa NON attaccare)*

**🟢 Limite funzionale documentato dal produttore stesso** — pagina di help ufficiale:
> «**Easyfatt non permette di gestire le liquidazioni Iva in questi casi particolari:** […] Contribuenti che si avvalgono delle agevolazioni dell'art. 74, comma 5 (**contratti di subfornitura**) […] Contribuenti che effettuano compravendita di autoveicoli oggetto di acquisto intracomunitario […] Contribuenti con contabilità separate e periodicità diversa»
> — [help.danea.it](https://help.danea.it/easyfatt/Comunicazione_liquidazioni_Iva.htm) 🟢
> *L'esclusione sulla subfornitura tocca direttamente le officine conto terzi.*

**🟢 Limite architetturale documentato:** Easyfatt è **desktop**. «essendo un software desktop, **non puoi usarlo da smartphone o tablet in modo nativo** […] Esiste un'app mobile, ma le funzionalità sono limitate […] l'assenza di una vera componente cloud rende più complessa la collaborazione con il commercialista». — [SRLonline](https://www.srlonline.com/software-gestionali-2026-fatture-in-cloud-vs-danea-teamsystem-confronto-prezzi-funzioni/) 🟡 (ma il fatto architetturale è verificabile)

### 🔵 VERBATIM — TeamSystem (Trustpilot: **2,4/5 su 1.244 recensioni**) e Zucchetti (**1,2/5 su 370**)

[TeamSystem](https://it.trustpilot.com/review/teamsystem.com) · [Zucchetti](https://www.trustpilot.com/review/www.zucchetti.it) 🔵

> «**Migrate ad Odoo**… è anche gratis se conoscete qualcuno che sa installarlo nella versione community… c'è una community incredibile. **TS aumentano i canoni ogni anno… e costa una fucilata.**»

> «Dopo l'ultimo aggiornamento **CRM in Cloud è diventato praticamente inutilizzabile**, si lavora (poco e male) solo **aprendo un ticket dopo l'altro.** E' assolutamente inconcepibile che sia andato in produzione un prodotto con tali e tante problematiche, in molti casi bloccanti.»

> «La assistenza è sempre gentile e professionale. **Non sempre riesce a risolvere tutte le nostre richieste non per mancanza di volontà, ma per carenze del programma stesso.**»
> *↑ Questa è la citazione più utile: distingue il problema di supporto dal problema di prodotto.*

> «**Credo che sopravvivano per mancanza di concorrenza**: ogni volta che domandiamo aiuto per il nostro business iniziano le prese in giro. Costi eccessivi, "customer care" scadente e spocchioso, tempi…»

> «Inizialmente cliente di **Ciao manager** con un discreto servizio, in seguito all'**acquisizione da parte di Team system l'inizio dei problemi.** Assistenza inesistente, impossibile parlare con operatori…»

> «**PROGRAMMA OBSOLETO, SUPERATISSIMO** […] FANNO PURE DANNI ECONOMICI COI LORO AGGIORNAMENTI CHE TI IMPEDISCONO DI INVIARE FT E LAVORARE SERENAMENTE.»

**Zucchetti — sul portale documentale:**
> «Si tratta di un portale […] **È complicatissimo, non dà modo di scaricare, né vedere i propri documenti.** […] C'è da chiedersi come mai un software del genere sia autorizzato e omologato. Tutte le volte problemi infiniti, assistenza nulla. **La maggior parte delle volte dice che il portale è in manutenzione** e che il servizio riprenderà al più presto.»

**Sistemi S.p.A. (FattureWeb) — il danno peggiore documentato:**
> «Durante la migrazione abbiamo affrontato numerosi problemi e disservizi […] Il colpo finale è stato la **perdita completa dello storico degli anni precedenti e delle anagrafiche dei clienti passati**, un danno grave per qualsiasi realtà aziendale. In momenti critici siamo rimasti completamente fermi, senza alcun supporto.»
> — [Trustpilot Sistemi](https://it.trustpilot.com/review/www.sistemi.com) 🔵

### 🔵 VERBATIM — "gli strumenti non parlano tra loro" (il vero angolo per ACCELERIAMO)

Da un **Sales Manager di TeamSystem stesso** (fonte identificabile, quindi credibile e non sospetta di ostilità al brand):

> «Ho incontrato negli ultimi mesi decine di imprenditori e responsabili operations nel Nord Est. Tutti bravi. Tutti occupati. Quasi tutti con lo stesso **problema invisibile**: i loro team passano **ore ogni settimana a fare cose che non generano valore. Riconciliazioni manuali tra gestionali diversi. Fatture inserite a mano da un sistema all'altro. Report costruiti su Excel alle 8 di sera prima del CDA.** Non è pigrizia. Non è incompetenza. **È che i loro strumenti non parlano tra loro.** Il costo reale? Non è solo il tempo. **È il costo delle decisioni prese in ritardo, con dati incompleti, su intuizioni invece che su numeri.**»
> — [Alessandro D'Arco, Sales Manager Triveneto & Emilia-Romagna BU Enterprise, TeamSystem — LinkedIn](https://it.linkedin.com/posts/alessandro-d-arco-69491225_erp-digitaltransformation-teamsystem-activity-7475080593597423616-mj6j) 🔵

E la controparte critica, fondamentale per non sovrapromettere:

> «**"Abbiamo speso 40 mila euro per il nuovo gestionale. Ma per le cose importanti usiamo ancora Excel."** […] **Digitalizzare il caos: se un processo è rotto, automatizzarlo significa solo renderlo rotto più velocemente.** Il gestionale non creerà mai ordine dove regna la confusione. Amplificherà solo il disordine a velocità digitale. […] Risultato: **7 software che non parlano tra loro, dati duplicati ovunque, e nessuno che ha la visione d'insieme.**»
> — [Federico Bocchini — LinkedIn](https://it.linkedin.com/posts/federicobocchini2311_abbiamo-speso-40-mila-euro-per-il-nuovo-activity-7393584475797966849-Ft8Q) 🔵

> «L'azienda **fattura 800k€ l'anno. Gestita interamente in Excel.** Mi chiama il titolare in panico: **"Abbiamo perso un file. Tre anni di clienti."** Storia vera, mese scorso.»
> — [Dominik Lemiecha — LinkedIn](https://it.linkedin.com/in/dominik-lemiecha-a7494717a) 🔵

---
---

# 2. EDILIZIA — fatture fornitori vs bolle di cantiere

**Verdetto sull'esempio del sito: molto realistico e ben scelto.** La riconciliazione fattura ↔ DDT ↔ commessa è un problema strutturale documentato. Il copy può però essere reso molto più preciso usando la terminologia della contabilità lavori.

## 2.1 Il processo reale con la terminologia esatta

### 🟢 SAL e contabilità lavori — la catena documentale normata (D.Lgs. 36/2023, Allegato II.14)

Questa è la parte in cui **si può essere chirurgici**, perché è legge. La sequenza:

**Giornale dei lavori → Libretto delle misure → Registro di contabilità → SAL → Certificato di pagamento (emesso dal RUP) → Conto finale dei lavori**

| Documento | Chi lo predispone | Cosa fa |
|---|---|---|
| **Giornale dei lavori** | Direttore lavori o assistente delegato | Registra l'andamento quotidiano |
| **Libretto delle misure** | Direttore lavori | **Misura e classifica** lavorazioni e provviste eseguite |
| **Registro di contabilità** | Direttore lavori | Applica alle quantità del libretto i **prezzi contrattuali** |
| **SAL** | Direttore lavori, **ricavato dal registro di contabilità** | Riepiloga tutto dall'inizio dell'appalto; determina il **corrispettivo maturato**, gli **acconti già corrisposti** e la **rata di acconto** da pagare |
| **Certificato di pagamento** | **RUP** | Previa verifica della **regolarità contributiva** |

Testo normativo diretto:

> «lo **stato di avanzamento lavori (SAL)** che riassume tutte le lavorazioni e tutte le somministrazioni eseguite dal principio dell'appalto sino ad allora. Tale documento, **ricavato dal registro di contabilità**, è rilasciato […] ai fini del pagamento di una **rata di acconto**; a tal fine il documento deve precisare il **corrispettivo maturato**, gli **acconti già corrisposti** e, di conseguenza, l'ammontare dell'acconto da corrispondere, sulla base della differenza tra le prime due voci. Il direttore dei lavori trasmette immediatamente lo stato di avanzamento al **RUP**, che emette il **certificato di pagamento**; il RUP, **previa verifica della regolarità contributiva** dell'esecutore, invia il certificato di pagamento alla stazione appaltante per l'emissione del **mandato di pagamento**»
> — [D.Lgs. 36/2023, Allegato II.14](https://www.codiceappalti.it/DLGS_36_2023/Allegato_II_14_Direzione_dei_lavori_e_direzione_dell%E2%80%99esecuzione_dei_contratti__Modalit%C3%A0_di_svolgimento_delle_attivit%C3%A0_della_fase_esecutiva__Collaudo_e_verifica_di_conformit%C3%A0_/12904) 🟢

E il vincolo temporale che genera il dolore quotidiano:
> «Il Direttore dei Lavori ha l'obbligo di **accertare e registrare i fatti producenti spesa contemporaneamente al loro accadere**, rispettando la **progressione costante della contabilità**.»
> — sintesi da [Allegato II.14](https://www.codicecontrattipubblici.com/nuovo-codice-contratti-pubblici-2023/allegato-ii-14-direzione-dei-lavori-e-direzione-dellesecuzione-dei-contratti-modalita-di-svolgimento-delle-attivita-della-fase-esecutiva-collaudo-e-verifica-di-conformita/) 🟢

**Altri termini normati e verificati:**
- **Contabilità a misura / a corpo / in economia** — tre regimi distinti. Nei **lavori a corpo** il DL registra «per ciascuna categoria, la **quota percentuale eseguita** delle relative **voci disaggregate**», controllabile «attraverso il **computo metrico estimativo** dal quale sono state ricavate le **aliquote contrattuali**»
- **EPU** (Elenco Prezzi Unitari) · **lavori in economia** · **rendicontazione economie**
- **SIL** (Situazione Interna dei Lavori — le misure interne dell'impresa, distinte dal SAL ufficiale)
- **RAL** (Riepilogo Avanzamento Lavori)
- **SAL subappaltatori** (da validare prima del pagamento) · **SAL a corpo Standard o Variante**

Fonti: [BibLus — Contabilità dei lavori pubblici](https://biblus.acca.it/contabilita-lavori-pubblici/) · [BibLus — SAL](https://biblus.acca.it/stato-avanzamento-lavori/) · [BibLus — Registro di contabilità](https://biblus.acca.it/registro-di-contabilita-lavori-pubblici/) 🟢 — *ACCA è l'editore di PriMus, è la fonte tecnica di riferimento del settore*
[Perfetto (myperfetto.it)](https://www.myperfetto.it/funzioni/contabilita-di-cantiere/) e [Matrix — 888 SP](https://www.888sp.com/it/matrix/) 🟡 per SIL/RAL/rapportini misure

### 🟢 CILA / SCIA / PdC — la scala dei titoli abilitativi (DPR 380/2001)

| Titolo | Articolo | Quando |
|---|---|---|
| **Edilizia libera** | art. 6 | Interventi nel **Glossario unico** (58 voci) — nessuna comunicazione |
| **CILA** — Comunicazione Inizio Lavori **Asseverata** | art. 6-bis | Manutenzione straordinaria che **non tocca le parti strutturali** e non modifica volumetria complessiva né destinazione d'uso urbanisticamente rilevante |
| **SCIA** — Segnalazione Certificata Inizio Attività | art. 22 | Interventi che **coinvolgono le parti strutturali**; restauro e risanamento conservativo su tali parti; ristrutturazioni diverse da quelle con PdC |
| **SuperSCIA** (alternativa al PdC) | art. 23 | Casi specifici |
| **PdC** — Permesso di Costruire | art. 10 | Nuove costruzioni, ristrutturazione urbanistica, ristrutturazione edilizia "pesante" (aumento unità immobiliari, modifiche volume/prospetti/sagoma/destinazione) |

Entrambe CILA e SCIA richiedono l'**asseverazione di un tecnico abilitato** (architetto, ingegnere, geometra, perito), che si assume responsabilità civile e penale. Rilevante anche il **Decreto Salva Casa 2024**.

Fonti: [BibLus — titoli abilitativi](https://biblus.acca.it/pratiche-edilizie-i-titoli-abilitativi-per-ogni-intervento-edilizio/) · [DPR 380/2001 — guida](https://www.claudioiodice.it/guide_esami_concorsi/scia-cila-permesso-costruire-dpr-380-2001.html) · [Infobuild](https://www.infobuild.it/approfondimenti/opere-edili-permessi-autorizzazioni-tipologia-intervento/) · [Professione Architetto — Glossario edilizia libera](https://www.professionearchitetto.it/news/notizie/24864/Edilizia-libera-glossario-unico-interventi-non-soggetti-a-Cila-Scia-permesso-di-costruire) 🟢

⚠️ **Attenzione nel copy:** CILA e SCIA sono adempimenti **del committente / del tecnico progettista**, non dell'impresa esecutrice. Un titolare di impresa edile *conosce* i termini e ne subisce gli effetti (non può iniziare senza titolo), ma non è lui a presentarli. Se il copy suggerisce che l'impresa "gestisce le CILA", suona sbagliato a chi lavora nel settore. **Meglio usarli come contesto di attesa/blocco, non come processo interno.**

### 🟢 Subappalto — la novità 2025 che ogni impresa cita

Con il **correttivo D.Lgs. 209/2024** (nuovo comma 2-bis dell'art. 119 D.Lgs. 36/2023): **almeno il 20% delle prestazioni subappaltabili deve essere affidato a micro, piccole o medie imprese**. L'operatore può proporre una soglia diversa solo motivandola per oggetto/natura delle prestazioni o caratteristiche del mercato.

Altri elementi: divieto di subappaltare l'esecuzione **prevalente della categoria prevalente**; **subappalto a cascata** ammesso salvo divieto motivato della stazione appaltante; **responsabilità solidale**; **pagamento diretto** ampliato al subappaltatore quando è micro/piccola impresa; obbligo per il subappaltatore di applicare **CCNL equivalente**; tenuta di **CEL** e dichiarazioni.

Critica ANCE citata:
> «l'[impossibilità], per l'operatore che ricorre al subappalto, di utilizzare i lavori subappaltati ai fini della qualificazione si traduce, di fatto, in **un ostacolo indiretto alla possibilità di ricorrere a questo istituto**»
> — ANCE, in [Confindustria Toscana Centro e Costa — Focus ANCE Firenze](https://confindustriatoscanacentroecosta.it/focus-ance-firenze-sul-correttivo-codice-appalti-1-le-novitain-materia-di-subappalto/) 🟢
> Anche: [Studio Tristano](https://www.studiotristano.com/subappalto-2025/) · [Studio Moscarini](https://www.studiomoscarini.it/2025/07/23/subappalto-nuovo-codice-limiti-autorizzazioni/) 🟢

### 🟡 Il ciclo passivo di cantiere — dove nasce la riconciliazione

Il flusso descritto in modo coerente da fonti vendor indipendenti tra loro:

**RDO ai fornitori → Ordine → DDT fornitore (arriva in cantiere) → Fattura passiva elettronica (arriva in amministrazione, settimane dopo) → Riconciliazione a 3 vie (ordine ↔ DDT ↔ fattura) → Imputazione a commessa / centro di costo → Certificazione dei costi di cantiere**

Infominds (Ergo — gestionale edile storico, 40 anni) elenca esattamente le funzioni che coprono il dolore:
> «Importazione dell'**XML relativo alle fatture fornitori**, proponendo la scrittura contabile e permettendo il **controllo dei DDT fornitori / SAL subappaltatori**» · «**Certificazione dei costi di cantiere** e possibilità di **aggiornare i listini fornitori automaticamente**» · «**Workflow per la validazione delle fatture fornitori**» · «**Creazione automatica dei DDT dal controllo fatture fornitori**» · «Gestione esecutivo: gestione contratto, definizione del progetto, redazione del budget e gestione dei rapporti con i fornitori (**RDO, ordini e contratti**)»
> — [Infominds — General Contractor](https://infominds.eu/settori/edilizia/general-contractor/) 🟡

*Nota: «Creazione automatica dei DDT dal controllo fatture fornitori» è la resa più cruda del problema: il DDT si crea **a posteriori dalla fattura** perché l'originale è perso.*

## 2.2 Dove si perde tempo

### 🟡 La descrizione più precisa del disallineamento temporale

> «In edilizia i materiali arrivano con il DDT, **la fattura arriva dopo — a volte settimane dopo**. Riconciliare la fattura con il DDT corrispondente è un passaggio che richiede attenzione manuale, e se non c'è un sistema che affianca, **i DDT finiscono in un cassetto e le fatture in un'altra pila**. […] Cantieri multipli, fornitori multipli. Un'impresa con 3-4 cantieri attivi può avere **50-80 fornitori diversi**, molti dei quali operano su un solo cantiere. […] **Ogni cantiere è in sostanza un centro di costo autonomo**, e tracciare le fatture per cantiere — necessario per il controllo di commessa — è un lavoro che a mano richiede **una disciplina che raramente si riesce a mantenere sotto pressione.**»
> — [Invoox](https://invoox.io/settori/edilizia/) 🟡

### 🟡 Il gesto fisico: dove finiscono le bolle

> «**Bolle di cemento, mattoni, ferro, calce, sabbia** che arrivano in cantiere. Da agganciare al cantiere giusto per fatturazione e SAL. **Finite tra le carte del furgone o nel container del capocantiere.**»
> — [RaDi](https://radi.work/edilizia) 🟡

> «I materiali vengono ordinati dal capocantiere **per telefono**. **Le bolle di consegna finiscono in un cassetto.** A fine commessa scopri che i costi materiali hanno sforato il budget del [X]%, ma **non sai dove**: erano gli infissi più costosi del previsto? La malta ordinata in eccesso? I tubi cambiati in corsa? Senza tracking, i costi materiali sono **un buco nero che scopri solo quando è troppo tardi.**»
> — [TeamLab](https://teamlabsrl.com/settori/software-gestionale-edilizia/) 🟡 *(percentuali nell'originale non verificate)*

### 🟡 La mezza giornata per un numero

> «**"Stiamo guadagnando o perdendo sulla commessa del condominio in via Roma?"** Il budget diceva €180.000 di costi. Ma quanto hai speso finora? Quanto manca? Il margine previsto regge o lo stai erodendo? Per rispondere devi **raccogliere dati da 5 fonti diverse (buste paga, fatture fornitori, bolle, ore extra, noleggi). Mezza giornata di lavoro per un numero che dovrebbe essere disponibile in tempo reale.**»
> — [TeamLab](https://teamlabsrl.com/settori/software-gestionale-edilizia/) 🟡

### 🟡 Le discussioni con i subappaltatori
> «Niente più discussioni con i subappaltatori sulle **giornate effettivamente lavorate**.» · «Tracciare le ore dei subappaltatori cantiere per cantiere, **validare i loro SAL prima del pagamento** […] tutto in un unico sistema invece di **N fogli Excel**.»
> — [RaDi](https://radi.work/edilizia) e [CantieriCloud](https://cantiericloud.com/gestione-cantieri) 🟡

### 🟡 Cosa cerca chi compra: il controllo a 3 vie
> «Con Cloud Cantieri la tua impresa ha il pieno controllo su **quantità e prezzi degli ordini, confrontandoli in modo puntuale con consegne e fatture ricevute.** Ogni **discrepanza** viene subito evidenziata»
> — [Cloud Cantieri](https://www.cloudcantieri.com/) 🟡
> «**Spese senza fattura**: Visualizza l'elenco delle spese registrate in cantiere che **non hanno ancora una fattura associata**. Non dimenticare mai più di sollecitare un documento a un fornitore.» · «**Allerta scostamenti**: Sei aggiornato se il **costo fatturato supera il budget preventivato nel computo**»
> — [Mela Work](https://www.melawork.it/it/solutions/riconciliazione-fatture) 🟡

## 2.3 Quantificazione

### 🟢 Struttura del settore (dati verificabili)
- **717.229 imprese edili attive** in Italia (Ateco 41 e 43)
- **83,3% microimprese**, 15% piccole, 1,6% medie, **0,1% grandi**
- **58,7% imprese individuali**
- Distribuzione: 29,7% Nord-Ovest, 20,6% Nord-Est, 20,5% Centro, 20,3% Sud, 8,9% Isole
- Fatturato da bilancio: **182 mld €**, **−9,4% sul 2023**
— [iCRIBIS Osservatorio 2026](https://www.contenuti.icribis.com/osservatorio/2026/settore-edile) 🟢

*Insight per il posizionamento: 83,3% microimprese significa che il decisore è il titolare, non un IT manager, e che il budget è piccolo. Il −9,4% di fatturato (fine bonus 110%) significa che nel 2025-26 la leva è **protezione del margine**, non crescita.*

### 🟢 Il caos normativo dei bonus — dalla voce di CNA
> «Si pensi al **caos normativo che ha segnato la materia dei bonus edilizi**. Le complicazioni nella gestione delle procedure per la fruizione degli incentivi connessi alla riqualificazione degli immobili sono da ricondursi principalmente alla **precarietà del quadro normativo, modificato decine di volte**. […] Un **affastellamento disordinato** contrassegnato da un equilibrio assai precario dell'edificio regolatorio in costruzione»
> — [CNA, Osservatorio Burocrazia 2025 (PDF integrale)](https://www.cna.it/wp-content/uploads/2025/03/Osservatorio-Burocrazia-2025-integrale.pdf) 🟢

### 🟢 Tempi degli appalti pubblici
> «in Italia occorrono **in media 815 giorni (circa 2 anni e 3 mesi)** per completare l'iter di un appalto pubblico tipo riasfaltatura di 20 chilometri di una strada a doppia corsia»
> — studio Confartigianato, via [Linea Italia Piemonte](https://www.lineaitaliapiemonte.it/2025/06/04/leggi-notizia/argomenti/lineaitaliapiemonteit/articolo/scadenze-e-adempimenti-rubano-ogni-anno-236-ore-alla-vita-delle-imprese-artigiane.html) 🟢

### ⚠️ Numeri NON verificati (da NON usare)
Il caso studio più tentante che ho trovato è anche il meno verificabile. Lo riporto solo perché **la struttura del racconto è ottima da imitare con dati propri**:
> «Un'impresa edile con 4 cantieri attivi e 60 fornitori. **180 fatture al mese, di cui il 30% arriva come foto o scan via email** […] un paio di ditte di smaltimento che mandano ancora tutto via **fax scannerizzato**. Prima: la responsabile amministrativa dedicava **un giorno intero a settimana** solo alla raccolta e inserimento delle fatture non-SDI, con altri **30-45 minuti di correzioni al giorno seguente** sulle voci ambigue. Dopo: […] verifica solo le fatture flaggate a bassa confidenza — circa 20-25 al mese. **Tempo recuperato: circa 3 giorni/mese.**»
> — [Invoox](https://invoox.io/settori/edilizia/) 🟡 **CASO NON VERIFICABILE — cliente non nominato, nessun dato di controllo.**

## 2.4 Software realmente usati

**Verticali edilizia/costruzioni confermati:** **Ergo** e **Ergo One** (Infominds), **Matrix** (888 SP), **Perfetto** (myperfetto.it), **STR** e **Vision** (Teamsystem Construction), **PriMus** e **Regolo BIM PLUS** (ACCA) per computi, prezzari **DEI** e regionali, formati di scambio **XPWE** e XLS per gli EPU.
**Nuova generazione cloud** (attenzione: molti giovanissimi, verifica prima di citarli come concorrenti): CantieriCloud, Pillar, Cloud Cantieri, Mela Work, archim, RaDi, Edilizia in Cloud, Tabiquo, Fondamenta.
**Contabilità:** Fatture in Cloud è il più citato come target di integrazione nativa dai verticali cloud.

### 🔵 Verbatim edilizia — ⚠️ CARENZA DA SEGNALARE
**Non ho trovato citazioni verbatim autentiche di titolari di imprese edili.** Le uniche "testimonianze" reperite sono anonime e su siti vendor, quindi **non usabili come citazione**:
> «Riconciliare fatture con consegne era un incubo. Ora archim lo fa in automatico, zero errori.» — [archim.ai](https://www.archim.ai/) 🟡 testimonial anonimo

**Raccomandazione operativa:** per questo settore le citazioni vanno raccolte a mano — 3-4 telefonate a titolari di imprese edili, registrando le frasi esatte. I gruppi Facebook di categoria (es. gruppi su bonus edilizi, geometri, capicantiere) sono la fonte più ricca ma non indicizzata.

---
---

# 3. OFFICINE MECCANICHE / LAVORAZIONI CONTO TERZI — lo stato commessa

**Verdetto sull'esempio del sito: realistico e con la migliore citazione verbatim di tutta la ricerca.** Questo è il settore con il materiale più autentico.

## 3.1 Il processo reale con la terminologia esatta

**Flusso confermato (officina di lavorazioni meccaniche conto terzi):**

**Arrivo richiesta (email + disegno) → Preventivo → Se accettato: immissione disegni nel CAD/CAM → Ordine di produzione / commessa → Ciclo di lavorazione (sequenza di fasi) → [Conto lavoro esterno: DDT c/lavorazione al terzista → rientro] → Avanzamento produzione / versamenti → Collaudo → DDT → Fattura**

**🟢 Terminologia verificata su fonti indipendenti:**
- **commessa** (e **commessa madre** per gli ordini di lavorazione esterna collegati)
- **ciclo di lavorazione** / **cicli** — sequenza di operazioni standard e alternative, «eseguibili dalla stessa azienda **o presso terzi**»
- **distinta base** (BOM), **MBOM** (distinta base di produzione), **distinta inversa**, **indice di modifica** (versioning della distinta)
- **conto lavoro** / **lavorazioni presso terzi** / **terzista**
- **versamento di produzione**, **dichiarazione di fine fase**, **avanzamento operazioni**
- **saturazione** / **carico macchine**, **capacità finita** vs **capacità infinita**
- **MPS** (Master Production Schedule / Piano Principale di Produzione), **MRP**, **CRP** (Capacity Requirements Planning)
- **OEE**, **fermi con causale**, **scarti**, **WIP**
- **RdA/RdO per conto lavoro** ← TeamSystem le nomina esplicitamente in questo contesto

Fonte primaria per la terminologia ERP: [TeamSystem Enterprise Power-I — Produzione](https://www.teamsystem.com/aziende/enterprise-power-i-enterprise-erp-azienda/funzionalita/enterprise-power-i-produzione/) 🟢 — elenco funzionale ufficiale del vendor leader, quindi terminologia autoritativa:
> «Lavorazioni presso terzi con **ordini di assemblaggio** e lavorazioni speciali» · «Modifica **da ordine terzista a ordine interno e viceversa**, **ordini aperti di conto lavoro**, **esplosione del ciclo per terzista**, gestione **indice di modifica**, **movimentazioni magazzino-deposito e tra terzisti**, **documenti di trasporto terzista**, **RdA/RdO per conto lavoro**»

Altre fonti: [Datalog — conto terzi](https://www.datalog.it/gestire-lavorazioni-conto-terzi/) 🟡 · [GP Progetti — Schedulatore di Filiera](https://www.gpprogetti.com/schedulatore-produzione/schedulatore-di-filiera/) 🟡 · [PLCinCloud — integrazione MES/ERP](https://plcincloud.it/blog/integrazione-mes-erp-produzione) 🟡 · [CAD3D — Distinta materiali](https://www.cad3d.it/distinta-materiali-cose-come-funziona-e-i-suoi-vantaggi/7941/) 🟡

**🟢 La distinzione ERP vs MES — con il test pratico più citabile del report:**
> «L'unità dell'ERP è **l'ordine, la commessa, la fattura**. L'unità del MES è **il pezzo, il ciclo macchina, il singolo evento di fermo**. […] Quasi ogni ERP ha un modulo produzione, e **per contabilizzare la produzione funziona** […] Il problema nasce quando gli si chiede di **governare** la produzione: senza collegamento ai PLC non vede fermi né cicli reali, **l'avanzamento dipende da dichiarazioni manuali**, l'OEE — se c'è — è calcolato su dati inseriti a fine turno. […] **Il test pratico: se i dati arrivano nel gestionale per dichiarazione manuale a fine turno, il MES non ce l'hai ancora.**»
> — [IOMA](https://ioma.ai/risorse/mes-vs-erp-differenze-integrazione) 🟡
> Regola architetturale: «**ogni dato nasce una volta sola, nel sistema più vicino a dove accade** — l'ordine nell'ERP, il versamento in linea.»

## 3.2 🔵 LA CITAZIONE VERBATIM MIGLIORE — perdita di tracciabilità in officina

Forum CAD3D.it, sezione "CAM in generale, manufacturing, macchine utensili". Utente **DarkAngel**, disegnatore tecnico, Reggio Emilia, software Lantek Expert + SolidWorks 2014. **Questa è una voce autentica di un addetto, non filtrata da nessun marketing:**

> «premessa: **officina meccanica per lavorazioni conto terzi**, le lavorazioni principali sono: **taglio laser, taglio idrogetto, centro di lavoro cnc, tornitura, saldatura, piegatura**
>
> **come si svolge ora il lavoro:** arrivo degli ordini → preventivo → se accettato → immissione dei disegni nel cad/cam (LANTEK expert, **se volete un consiglio statene lontani come la peste!**) → taglio
>
> **da questo punto in poi si perde la tracciabilità**, cioè i disegni dei pezzi e le successive lavorazioni **viaggiano per l'officina in modo abbastanza caotico** tanto che alcune volte **si è incappati in consegne di ordini che sembravano complete mentre i pezzi dovevano subire altre lavorazioni**
>
> quello che vorremmo ottenere è un percorso di questo tipo: […] **tutti i disegni vengono caricati nel database e ogni postazione deve accedere al database e vedere che pezzi, quali ordini / date di consegna / ecc restano da fare e poter "flaggare" un pezzo come completo e di conseguenza un ordine come "completato"**, il tutto diretto da una **priorità degli ordini gestita dal capo**.
>
> esiste una soluzione del genere? per ora abbiamo preso in prova alcuni moduli gestionali di lantek ma **fanno ancora più pena del cad/cam**»
>
> — [CAD3D.it, "gestione del ciclo produttivo"](https://www.cad3d.it/forum1/discussione/gestione-del-ciclo-produttivo.42319/) 🔵
> ⚠️ **Il thread ha ricevuto ZERO risposte.** Il che è, di per sé, un dato: nessuno in un forum tecnico da 507.291 messaggi e 111.923 utenti registrati aveva una risposta.

**Perché usarla:** «consegne di ordini che sembravano complete mentre i pezzi dovevano subire altre lavorazioni» è il tipo di frase che un titolare di officina riconosce istantaneamente perché gli è capitato. E «flaggare un pezzo come completo» è esattamente il linguaggio dell'operatore, non del consulente.

## 3.3 🔵 Seconda citazione: come si preventiva davvero (e la reticenza del settore)

Sempre CAD3D.it, thread "CALCOLARE PREVENTIVI PEZZI MECCANICI". Un utente descrive il **metodo di stima reale**, quello che sta nella testa del preventivista:

> «però poi **fanno tutti i puritani e non vogliono svelare nulla**.
> - **peso grezzo e costo/kg** ottengo costo di acquisto
> - se ci son saldature ci sarà **costo/m** oppure costo/kg oppure si concorda 1,60 €/kg tutto compreso
> - se c'è **ricottura** si fissa costo/kg
> - **per le forature a macchina si fa una tabellina con dei range di fori con il tempo medio per foro**… sapendo che la macchina utensile costa 30 €/h uomo ci si attaccano altri 15…20…25 €/h… si determina una stima di costo per i fori
> - per le **lavorazioni di asportazione di truciolo** si calcola il volume totale da asportare e sapendo che **un tornio toglie in sgrossatura 40 cm³/min e 2 cm³/min in finitura**… si calcola il tempo e lo si moltiplica per il costo orario
> - **tempi fissi per macchina utensile** al costo orario stabilito **per attrezzare la m.u.**
> - somma di tutti i costi
>
> In effetti **con un disegno di fabbricazione in mano non puoi metterti a fare un G code e fare la simulazione per capire quanto tempo ci vuole**… Occorre qualcosa di molto semplice. […] **Quello che non sono riuscito a trovare e che mi manca sono i parametri di asportazione di truciolo in cm³/min per stozzatura di sedi per linguette**, in sgrossatura e finitura. **Mi mancano le considerazioni per tempra soprattutto per ingranaggi, cromatura, nitrurazione, gommatura ecc.**
>
> A me serve preventivare soprattutto per correggere la fase di progettazione: flange tornite e fresate, alberi, distanziali, perni, ingranaggi (a proposito… mi mancano i parametri per la **dentatrice** e la **rettifica denti**…), **carpenterie elettrosaldate** da lamiere e tubolari, **piastrame forato e filettato**, lamiere piegate»
>
> — [CAD3D.it](https://www.cad3d.it/forum1/discussione/calcolare-preventivi-pezzi-meccanici.51279/) 🔵

**Vocabolario da estrarre:** peso grezzo, costo/kg, sgrossatura, finitura, asportazione di truciolo, cm³/min, attrezzare la macchina utensile, ricottura, tempra, nitrurazione, cromatura, stozzatura di sedi per linguette, dentatrice, rettifica denti, carpenterie elettrosaldate, piastrame forato e filettato, flange tornite e fresate, G code.
Un titolare che legge queste parole in un copy capisce immediatamente che chi l'ha scritto ha parlato con qualcuno del mestiere.

## 3.4 Dove si perde tempo — il "a che punto è"

### 🟡 Elenco dei pain point (attendibile come descrizione, non come dato)
> «Priorità che cambiano continuamente in base alle richieste dei clienti · Difficoltà nel gestire più commesse contemporaneamente · **Scarsa visibilità su avanzamento e stato ordini** · Ritardi nelle consegne · **Pianificazione gestita con Excel o strumenti non integrati** · Difficoltà nel capire carico e **saturazione delle macchine**»
> — [IRIDay — MES conto terzi](https://www.iriday.it/iriday-suite/software-mes-conto-terzi/) 🟡

> «**Excel, WhatsApp, post-it, memoria.** Le urgenze arrivano e il piano salta. Macchine ferme, operatori che aspettano, consegne in ritardo. **Ogni venerdì è una rincorsa.** […] **Mandi i pezzi fuori e perdi visibilità.** Quando il cliente chiede lo stato, non hai una risposta. **Ogni sollecito è una telefonata, ogni ritardo è una sorpresa.**»
> — [AlfaWeb ERP](https://www.alfaweberp.it/) 🟡

### 🟡 Il "a che punto è" — la scena, resa bene
> «Il cliente chiama: **"A che punto è la mia macchina?"** Tu molli la **chiave dinamometrica**, ti pulisci le mani, cerchi il numero nel telefono, non lo trovi, lo richiami dal fisso. Intanto l'altro cliente in sala d'attesa si spazientisce. Il pezzo che hai ordinato martedì non è ancora arrivato e non sai se il fornitore l'ha spedito perché **il messaggio WhatsApp si è perso tra altri 50**. Se gestisci un'officina, **passi più tempo al telefono che sotto al cofano.**»
> — [TeamLab](https://teamlabsrl.com/settori/software-gestionale-officine-autoriparatori/) 🟡
> ⚠️ Lo stesso sito dichiara «1-2 ore al giorno di telefono», «5-6 chiamate al giorno», «chiamate −70%», «reminder tagliandi: +15 clienti recuperati all'anno». **Nessuno di questi numeri ha fonte. NON usarli.**

### 🟡 Il coordinamento con i terzisti — l'esempio più concreto
> «un'azienda metalmeccanica che collabora con **cinque terzisti** per operazioni di **trattamento termico, verniciatura e rettifica**: senza un sistema integrato, il coordinamento si affida a **email e telefonate**, con il rischio costante di errori, duplicazioni e informazioni non aggiornate che rallentano l'intera catena produttiva.»
> — [Datalog](https://www.datalog.it/gestire-lavorazioni-conto-terzi/) 🟡

## 3.5 Quantificazione

### 🟢 Preventivazione: il caso Bystronic (produttore di macchine laser — caso cliente, non software house generalista)
> «Un'azienda **canadese** specializzata nella lavorazione della lamiera impiegava **fino a due ore per preparare un preventivo in Excel**, a causa dell'elevato numero di riferimenti articolo. **Per ogni riferimento, il reparto commerciale doveva copiare e incollare articolo e prezzo.** Questo portava a errori, ritardi e, in ultima analisi, alla perdita di clienti. La soluzione è stata automatizzare le attività ripetitive […] l'azienda ha **ridotto il tempo di preparazione a dieci minuti** e **aumentato del 20% il tasso di conversione da preventivo a ordine.**»
> — [Bystronic](https://bystronic.com/ita/it/Come-la-preparazione-manuale-dei-preventivi-rallenta) 🟢/🟡
> ⚠️ **È marketing di un vendor, ma di un vendor industriale credibile, il caso è circostanziato e l'azienda è geograficamente identificata. Usabile con attribuzione esplicita a Bystronic. NON è un dato italiano.**

### 🟡 Carpenteria pesante — caso italiano ma non verificabile
> «Tempi medi: **da cinque a dodici giorni lavorativi per offerta**. In un mercato dove il buyer decide spesso entro **quarantotto ore**, questo ritmo è letale. […] Il tempo medio di elaborazione di un'offerta è passato **da otto giorni a meno di due ore** (−71%). Il **tasso di conversione delle offerte è salito dal 17% al 24%** […] Il numero di **richieste di chiarimento post-offerta si è ridotto del 40%** […] Lo **scostamento medio sul prezzo finale è risultato inferiore al 2%**»
> — [DGITALMECSHOW](https://dgitalmecshow.com/pmi-carpenteria-pesante-configuratore-cpq-digitale-tempi-offerta/) 🟡 **Azienda non nominata. NON citabile come dato.** La struttura narrativa (5-12 giorni per offerta vs 48h di finestra decisionale del buyer) è però un'ottima intuizione da verificare con clienti reali.

### 🟡 Il costo dell'errore di pricing — ragionamento (non dato) molto efficace
> «Un preventivo con un **errore del 3% su una commessa da 50.000 euro** significa **1.500 euro di margine perso**. Quando i calcoli vengono fatti manualmente con Excel o a mente, questi errori accadono con frequenza statistica prevedibile. **Il problema è che spesso vengono scoperti solo a consuntivo, quando non c'è più possibilità di correzione.**» · «un'azienda di serramenti con 8 tecnici commerciali perde mediamente **3-4 ore a testa a settimana** solo in attività di preventivazione manuale»
> — [Graffico](https://graffico.it/solutions/automazione-preventivazione-complessa) 🟡 — l'aritmetica è verificabile, le premesse (3%, 3-4 ore) no.

### 🟢 Autoriparazione — dati Confartigianato solidissimi
- **88.977 imprese** registrate a fine I trim. 2025, **211.131 addetti**, di cui **116.257 dipendenti**
- **67.000 imprese artigiane = 74,9% del settore**, con 155.000 addetti (73,3%)
- **Italia 1ª in UE-27 per numero di imprese** di autoriparazione; **2ª per addetti** dietro la Germania (276.000)
- Fatturato netto 2023: **20,8 mld €**; di cui **5,5 mld sostenuti dalle famiglie** ≈ **330 € a nucleo familiare**
- Fatturato **+7,5% nel 2024** (media UE +5,8%; DE +6,4%); +1,9% nel primo bimestre 2025
- Difficoltà di reperimento: in Sardegna il **57%** delle imprese fatica a trovare personale con competenze digitali, il **70%** con competenze green

Fonti: [Confartigianato — Ufficio Studi](https://www.confartigianato.it/2025/05/studi-autoriparazione-ricavi-in-crescita-in-un-contesto-di-incertezza-del-mercato-dellauto/) · [ADIRA Relazione 2025 (PDF)](https://www.adira.it/wp-content/uploads/2025/11/ADIRA_Relazione_2025_ok_compressed.pdf) · [Confartigianato Pavia](https://www.confartigianatopavia.com/riparare-conviene-lartigianato-dellautoriparazione-spinge-il-settore-automotive) · [Imprese Territorio](https://www.impreseterritorio.org/it/approfondimenti/autoriparazione-il-settore-cresce-nonostante-la-crisi-dell-automotive.html) · [Sardegna Impresa](https://sardegnaimpresa.it/autoriparazione-2025/) 🟢

### 🟢 RENTRI — l'adempimento nuovissimo che ogni officina sta subendo ADESSO
Questo è un gancio di copy **fresco e verificabile**, con una scadenza a giorni dalla data di questa ricerca.

- **13 febbraio 2026**: scadenza iscrizione al RENTRI anche per i **piccoli produttori di rifiuti pericolosi fino a 10 dipendenti** (le officine)
- **Dal 16 settembre 2026**: il **FIR** (Formulario di Identificazione del Rifiuto) diventa **esclusivamente digitale (xFIR)** per gli iscritti; finisce il "doppio binario" del Milleproroghe (D.L. 200/2025 → L. 26/2026)
- **Registro cronologico di carico e scarico** già obbligatorio in formato digitale dalla data di iscrizione
- **Sanzioni mancata iscrizione: 500–2.000 € (non pericolosi), 1.000–3.000 € (pericolosi)**, ridotte a 1/3 se si regolarizza entro 60 giorni
- Costo iscrizione: 10 € diritti di segreteria + 15–100 €/anno (15 € fino a 10 dipendenti), via PagoPA
- Rifiuti tipici dell'officina: **oli e lubrificanti esausti, filtri dell'olio, batterie al piombo, PFU, liquidi dei freni e antigelo, stracci sporchi**; per i gommisti anche **masse di equilibratura**
- Aggiornato dal **Decreto direttoriale n. 210 del 31 luglio 2026** (nuove istruzioni per registro e FIR)

Fonti: [FISCOeTASSE](https://www.fiscoetasse.com/approfondimenti/17430-rentri-dal-16-settembre-il-fir-diventa-definitivamente-digitale.html) · [Ambiente Sicurezza News](https://www.ambientesicurezzanews.it/in-evidenza/rentri-novita-settembre-fir-digitale-sanzioni.php) 🟢 · [Gianni Tritella — tabella scadenze](https://www.giannitritella.com/2026/05/29/rentri-2026-officine-autoriparazione/) · [Carsu — guida RENTRI officine](https://www.carsu.com/it/rentri-officine) 🟡

### 🟢 Meccatronica — l'altro adempimento che brucia (fonte CNA)
> «Le attività appartenenti alle categorie **meccanica motoristica** ed **elettrauto** sono state accorpate in un'unica nuova categoria denominata **"meccatronica"** dalla legge 224/2012. Le imprese che […] erano iscritte al Registro Imprese per una sola delle attività possono continuare l'attività **fino a luglio 2025**. Entro questa data, **peraltro prorogata più volte (al 2018, al 2023, al 2024 e infine al 2025)**, i responsabili tecnici erano tenuti a conseguire l'abilitazione alla categoria mancante […] tramite corsi regionali della **durata di 40 ore**.»
> Adempimenti richiesti con la SCIA per un'officina: «SCIA, comunicazioni in CCIAA, variazione posizione Agenzia delle Entrate, INAIL, Attestato di fine corso, requisiti di onorabilità, requisiti professionali del responsabile tecnico, dati catastali, **AUA emissioni in atmosfera**, comunicazioni di impatto acustico, prevenzione incendi, **comunicazione di industria insalubre**, SCIA per insegna, planimetria, relazione tecnica, diritti di segreteria, idoneità dei locali, autorizzazione agli scarichi, certificato di destinazione d'uso dei locali.»
> — [CNA, Osservatorio Burocrazia 2025](https://www.cna.it/wp-content/uploads/2025/03/Osservatorio-Burocrazia-2025-integrale.pdf) 🟢
> Il documento censisce **34.605 imprese** in "Riparazioni meccaniche di autoveicoli" (Ateco 45201) con **99.879 addetti**.

## 3.6 Software realmente usati

**ERP/MES produzione:** TeamSystem Enterprise Power-I, Zucchetti, **Mago.net**, **Panthera**, **Integro360**, **IRIDay** (Lythe/Skeda/Iride AI), **MS5 ERP** (carpenterie), **AlfaWeb ERP** (conto lavoro), **Zelo ERP** (Entersys), **GP Progetti** (Schedulatore di Filiera), Microsoft Dynamics 365 BC + **PRIME365**, **Siemens Opcenter APS**, **Teamcenter / TC Easy Plan**.
**CAD/CAM/nesting:** **Lantek Expert** (⚠️ pesantemente criticato nel verbatim sopra), SolidWorks, **BySoft Business** (Bystronic), **up2parts** (AI su modelli 3D + dati PMI/tolleranze), TinkDesign (bocciato nel verbatim), Creo, PriMus per la parte edile.
**Autoriparazione:** **Calibro** (Proger, su banche dati **ClipParts**), **Carsu**, **Quicknet**, **myEsperto**, **Techdata**.

**Limite lamentato più rilevante:** il verbatim CAD3D dice che i moduli gestionali del CAD/CAM «fanno ancora più pena del cad/cam» — cioè il problema non è la mancanza di software, è che **il CAD/CAM e il gestionale non si parlano** e nessuno dei due copre il tratto centrale (tracciabilità del pezzo tra le fasi).

---
---

# 4. AZIENDE DI MANUTENZIONE — giri operatori e rapportini

**Verdetto sull'esempio del sito: realistico. Il termine "giro" è verificato ed è specifico del mestiere.** Ma questo è il settore dove ho trovato **meno dati verificabili e meno verbatim autentici**.

## 4.1 Il processo reale con la terminologia esatta

**Flusso confermato:**

**Contratto di manutenzione (a servizio / a consumo, con o senza manutenzione programmata) → Scadenzario → Generazione delle visite programmate → Assegnazione: per GIRO DI MANUTENZIONE o per singolo impianto → [oppure: chiamata guasto → ticket → ODL] → Intervento → Rapportino d'intervento con firma cliente → Rendicontazione ore e materiali → Fatturazione (canone e/o consumi)**

**🟢/🟡 Il "giro di manutenzione" — struttura verificata.** La fonte più autorevole è Datalog (KING MANUTENZIONI, gestionale storico), che descrive **come è codificato** un giro:

> «La pianificazione della manutenzione può essere organizzata in base ai **giri di manutenzione** predisposti a sistema oppure assegnando il tecnico al singolo impianto. **I giri di manutenzione sono strutturati in modo tale da prevedere un supervisore, il tecnico, l'impianto e giro di manutenzione.** I dati vengono impostati in tabelle e i giri di manutenzione **vengono codificati e pianificati** in base alle esigenze e al contratto.»
> — [Datalog — KING MANUTENZIONI](https://www.datalog.it/software-assistenza-tecnica/manutenzioni/) 🟡

E il dettaglio operativo più bello e più specifico che ho trovato in tutta la ricerca — **la firma cumulativa nei condomini**:

> «È disponibile anche una funzione particolare di **firma cumulativa** con la quale il tecnico fa firmare, con un'unica operazione, più rapportini alla fine di un set di interventi (ad esempio, **per i lavori nei condomini non sempre ad ogni piano c'è la persona che deve firmare** per il lavoro svolto, perciò viene richiesta la firma su tutti i rapportini una volta finito il giro di tutti i piani).»
> — [Datalog — App interventi](https://www.datalog.it/app-gestionale/interventi/) 🟡

*Questo è il tipo di dettaglio che fa dire "questi sanno come lavoro io". Un dettaglio così non si inventa.*

Sempre Datalog, la vista del tecnico in app: «Le manutenzioni sono visualizzabili **in base alla posizione, ai giri di manutenzione e alle scadenze**» e «**Per mensilità**: l'app mostra le manutenzioni da fare oppure quelle **scadute o in scadenza o anche quelle che possono essere anticipate**» e «**attività ricorrenti** previste a contratto (ad esempio le **disinfezioni, sostituzioni di batterie** e simili) […] Il tecnico così **si predispone le attrezzature utili** per queste attività e **non riprogramma ulteriori uscite.**» 🟡

**Termini di mestiere confermati:** contratto di manutenzione, manutenzione programmata / preventiva / straordinaria, **giro di manutenzione**, **scadenzario** (o scadenziario), **rapportino d'intervento**, **ODL** (Ordine di Lavoro), ticket assistenza, **impianto** / **asset** / apparecchiatura, **censimento impianti**, **libretto digitale**, terzo responsabile, **manutenzione in subappalto**, canone, a consumo, **SLA**, dispatcher, **rendicontazione ore**, **trasferta**, collaudo, QR Code su impianto.
Fonti aggiuntive: [Hopperix](https://www.hopperix.it/funzionalita/applicazione-manutenzione-e-interventi/) · [D-TEC](https://dtec.one/software-gestione-interventi-manutenzioni-e-rapportini/) · [Eassistance](https://www.softwareinterventi.it/eassistance/) 🟡

## 4.2 🟢 Gli adempimenti reali — questa è la parte più preziosa e verificabile

Se il copy per le aziende di manutenzione deve suonare competente, deve nominare **queste** cose, non i "giri" in astratto.

### 🟢 Impianti termici — Libretto, RCEE, bollino, catasto regionale

Il quadro normativo (**DPR 74/2013** + **D.M. 10 febbraio 2014**):

- Dal **1° giugno 2014** ogni impianto termico deve avere il **"Libretto di impianto per la climatizzazione"**. In caso di trasferimento dell'immobile **va consegnato all'avente causa, aggiornato, con gli allegati**.
- Il **RCEE / REE** (Rapporto di Controllo di Efficienza Energetica) si applica alla **climatizzazione invernale > 10 kW** e **estiva > 12 kW** — «soglie che includono di fatto **tutte le caldaie domestiche**»
- **Periodicità del controllo di efficienza** (Allegato A DPR 74/2013): **ogni 4 anni** per impianti da 12 a 100 kW, **ogni 2 anni** oltre 100 kW. Le **Regioni possono prevedere obblighi più stringenti.**
- ⚠️ **Distinzione che il copy deve rispettare:** la **manutenzione ordinaria** ha la periodicità indicata **dal fabbricante nel libretto di istruzioni** o, in mancanza, dall'installatore — «**Spesso è annuale, ma non è un obbligo normativo uniforme.**» Il **controllo di efficienza energetica** invece ha cadenza fissata per legge. *Confondere le due cose è l'errore classico.*
- Il manutentore **deve trasmettere copia del RCEE al catasto regionale**, «**prioritariamente con strumenti informatici**», e **appone il bollino** (codice univoco che attesta il pagamento del contributo regionale)
- **Ogni Regione ha il suo applicativo**: **CURIT** (Lombardia), **CIT** (Piemonte), **SIERT** (Toscana), **CRITER** (Emilia-Romagna), **CAITEL** (Liguria)
- L'installatore ottiene un **codice catastale per ogni impianto**, da apporre sul libretto
- Nel rapporto il manutentore deve annotare **osservazioni**, **raccomandazioni**, **prescrizioni** e **la data prevista per il successivo intervento**

Fonti: [DPR 74/2013](https://leggi.edilizia.com/normativa/atto/27231/d-p-r-74-2013-regolamento-recante-definizione-dei-criteri-generali-in-materia-di-esercizio-conduzione-controll) · [D.M. 10/02/2014](https://leggi.edilizia.com/normativa/atto/188270/d-m-10-02-2014-d-m-10-febbraio-2014-modelli-di-libretto-di-impianto-per-la-climatizzazione-e-rapporto-di-effic) · [BibLus — Libretto di impianto](https://biblus.acca.it/download/modello-pdf-editabile-libretto-impianto-e-del-rapporto-di-controllo/) · [APEfacile](https://www.apefacile.it/news/infoape/rapporto-controllo-caldaia-come-gestirlo/) · [Regione Marche — DAM e REE](https://www.regione.marche.it/impiantitermici) 🟢

*Nota: la Regione Marche aggiunge la **DAM** (Dichiarazione di Avvenuta Manutenzione) e richiede **una terza copia del REE** all'Autorità Competente quando il controllo è "in scadenza secondo tabella". Cioè: la stessa attività genera un numero di copie e destinatari **diverso da Regione a Regione**. Per un'azienda che opera su due regioni, questo è un dolore reale e specificissimo.*

### 🟢 F-gas — comunicazione entro 30 giorni, per ogni intervento

**DPR 146/2018** (attuazione Reg. UE 517/2014):
- **Dal 25 settembre 2019** l'impresa certificata (o la persona certificata, se l'impresa è esente) **comunica per via telematica alla Banca Dati FGAS, entro 30 giorni dalla data dell'intervento**, le informazioni ex art. 16
- Riguarda: **installazione, primo controllo delle perdite, manutenzione, riparazione, smantellamento** su **apparecchiature fisse di refrigerazione, condizionamento, pompe di calore fisse, apparecchiature antincendio, celle frigorifero di autocarri e rimorchi, commutatori elettrici**
- **A prescindere dalla quantità di F-gas contenuta** (la soglia di 5 t CO₂eq serve solo a determinare frequenza dei controlli perdite)
- Obbligo di **iscrizione al Registro telematico nazionale** delle persone e imprese certificate
- Accesso a `bancadati.fgas.it` con credenziali del Registro FGAS, **CNS o SPID**; inserimento manuale **o upload XML** per interventi multipli
- **Diritti di segreteria annuali alle Camere di Commercio entro il mese di novembre**
- L'impresa trasmette all'operatore un **rapporto di intervento** con codice apparecchiatura e codice intervento

Fonti: [MASE — DPR 146/2018](https://www.mase.gov.it/portale/d-p-r-n-146-2018-recante-attuazione-del-regolamento-ue-n-517-2014) · [MASE — Banca Dati](https://www.mase.gov.it/portale/banca-dati-per-la-comunicazione-degli-interventi-sulle-apparecchiature-contenenti-gas-fluorurati-a-effetto-serra) · [Banca Dati FGAS — manuale](https://bancadati.fgas.it/Home/DownloadManualeComunicazioneInterventi) · [InSic](https://www.insic.it/tutela-ambientale/sostanze-pericolose/gas-fluorurati-25-settembre-comunicazioni-banca-dati-fgas/) · [CCIAA Dauniana](https://www.dl.camcom.it/sonoimpresa/sono-impresa-cosa-devo-fare/conoscere-gli-obblighi-ambiente/ufficio-unico-ambiente/Registro-gas-fluorurati/la-banca-dati-dei-gas-fluorurati) 🟢

**➡️ Questa è, a mio giudizio, la singola opportunità di copy più forte del settore manutenzione: "ogni intervento su un impianto F-gas va comunicato entro 30 giorni. Quanti ne hai in arretrato adesso?"** È verificabile, ha una scadenza precisa, e un manutentore certificato lo sente come una spina.

CNA segnala anche che l'**accreditamento F-GAS delle persone fisiche** e l'**abilitazione dei tecnici manutentori dei presidi antincendio** sono tra le 100 proposte di semplificazione — cioè: sono riconosciuti come problema dall'associazione di categoria. [Fonte](https://www.cna.it/wp-content/uploads/2025/03/Osservatorio-Burocrazia-2025-integrale.pdf) 🟢

## 4.3 Dove si perde tempo

### 🟡 Il percorso del rapportino cartaceo — descrizione precisa
> «Il **rapportino cartaceo** viene compilato **a mano in cantiere, spesso in condizioni difficili**. Arriva in ufficio **il giorno dopo, o il venerdì per tutta la settimana.** L'ufficio lo **trascrive nel gestionale** per la fatturazione. **La trascrizione introduce errori.** La fattura esce con settimane di ritardo.»
> — [Graffico — Field Service](https://graffico.it/solutions/piattaforma-field-service-manutenzione) 🟡
> ⚠️ Lo stesso testo afferma «un'azienda con 15 tecnici sul campo gestisce in media 60-80 interventi a settimana», cita "Aberdeen Group" per −20% costi operativi e +25% produttività tecnici (**non verificata**), e «i tempi medi di fatturazione scendono da 15-20 giorni a 1-3 giorni» (**senza fonte**). **Non usare i numeri.**

### 🟡 I quattro modi in cui si perde denaro (framing utile)
> «**Rapportini Persi**: Fogli che spariscono nel furgone, **caffè versato, grafia illeggibile**. Ogni rapportino perso sono soldi persi. · **Ritardi nella Fatturazione**: Devi aspettare che il tecnico torni in ufficio per fatturare. **Il cashflow soffre.** · **Ricambi non Segnati**: Materiale usato e non segnato sul foglio. **A fine anno sono migliaia di euro di magazzino che mancano all'appello.**»
> — [Raply](https://www.raply.it/) 🟡

> «Ore straordinarie, **ore di collaudo, attese in cantiere: chi le registra? Di solito nessuno. Quelle ore diventano costo d'azienda invece di riga in fattura**» · «Il tecnico chiude l'intervento, il foglio di lavoro torna in ufficio, la fattura si emette **'quando c'è tempo' — tre settimane dopo, se ti ricordi.** Intanto hai già pagato i ricambi e gli stipendi. **La cassa la rincorri ogni mese** invece di tenerla sotto controllo.»
> — [Edilizia in Cloud — impiantisti](https://www.ediliziaincloud.com/per/impiantisti/) 🟡

### 🟡 Il rischio di saltare un giro
> «A 60 e 30 giorni dalla scadenza prevista parte un avviso automatico all'ufficio, così **non scopri a fine anno di aver saltato un giro su 30 caldaie.**» · «tecnici che girano **5-15 visite al giorno**»
> — [RaDi](https://radi.work/manutenzione) 🟡 *(il "5-15 visite" non è verificato)*

### 🔵 Verbatim manutenzione — ⚠️ CARENZA DA SEGNALARE
Le uniche "testimonianze" sono **anonime e su sito vendor** (Raply). Le riporto perché il tono è verosimile, ma **non sono citazioni utilizzabili**:
> «Finalmente non devo più decifrare la grafia dei miei tecnici. Le fatture partono il giorno stesso dell'intervento.» / «Il magazzino si aggiorna da solo. Ho ridotto gli sprechi del 30% in sei mesi.» — [raply.it](https://www.raply.it/) 🟡 (attribuite a "Amministrazione, ElettroImpianti")

**Raccomandazione:** vale la pena raccogliere verbatim reali da questo settore, perché la terminologia normativa (RCEE, bollino, CURIT, F-gas 30 giorni) è già disponibile e molto specifica: basterebbero 3-4 frasi vere di titolari per avere un copy imbattibile.

## 4.4 Software realmente usati
**KING MANUTENZIONI** (Datalog), **Eassistance** (softwareinterventi.it), **Hopperix**, **D-TEC**, **mainsim**, **Appsistance**, **Cadulis**, **Evolvex**, **AntsRoute**, **Raply**, **RaDi**.
D-TEC dichiara integrazioni con **Mexal Passepartout, TeamSystem e Zucchetti** — indicazione utile: nel field service il verticale sta *accanto* al gestionale, non lo sostituisce. [Fonte](https://dtec.one/software-gestione-interventi-manutenzioni-e-rapportini/) 🟡

---
---

# 5. CENTRI GOMME / GOMMISTI — appuntamenti, deposito, cambio stagionale

**Verdetto sull'esempio del sito: realistico, e questo settore ha i migliori verbatim istituzionali.** Ma il punto di dolore più forte non è l'appuntamento: è **il deposito** e **i PFU**.

## 5.1 Il processo reale con la terminologia esatta

**Flusso confermato:**

**Riconoscimento veicolo da TARGA → recupero pneumatici in uso + in deposito da banca dati → Preventivo (multi-marca, con ricarico per fornitore/canale/stagione) → Appuntamento in agenda → LISTA DI PICKING degli pneumatici da preparare per il giorno dopo → Scheda lavoro → Cambio stagionale / inversione → Etichettatura e ubicazione in deposito → Ricevuta di deposito al cliente → Fattura + contributo ambientale PFU → Promemoria automatico per il prossimo cambio**

**🟢/🟡 Terminologia verificata:**
- **targa** come chiave di ricerca primaria (e da lì: **telaio**, **codice motore**, **dato tecnico gomme da libretto**, pneumatici **omologati su carta di circolazione**)
- **cambio stagionale** · **inversione** (degli pneumatici, per usura uniforme) · **calettamento** · **equilibratura** / **bilanciatura** · **convergenza** · **allineamento** · **ADAS** (da ritarare)
- **deposito** / **conto deposito** / **custodia stagionale** · **treno di gomme** (l'unità di conto!) · **ubicazione** / **scaffale** · **etichetta di deposito** con barcode o QR · **ricevuta di deposito** · **lista di picking**
- **usura del battistrada** (min. **1,6 mm** per legge) · **km percorsi** · **cerchio in acciaio vs in lega**
- **PFU** (Pneumatici Fuori Uso) · **contributo ambientale PFU** · **masse di equilibratura** (rifiuto!)
- **banca dati pneumatici**, **fasce di ricarico** per fornitore/canale/stagione, **B2B dei fornitori**

Fonti: [YAP Gomme (MMB Software)](https://www.mmbsoftware.com/gestionale-yap/yap-gomme/) · [DECK](https://deckgestionaleofficina.it/software-gestionale-deposito-pneumatici/) · [OfficinaCsPro](https://officinacspro.it/gestione-pneumatici) · [Pneusdata](https://www.pneusdata.it/) · [PneuStock](https://pneustock.it/) · [Anolla](https://anolla.com/it/software-per-gommisti) 🟡

**🟡 Il dettaglio che dimostra conoscenza del mestiere:** la **lista di picking del giorno dopo**.
> «la **predisposizione automatizzata della lista di picking degli pneumatici da preparare per il giorno successivo**» e «sfruttando le informazioni sullo **stato degli pneumatici in deposito** per **anticipare preventivi dedicati**»
> — [YAP Gomme](https://www.mmbsoftware.com/gestionale-yap/yap-gomme/) 🟡

*Cioè: il gommista organizzato la sera prima va in magazzino e tira giù i treni dei clienti di domani. Chi non lo fa, li cerca mentre il cliente aspetta. Questo è IL processo.*

**🟢 Le date che scandiscono l'anno** (Codice della Strada):
- **15 ottobre – 15 novembre**: finestra per montare gli invernali senza sanzione
- **15 novembre – 15 aprile**: obbligo effettivo su tutto il territorio nazionale (salvo ordinanze locali)
- **15 aprile – 15 maggio**: finestra per il ritorno agli estivi
- Pneumatici invernali: **M+S** o M+S con **fiocco di neve (3PMSF)**; aderenza sotto i **7 °C**
— [Gruppo Fassina](https://www.fassina.it/cambio-gomme-stagionale-2025-quando-farlo-e-cosa-sapere-per-essere-in-regola/) 🟢 (concessionaria, riporta la norma) · confermato da [Lapam](https://www.lapam.eu/notizie/rappresentanza/cambio-gomme-affidarsi-a-professionisti-pfu-non-piu-sostenibili/) 🟢

## 5.2 🔵 VERBATIM — le migliori del report, con fonti identificabili

### 🔵 La scena del deposito — venti minuti che incrinano la fiducia

> «**Un cliente entra per il cambio gomme e chiede il suo treno lasciato in deposito a maggio.**
> Il tuo collaboratore **sfoglia il quaderno. Niente. Apre il vecchio Excel sul PC dell'ufficio. Niente di chiaro. Torna in magazzino e comincia a cercare a occhio, tra centinaia di pneumatici impilati.**
> **Passano venti minuti.**
> Il cliente aspetta. Guarda l'orologio. E la fiducia che aveva in te, quella che si costruisce in anni, **comincia a incrinarsi in venti minuti.**
>
> Questa non è un'eccezione. **È la normalità in un sacco di gommisti che ancora oggi affidano centinaia di pneumatici a un quaderno o a un file che solo una persona sa interpretare.**
>
> E qui viene il problema vero: con centinaia di clienti e migliaia di gomme stoccate, **l'errore umano non è un rischio remoto. È statistica.** Prima o poi succede: **un treno etichettato male, uno pneumatico consegnato al cliente sbagliato.**
>
> **Pensi di aver già risolto perché sei passato dalla carta a Excel? Non hai risolto niente. Hai solo digitalizzato lo stesso limite: un'unica persona sa dove cercare. Se quella persona è in ferie, o se ne va, tu perdi la mappa del tuo stesso magazzino.**
>
> E indovina quando tutto questo esplode? **Aprile e ottobre. Cambio stagionale. Sei con la sala d'attesa piena, il telefono che squilla, e zero tempo per cercare un treno di gomme per venti minuti.**»
>
> — [La Digital Motor Strategy, post LinkedIn](https://it.linkedin.com/posts/la-digital-motor-strategy_deposito-pneumatici-la-guida-per-gommisti-activity-7497557792195543040-DZHA) 🔵/🟡
> ⚠️ È marketing, ma di un operatore identificabile del settore automotive, e **non contiene numeri inventati**. Il passaggio "hai solo digitalizzato lo stesso limite" è un argomento riutilizzabile in tutti i settori.

### 🔵 Il picco non è un problema di magazzino, è un problema di calendario

> «**Il cambio gomme stagionale non è un problema di magazzino. È un problema di calendario.**
> Ottobre e aprile: **due mesi che decidono buona parte del fatturato annuo di molte officine.** E puntualmente, ogni anno, la stessa scena — codice, clienti in attesa, magazzino sotto pressione, personale sopra i giri.
> **Il punto è che il problema non nasce ad ottobre. Nasce a settembre, quando nessuno ha pianificato slot, ordini fornitore e turni con anticipo.**
> Le reti che gestiscono bene questo picco **non lavorano di più durante il cambio stagionale. Lavorano prima.** Prenotazioni aperte con settimane di anticipo, **ordini piazzati su base storica**, personale organizzato su turni pensati apposta per quel periodo.
> E c'è un altro fattore che sta cambiando le carte in tavola: **le gomme all-season. Chi si affida ancora solo al doppio picco stagionale rischia di trovarsi con un modello di ricavo sempre più fragile.**»
>
> — [Giacomo Battistini, Consulente key account @ Gomme & Service — LinkedIn](https://it.linkedin.com/posts/giacomo-battistini-gb_automotive-gestioneaziendale-reteaffiliati-activity-7488864909833961472-3e3f) 🔵
> Commento di **Elenio Bergomi** al post: «**Una grandissima verità. È incredibile essere qui ancora a discuterne dopo anni dalla famosa ordinanza.**»

*Nota strategica: l'osservazione sulle all-season è importante. Se il modello a doppio picco si sta erodendo, il valore di un sistema che gestisce **il deposito e la relazione continuativa** (non solo il picco) cresce.*

### 🔵 Il vero incubo del gommista: i PFU — fonte CNA, presidente di categoria

Questa è la citazione **più autorevole** del settore: viene da un'associazione di categoria, con nome e cognome del dirigente e la sua azienda.

> «Piazzali delle officine **stracolmi**, ritiri a rilento e una **bomba ad orologiera** sul piano della sicurezza ambientale e dell'incolumità pubblica. […] Un **picco di lavoro stagionale che rischia di far scoppiare un'emergenza stoccaggio non più gestibile** nella provincia pisana. A sette mesi dalla consultazione sulla revisione della normativa nazionale sugli Pneumatici Fuori Uso (PFU), **il Ministero dell'Ambiente non ha ancora fornito risposte.**
>
> [Andrea Berni, presidente degli Autoriparatori di CNA Pisa e amministratore unico di Berni Auto Srl]: **"Senza interventi immediati, le imprese della provincia si troveranno di fronte a un bivio inaccettabile — rifiutarsi di servire i clienti, paralizzando la mobilità locale, oppure accumulare PFU oltre i limiti consentiti, aumentando i rischi per la sicurezza e incappando in sanzioni ingiuste per colpe non loro."**
>
> **"Gli autoriparatori e i cittadini pisani non possono più attendere — conclude Berni —. Il Ministero intervenga prima che il cambio stagionale trasformi i piazzali delle nostre officine in un pericolo per l'intera comunità."**»
>
> — [PisaToday](https://www.pisatoday.it/cronaca/allarme-accumulo-pneumatici-fuori-uso-andrea-berni-cna-pisa.html) e [PisaNews](https://pisanews.net/pneumatici-fuori-uso-lallarme-di-cna-pisa-piazzali-intasati-nelle-officine-della-provincia-e-rischio-incendi/) 🔵🟢
> CNA ha chiesto, tramite l'on. Antonino Iaria, un'interrogazione parlamentare per la revisione del **D.M. 182/2019**, misure straordinarie e **tempi massimi vincolanti per il ritiro dei PFU**.

### 🔵 I limiti di stoccaggio PFU — numeri precisi, fonte associativa (Lapam Confartigianato)

> «Nello stoccaggio dei PFU, il gommista può raggruppare gli pneumatici in un **deposito temporaneo** conservandoli per **massimo 90 giorni** prima di smaltirli. In alternativa al criterio temporale, può decidere di smaltirli quando **il quantitativo di rifiuti supera i 30 metri cubi**, con **almeno uno smaltimento all'anno**.»
>
> [Daniele Michelini, presidente categoria Autoriparazione Lapam]: per gli autoriparatori «**la criticità principale, al di là del carico di lavoro intenso in questo mese** a disposizione degli utenti della strada per cambiare le proprie gomme, **riguarda sempre la gestione dei PFU**» — un «**annoso problema che si trascina ormai da troppi anni**».
> L'associazione ha ottenuto la conferma dell'**extra target di raccolta PFU fino al 10% per il 2024** — «Una misura sicuramente apprezzabile ma **non basterà a risolvere il problema**».
>
> — [Lapam](https://www.lapam.eu/notizie/rappresentanza/cambio-gomme-affidarsi-a-professionisti-pfu-non-piu-sostenibili/) 🟢

**➡️ Insight di copy: 90 giorni o 30 m³. Un gommista che nel picco accumula PFU sa esattamente quanti giorni gli restano e non ha modo di saperlo con precisione. È un adempimento con un contatore.**

## 5.3 Quantificazione

### 🟢 Mercato pneumatici (Federpneus / GfK Italia) — dati da usare con nota sull'annata
Canale **Gommisti Specializzati**, vetture + trasporto leggero + 4x4 SUV, Italia:
- **2022: 19,7 milioni di pezzi** venduti (−0,4% sul 2021), **2,4 mld €** (+~12%)
- **Prezzo medio** pneumatico (IVA incl., **senza montaggio**) fine 2022: **120 €**; gen–mag 2023: **126 €**
- Gen–mag 2023: 7 mln di pezzi, quasi 1 mld €
- **Tasso di innovazione: il 47,7% delle vendite è di prodotti lanciati negli ultimi 4 anni**
- Crescita dei diametri **≥18 pollici** e del segmento **Quattro Stagioni**; soffrono gli estivi sotto i 18"
— [Federpneus](https://www.federpneus.it/it/news-det.php?id=5145) 🟢 ⚠️ **Dati 2022-2023, non aggiornati. Verificare l'ultima edizione prima di pubblicare.**

### 🟡 Volumi giornalieri — coerenti tra fonti, ma fonti debolissime
Tre pagine di `softwarebusinessplan.it` e `bsness.com` (siti di business plan generati, 🟡) convergono su:
- picco: **20–30 veicoli/giorno** per una piccola officina; **fino a 60/giorno con 3 tecnici specializzati**
- bassa stagione: **5–10 veicoli/giorno**
- **cambio stagionale (smontaggio + montaggio + equilibratura): 30–60 € a vettura** (30-50 € su cerchio in acciaio, 40-70 € in lega, 10-15 € equilibratura singola gomma)
- **custodia stagionale: 30–40 € per treno di gomme**
- picchi: **ottobre-novembre** e **aprile-maggio**, domanda che «può arrivare a raddoppiare»
— [1](https://www.softwarebusinessplan.it/gommista-guida-pratica/) · [2](https://www.softwarebusinessplan.it/quanto-guadagna-gommista-2/) · [3](https://www.softwarebusinessplan.it/quanto-guadagna-gommista/) · [4](https://www.bsness.com/piano-operativo/piano-operativo-gommista/) 🟡

⚠️ **La convergenza tra queste fonti NON è conferma**: sono siti dello stesso tipo che probabilmente attingono l'uno dall'altro o dalla stessa base. **Gli ordini di grandezza (20-30/giorno nel picco, 30-60 € per il cambio, 30-40 € per il deposito) sono plausibili e utili per costruire un ragionamento, ma vanno validati con un gommista reale prima di finire in un claim.**

### 🟢 Contesto: 89.000 imprese di autoriparazione, 75% artigiane
(vedi §3.5 — i gommisti rientrano in questo perimetro Confartigianato)

## 5.4 Software realmente usati
**YAP Gomme** (MMB Software), **Pneusdata**, **TireManager**, **SmartGomme**, **Anolla**, **Smartyres** (Brianza ICT), **DECK**, **StudioPneus One**, **GestiTyre**, **SmartERP / Smart Pneus**, **PneuStock**, **OfficinaCsPro**, **Carsu**.
Hardware citato come parte della soluzione: **etichettatrice professionale** (anche Zebra), **pistola/lettore barcode**, stampante. — [PneuStock](https://pneustock.it/) 🟡

*Nota: nessuno di questi ha recensioni pubbliche significative. Il settore è servito da software house locali, spesso mono-prodotto. Il che è **un'opportunità**: nessun incumbent forte da spodestare, ma anche un mercato abituato a spendere poco (SmartGomme parte da 59 €/mese, RaDi da 79 €/mese flat).*

---
---

# 6. ALTRI SETTORI CANDIDATI

Ho valutato 4 settori con evidenze. Li ordino per **forza del dolore documentato**, non per dimensione.

## 6.1 🥇 SERRAMENTISTI / INFISSI — il settore con la complessità matematica più alta

**Perché è il candidato migliore:** ha un problema che **nessun gestionale generalista sa risolvere** — le **misure variabili** — e questo genera un'intera categoria di software verticale. Dove esiste una categoria di software verticale, esiste un dolore pagato.

**🟢 Terminologia di mestiere specifica e verificata:**
- **griglia dei prezzi** (prezzo per **fasce di dimensioni**, non per pezzo)
- **minimo fatturabile** e **multiplo delle misure** (in m², m lineari, m³)
- **distinta base** con **calcolo quantità tramite formule configurabili**
- **liste di taglio** · **ottimizzazione del taglio** · **distinta vetri** · **schemi di assemblaggio**
- **calcolo della trasmittanza termica** · **marcatura CE** con etichette
- **posa** (fase distinta dalla produzione, spesso in subappalto)
- **esportazione dati per ottimizzatori** e **programmazione centri di taglio e lavoro** (CNC)

Fonti: [Fagis (MIGG)](https://migg.it/prodotti/fagis) e [software-fagis.it](https://software-fagis.it/) · [Pragma Infissi](https://www.pragma-soft.it/prodotti/pragma-infissi.html) · [CSM Finestra 3000](https://www.finestra3000.it/caratteristiche.html) · [FP SUITE / Emmegisoft](https://www.edilsiderspa.it/prodotti/emmegisoft/) 🟡 (ma la terminologia è concordante su 4 vendor indipendenti = affidabile)

**🟡 Il dolore, descritto da un vendor di settore:**
> «In molte aziende di serramenti il lavoro quotidiano assorbe tutte le energie: **preventivi, ordini, cantieri, posa, assistenza, amministrazione.** I dati ci sono, ma sono **sparsi tra fogli Excel, gestionale contabile, appunti interni e memoria delle persone.** Il risultato è che **le decisioni strategiche vengono spesso prese "a intuito"**, basandosi sull'esperienza o su percezioni parziali. […] **stiamo vendendo di più o solo facendo più preventivi?**»
> — [Gesty Serramenti](https://www.gestyserramenti.it/soluzioni/software-reportistica-serramenti/) 🟡

**🟡 Quantificazione (non verificata ma coerente):** «un'azienda di serramenti con **8 tecnici commerciali** perde mediamente **3-4 ore a testa a settimana** solo in attività di preventivazione manuale» — [Graffico](https://graffico.it/solutions/automazione-preventivazione-complessa) 🟡

**Perché è un buon target per ACCELERIAMO:**
1. **Il preventivo è il processo**, non un accessorio: il preventivo *è* la distinta base *è* la lista di taglio. Un errore di 5 mm si propaga fino al vetro tagliato male.
2. Il settore vive di **richieste da geometri, imprese e privati via email con misure in formati caotici** — caso d'uso perfetto per estrazione automatica.
3. FP SUITE (Emmegi) è un pacchetto di **7 software** — cioè le aziende strutturate hanno già speso molto e hanno comunque problemi di integrazione.
4. Le PMI serramentiste usano software **senza canoni obbligatori** (Fagis: 440–670 € una tantum) — quindi il budget è basso, ma il dolore è alto: spazio per un servizio, non un prodotto.

## 6.2 🥈 CONTO LAVORO / TERZISTI (tessile, pelle, metalmeccanica) — "dove sono finiti quei 200 kg di filato?"

**Perché è forte:** il dolore è **il materiale fisicamente fuori dall'azienda**, che è un tipo di ansia diversa e più acuta della semplice inefficienza.

**🟡 La descrizione più efficace trovata in tutta la ricerca:**
> «Il materiale esce dallo stabilimento verso il terzista. **Viene annotato su un DDT cartaceo.** Dopo giorni o settimane torna lavorato. **Qualcuno deve controllare manualmente che sia tornato tutto. Se manca qualcosa, inizia la ricerca: "Dove sono finiti quei 200 kg di filato?"**
>
> Non c'è visibilità in tempo reale su cosa è dove. **La pianificazione diventa impossibile perché non sai quando torneranno i materiali dai terzisti.** I costi delle lavorazioni esterne vengono registrati a valle, quindi **non sai il costo reale del prodotto finché non è finito.**»
>
> E sul lato produzione: «**schede cartacee appese ai telai, annotazioni su quaderni** […] quando un cliente chiama per sapere a che punto è il suo ordine, **parte la caccia alle informazioni tra reparti. "Aspetti che verifico in produzione… richiamo tra mezz'ora."** […] Si procede per tentativi: **"Sposto questo ordine al telaio 3, vediamo se ci sta…"**»
>
> — [Var Prime — ERP tessile](https://blog.varprime.com/erp-tessile-dynamics365-sfide-mercato-2025/) 🟡

L'alert che descrivono come soluzione è un'idea di prodotto già formulata: «**"Attenzione, il terzista X ha materiale da più di 15 giorni e dovrebbe rientrare entro 3 giorni per rispettare la consegna al cliente Y."**»

**🟢 Terminologia verificata:** conto lavoro, **fasonista** (specifico del tessile/moda!), terzista, **DDT c/lavorazione**, magazzino-deposito presso terzi, **ordini aperti di conto lavoro**, **esplosione del ciclo per terzista**, taglie e colori, **campionatura**, rilavorazione, conforme/non conforme.
Fonti: [TeamSystem Power-I](https://www.teamsystem.com/aziende/enterprise-power-i-enterprise-erp-azienda/funzionalita/enterprise-power-i-produzione/) 🟢 · [Dylog OpenFashion / Fashion Up](https://www.dylog.it/software/gestionale-taglie-e-colori-openfashion/) 🟡 · [Integro360](https://www.integrosrl.it/settore/gestionale-aziende-tessili-e-pelle/gestionale-per-tessile/) 🟡

**Nota importante:** il conto lavoro è **trasversale**, non un settore. Copre tessile/moda (Prato, Carpi, Fermo), pelletteria (Toscana), metalmeccanica (trattamenti termici, verniciatura, rettifica, zincatura), occhialeria (Belluno). Come angolo di copy **funziona su più settori con lo stesso messaggio** — che è un vantaggio notevole.

Vale la pena segnalare il progetto **Didip** per il distretto di Prato (connessione dei gestionali esistenti per tracciabilità e **Digital Product Passport**): indica che la spinta normativa europea sta creando domanda in questo esatto punto.

## 6.3 🥉 PMI ALIMENTARI — lotti, tracciabilità e il conto alla rovescia del richiamo

**Perché è forte:** è l'unico settore dove **il costo dell'inefficienza è il ritiro di un prodotto dal mercato**. E la normativa fornisce un contatore ("immediatamente").

**🟢 La base legale, con la distinzione che quasi tutti sbagliano:**
- **Reg. CE 178/2002, art. 18** (General Food Law, obbligo dal 1° gennaio 2006): l'operatore deve individuare chi gli ha fornito un alimento (**one step back**) e a chi ha fornito i propri prodotti (**one step forward**). «Su richiesta delle autorità competenti, questa informazione deve essere disponibile **immediatamente**.»
- ⚠️ **DISTINZIONE CRITICA per non sbagliare il copy:** «**La rintracciabilità interna non è obbligatoria per legge**; non esiste un obbligo generalizzato di mantenere una scheda di collegamento tra materie prime e singole produzioni.» È «fortemente raccomandata, e spesso necessaria nell'ambito del sistema HACCP», ma **non obbligatoria**. Chi scrive che è obbligatoria perde credibilità con un tecnologo alimentare.
- La normativa **non impone una forma**: «DDT, fatture, registri cartacei o sistemi digitali sono tutti strumenti idonei, purché le informazioni siano complete, coerenti e **facilmente reperibili**.» — cioè il cartaceo è legale. **Il gancio non è la compliance, è il tempo di risposta.**
- **Tempi di conservazione** (Linee guida Conferenza Stato-Regioni): prodotti freschi (pane, pasticceria) **almeno 3 mesi**; con data di scadenza **6 mesi dopo la scadenza**; con **TMC 12 mesi dopo il TMC**; senza indicazioni di durabilità **2 anni**.
- **Reg. CE 852/2004**: il sistema HACCP richiede documentazione di ogni **CCP** (punto critico di controllo).

Fonti: [Almater](https://almater.it/rintracciabilita-alimentare-obblighi-normativi-buone-pratiche/) 🟢 — *la più rigorosa e l'unica che segnala correttamente la non-obbligatorietà della rintracciabilità interna* · [Xelab](https://www.xelab.it/software-tracciabilita-haccp) · [FoodTag](https://www.foodtag.it/haccp/tracciabilita-alimentare-2025/) 🟡

**🟡 Il numero chiave (da verificare alla fonte prima di usarlo):**
> «Secondo i dati di **GS1 Italy**, il tempo medio per completare un **recall alimentare con sistemi manuali è di 24-72 ore**. Con sistemi digitali integrati, **scende a meno di 4 ore.** […] è la differenza tra un problema gestito e una crisi comunicativa che finisce sui giornali.»
> — [SIVAF](https://www.sivaf.it/tracciabilita-alimentare-food-beverage/) 🟡
> ⚠️ **La fonte GS1 Italy non è linkata. Da verificare direttamente su gs1it.org prima di citare.** Ma GS1 Italy è un ente affidabile e il dato è plausibile: vale la ricerca.

**🟢 Il vero gancio: la GDO, non la legge.**
> «il software diventa indispensabile quando: […] Si effettuano lavorazioni complesse che richiedono il **legame tra lotto di origine e lotto di produzione**. Si vuole ottenere una certificazione di qualità (es. **ISO 22000**) o **si lavora con la Grande Distribuzione (GDO), che richiede precisione millimetrica sulla rintracciabilità**.»
> — [Xelab](https://www.xelab.it/software-tracciabilita-haccp) 🟡

**Terminologia:** lotto, **mock recall** (simulazione di richiamo), ritiro vs **richiamo**, CCP, **batch record**, registro di sanificazione, registro di refrigerazione, registro verifica infestanti, registro fornitori/clienti, **OSA** (Operatore del Settore Alimentare), TMC, **visita ispettiva ASL**.

**Il pain point operativo quotidiano** (da [HaccpOK](https://haccpok.it/) 🟡): «**Caos durante le visite ispettive** (difficoltà nel reperire tutta la documentazione necessaria) · **Dispendio di tempo nella compilazione dei registri** · Nessun controllo sulle **scadenze dei contratti e attestati** · Difficoltà nel ricevere informazioni **sui prodotti richiamati**».

**Software di settore:** MyHaccp.cloud, XHACCP (Xelab), FoodTag, KoreLab, HaccpOK. Standard: **GS1 / GDSN**.

## 6.4 SPEDIZIONIERI / CASE DI SPEDIZIONE — il settore con la scadenza normativa più vicina

**Perché è interessante:** è l'unico settore dove **l'Europa sta imponendo la digitalizzazione con una data certa**. Chi arriva prima della scadenza vende.

**🟢 La leva normativa:**
- **eFTI** (electronic Freight Transport Information): «**digitalizzerà entro il 2027** la documentazione dei trasporti intra-UE, **ma è ancora poco conosciuto dal tessuto imprenditoriale**» ← *questa frase, da un Osservatorio del Politecnico, è la definizione di una finestra commerciale*
- **eCMR** (lettera di vettura elettronica)
- **ViDA** (VAT in the Digital Age), attivo **dal 2030**: estenderà l'obbligo di fatturazione elettronica intra-UE
- **RENTRI** operativo da aprile 2025 per i rifiuti industriali
- **EUDR** (deforestazione), **Digital Product Passport**
— [Metel, su report Osservatorio Digital B2b Polimi 2024-25](https://www.metel.it/news/report-ricerca-2024-2025-osservatorio-digital-b2b) 🟢

**🟢 Terminologia di mestiere (molto specifica, ottima per il copy):**
- **bolla doganale** · **fascicolo doganale** (digitale, indicizzato per **MRN**, numero pratica, cliente)
- **MRN** (Movement Reference Number) · **DAE** · **DAT** · **Prospetti Import**
- **AES** (Automated Export System) · **NCTS Phase 6** (transito) · **ICS2** (Import Control System 2, sicurezza pre-arrivo) · **AIDA 2.0** · **PUDM** (Portale Unico Dogane e Monopoli) · **ADM** (Agenzia Dogane e Monopoli)
- **temporanea custodia** · **deposito doganale** · **accise** · **appuramento** · **svincolo** · **prova di origine**
- **OTELLO 2.0** (tax free per viaggiatori extra-UE, obbligo dal 1° settembre 2018)
- **giri di ritiro e consegna** · **liste di carico** · **corrispondenti** · **packing list** · **CMR**

Fonti: [TruckOne](https://www.truckonesas.it/software-doganale/) e [suite](https://www.truckonesas.it/suite-software-truckone-doganale-logistica/) · [Parvasoft Customs](https://parvasoft.eu/parvasuite/gestione-dogane/) e [Digital Freight Forwarder Suite](https://parvasoft.eu/soluzioni-spedizionieri/) · [Ifin Sistemi Custom Flow](https://ifin.it/soluzioni/digitalizzazione-processi-e-documenti/custom-flow-ottimizza-la-gestione-delle-bolle-doganali/) 🟡

**Il framing migliore trovato:**
> «Nel trasporto, **il vero salto non è passare dalla carta a un PDF. È passare da un documento statico a un dato strutturato**, aggiornabile e condivisibile tra i soggetti coinvolti.»
> — [TruckOne](https://www.truckonesas.it/suite-software-truckone-doganale-logistica/) 🟡

E il pain point OTELLO, molto concreto: «Nella pratica, questo significa **tempo perso sul portale ADM**, procedure manuali e, spesso, **margini erosi dalle commissioni delle società di Global Refund**.» 🟡

⚠️ **Cautela:** questo settore ha **già** molti verticali maturi (TruckOne, Parvasoft, Ifin) e la compliance doganale è un terreno dove l'errore ha conseguenze legali. È il candidato con la barriera all'ingresso più alta.

## 6.5 Menzione: E-COMMERCE MULTICANALE — dolore chiarissimo, mercato già affollato

Il problema è nitido e universalmente riconosciuto:
> «un cliente compra un prodotto sul sito, **lo stock non si aggiorna su Amazon**, un altro cliente lo compra lì, **si finisce per vendere lo stesso prodotto due volte.** Le conseguenze: cancellazioni, rimborsi, **peggioramento dei rating sui marketplace**, lavoro extra del customer care, perdita di fiducia dei clienti.»
> — [Ecommerce Italia](https://www.ecommerceit.it/sincronizzazione-di-catalogo-e-ordini-tra-sito-e-marketplace/) 🟡

Terminologia: **overselling**, **hub and spoke** ("fonte di verità" centrale + spoke), **buffer di sicurezza** sullo stock, **SKU coerenti**, allocazione, **stock fisico vs disponibile**, WMS, lettera di vettura.
Costi indicativi di piattaforme di canale: **100–1.000 €/mese** (Sellercloud, Skubana, Solid Commerce, Linnworks).

**Perché lo metto in coda:** è affollatissimo (Poleepo e decine di altri), è il settore dove il compratore è più tecnicamente attrezzato, e il problema è più "integrazione software" che "processo di mestiere". Meno terreno per il copy iper-concreto che state cercando.

---
---

# 7. SINTESI OPERATIVA PER IL COPY

## 7.1 I 6 numeri che potete usare senza esitazione

| Numero | Cosa dice | Fonte |
|---|---|---|
| **93 minuti → 20 minuti** (−78%) | Tempo medio di gestione di un ciclo d'ordine, da analogico a integrato | [GS1 Italy × Polimi](https://gs1it.org/servizi/osservatorio-edi/) |
| **10–14 € per ordine ricevuto**; **25–65 € per ciclo d'ordine** | Risparmio per singolo documento/ciclo dematerializzato | [Osservatorio Polimi / GS1](https://gs1it.org/files/sharing/1770801281/3933/gs1-italy-monitoraggio-edi-2025.pdf) |
| **Il 50% del beneficio viene dalla riduzione degli errori**, non dal tempo | E più tardi scopri l'errore, più costa | [Digital4 / Osservatorio Polimi](https://www.digital4.biz/procurement/strategie/ciclo-dell-ordine-in-digitale-tre-i-principali-benefici/) |
| **313 ore/anno** e **9.210 €** per impresa in adempimenti burocratici | Su campione di **oltre 1.000 imprese associate** | [CNA, Osservatorio Burocrazia 2025](https://www.cna.it/wp-content/uploads/2025/03/Osservatorio-Burocrazia-2025-integrale.pdf) |
| **238 ore/anno** per il titolare di una piccola impresa, **56 in più della media OCSE** | Quasi **6 settimane lavorative** | Confartigianato, via [Money.it](https://www.money.it/la-burocrazia-costa-alle-imprese-italiane-piu-delle-tasse-i-numeri-nascosti) |
| **Il 55% dello scambio documentale B2B avviene ancora via email/PEC**; EDI solo nel 25% delle PMI; **il 65% non ha nemmeno valutato l'alternativa** | La dimensione del mercato non-servito | [Osservatorio Digital B2b Polimi](https://www.osservatori.net/comunicato/digital-b2b/gestione-digitale-documenti-aziendali-mercato-b2b/) |

Bonus dalla Banca d'Italia, via Money.it: «**il 90% delle imprese italiane ha personale dedicato esclusivamente agli adempimenti amministrativi**; il **24% degli imprenditori dichiara di impiegare oltre il 10% del proprio personale** per gestire le pratiche». E Confartigianato: «**tre imprese italiane su quattro (74%) giudicano la complessità delle procedure amministrative un ostacolo grave**, 8 punti sopra la media europea; l'**80% segnala il continuo cambiamento delle leggi**, 16 punti sopra la media UE».

## 7.2 Le 5 citazioni verbatim più forti, in ordine di potenza

1. **«Spero di essere stato chiaro anche se capisco che non è facile da spiegare.»** — utente ForumExcel.it, dopo aver descritto 200 parole di copia-incolla tra tre fogli Excel per aggiornare un listino fornitore. *Il dolore di chi non ha nemmeno le parole per dire quanto è assurdo il proprio lavoro.*

2. **«Da questo punto in poi si perde la tracciabilità […] alcune volte si è incappati in consegne di ordini che sembravano complete mentre i pezzi dovevano subire altre lavorazioni.»** — DarkAngel, CAD3D.it, officina conto terzi, Reggio Emilia. *Zero risposte al thread.*

3. **«Passano venti minuti. Il cliente aspetta. Guarda l'orologio. E la fiducia che aveva in te, quella che si costruisce in anni, comincia a incrinarsi in venti minuti.»** — La Digital Motor Strategy, sul deposito pneumatici.

4. **«Rifiutarsi di servire i clienti, paralizzando la mobilità locale, oppure accumulare PFU oltre i limiti consentiti […] incappando in sanzioni ingiuste per colpe non loro.»** — Andrea Berni, presidente Autoriparatori CNA Pisa.

5. **«È che i loro strumenti non parlano tra loro. Il costo reale? Non è solo il tempo. È il costo delle decisioni prese in ritardo, con dati incompleti, su intuizioni invece che su numeri.»** — Alessandro D'Arco, Sales Manager TeamSystem. *Detta da chi vende gestionali, vale doppio.*

E la citazione che vi tiene onesti: **«Se un processo è rotto, automatizzarlo significa solo renderlo rotto più velocemente.»** — Federico Bocchini.

## 7.3 Il vocabolario, settore per settore (da tenere sotto mano mentre si scrive)

**Grossisti:** ciclo attivo/passivo · OC · BV · causale di magazzino · impegnato · ordinato · giacenza · disponibilità · evasione parziale · backorder · vuoti a rendere · DDT/bolla · fatturazione differita (TD24, entro il 15) · listino · scala sconti · sconti a scaglioni · prezzo netto · date di decorrenza · contratto quadro · fido · scadenzario · transcodifica · Metel 022 · METCOD · consegna in ribalta · RdA / RdO / ODA

**Edilizia:** commessa · cantiere · computo metrico estimativo · EPU · voci disaggregate · aliquote contrattuali · a misura / a corpo / in economia · giornale dei lavori · libretto delle misure · registro di contabilità · SAL (Standard/Variante) · SIL · RAL · certificato di pagamento · conto finale · DL · RUP · DDT fornitore · bolla di cantiere · riconciliazione · centro di costo · preventivato vs consuntivo · scostamento per voce · subappalto (20% PMI) · CEL · rapportino giornaliero · CILA · SCIA · SuperSCIA · PdC · asseverazione

**Officine c/terzi:** commessa (e commessa madre) · ciclo di lavorazione · distinta base / MBOM / distinta inversa · indice di modifica · conto lavoro · terzista · versamento di produzione · dichiarazione di fine fase · avanzamento operazioni · saturazione · carico macchine · capacità finita/infinita · MPS · MRP · CRP · OEE · fermo con causale · scarto · WIP · peso grezzo · costo/kg · sgrossatura / finitura · asportazione di truciolo (cm³/min) · attrezzare la m.u. · nesting · sviluppo lamiere · RENTRI · FIR / xFIR · meccatronica

**Manutenzione:** contratto di manutenzione (a servizio / a consumo) · manutenzione programmata / preventiva / straordinaria · **giro di manutenzione** (supervisore + tecnico + impianto) · scadenzario · rapportino d'intervento · firma cumulativa · ODL · ticket · impianto / asset · censimento impianti · libretto di impianto per la climatizzazione · RCEE / REE · DAM · bollino · catasto regionale (CURIT, CIT, SIERT, CRITER, CAITEL) · codice catastale impianto · terzo responsabile · Banca Dati FGAS (30 giorni) · attività ricorrenti · SLA · trasferta · rendicontazione ore

**Gommisti:** targa · telaio · dato tecnico da libretto · treno di gomme · cambio stagionale · inversione · calettamento · equilibratura · convergenza · ADAS · deposito / conto deposito / custodia stagionale · ubicazione / scaffale · etichetta di deposito (barcode/QR) · ricevuta di deposito · lista di picking · battistrada (1,6 mm) · cerchio in acciaio / in lega · M+S / 3PMSF · PFU · contributo ambientale PFU · masse di equilibratura · deposito temporaneo (90 giorni / 30 m³) · 15 ottobre – 15 novembre / 15 aprile

## 7.4 Tre raccomandazioni sul contenuto attuale del sito

Guardando `components/ProcessComparison.tsx`, l'esempio "richiesta di preventivo" attualmente elenca: apre email e allegati → cerca il listino del cliente → ricopia i campi nel gestionale → chiede i dati mancanti → scrive il preventivo.

1. **È accurato e realistico** — la sequenza corrisponde a quanto documentato. «Cerca il listino del cliente» è particolarmente giusto: il verbatim di ForumExcel conferma che il listino è un file separato, non un dato nel gestionale.

2. **Manca il passaggio che fa più male: la verifica della disponibilità.** Tutte le fonti sul ciclo attivo mettono il controllo giacenza/disponibilità *prima* della conferma, e i portali B2B lo vendono come funzione principale. Uno step tipo *«controlla se è disponibile o va ordinato»* renderebbe la sequenza più riconoscibile.

3. **Il beneficio più forte non è il tempo, è l'errore trovato tardi.** Il dato dell'Osservatorio Polimi (50% del beneficio viene dalla riduzione delle inesattezze, e il costo cresce quanto più tardi le scopri) suggerisce che il pannello "Dopo" potrebbe puntare non solo sulla velocità ma su *«il prezzo sbagliato lo vedi prima di mandare l'offerta, non in fattura»*.

---

## 8. Cosa NON ho trovato — trasparenza sui buchi

1. **Verbatim autentici di titolari di imprese edili e di aziende di manutenzione.** Zero. Le testimonianze reperite sono anonime su siti vendor. **Da colmare con telefonate.**
2. **Il dato GS1 Italy sui tempi di recall alimentare (24-72h → <4h)**: citato di seconda mano, fonte primaria non trovata. Da verificare su gs1it.org.
3. **Dati Federpneus aggiornati**: quelli reperibili sono 2022-2023.
4. **Ricerca "Aberdeen Group" su field service** (−20% costi, +25% produttività tecnici): citata su graffico.it, originale non rintracciato.
5. **Numeri specifici su volumi documentali per settore** (quante fatture/mese un grossista medio, quanti DDT un'impresa edile): non esistono statistiche pubbliche. Tutti i numeri circolanti sono claim vendor.
6. **Studi IDC/Gartner sul data entry manuale** (5% tasso di errore, 3% del fatturato): circolano da anni senza fonte primaria verificabile. Trattare come folklore.
7. **Forum di settore attivi.** CAD3D.it è vivo per la meccanica; ForumExcel.it dà spunti trasversali; ammirati.org e ilpuntomanutenzione.it esistono ma le discussioni utili sono vecchie o off-topic. **La conversazione reale delle PMI italiane oggi è nei gruppi Facebook e su WhatsApp — non indicizzabile.** Per avere verbatim freschi in volume, quella è la strada.
