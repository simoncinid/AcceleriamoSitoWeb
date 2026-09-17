# AI WorkMap — implementazione e attivazione

## Stato

Verticale implementata nel repository, senza pubblicazione. I servizi esterni richiedono credenziali e configurazione reali. Nessuna risposta AI fittizia, simulazione di pagamento o falso successo SMTP nel codice applicativo. Le simulazioni si trovano esclusivamente in `tests/`.

## Analisi del repository e scelte

Next.js 16.3.4 App Router, React 19, TypeScript 6. Riutilizzati Header, Footer, Brand, Icons, JsonLd, font Degular e Inter, variabili CSS, pulsanti e convenzioni responsive. Hosting previsto: Vercel. SMTP: Aruba/Nodemailer. Analytics: Vercel e Meta con consenso. Non esistevano database, autenticazione, admin, pagamenti o servizi AI.

Nuove dipendenze runtime: Zod (schema/output strutturati) e PDFKit (PDF selezionabile senza installare un browser in produzione). Playwright è soltanto una dipendenza di sviluppo. Nessuna dashboard, account complesso, coda esterna o abbonamento.

Persistenza Redis REST/Upstash in produzione (piano free, creato da Vercel Storage). File JSON con scrittura atomica e controllo versione solo per sviluppo o hosting con volume persistente esplicitamente autorizzato. Il filesystem effimero di Vercel è rifiutato. Non sono necessarie migrazioni SQL: ogni conversazione è un aggregato versionato.

La generazione è a checkpoint: ogni richiesta `generate` esegue un passo AI. La pagina aperta avanza da sola i passi successivi. Su Vercel, se il cliente chiude la scheda, il worker riprende lo stesso checkpoint (`after()` verso `/api/workmap/worker`). Un Cron giornaliero in `vercel.json` raccoglie job o email fermi. Non si usa QStash.

Il contenuto validato alimenta sia la pagina HTML privata sia il renderer PDF nativo. Scelta deliberata rispetto a HTML→Chromium→PDF: evita un browser nel runtime Vercel, mantiene testo selezionabile e impaginazione dedicata. Non viene esportato direttamente il testo della chat.

## Route

- `/ai-workmap`: landing statica e metadata, canonical, OpenGraph, Product senza recensioni o offerte fittizie.
- `/ai-workmap/analisi`: chat e risultato privato, noindex.
- `/ai-workmap/risultato`: accesso alla stessa esperienza privata, noindex.
- `/ai-workmap/condizioni`: caratteristiche, condizioni e trattamento dati specifici.
- `/api/workmap/[action]`: start, session, resume, answer, qualify, confirm, edit, checkout, payment, generate, email, consent, pdf.
- `/api/workmap/webhook`: webhook Stripe con firma verificata sul body grezzo.
- `/api/workmap/worker`: prosecuzione job ed email, protetto da `CRON_SECRET` (GET per il Cron Vercel, POST per i passi successivi).

## File e componenti

- `app/ai-workmap/`: landing, layout/CSS, pagine conversazione, risultato e condizioni.
- `components/workmap/Chat.tsx`: conversazione, risposte multiple/testo, riepilogo modificabile, anteprima, paywall, avanzamento e retry.
- `components/workmap/Result.tsx`: dieci sezioni del documento, istruzioni copiabili, download.
- `components/workmap/CTA.tsx`, `tracking.ts`: CTA e whitelist eventi.
- `lib/workmap/schema.ts`: contratti e validazione Zod.
- `lib/workmap/conversation.ts`: scelta deterministica dei campi mancanti, personalizzazione delle domande, un solo follow-up libero.
- `lib/workmap/prompts/index.ts`: 11 prompt con id/versione/scopo/data.
- `lib/workmap/catalog.ts`: 26 workflow curati nelle 24 macrofamiglie richieste, più circolari e schede immobili.
- `lib/workmap/ai.ts`: adapter HTTP OpenAI-compatible, structured outputs strict, timeout, validazione e gestione rifiuti.
- `lib/workmap/store.ts`: token, CAS, lease, rate limit e rimozione lead scaduti.
- `lib/workmap/jobs.ts`: avanzamento senza coda esterna, Cron e retry.
- `lib/workmap/payments.ts`, `email.ts`, `meta.ts`: adapter dei servizi.
- `lib/workmap/pipeline.ts`, `pdf.ts`, `service.ts`: job riprendibili, rendering e accesso privato.
- `tests/workmap.test.mjs`: integrazione API con servizi simulati; `tests/browser/`: prove sul browser reale.

