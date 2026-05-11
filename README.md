![MeroUniversitat logo](public/merounilogo.png)

# MeroUniversitat

MeroUniversitat is a community-driven platform that makes Germany applications transparent, organized, and collaborative for Nepali students. Discover universities, benchmark with anonymized student outcomes, track your application pipeline, and plan visa timelines with real community data.

## Why it exists

Applying to Germany can feel opaque and fragmented. MeroUniversitat brings the process into one place so students can make informed decisions and move together with confidence.

## Product highlights

- University Explorer with 150+ German universities and program search
- Community acceptance data and anonymized student profiles
- Application tracker with Kanban workflow and status insights
- Team workspaces for shared planning and collaboration
- Visa and embassy timeline intelligence based on community milestones
- Resources hub for SOPs, checklists, and templates

## Tech stack

- Next.js 16 + React 19 (App Router)
- PostgreSQL + Prisma
- Better Auth (email/password + Google)
- Tailwind CSS + Shadcn UI

## Quick start

### 1) Install dependencies

```bash
pnpm install
```

### 2) Start Postgres

```bash
docker-compose up -d
```

### 3) Configure environment

Create `.env` and set at least:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mero_universitat
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Google OAuth is optional for local dev. If you skip it, keep the variables empty or remove the provider configuration.

### 4) Generate Prisma client and apply migrations

```bash
pnpm db:generate
pnpm db:migrate:prod
```

### 5) Run the app

```bash
pnpm dev
```

Open http://localhost:3000

## Optional: seed data

These scripts use Bun:

```bash
bun run scripts/seed-universities.ts
bun run scripts/seed-university-logos.ts
bun run scripts/sync-university-cities-from-json.ts
```

## Project structure

This repo is organized by feature domains in `src/modules`. UI routes live in `src/app` and import from modules.

## Scripts

- `pnpm dev` - start the development server
- `pnpm build` - build for production
- `pnpm start` - run the production server
- `pnpm lint` - lint the codebase
- `pnpm db:generate` - generate Prisma client
- `pnpm db:migrate:prod` - apply migrations
- `pnpm seed:universities` - seed university list
- `pnpm seed:university-logos` - seed university logos
- `pnpm sync:university-cities` - sync university cities
