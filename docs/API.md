# LG Travels — REST API (NestJS)

Base URL: `${NEXT_PUBLIC_API_URL}` → `https://api.lgtravels.com/api`

Auth: `Authorization: Bearer <Clerk JWT>` on protected routes.
Roles in **bold** are required (RBAC via `RolesGuard`).

## Public
| Method | Path | Description |
|---|---|---|
| GET | `/destinations` | List destinations (`?featured=&continent=`) |
| GET | `/destinations/:slug` | Destination detail |
| GET | `/packages` | List packages (`?category=&destination=&sort=&featured=`) |
| GET | `/packages/:slug` | Package detail (incl. itinerary, reviews) |
| GET | `/packages/:slug/related` | Related packages |
| GET | `/testimonials` | Published testimonials |
| GET | `/blog` | Published posts (`?category=&tag=&page=`) |
| GET | `/blog/:slug` | Post detail |
| GET | `/faqs` | FAQ list |
| POST | `/inquiries` | Create a lead (contact form) |
| POST | `/newsletter` | Subscribe email |

## Authenticated (customer)
| Method | Path | Description |
|---|---|---|
| GET | `/me` | Current user profile |
| PATCH | `/me` | Update profile |
| GET | `/me/bookings` | My bookings |
| GET | `/me/wishlist` · POST · DELETE `/me/wishlist/:packageId` | Manage wishlist |
| POST | `/bookings` | Create booking → returns `reference` |
| GET | `/bookings/:reference` | Booking detail |
| POST | `/payments/intent` | Create payment intent (Stripe/Razorpay/Telr) |
| POST | `/payments/confirm` | Confirm + transition booking to `confirmed` |
| GET | `/bookings/:reference/invoice` | Download PDF invoice |

## Webhooks
| Method | Path | Source |
|---|---|---|
| POST | `/auth/webhook` | Clerk → sync users |
| POST | `/payments/webhook/:provider` | Gateway → reconcile payment status |

## Admin (`/admin/*`)
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/admin/analytics` | **any admin** | totalBookings, monthlyRevenue, activeUsers, topDestinations, packagePerformance |
| CRUD | `/admin/packages` `/admin/destinations` | **travel_manager, super_admin** | Manage catalogue |
| GET/PATCH | `/admin/bookings` | **travel_manager, sales_team** | Manage bookings |
| GET | `/admin/payments` | **travel_manager, super_admin** | Payment ledger |
| CRUD | `/admin/users` | **super_admin** | Users & role assignment |
| CRUD | `/admin/blog` `/admin/banners` `/admin/testimonials` | **content_manager** | Content |
| GET/PATCH | `/admin/inquiries` | **sales_team** | Leads pipeline |
| GET/PUT | `/admin/settings` | **super_admin, content_manager** | SEO + site settings |

### Standard response envelope
```jsonc
{ "data": { /* ... */ }, "meta": { "page": 1, "total": 42 } }
```
Errors follow NestJS `HttpException`: `{ "statusCode": 400, "message": "...", "error": "Bad Request" }`.