`next.config.ts` include esplicitamente i font e le metriche PDF nei bundle server Vercel.

File esistenti aggiornati: header (CTA dedicata), footer (collegamento alla verticale), sitemap tramite `lib/site.ts`, robots, privacy/cookie/termini e versione legale, preferenze Meta, package e lockfile, `.env.example`, `.gitignore`, README. Nessuna modifica alle funzionalità del modulo contatti.

## Dati

`Session` contiene gli equivalenti di Lead, Conversation, Message e Profile, più Order/Payment, WorkflowInstance, WorkMap, GenerationJob e contatore Download:

- ID casuale derivato con SHA-256 da un token a 256 bit, versione e timestamp;
- profilo validato, messaggi necessari alla conversazione, domande già risposte;
- email, stato funnel, opportunità, versione informativa;
- ordine con ID idempotente, amount/currency, sessione Stripe, riferimento pagamento, data conferma e accettazione condizioni;
- job con fase, cursore, errori e tentativi; bozze e documento validato, PDF;
- email inviate/errori, consenso e identificatori Meta solo quando autorizzati.

Stati: lead → qualified → checkout_started → paid → profile_complete → generating → reviewing → ready. `failed` conserva fase e risultati già completati. Fino a cinque retry espliciti; poi assistenza.

Redis: `workmap:<id>`, lease `wm:lease:<id>`, rate counters `wm:rate:<digest>`, canale `workmap:events:<id>`. Le scritture Lua applicano CAS atomico. I lease impediscono chiamate AI concorrenti per lo stesso job; la versione protegge dalle risposte tardive. I token non compaiono negli URL server: i link email usano un fragment, subito rimosso dopo la lettura.

## AI e qualità

Il provider predefinito è l’endpoint OpenAI, ma non viene imposto un modello. Impostare un modello disponibile nel proprio account che supporti JSON Schema strict. È possibile sostituire endpoint e chiave con un provider compatibile. `temperature` viene inviata solo se esplicitamente supportata dal modello.

Prompt: conversation-system, profile-extractor, followup-decider, next-question, task-analyzer, workflow-selector, workflow-personalizer, prompt-generator, assistant-generator, plan-generator, quality-reviewer.

Pipeline: analisi attività → selezione catalogo → un workflow per step → assistenti → piano → seconda revisione AI e controlli strutturali → PDF. Ogni step è persistito. Errori JSON, timeout e PDF non pubblicano un documento incompleto. Nessun fallback a contenuti precompilati spacciati per personalizzazione. I test con stub verificano orchestration e contratti; la qualità semantica del modello reale richiede una prova con le credenziali finali.

## Pagamento

Prezzo unico in `lib/workmap/config.ts`: 4700 centesimi EUR, IVA inclusa. Stripe Checkout in modalità `payment`, mai subscription. Prezzo deciso dal server. Conferma da webhook o recupero server-side della sessione: verifica paid, mode, ordine, cliente tecnico, currency e amount_total. Il redirect non vale come prova d’acquisto. Firma HMAC con tolleranza 5 minuti. Ordine salvato prima della richiesta; chiave idempotente stabile. Callback duplicati non riaprono la chat né duplicano l’ordine.

`tax_behavior=inclusive` descrive il prezzo: non implementa da solo registrazioni fiscali, calcolo imposte o fatturazione. Configurare gli adempimenti effettivi dell’attività nel proprio account Stripe e nel processo amministrativo prima dell’attivazione. Nessun order bump attivo; eventuali nuovi prodotti vanno aggiunti alla configurazione server, non ai parametri browser.

## Email e recupero

SMTP Aruba già presente. Tre email di servizio: analisi salvata, acquisto confermato, documento pronto. Nessuna campagna marketing. Messaggi con Message-ID stabile e stato persistente; retry tramite UI o worker. Come ogni invio SMTP, un arresto fra consegna al provider e salvataggio può produrre un duplicato: il Message-ID aiuta ma non garantisce exactly-once.

