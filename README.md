# TinDoog 🐕

> **Progetto personale realizzato per imparare e consolidare lo stack Next.js, NextAuth.js, Prisma, TailwindCSS e le best practice di sviluppo web moderno.**
>
> L'app è stata sviluppata come portfolio da mostrare su LinkedIn per dimostrare le mie competenze fullstack.

Un'app di incontri per cani costruita con Next.js, NextAuth.js, Prisma e SQLite.

## 🚀 Setup del progetto

### Prerequisiti

- Node.js 18+ (TypeScript richiede almeno Node 14, ma consigliato 18+)
- npm o yarn

### 1. Installa le dipendenze

```bash
npm install
```

### 2. Configura le variabili d'ambiente

```bash
# Copia il template delle variabili d'ambiente
cp .env.example .env

# Modifica .env con le tue chiavi API
```

### 3. Configura il database

```bash
# Genera il client Prisma
npx prisma generate

# Sincronizza il database
npx prisma db push
```

### 4. Ottieni le API Keys

#### Resend (per invio email OTP)

1. Vai su [resend.com](https://resend.com)
2. Crea un account gratuito
3. Ottieni la tua API Key
4. Aggiungi la chiave al file `.env`:
   ```
   RESEND_API_KEY=re_your_api_key_here
   ```

### 5. Avvia il server di sviluppo

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

### Comandi disponibili

```bash
# Controllo errori TypeScript (senza build)
npx tsc --noEmit

# Build di produzione
npm run build

# Lint del codice
npm run lint
```

## 🔧 Tech Stack

- **Linguaggio**: TypeScript 5.x per type-safety end-to-end
- **Frontend**: Next.js 15 (App Router), React 19, TailwindCSS 4
- **Backend**: Next.js API Routes (TypeScript)
- **Database**: SQLite con Prisma ORM 6.x
- **Autenticazione**: NextAuth.js 4.x con Credentials Provider
- **Email**: Resend per invio OTP
- **Gestione immagini**: Upload immagini profilo, salvataggio su S3 (se configurato)
- **Sistema Match**: logica di matching tra utenti
- **Styling**: TailwindCSS

## 📱 Funzionalità

- ✅ Registrazione utente con verifica email OTP
- ✅ Login/Logout con sessioni sicure
- ✅ Dashboard protetta
- ✅ Validazione email esistente
- ✅ Sistema di matching tra utenti
- ✅ Caricamento e gestione immagini profilo

## 🎯 Cosa ho imparato

- Progettare e sviluppare un'app fullstack moderna con Next.js 15 e TypeScript
- Type-safe session management con NextAuth.js e TypeScript type augmentation
- Gestire autenticazione sicura con NextAuth.js e JWT
- Implementare un sistema di verifica email OTP
- Gestire upload e salvataggio immagini (S3 ready)
- Creare un sistema di matching tra utenti
- Utilizzare Prisma ORM con type-safety e gestire migrazioni database
- Applicare best practice di sicurezza (hash password, validazione input, protezione route)
- Deploy su Vercel e gestione variabili ambiente

---

## � Struttura del Progetto

```
src/
├── app/                 # Next.js App Router
│   ├── (auth)/         # Layout group per pagine di auth
│   ├── (authenticated)/ # Layout group per pagine protette
│   ├── api/            # Route handlers (TypeScript)
│   └── ...
├── components/         # React components (TypeScript)
│   ├── registration/   # Componenti wizard registrazione
│   ├── matching/       # Componenti matching
│   └── ...
├── lib/                # Utility e config (TypeScript)
│   ├── prisma.ts       # Prisma client singleton
│   ├── aws.ts          # AWS S3 config
│   └── ...
├── services/           # Business logic (TypeScript)
│   └── matching.ts     # Logica matching
├── types/              # Type definitions
│   └── next-auth.d.ts  # NextAuth type augmentation
└── prisma/             # Database schema e migrations
```

## 🔐 NextAuth Configuration

Il progetto usa strategie JWT e callbacks tipizzati con TypeScript:

- `next-auth.d.ts` estende i tipi di sessione per includere `user.id`
- Callbacks JWT e session mantengono il `id` dell'utente attraverso tutta l'app
- Credenziali provider custom per autenticazione email/password

## �🛡️ Sicurezza

- Password hashate con bcrypt
- OTP con scadenza (5 minuti)
- Sessioni JWT sicure
- Validazione input lato client e server
- Protezione route autenticate

## 📧 Sistema OTP

Il sistema di verifica email utilizza:

- Codici OTP di 6 cifre
- Scadenza automatica dopo 5 minuti
- Template email personalizzato
- Possibilità di reinvio codice
