# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Next.js 15 (App Router, TypeScript) app: a login-gated, searchable reference of polymer
clay **projects**, **techniques**, and **finishing options**, each rated Easy/Medium/Hard.
Built to run locally on **SQLite** and later deploy to **Vercel on Postgres** with only a
Prisma datasource change (see the migration guide in `README.md`).

## Commands

Node is installed but **not on the tool-shell PATH**. Prefix commands:
`export PATH="/c/Program Files/nodejs:$PATH"` (bash).

| Command | Purpose |
|---|---|
| `npm install` | Install deps (runs `prisma generate` via postinstall) |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | `prisma generate` + `next build` (also the Vercel build) |
| `npm run db:migrate` | `prisma migrate dev` — create/apply a migration after editing `schema.prisma` |
| `npm run db:seed` | Reload the 3 content tables (idempotent; `deleteMany` + `createMany`; never touches `User`) |
| `npm run db:studio` | Prisma Studio |
| `npx tsc --noEmit` | Typecheck |

There is no test suite and no separate lint step (`next build` type-checks and lints).

Test user after seeding: `ada@example.com` / `claytime123` (created ad hoc during dev; not
seeded — sign up if the DB is fresh).

## Architecture

**Data (`prisma/schema.prisma`, `src/lib/db.ts`)** — `User` plus three content models
(`Project`, `Technique`, `Finish`). Each content model has a `difficulty` **String**
(not a Prisma enum — enums are unsupported on SQLite and complicate the Postgres move);
valid values live in `src/lib/difficulty.ts` (`DIFFICULTIES`, `isDifficulty`,
`DIFFICULTY_STYLES`). `prisma` is a singleton to survive dev HMR.

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

## Moving to Postgres / Vercel

Change `datasource db { provider }` in `schema.prisma` to `postgresql`, delete
`prisma/migrations/`, regenerate against the Postgres URL, set `DATABASE_URL` and a fresh
`AUTH_SECRET` in Vercel. No application code changes. Full steps in `README.md`.
