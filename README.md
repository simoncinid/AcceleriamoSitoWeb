# ACCELERIAMO

Sito corporate di ACCELERIAMO, realizzato con Next.js, React e TypeScript.

## Avvio locale

```bash
npm install
npm run dev
```

Il sito è disponibile su `http://localhost:3000`.

## Verifiche

```bash
npm run typecheck
npm run lint
npm run build
node --test tests/contact-route.test.mjs
```

## Configurazione

Copia `.env.example` in `.env.local` e valorizza:

- `GMAIL_FROM_ADDRESS`, `GMAIL_TO_ADDRESS`, `GMAIL_APP_PASSWORD`: credenziali SMTP e casella destinataria del modulo. Non sono recapiti pubblicati automaticamente.
- `LEGAL_BUSINESS_ADDRESS`: indirizzo completo della sede da pubblicare.
- `LEGAL_CONTACT_EMAIL`: email pubblica per contatti e diritti privacy.
- `NEXT_PUBLIC_SITE_URL`: dominio pubblico, se diverso da `https://acceleriamo.it`.

Le variabili legali devono essere presenti al momento della build. Se mancano, le pagine legali mostrano esplicitamente che i recapiti sono da completare.

## Privacy e condizioni

Pagine: `/privacy-policy`, `/cookie-policy`, `/termini-e-condizioni`. Il footer riporta Diego Simoncini, P. IVA 02524780505. Il modulo richiede due caselle non preselezionate (presa visione privacy e accettazione termini), controllate anche dal server. Non è richiesto consenso marketing. Nell’email vengono registrate le dichiarazioni, la versione dei documenti e la data UTC del server, senza raccogliere IP a tale scopo. Nessun database applicativo aggiunto.

Prima della pubblicazione, completare i recapiti e verificare con il titolare:

- Hosting effettivo (Vercel è citato nella configurazione SMTP ma non verificato), eventuali CDN/protezioni e cookie introdotti dalla piattaforma. Il codice non integra analytics o tracciamento. Eseguire una verifica del dominio di produzione, completando la Cookie Policy con nomi, finalità e durata degli eventuali cookie tecnici. Per strumenti non necessari occorre blocco preventivo e gestione di accettazione, rifiuto e revoca.
- Tipo di account Google utilizzato, fornitori effettivi, accordi art. 28 GDPR, localizzazione, subfornitori e garanzie reali per trasferimenti extra SEE. Completare la sezione 7 della Privacy Policy con le informazioni verificate: il testo non certifica accordi o trasferimenti non verificati.
- Applicazione del termine di 12 mesi dall’ultimo scambio per richieste senza incarico: impostare una revisione periodica e cancellare anche copie inviate e duplicati. Il codice invia email, non automatizza la cancellazione nelle caselle. Documentare tempi effettivi dei log e dei backup e aggiornare l’informativa.
- Eventuali ulteriori dati obbligatori applicabili all’attività: registro imprese/REA o albo, se pertinente. Non sono stati inventati.
- Gestione concreta dei diritti, accessi alla posta, sicurezza e cancellazione. Per incarichi a pagamento predisporre accordi e informative specifici: questi termini coprono il sito e la consulenza iniziale gratuita.

Le pagine sono una base riferita all’implementazione corrente; la conformità richiede anche le verifiche e le procedure sopra indicate. Nessun deploy è incluso nella modifica.

Per modificare le dichiarazioni o i documenti aggiornare `LEGAL_VERSION` in `lib/legal.ts`, la data visualizzata e conservare in Git le versioni precedenti. Le richieste con versione obsoleta sono rifiutate per consentire la nuova lettura.

Fonti: [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=it), [Garante: cookie](https://www.garanteprivacy.it/faq/cookie), [D.lgs. 70/2003](https://www.normattiva.it/atto/caricaDettaglioAtto?atto.codiceRedazionale=003G0090&atto.dataPubblicazioneGazzetta=2003-04-14).
