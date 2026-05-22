# LG Travels — System Architecture

A globally-scalable, luxury travel-tech platform. Monorepo-style layout with a
clear separation between the **frontend** (Next.js, built in this repo), the
**backend** (NestJS), the **CMS** (Strapi) and **PostgreSQL**.

```
┌──────────────┐     REST/JSON     ┌──────────────┐     SQL      ┌────────────┐
│  Next.js 15  │ ───────────────▶  │   NestJS     │ ───────────▶ │ PostgreSQL │
│  (Vercel)    │ ◀───────────────  │  (Railway)   │ ◀─────────── │ (Railway)  │
└──────┬───────┘                   └──────┬───────┘              └────────────┘
       │ Clerk (auth/JWT)                 │ Prisma ORM
       │ Cloudinary (media)               │ Webhooks
       │ Strapi (editorial content) ◀─────┘
```

## 1. Frontend (this repo: `/frontend`) — DELIVERED & BUILDING

- **Next.js 16 (App Router)** + TypeScript + Tailwind v4 + Framer Motion.
- Route groups separate concerns:
  - `app/(site)/` — marketing/site shell (transparent navbar + footer).
  - `app/(auth)/` — full-screen split-screen auth (login/register).
  - `app/dashboard/` — sidebar app shell (user dashboard).
- State: **Zustand** (`store/wishlist.ts` persisted, `store/booking.ts`).
- Forms: **React Hook Form + Zod** (`components/contact`, auth pages).
- Data today comes from typed mock modules in `src/data/*`. Each is a drop-in
  for a `services/*` call to the NestJS API — same shapes as `src/types`.

### Folder structure (frontend)
```
src/
├── app/
│   ├── (site)/            # home, about, destinations, packages, blog, contact, faq, legal, checkout, payment
│   ├── (auth)/            # login, register
│   ├── dashboard/         # user dashboard (own layout + sidebar)
│   ├── layout.tsx         # root: fonts, metadata, viewport
│   ├── sitemap.ts robots.ts not-found.tsx
│   └── globals.css        # design tokens (brand colours, fonts, utilities)
├── components/
│   ├── ui/                # Button, Badge, Input, Card, Accordion (shadcn-style)
│   ├── layout/            # Navbar, Footer, Logo
│   ├── home/              # Hero, SearchWidget, sections
│   ├── shared/            # Reveal, SectionHeading, PageHeader, cards, LegalPage
│   ├── packages/ destinations/ contact/ auth/ dashboard/
├── data/                  # mock content (swap for services/)
├── store/                 # Zustand stores
├── lib/                   # utils (cn, formatters), motion constants
├── constants/             # site config, nav links
└── types/                 # shared domain types
```

## 2. Backend (`/backend`, NestJS) — TO SCAFFOLD

Clean, modular architecture. One module per domain, each with
`controller / service / dto / entity`:

```
src/
├── main.ts
├── app.module.ts
├── prisma/                # PrismaService (wraps database/prisma/schema.prisma)
├── common/                # guards, interceptors, filters, decorators
│   ├── guards/clerk-auth.guard.ts     # verifies Clerk JWT
│   ├── guards/roles.guard.ts          # RBAC via @Roles()
│   └── decorators/roles.decorator.ts
└── modules/
    ├── auth/              # Clerk webhook sync, current-user
    ├── users/
    ├── destinations/
    ├── packages/          # + itineraries (nested)
    ├── bookings/
    ├── payments/          # Stripe / Razorpay / Telr strategies
    ├── reviews/
    ├── testimonials/
    ├── blog/
    ├── inquiries/         # leads
    ├── banners/
    ├── settings/          # SEO + site settings
    └── admin/             # dashboard analytics aggregations
```

### Authentication & RBAC
- **Clerk** issues JWTs on the frontend. The NestJS `ClerkAuthGuard` validates
  the bearer token (Clerk JWKS) on every protected route.
- A Clerk **webhook** (`POST /api/auth/webhook`) syncs users into the `users`
  table on `user.created` / `user.updated`.
- Roles (`super_admin`, `travel_manager`, `content_manager`, `sales_team`,
  `customer`) are stored on the user row and enforced with a `RolesGuard` +
  `@Roles('travel_manager')` decorator. Admin routes live under `/api/admin/*`.

## 3. Admin Panel

Built as a separate Next.js route group (`app/(admin)/admin/*`) or a standalone
dashboard app, protected by `RolesGuard`. Structure:

| Section | Roles | Backend |
|---|---|---|
| Dashboard analytics (bookings, revenue, active users, top destinations, package performance) | all admins | `GET /api/admin/analytics` |
| Packages / Destinations / Itineraries CRUD | travel_manager, super_admin | `packages`, `destinations` |
| Bookings & Payments | travel_manager, sales_team | `bookings`, `payments` |
| Users & Roles | super_admin | `users` |
| Blog / Banners / Testimonials | content_manager | `blog`, `banners`, `testimonials` |
| Leads (inquiries) | sales_team | `inquiries` |
| SEO & Website settings | super_admin, content_manager | `settings` |

## 4. CMS (Strapi)
Strapi owns long-form editorial content (blog, landing copy, banners) so
non-technical staff can publish. The Next.js frontend reads published content
from Strapi's REST/GraphQL API; transactional data (bookings, payments) stays
in the NestJS + PostgreSQL core.

## 5. Media (Cloudinary)
All imagery/video is uploaded to Cloudinary and served via its CDN with
automatic format/quality optimisation. In the frontend, `next.config.ts`
already allow-lists `res.cloudinary.com`. Today the demo hot-links Unsplash/
Pexels — swap the URLs in `src/data/*` and the hero `VIDEO_SOURCES`.

## 6. Markets & i18n readiness
- Currency is per-record (`currency` column) and formatted via `Intl` in
  `lib/utils.ts` → ready for USD / AED / SAR / EUR / INR.
- Payment strategy is pluggable per market: Stripe (global), Razorpay (India),
  Telr (UAE/KSA).
- Copy and structure avoid region-specific idioms; `next-intl` can be layered
  on the `(site)` group for full localisation later.
