# ACCELERIAMO

Sito Next.js, React e TypeScript per piccole aziende italiane.

## Avvio e verifiche

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
node --test tests/*.test.mjs
```

## Configurazione

Copia `.env.example` in `.env.local`. Le variabili pubbliche e i dati legali richiedono una nuova build.

- `ARUBA_USER`, `ARUBA_PASS`, `LEAD_DEST`: invio SMTP del modulo via Aruba (`smtps.aruba.it:465`). `ARUBA_USER` è la casella mittente, `LEAD_DEST` il destinatario fisso della richiesta. Non vengono pubblicati come recapiti. Senza configurazione il modulo risponde 503, senza dichiarare l’invio riuscito.
- Recapito pubblico: `info@acceleriamo.it`, in `lib/legal.ts`. Non è ricavato dalle credenziali SMTP.
- `LEGAL_BUSINESS_ADDRESS`: lasciato vuoto per indicazione del titolare; non compare alcun indirizzo o segnaposto. Questa omissione non equivale a completare i dati legali.
- `NEXT_PUBLIC_SITE_URL`: `https://acceleriamo.it`.
- `NEXT_PUBLIC_META_PIXEL_ID`: ID del Pixel Meta. Se manca, nessuno script Meta o banner viene caricato.
- `META_CONVERSIONS_ACCESS_TOKEN`: token segreto esclusivamente server per l’API Conversioni.
- `META_GRAPH_API_VERSION`: versione Graph supportata dall’account Meta, nel formato `vXX.X`. Se manca, l’API Conversioni resta spenta.
- `META_TEST_EVENT_CODE`: facoltativo, solo per Gestione eventi; rimuoverlo per il traffico reale.

WhatsApp: **+39 339 179 7616**, configurato in `lib/contact.ts`, con messaggio precompilato. Il caso immobiliare è autorizzato e resta anonimo.

## Settori e campagne

Gli annunci possono preselezionare la scheda tramite `?settore=officine` (supportati anche `sector` e `utm_term` con lo stesso valore). Gli slug disponibili sono in `lib/sectors.ts`:

`ingrosso`, `impianti-e-manutenzioni`, `officine`, `agenzie-immobiliari`, `agenti-di-commercio`, `servizi-su-appuntamento`.

Esempio: `/?settore=officine&utm_source=instagram&utm_medium=paid_social&utm_campaign=officine&utm_content=video-1`.

Le sei variabili UTM standard presenti nell’URL e il settore vengono inclusi nella mail del contatto. Non sono salvati in cookie o nello storage del browser. Gli URL di annuncio devono usare slug e codici di campagna senza dati personali.

## Modulo e tracciamento

Nome, azienda, telefono e attività sono obbligatori; email e dettagli sono facoltativi. Non ci sono caselle di accettazione. La versione dell’informativa resta nel campo nascosto e nell’email. Aggiornare `LEGAL_VERSION` e `LEGAL_DATE` in `lib/legal.ts` quando cambiano i documenti.

Il server genera un ID e restituisce `accepted: true` solo dopo la conferma SMTP. Honeypot, errori di validazione, SMTP assente o fallito non generano conversioni. Il browser impedisce doppi clic durante l’invio. Pixel e API Conversioni condividono `eventID` / `event_id` per la deduplicazione del medesimo Lead; non si tratta di una deduplicazione di richieste separate o retry HTTP.

Meta viene attivato solo dopo consenso separato. Rifiuto e revoca sono disponibili nel banner e nelle preferenze del footer. L’API Conversioni richiede sia la scelta salvata nel cookie sia il consenso nella richiesta; i recapiti sono sottoposti ad hash. Un guasto Meta non cambia l’esito di una richiesta già ricevuta. Vercel Web Analytics resta dichiarato in cookie e privacy policy.

`WhatsAppClick` è un evento personalizzato per tutti i collegamenti WhatsApp, con la posizione del link. Misura il clic, non l’effettivo invio di un messaggio.

Per attivare le campagne serve ancora configurare l’account reale: in **Gestione eventi → Impostazioni**, disabilitare il tracciamento automatico degli eventi senza codice e rimuovere eventuali vecchie regole dell’Event Setup Tool. Il codice imposta già `autoConfig: false`. Verificare in Test Events rifiuto, consenso, un Lead dopo ricezione e deduplicazione browser/server. Queste operazioni sull’account non sono state effettuate senza ID/accesso.

Le verifiche automatiche usano SMTP e Meta simulati; non inviano email o conversioni reali.

## Dati legali

Le pagine `/privacy-policy`, `/cookie-policy`, `/termini-e-condizioni` descrivono l’implementazione corrente. Il footer identifica Diego Simoncini e P.IVA 02524780505. Indirizzo omesso su istruzione; email pubblica `info@acceleriamo.it`. Restano da applicare nella gestione reale della posta il termine di conservazione di 12 mesi per le richieste senza incarico e le procedure per i diritti degli interessati: il sito non automatizza la cancellazione delle email.

Riferimenti: [Vercel Web Analytics](https://vercel.com/docs/analytics/privacy-policy), [Garante: cookie](https://www.garanteprivacy.it/faq/cookie), [Meta: deduplicazione](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events/).
