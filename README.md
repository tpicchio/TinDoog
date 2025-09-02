
# TinDoog 🐕💜

> **Progetto personale realizzato per imparare e consolidare lo stack Next.js, NextAuth.js, Prisma, TailwindCSS e le best practice di sviluppo web moderno.**
>
> L'app è stata sviluppata come portfolio da mostrare su LinkedIn per dimostrare le mie competenze fullstack.

Un'app di incontri per cani costruita con Next.js, NextAuth.js, Prisma e SQLite.

## 🚀 Setup del progetto

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


## 🔧 Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: SQLite con Prisma ORM
- **Autenticazione**: NextAuth.js con Credentials Provider
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
- ✅ Design responsive con tema viola
## 🎯 Cosa ho imparato

- Progettare e sviluppare un'app fullstack moderna con Next.js 15
- Gestire autenticazione sicura con NextAuth.js e JWT
- Implementare un sistema di verifica email OTP
- Gestire upload e salvataggio immagini (S3 ready)
- Creare un sistema di matching tra utenti
- Utilizzare Prisma ORM e gestire migrazioni database
- Applicare best practice di sicurezza (hash password, validazione input, protezione route)
- Deploy su Vercel e gestione variabili ambiente

---

Se ti piace il progetto, puoi trovarlo anche sul mio [LinkedIn](https://www.linkedin.com/)!

## 🛡️ Sicurezza

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

## 🚀 Deploy

### Vercel (Consigliato)

1. Connetti il tuo repository GitHub a Vercel
2. Configura le variabili d'ambiente nel dashboard Vercel:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET` (genera una nuova chiave per produzione)
   - `NEXTAUTH_URL` (il tuo dominio)
   - `RESEND_API_KEY`

### Altre piattaforme
- Netlify
- Railway  
- Heroku

## 🤝 Contribuire

1. Fork il progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit le tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Distribuito sotto licenza MIT. Vedi `LICENSE` per maggiori informazioni.
