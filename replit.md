# Maylea Logistics & Transport — Documenti di Trasporto

Applicazione web per la gestione dei Documenti di Trasporto (DDT) di Maylea Logistics & Transport (C.T.D. SRL).

## Funzionalità principali

- Compilazione DDT con dati mittente, destinatario, contenuto, peso, prezzo
- Stampa su singola pagina A4 con copia azienda e copia cliente
- Profili mittenti e destinatari riutilizzabili
- Archivio documenti con cancellazione automatica dopo 30 giorni
- Dashboard statistiche (peso e ricavi) con grafici
- Validazione indirizzi tramite Google Maps (con fallback)

## Stack tecnologico

- **Frontend**: React 18 + Vite + TypeScript, TailwindCSS + shadcn/ui, wouter, TanStack Query, react-hook-form
- **Backend**: Express + TypeScript
- **Database**: PostgreSQL via Drizzle ORM (`postgres-js` driver)
- **Schema condiviso**: `shared/schema.ts`

## Struttura del progetto

```
client/        # React frontend (Vite)
server/        # Express backend
  index.ts     # Entry point per Replit / sviluppo (server long-running)
  routes.ts    # API routes + scheduler cleanup
  storage.ts   # Operazioni CRUD su Drizzle
  db.ts        # Connessione Postgres
api/           # Entry point serverless per Vercel
shared/        # Schemi e tipi condivisi
attached_assets/ # Loghi e immagini referenziati con @assets/...
```

## Sviluppo locale (Replit)

```bash
npm run dev     # avvia server Express + Vite su porta 5000
npm run db:push # applica schema Drizzle al database
```

Il workflow `Start application` esegue `npm run dev`.

## Variabili d'ambiente

| Nome | Obbligatoria | Descrizione |
|------|--------------|-------------|
| `DATABASE_URL` | Sì | Connection string Postgres (Neon, Supabase, ecc.) |
| `GOOGLE_MAPS_API_KEY` | No | Chiave Google Maps per validazione indirizzi |
| `CRON_SECRET` | No | Se impostata, protegge `/api/cron/cleanup` con `Authorization: Bearer <secret>` |
| `STRIPE_SECRET_KEY` | No | Stripe (se attivato) |
| `VITE_STRIPE_PUBLIC_KEY` | No | Stripe lato client (se attivato) |

## Deploy

### Replit (consigliato)
Pubblica direttamente con il pulsante Deploy: nessuna configurazione aggiuntiva.

### Vercel

Il progetto è già configurato per Vercel:

- `vercel.json` — definisce build, routing e cron job
- `api/index.ts` — handler serverless che monta l'app Express
- `server/routes.ts` — disabilita il `setInterval` di cleanup quando rileva l'ambiente serverless e espone l'endpoint `/api/cron/cleanup`

#### Passi per il deploy su Vercel

1. Crea un progetto Vercel collegato al repo
2. Vercel rileverà automaticamente `vercel.json` (Build command: `vite build`, Output directory: `dist/public`)
3. Aggiungi le variabili d'ambiente nel pannello Vercel:
   - `DATABASE_URL` (Postgres pubblicamente accessibile, es. Neon)
   - `GOOGLE_MAPS_API_KEY` (opzionale)
   - `CRON_SECRET` (opzionale, raccomandato per proteggere il cron)
4. Premi Deploy

#### Cron pulizia documenti scaduti

`vercel.json` registra un cron giornaliero alle 03:00 UTC che chiama `/api/cron/cleanup`. La pulizia rimuove i documenti più vecchi di 30 giorni. Funziona solo sui piani Vercel che supportano i Cron Jobs.

#### Limitazioni Vercel da conoscere

- Le funzioni serverless hanno timeout (30s nel piano Pro, 10s nel piano Hobby)
- Nessun processo persistente: il cleanup automatico passa dal cron, non più da `setInterval`
- Cold start sulla prima richiesta dopo periodi di inattività
- Il database deve essere accessibile via Internet (Replit Postgres interno non è raggiungibile da Vercel — usa Neon o un altro provider esterno)

## Decisioni architetturali rilevanti

- **Two-copy A4 layout** in `client/src/components/FormPreview.tsx`
- **Auto-eliminazione documenti**: campo `expiresAt` calcolato in `server/storage.ts`, eliminazione tramite `deleteExpiredDocuments`
- **Validazione indirizzi**: `server/googleMapsService.ts` con fallback in `client/src/components/AddressAutocomplete.tsx` quando l'API risponde 403
- **UI in italiano**: "Mittenti", "Destinatari", "Copia Azienda", "Copia Cliente"
- **Intestazione documenti**: MAYLEA – Logistics & Transport / C.T.D. SRL / Via Gonzaga 105 – Rosolini, Tel: 09311666849 / whatsapp: 331 3896381 - www.maylealogistics.it
