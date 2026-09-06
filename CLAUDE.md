# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Next.js 15 (App Router, TypeScript) app: a login-gated, searchable reference of polymer
clay **projects**, **techniques**, and **finishing options**, each rated Easy/Medium/Hard.
Runs on **Postgres** everywhere — local via `docker compose up -d db`, production on
**Neon + Vercel**. Deploy steps in `README.md`.

## Commands

Node is installed but **not on the tool-shell PATH**. Prefix commands:
`export PATH="/c/Program Files/nodejs:$PATH"` (bash).

| Command | Purpose |
|---|---|
| `docker compose up -d db` | Local Postgres on `localhost:5432` (db `polymerclay`) |
| `npm install` | Install deps (runs `prisma generate` via postinstall) |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | `prisma generate` + `next build` — the exact Vercel build; no DB access |
| `npm run db:migrate` | `prisma migrate dev` — create/apply a migration after editing `schema.prisma` |
| `npm run db:deploy` | `prisma migrate deploy` + seed against `DATABASE_URL`; run manually against Neon after schema/seed changes |
| `npm run db:seed` | Reload the 3 content tables (idempotent; `deleteMany` + `createMany`; never touches `User`) |
| `npm run db:studio` | Prisma Studio |
| `npx tsc --noEmit` | Typecheck |

There is no test suite and no separate lint step (`next build` type-checks and lints).

The Vercel build deliberately does **not** run migrations or seed — that was flaky against
a cold Neon endpoint. Schema/seed changes are applied to prod by running `npm run db:deploy`
with the Neon connection string in the environment.

## Architecture

**Data (`prisma/schema.prisma`, `src/lib/db.ts`)** — `User` plus three content models
(`Project`, `Technique`, `Finish`). Each content model has a `difficulty` **String**
(not a Prisma enum, kept simple); valid values live in `src/lib/difficulty.ts`
(`DIFFICULTIES`, `isDifficulty`, `DIFFICULTY_STYLES`). `prisma` is a singleton to survive
dev HMR. The datasource uses `directUrl` (`DATABASE_URL_UNPOOLED`) so migrations run over a
direct connection while the app uses the pooled `DATABASE_URL`.

**Auth is deliberately split in two so middleware stays Edge-safe:**
- `src/lib/session.ts` — JWT sign/verify (`jose`) + cookie name/options. No Prisma, no
  bcrypt. Imported by `src/middleware.ts`, which guards `/browse` and `/profile` (see its
  `matcher`) and redirects to `/login?next=…`.
- `src/lib/auth.ts` — `bcryptjs` hashing, `startSession`/`endSession` (writes the httpOnly
  cookie via `next/headers`), and `getCurrentUser()` (cookie → verify → Prisma lookup,
  returns `SafeUser` without `passwordHash`). Server components and route handlers only.

Never import `auth.ts` (or anything pulling in Prisma/bcrypt) from `middleware.ts`.

**Auth flow** — client forms in `src/app/{signup,login}/page.tsx` POST JSON to
`src/app/api/auth/{signup,login,logout}/route.ts`; those validate, then call
`startSession`. `signup` maps Prisma `P2002` to a 409. `src/app/api/profile/route.ts`
`PUT` updates name/phone/address (email is immutable).

**Browse UI** — `src/app/browse/page.tsx` is a server component: it reads all three tables
via Prisma and hands column defs + rows to `<TabbedTables>` (client). `<DataTable>` does
**all filtering client-side** (tables are ~5–19 rows): one text box per column (AND'd,
case-insensitive substring) and a select for the `difficulty` column (exact match). To add
a column, extend the `columns` array in `browse/page.tsx` and the row mapping — `DataTable`
is generic over `{ key, label, kind?, className? }`.

**Layout** — `src/app/layout.tsx` is `async`, calls `getCurrentUser()`, and passes the
user to `<NavBar>`. Tailwind with a custom `clay` color scale in `tailwind.config.ts`.

## Deploy

GitHub remote is `origin` → `github.com/mansdeep/PolymerClayApp`, branch `main`. Vercel
builds from `main`: it needs `DATABASE_URL` + `DATABASE_URL_UNPOOLED` (Neon integration in
the Storage tab) and `AUTH_SECRET` (fresh, not the local value). The `build` script applies
migrations and seeds. No code differs between local and prod. Full steps in `README.md`.

Regenerating the init migration (no DB needed):
`npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script`
