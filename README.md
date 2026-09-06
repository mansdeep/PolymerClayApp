# Polymer Clay Inspo

A small Next.js app: a searchable reference of polymer clay **projects**, **techniques**,
and **finishing options**, each rated **Easy / Medium / Hard**. Users sign up, keep a
profile (name, email, phone, address), and browse the three tables — every column has its
own search box.

## Stack

- **Next.js 15** (App Router, TypeScript) + Tailwind CSS
- **Prisma ORM** on **Postgres** (local: Docker; production: Neon on Vercel)
- **Auth** — custom: `bcryptjs` password hashing + a signed JWT (`jose`) in an httpOnly
  cookie, with `src/middleware.ts` guarding `/browse` and `/profile`

## Run locally

Requires Node.js >= 18.18 (tested on 24) and Docker.

```bash
npm install
cp .env.example .env                  # then set AUTH_SECRET (see below)
docker compose up -d db               # Postgres on localhost:5432
npm run db:migrate                    # apply migrations
npm run db:seed                       # load the 3 content tables
npm run dev                           # http://localhost:3000
```

Generate an `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

### Useful scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | `prisma generate` + `next build` (this is what Vercel runs) |
| `npm start` | Serve a production build |
| `npm run db:migrate` | Create/apply a Prisma migration locally (`prisma migrate dev`) |
| `npm run db:deploy` | Apply migrations + seed against `DATABASE_URL` (run this against Neon after schema changes) |
| `npm run db:seed` | Re-seed the content tables (idempotent; never touches users) |
| `npm run db:studio` | Open Prisma Studio to inspect the DB |

## Project layout

```
prisma/
  schema.prisma      User + Project + Technique + Finish models
  migrations/0_init  Postgres schema
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

## Deploy to Vercel

1. **Import the repo** at [vercel.com/new](https://vercel.com/new) → pick
   `mansdeep/PolymerClayApp`. Framework (Next.js) auto-detects. Don't deploy yet.
2. **Add a database** — in the project's **Storage** tab, create a **Neon** Postgres
   database and connect it to the project. This injects `DATABASE_URL` (pooled) and
   `DATABASE_URL_UNPOOLED` (direct) into all environments.
   - If your integration only exposes `POSTGRES_*` names, add two env vars manually:
     `DATABASE_URL` → the pooled string, `DATABASE_URL_UNPOOLED` → the non-pooling string.
3. **Add `AUTH_SECRET`** in **Settings → Environment Variables** — a fresh value from the
   command above (do not reuse the local one).
4. **Set up the schema once, from your machine.** The Vercel build does *not* touch the
   database (fragile against a cold Neon endpoint). Grab Neon's **direct** connection
   string (Storage tab → `.env.local` tab, or neon.tech → Connect → pooling off) and run:
   ```bash
   DATABASE_URL="postgresql://…neon.tech/neondb?sslmode=require" \
   DATABASE_URL_UNPOOLED="postgresql://…neon.tech/neondb?sslmode=require" \
   npm run db:deploy
   ```
   (Same direct string for both — this is a one-off admin run, not the serverless app.)
5. **Deploy.** Every push to `main` redeploys. Re-run `npm run db:deploy` only when
   `prisma/schema.prisma` or `prisma/seed.ts` changes.

No application code changes are needed between local and production — only the database
and `AUTH_SECRET` env vars differ.