I collegamenti privati sono bearer link firmati HMAC: chi li possiede può accedere al risultato. Non condividerli. La rotazione del segreto invalida tutti i link precedenti. L’email è un recapito fornito dal cliente, non un’identità verificata. Nessun testo di chat viene trasmesso nelle email.

## Tracking e privacy

Eventi richiesti collegati ai passaggi reali; PageView resta gestito dalle integrazioni del sito. Purchase ha ID stabile condiviso fra browser e server per deduplicazione. Meta riceve soltanto conteggio workflow, prezzo e valuta, oltre agli identificatori consentiti. Non vengono inviate professioni libere, nome, email, descrizioni, chat o azienda. Purchase server-side viene ritentato dal worker solo se esistono consenso registrato e identificatori Meta. La revoca sul sito aggiorna anche la sessione WorkMap.

Il cookie HttpOnly/SameSite è tecnico. API e PDF usano no-store; chat/risultato sono noindex con referrer no-referrer. Rate limit sul numero di sessioni e risposte. Origine richiesta verificata per le mutazioni browser. Generazione, output e PDF sono protetti dal pagamento persistito.

Il worker e la scadenza Redis eliminano i lead non acquistati dopo 30 giorni dalla creazione. Prima di vendere, verificare i documenti legali effettivi, indicare provider/ruoli/trasferimenti e definire la gestione dei dati acquistati, dei diritti e degli obblighi fiscali. Le condizioni non includono una rinuncia automatica al recesso né una garanzia commerciale inventata.

## Configurazione manuale necessaria

1. Configurare `WORKMAP_AI_API_KEY`, `WORKMAP_AI_MODEL`, eventuale `WORKMAP_AI_BASE_URL`, `WORKMAP_AI_PROVIDER_NAME` e supporto temperature. Non mettere segreti in variabili `NEXT_PUBLIC_*`.
2. In Vercel: Storage → Create Database → Upstash Redis (piano free) e collegarlo al progetto. Lasciare vuoto `WORKMAP_REDIS_URL` se è un valore `rediss://…`. Usare `STORAGE_KV_REST_API_URL` (`https://…`) e `STORAGE_KV_REST_API_TOKEN` (non il read-only, non `STORAGE_REDIS_URL`). Regione UE se disponibile.
3. Generare `WORKMAP_ACCESS_SECRET` e `CRON_SECRET` con almeno 32 caratteri casuali; conservarli stabilmente. Il cron giornaliero è già in `vercel.json`.
4. Configurare Stripe secret e webhook secret. Endpoint: `/api/workmap/webhook`. Eventi: `checkout.session.completed`, `checkout.session.async_payment_succeeded`. Configurare URL termini e privacy nelle impostazioni Checkout, dati venditore, imposte e flusso amministrativo.
5. Configurare Aruba con `ARUBA_USER`, `ARUBA_PASS`. Riusa le credenziali del sito, non `LEAD_DEST` (che resta il destinatario del modulo contatti).
6. Configurare `NEXT_PUBLIC_SITE_URL` con l’origine effettiva del deployment.
7. Verificare condizioni commerciali/privacy specifiche e provider reali, poi impostare `WORKMAP_SALES_ENABLED=true`. L’acquisto richiede anche AI, SMTP e segreto di recupero configurati.
8. Eseguire un acquisto Stripe **test** e una generazione reale completa; verificare le tre email, il recupero su un altro dispositivo e i Test Events Meta. Solo dopo usare credenziali live.

Per sviluppo senza Redis: file in `.workmap-data` ignorati da Git. Per un `next start` locale esplicito: `WORKMAP_ALLOW_LOCAL_STORE=true`, directory dedicata. Non impostare questo flag su Vercel. `WORKMAP_TEST_LOCAL_AI=true` serve esclusivamente al server locale di Playwright e non deve essere presente nel deployment.

## Verifiche riproducibili

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Playwright usa Google Chrome installato e due server locali dedicati (porte 3100/4101). I test browser non usano servizi esterni. Il PDF e gli screenshot di QA finiscono in `artifacts/workmap/` (ignorati da Git).

Riferimenti ufficiali usati per le integrazioni: [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [Stripe Checkout](https://docs.stripe.com/api/checkout/sessions/create), [firma webhook Stripe](https://docs.stripe.com/webhooks/signature), [Redis REST](https://upstash.com/docs/redis/features/restapi), [Vercel Cron](https://vercel.com/docs/cron-jobs).
