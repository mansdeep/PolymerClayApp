# Polymer Clay Inspo

A small Next.js app: a searchable reference of polymer clay **projects**, **techniques**,
and **finishing options**, each rated **Easy / Medium / Hard**. Users sign up, keep a
profile (name, email, phone, address), and browse the three tables — every column has its
own search box.

## Stack

- **Next.js 15** (App Router, TypeScript) + Tailwind CSS
- **Prisma ORM** — SQLite locally, Postgres in production (one-line switch)
- **Auth** — custom: `bcryptjs` password hashing + a signed JWT (`jose`) in an httpOnly
  cookie, with `src/middleware.ts` guarding `/browse` and `/profile`

## Run locally

Requires Node.js >= 18.18 (tested on 24).

```bash
npm install
cp .env.example .env          # then set AUTH_SECRET (see below)
npx prisma migrate dev        # creates prisma/dev.db
npm run db:seed               # loads the 3 content tables
npm run dev                   # http://localhost:3000
```

Generate an `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

### Useful scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run db:migrate` | Create/apply a Prisma migration |
| `npm run db:seed` | Re-seed the content tables (idempotent; never touches users) |
| `npm run db:studio` | Open Prisma Studio to inspect the DB |

## Project layout

```
prisma/
  schema.prisma      User + Project + Technique + Finish models
  seed.ts            content for the 3 tables
src/
  middleware.ts      auth gate for /browse and /profile
  lib/
    db.ts            Prisma client singleton
    session.ts       edge-safe JWT sign/verify + cookie options
    auth.ts          bcrypt + getCurrentUser + start/end session
    difficulty.ts    Easy/Medium/Hard constants + pill styles
  app/
    page.tsx         landing (redirects to /browse when logged in)
    signup, login    auth forms -> /api/auth/*
    browse/          server component: reads all 3 tables, renders <TabbedTables>
    profile/         view + edit name/phone/address
    api/auth/*       signup, login, logout route handlers
    api/profile      PUT to update profile
  components/
    TabbedTables.tsx three tabs
    DataTable.tsx    generic table with a per-column filter row
    DifficultyBadge, NavBar, LogoutButton, ProfileForm
```

## Moving to Vercel + Postgres

1. **Provision a Postgres database** — Vercel Postgres, Neon, or Supabase. Copy the
   connection string.
2. **Switch the Prisma provider** in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. **Regenerate migrations** — SQLite and Postgres migration SQL are not interchangeable:
   ```bash
   rm -rf prisma/migrations
   DATABASE_URL="postgres://..." npx prisma migrate dev --name init
   ```
4. **Set environment variables** in the Vercel project settings:
   - `DATABASE_URL` — the Postgres string
   - `AUTH_SECRET` — a fresh random value (do not reuse the local one)
5. **Deploy** — push to GitHub and import the repo into Vercel. The `build` script already
   runs `prisma generate`. Framework is auto-detected.
6. **Seed production once**:
   ```bash
   DATABASE_URL="postgres://..." npm run db:seed
   ```

No application code changes are needed — only the datasource provider and env vars.
