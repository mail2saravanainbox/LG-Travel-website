# LG Travels — Luxury Travel-Tech Platform

A premium, globally-scalable travel booking platform. Cinematic, mobile-first,
luxury aesthetic — built to compete visually with Airbnb Experiences, WanderOn
and modern airline brands.

> **Brand** · Midnight Travel Blue `#082567` · Luxury Gold `#F4B400` ·
> Headings **Sora**, Body **Inter**.

## What's in this repo

| Path | Status | Description |
|---|---|---|
| `frontend/` | ✅ **Built & production-building** | Next.js 16 (App Router) + TS + Tailwind v4 + Framer Motion. All 18 pages, runnable. |
| `database/schema.sql` | ✅ Delivered | Full PostgreSQL relational schema. |
| `database/prisma/schema.prisma` | ✅ Delivered | Prisma ORM model for the NestJS backend. |
| `docs/ARCHITECTURE.md` | ✅ Delivered | Full system design (frontend, NestJS backend, admin, auth, CMS). |
| `docs/API.md` | ✅ Delivered | REST API surface incl. admin RBAC. |
| `docs/DEPLOYMENT.md` | ✅ Delivered | Vercel + Railway + Clerk + Cloudinary + Strapi. |
| `backend/` | 📐 Scaffold spec | NestJS module structure documented in `docs/ARCHITECTURE.md`. |

## Run the frontend

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (verified green — 39 routes)
```

> Note: the scaffold installed **Next.js 16** (current latest), which supersedes
> the requested Next 15 — same App Router, with Turbopack on by default and
> async `params`/`searchParams` (handled throughout).

## Pages (all implemented)

Home · About · Destinations · Destination details · Packages · Package details
· Contact · Blog · Blog details · Testimonials · FAQ · Privacy · Terms ·
Login · Register · User Dashboard · Checkout · Payment success/failed · custom 404.

## Highlights

- **Cinematic hero** with autoplay/muted/looping drone video (poster fallback),
  layered gradient overlays, floating glass UI cards and 3D-style float motion.
- **Animated search widget** (Packages/Hotels/Flights tabs) with `layoutId`
  transitions.
- **Scroll-reveal** system, premium hover scaling, glassmorphism, soft shadows.
- **Wishlist** (persisted Zustand) + **booking draft** flow → checkout → payment.
- **SEO**: dynamic metadata, Open Graph, JSON-LD (TravelAgency / Product /
  FAQPage), `sitemap.xml`, `robots.txt`.
- **Forms** with React Hook Form + Zod validation.
- Fully **responsive**, mobile drawer nav, `prefers-reduced-motion` respected.

## Media

Demo uses hot-linked Unsplash (images) + Pexels (hero video). Swap for your own
Cloudinary assets in `frontend/src/data/*` and `components/home/hero.tsx`
(`VIDEO_SOURCES`). Allowed hosts are configured in `frontend/next.config.ts`.

## Next steps to full production

1. Scaffold the NestJS backend per `docs/ARCHITECTURE.md`; wire Prisma to Railway Postgres.
2. Add `<ClerkProvider>` + `proxy.ts` to the frontend; protect `/dashboard` & `/admin`.
3. Replace `src/data/*` mock modules with `services/*` calls to the API.
4. Integrate a payment provider in the `payments` module and `/checkout`.
5. Connect Strapi for editorial content; move imagery to Cloudinary.

See `docs/` for the complete architecture, API and deployment details.
