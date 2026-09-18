# AI WorkMap — analisi gratuita e PDF via email

AI WorkMap offre gratuitamente la conversazione, l’analisi completa e il documento personalizzato: 10–15 workflow, prompt, tre assistenti e un piano di 30 giorni.

## Flusso

La conversazione iniziale raccoglie ruolo e attività. L’utente indica l’email, verifica il riepilogo e vede le opportunità. Il pulsante «Completa la mia analisi gratuita» apre una nuova conversazione pulita con le ultime domande; al termine la generazione parte automaticamente. Una sola email viene inviata quando il documento è pronto, con il PDF completo allegato.

Stati: `lead → qualified → details → profile_complete → generating → reviewing → ready`. Lo stato `failed` conserva il checkpoint per riprovare. Le sessioni e i documenti scadono dopo 30 giorni dalla creazione; il PDF ricevuto resta all’utente.

## Implementazione

- Next.js App Router, React, TypeScript e Zod.
- `lib/workmap/conversation.ts`: conversazione iniziale e approfondimento.
- `lib/workmap/pipeline.ts`: analisi, selezione workflow, personalizzazione, assistenti, piano, revisione e PDF.
- `lib/workmap/pdf.ts`: renderer PDFKit, testo selezionabile.
- `lib/workmap/email.ts`: SMTP Aruba, unica email finale con allegato `AI-WorkMap.pdf` e collegamento personale di recupero.
- `lib/workmap/jobs.ts`: worker e recupero dei job/email interrotti.
- `lib/workmap/store.ts`: Redis REST in produzione; file locali solo in sviluppo, CAS e lease per evitare lavorazioni concorrenti.
- `components/workmap/`: chat, anteprima, risultato, download e metriche aggregate.

API `/api/workmap/[action]`: `start`, `reset`, `session`, `resume`, `answer`, `qualify`, `confirm`, `edit`, `complete`, `generate`, `email`, `consent`, `pdf`. Il worker `/api/workmap/worker` richiede `CRON_SECRET`.

La generazione prosegue per checkpoint anche a pagina chiusa: ogni avvio accoda un worker server-side (`kickGeneration`) che esegue più step fino al timeout e si riaccoda da solo; il cron giornaliero (piano Hobby Vercel) riprende job ed email ancora pendenti se la catena si interrompe. In produzione servono `CRON_SECRET` e `VERCEL_URL`. Nessun documento incompleto viene pubblicato. Gli invii registrati non vengono ripetuti; un arresto tra invio SMTP e salvataggio può comunque produrre un duplicato.

## Configurazione

1. Configurare `WORKMAP_AI_API_KEY`, `WORKMAP_AI_MODEL`, provider ed eventuale endpoint compatibile con JSON Schema.
2. Collegare Redis REST/Upstash tramite Vercel Storage, con URL HTTPS e token di scrittura.
3. Configurare `WORKMAP_ACCESS_SECRET` e `CRON_SECRET` con almeno 32 caratteri casuali.
4. Configurare `ARUBA_USER`, `ARUBA_PASS` e `NEXT_PUBLIC_SITE_URL`.
5. Verificare una generazione reale, ricezione del PDF allegato e recupero su un altro dispositivo.

Per sviluppo locale: `.workmap-data`, oppure `WORKMAP_DATA_DIR`. Per `next start` locale è necessario `WORKMAP_ALLOW_LOCAL_STORE=true`; non usarlo su Vercel. `WORKMAP_TEST_LOCAL_AI=true` è riservato ai test browser.

## Accesso e privacy

Cookie HttpOnly/SameSite, link personali HMAC, API/PDF con `no-store`, pagine private `noindex`, controllo origine e rate limit. L’email non è inviata al modello. Le metriche escludono chat, professione libera e dati personali; Meta segue il consenso. I link email consentono accesso privato e non vanno condivisi.

## Verifiche

`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e`.

I test API simulano AI e SMTP e verificano l’intero flusso gratuito, il PDF allegato, deduplicazione, retry e accesso privato. Playwright usa Chrome e un provider locale sulle porte 3100/4101. Gli artefatti QA sono in `artifacts/workmap/`, ignorati da Git.
