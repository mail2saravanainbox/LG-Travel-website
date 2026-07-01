# LG Travels — Handoff Guide

This guide is for the team taking over hosting of **LG Travels**. It covers what
the app needs, what secrets to obtain, and how to get it running. For deeper
detail see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md),
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and, for a single-VM setup,
[`deploy/aws/RUNBOOK.md`](deploy/aws/RUNBOOK.md).

---

## 1. What the app is

| Part | Stack | Folder |
|---|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind v4 | `frontend/` |
| Backend | NestJS + Prisma ORM | `backend/` |
| Database | PostgreSQL | schema in `backend/prisma/schema.prisma` |

**Services the app actually uses:** PostgreSQL, Cloudinary (media), Clerk (auth).
`Strapi`, `Stripe`, `Razorpay`, and `Telr` appear in `.env.example` but are **not
wired into the code** — you can ignore them.

---

## 2. Secrets you need

The repo contains **no real secrets** — only `.env.example` templates. You will
create a `backend/.env` and a `frontend/.env.local` from those templates and fill
in the values below.

### Provided by the current owner (reuse these)

- **Cloudinary** — `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
  `CLOUDINARY_API_SECRET`.
  All existing site media lives in this account. If you swap in a different
  Cloudinary account, existing image URLs will break. **Reuse the provided keys.**
- **Clerk** (optional to reuse) — `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` +
  `CLERK_SECRET_KEY`.
  Reuse the owner's keys to keep existing user logins, **or** create a fresh Clerk
  project at [clerk.com](https://clerk.com) for a clean start. Both work.

> These values are shared **separately and securely** (password manager /
> encrypted message) — never committed to the repo or sent in plain email.

### You create yourself

- **`DATABASE_URL`** — connection string to your own PostgreSQL instance. Your DB
  starts empty; ask the owner for a data export if you need existing content.
- **`ADMIN_USERNAME`, `ADMIN_PASSWORD`** — pick your own admin-panel login.
- **`ADMIN_TOKEN_SECRET`** — a long random string. Generate one, e.g.:
  ```bash
  openssl rand -base64 48
  ```

---

## 3. Environment files

### `backend/.env`
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/lg_travels?schema=public"
PORT=4000
FRONTEND_URL="https://your-frontend-domain"     # CORS; comma-separated ok
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="<your-strong-password>"
ADMIN_TOKEN_SECRET="<openssl rand -base64 48>"
CLERK_SECRET_KEY="<from owner or your Clerk project>"
CLOUDINARY_CLOUD_NAME="<from owner>"
CLOUDINARY_API_KEY="<from owner>"
CLOUDINARY_API_SECRET="<from owner>"
```

### `frontend/.env.local`
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<from owner or your Clerk project>"
CLERK_SECRET_KEY="<same as backend>"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_API_URL="https://your-backend-domain/api"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="<from owner>"
NEXT_PUBLIC_SITE_URL="https://your-frontend-domain"
```

---

## 4. Run locally

**Prerequisites:** Node.js 20+, npm, a PostgreSQL database.

```bash
# Backend
cd backend
npm install
cp .env.example .env        # then fill in values (see section 3)
npm run db:setup            # prisma db push + seed data
npm run start:dev           # http://localhost:4000

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env.local  # then fill in values
npm run dev                 # http://localhost:3000
```

---

## 5. Deploy

Any host works. Two documented paths:

- **Managed (Vercel + managed Postgres):** see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).
  Frontend root = `frontend/`, backend root = `backend/`.
- **Single VM (AWS EC2 / any Linux box, nginx + pm2):** see
  [`deploy/aws/RUNBOOK.md`](deploy/aws/RUNBOOK.md) and `deploy/aws/setup.sh`.

**Key deploy notes:**
- Backend build: `npm run build`; start: `npm run start:prod`
  (Nest builds to `dist/src/main.js`). `postinstall` runs `prisma generate`.
- There are **no Prisma migration files** (schema built with `db push`). On first
  deploy, sync the schema with:
  ```bash
  npx prisma db push
  ```
- Set `FRONTEND_URL` on the backend to your real frontend origin(s) for CORS.

---

## 6. Handoff checklist

- [ ] Repo access granted (GitHub collaborator or clone).
- [ ] Cloudinary keys received from owner.
- [ ] Clerk keys received **or** new Clerk project created.
- [ ] Own PostgreSQL provisioned; `DATABASE_URL` set.
- [ ] Admin credentials + `ADMIN_TOKEN_SECRET` chosen.
- [ ] `.env` / `.env.local` filled from the templates above.
- [ ] Backend runs (`npm run start:dev`) and DB seeded (`npm run db:setup`).
- [ ] Frontend runs (`npm run dev`) and talks to the backend.
- [ ] Deployed; `NEXT_PUBLIC_API_URL` and `FRONTEND_URL` point at real domains.
- [ ] (Optional) Existing content/data exported from owner and imported.
