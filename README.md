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
```

## Configurazione

Copia `.env.example` in `.env.local` e valorizza:

- `CONTACT_WEBHOOK_URL`: endpoint HTTPS che riceve il payload JSON del form.
- `NEXT_PUBLIC_SITE_URL`: dominio pubblico, se diverso da `https://acceleriamo.it`.

Prima della pubblicazione vanno inoltre sostituiti i placeholder espliciti nel footer (dati societari, LinkedIn, privacy e cookie).
