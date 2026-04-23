# Lista Nascita di Marco 🍼

Mini web app React per la lista regali di Marco. Link pubblico, nessun login: i parenti aprono la pagina, scelgono un regalo e scrivono il loro nome — che viene salvato direttamente su Airtable.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS
- Airtable come backend (REST API lato client, nessun server)

## Setup

1. Installa le dipendenze:

   ```bash
   npm install
   ```

2. Crea un **Personal Access Token** su Airtable con gli scope:
   - `data.records:read`
   - `data.records:write`

   limitato alla base `appOT5B0zbZaCEQRZ`.

3. Copia `.env.example` in `.env` e incolla il token:

   ```bash
   cp .env.example .env
   ```

   ```env
   VITE_AIRTABLE_TOKEN=pat_xxx
   VITE_AIRTABLE_BASE_ID=appOT5B0zbZaCEQRZ
   VITE_AIRTABLE_TABLE=Regali
   ```

   `.env` è già nel `.gitignore` — non verrà mai committato.

4. Avvia il dev server:

   ```bash
   npm run dev
   ```

## Schema Airtable — tabella `Regali`

| Campo      | Tipo             | Note                                       |
| ---------- | ---------------- | ------------------------------------------ |
| Nome       | singleLineText   | Nome del regalo                            |
| Dettaglio  | singleLineText   | Specifiche (colore, modello, ecc.)         |
| Note       | singleLineText   | Note libere                                |
| Priorità   | checkbox         | Regali importanti → badge speciale         |
| Preso da   | singleLineText   | Vuoto = disponibile · compilato = scelto   |

## Funzionalità

- Lista dei regali disponibili + sezione separata per quelli già scelti (barrati, opacità ridotta).
- Clic su un regalo → modal con input nome → `PATCH` su Airtable.
- Badge speciale per regali con `Priorità = true`.
- Counter in alto con i regali ancora disponibili.
- **Admin mode nascosto:** 5 clic sul titolo "Marco" entro 2.5 secondi sblocca il pulsante "Libera regalo" sui regali già scelti.
- Responsive mobile-first.
- Debounce sulle ricariche per essere gentili con il rate limit Airtable.

## Build

```bash
npm run build
npm run preview
```

## Deploy

Qualsiasi host statico funziona (Vercel, Netlify, GitHub Pages). Su Vercel basta importare il repo e aggiungere le variabili `VITE_AIRTABLE_TOKEN`, `VITE_AIRTABLE_BASE_ID`, `VITE_AIRTABLE_TABLE`.

> ⚠️ Il token Airtable viene bundlato nel JS del client: chiunque ispezioni la pagina può leggerlo. Usa un token con scope **limitati alla sola tabella `Regali`** della base.
