# TinDoog 🐕💜

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
- **Styling**: TailwindCSS

## 📱 Funzionalità

- ✅ Registrazione utente con verifica email OTP
- ✅ Login/Logout con sessioni sicure
- ✅ Dashboard protetta
- ✅ Validazione email esistente
- ✅ Design responsive con tema viola

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
