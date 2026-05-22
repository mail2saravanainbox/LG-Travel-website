# LG Travels — Backend API (NestJS + Prisma + PostgreSQL)

Runnable REST API for the LG Travels platform. Verified working locally.

## Prerequisites (you already have these ✅)
- Node.js 18+ (you have 25)
- PostgreSQL 14+ running locally (you have 14 via Homebrew)
- Or Docker, if you prefer a containerised Postgres

## First-time setup

```bash
cd backend
npm install                 # install dependencies

# 1. Create the database (once)
createdb lg_travels         # uses your local Postgres

# 2. Point the app at it — edit .env if your Postgres user/password differ
#    Default: postgresql://<your-mac-username>@localhost:5432/lg_travels

# 3. Generate the Prisma client + create tables + seed sample data
npm run prisma:generate
npx prisma db push          # creates all tables from prisma/schema.prisma
npm run db:seed             # loads destinations, packages, testimonials
```

> Shortcut for steps after generate: `npm run db:setup` (push + seed).

## Run the API

```bash
npm run start:dev           # development, hot-reload → http://localhost:4000/api
# or
npm run build && npm run start:prod   # production build
```

You should see: `🛫  LG Travels API ready → http://localhost:4000/api`

## Endpoints

| Method | Route | Notes |
|---|---|---|
| GET | `/api/health` | DB connectivity check |
| GET | `/api/destinations?featured=true&continent=Asia` | list |
| GET | `/api/destinations/:slug` | detail + packages |
| GET | `/api/packages?category=Honeymoon&sort=price-asc&featured=true` | list |
| GET | `/api/packages/:slug` | detail + itinerary + reviews |
| GET | `/api/packages/:slug/related` | related trips |
| GET | `/api/testimonials` | list |
| POST | `/api/inquiries` | create lead (validated) |
| GET | `/api/inquiries` | list leads |
| POST | `/api/bookings` | create booking → returns reference + total |
| GET | `/api/bookings/:reference` | booking detail |

### Quick test
```bash
curl http://localhost:4000/api/health
curl http://localhost:4000/api/packages/maldives-overwater-escape
curl -X POST http://localhost:4000/api/bookings -H "Content-Type: application/json" \
  -d '{"packageSlug":"maldives-overwater-escape","travelers":2,"leadName":"Jane","leadEmail":"jane@example.com"}'
```

## Inspect the database
```bash
npx prisma studio           # visual DB browser at http://localhost:5555
psql lg_travels -c "\dt"    # list tables
```

## Using Docker for Postgres instead (optional)
```bash
docker run --name lg-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=lg_travels \
  -p 5432:5432 -d postgres:16
# then set DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lg_travels?schema=public"
```

## Connect the frontend
In `frontend/.env.local` set `NEXT_PUBLIC_API_URL=http://localhost:4000/api`,
then replace the mock imports in `frontend/src/data/*` with fetches to these endpoints.
CORS already allows `http://localhost:3000` and `:3001`.
