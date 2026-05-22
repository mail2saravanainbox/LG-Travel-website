# LG Travels — Deployment Guide

## Overview
| Layer | Platform | Notes |
|---|---|---|
| Frontend (Next.js) | **Vercel** | Auto-deploy from `main`; root = `/frontend` |
| Backend (NestJS) | **Railway** | Dockerfile or Nixpacks; root = `/backend` |
| Database (PostgreSQL) | **Railway** | Managed Postgres plugin |
| CMS (Strapi) | **Railway** | Separate service; own Postgres or shared schema |
| Auth | **Clerk** | Hosted; keys via env |
| Media | **Cloudinary** | CDN delivery |

---

## 1. Frontend → Vercel
1. Import the repo into Vercel; set **Root Directory** to `frontend`.
2. Framework preset auto-detects **Next.js**. Build: `next build` (Turbopack by default in 16).
3. Add env vars from `frontend/.env.example` (Clerk, API URL, Cloudinary, site URL).
4. Add custom domain `lgtravels.com`; Vercel manages SSL.

Local:
```bash
cd frontend
npm install
cp .env.example .env.local   # fill values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production check
```

## 2. Backend → Railway
1. New Railway project → add **PostgreSQL** plugin (provides `DATABASE_URL`).
2. New service from repo, root `backend/`. Build: `npm run build`; start: `npm run start:prod`
   (Nest builds to `dist/src/main.js`, not `dist/main.js`). `postinstall` runs `prisma generate`.
3. Env: `DATABASE_URL`, `PORT`, `FRONTEND_URL` (CORS — comma-separated origins ok).
   Later: `CLERK_SECRET_KEY`, payment keys, `CLOUDINARY_*` once those are wired.
4. Sync schema on deploy. There are **no migration files** (schema was built with
   `db push`), so use a Railway pre-deploy command:
   ```bash
   npx prisma db push
   ```
   Seed **once** (not on every deploy — the seed is not idempotent). Easiest is to
   run it locally against the Railway DB:
   ```bash
   DATABASE_URL="<railway-postgres-url>" npm run db:seed
   ```

## 3. Database
- Schema lives in `database/schema.sql` (raw SQL) and `database/prisma/schema.prisma` (ORM).
- First-time setup with Prisma:
  ```bash
  cd backend
  npx prisma migrate dev --name init   # dev
  npx prisma db seed                   # optional seed
  ```
- Or apply raw SQL: `psql "$DATABASE_URL" -f database/schema.sql`.

## 4. Clerk
1. Create a Clerk application; copy publishable + secret keys.
2. Set sign-in/up URLs to `/login` and `/register` (see `.env.example`).
3. Add a webhook → `https://api.lgtravels.com/api/auth/webhook` for `user.created`, `user.updated`.
4. Wrap the frontend root layout in `<ClerkProvider>` and add `proxy.ts`
   (Next 16 renamed `middleware` → `proxy`) to protect `/dashboard` and `/admin`.

## 5. Cloudinary
- Create an unsigned upload preset for client uploads, signed for admin.
- Replace demo Unsplash/Pexels URLs in `frontend/src/data/*` and the hero
  `VIDEO_SOURCES` with Cloudinary delivery URLs.

## 6. Payments
- **Stripe** (global), **Razorpay** (India), **Telr** (UAE/KSA). The
  `payments` module exposes one interface with per-provider strategies; pick by
  the booking's `currency`/market. Configure gateway webhooks to
  `/api/payments/webhook/:provider`.

## CI/CD
- Vercel + Railway both deploy on push to `main`.
- Recommended checks before merge: `npm run build` (frontend) and
  `npm run test` (backend).
