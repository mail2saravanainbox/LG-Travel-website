# LG Travels — AWS EC2 Deployment Runbook

All-in-one single EC2 box: PostgreSQL + NestJS API + Next.js frontend + nginx + Let's Encrypt SSL.
Cloudinary and Clerk are unchanged (external services).

> Secrets (DB password, Clerk secret, Cloudinary secret, admin password) are **not** in this
> file — they're filled into the `.env` files directly on the server at deploy time.

---

## 1. Server the client must provision

| Setting | Value |
|---|---|
| Service | EC2 |
| OS | **Ubuntu 22.04 or 24.04 LTS** |
| Instance type | **t3.small** min (2 GB RAM) · **t3.medium** recommended (4 GB — smoother Next.js build) |
| Storage | 20–30 GB gp3 |
| Region | **ap-south-1 (Mumbai)** recommended |
| Elastic IP | **Allocate + associate one** (static public IP — required so DNS doesn't break on reboot) |
| Security Group (inbound) | TCP **22** (SSH — ideally your IP only), TCP **80** (HTTP, 0.0.0.0/0), TCP **443** (HTTPS, 0.0.0.0/0) |

**Client sends back:** the SSH private key (`.pem`), the **Elastic IP**, and the login user (usually `ubuntu`).

Test SSH: `ssh -i lgtravels.pem ubuntu@<ELASTIC_IP>`

---

## 2. DNS changes (GoDaddy) — do at cutover, after the box is verified

Currently the apex points at Vercel (`76.76.21.21`). To move to AWS:

| Type | Name | Value | Note |
|---|---|---|---|
| A | `@` | `<ELASTIC_IP>` | change from 76.76.21.21 |
| A | `api` | `<ELASTIC_IP>` | **new** — backend host |
| CNAME | `www` | `lgtravels.in` | change from `cname.vercel-dns.com` |

Leave all email records (secureserver, `_domainkey`, `_domainconnect`) untouched.
Keep Vercel/Render running until AWS is confirmed — DNS is a safe, reversible flip.

---

## 3. Environment files (create on the server)

**`backend/.env`**
```
DATABASE_URL="postgresql://lg:<DB_PASSWORD>@localhost:5432/lg_travels?schema=public"
PORT=4000
FRONTEND_URL="https://lgtravels.in,https://www.lgtravels.in"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="<ADMIN_PASSWORD>"
ADMIN_TOKEN_SECRET="<LONG_RANDOM_STRING>"
CLERK_SECRET_KEY="<sk_...>"
CLOUDINARY_CLOUD_NAME="dzevugvgg"
CLOUDINARY_API_KEY="<key>"
CLOUDINARY_API_SECRET="<secret>"
```

**`frontend/.env.production.local`**  (NEXT_PUBLIC_* are baked in at build — set BEFORE `npm run build`)
```
NEXT_PUBLIC_API_URL="https://api.lgtravels.in/api"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<pk_...>"
CLERK_SECRET_KEY="<sk_...>"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/login"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/register"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/dashboard"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/dashboard"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dzevugvgg"
NEXT_PUBLIC_SITE_URL="https://lgtravels.in"
```

---

## 4. Provision + build

```bash
# on the server, as ubuntu:
git clone https://github.com/mail2saravanainbox/LG-Travel-website.git
cd LG-Travel-website
# create the two .env files from §3, then:
export DB_PASSWORD="<DB_PASSWORD>"   # same as in backend/.env
bash deploy/aws/setup.sh
```
`setup.sh` installs Node 22, Postgres, nginx, pm2; creates the DB; builds both apps; starts them under pm2.

---

## 5. Database: bring your live data over from Render

Instead of re-seeding (which is sample data only), copy the **current** Render DB so any
admin edits come along:

```bash
# from your laptop OR the server — needs the Render EXTERNAL url:
pg_dump "postgresql://lg_travels_user:<pw>@dpg-...singapore-postgres.render.com/lg_travels?sslmode=require" \
  --no-owner --no-privileges -Fc -f lg_travels.dump

# restore into the local box DB:
pg_restore --no-owner --no-privileges -d "postgresql://lg:<DB_PASSWORD>@localhost:5432/lg_travels" lg_travels.dump
```
(If you'd rather start clean with sample content: `cd backend && npm run db:seed` instead.)

---

## 6. nginx + SSL

```bash
sudo cp deploy/aws/nginx-lgtravels.conf /etc/nginx/sites-available/lgtravels
sudo ln -sf /etc/nginx/sites-available/lgtravels /etc/nginx/sites-enabled/lgtravels
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# DNS (step 2) must resolve to this box first, then:
sudo snap install --classic certbot && sudo ln -sf /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx -d lgtravels.in -d www.lgtravels.in -d api.lgtravels.in \
  --non-interactive --agree-tos -m akwadagency@gmail.com --redirect
```
certbot auto-renews via a systemd timer.

---

## 7. Verify

```bash
curl -s https://api.lgtravels.in/api/health          # {"status":"ok","db":"up"}
curl -s -o /dev/null -w "%{http_code}\n" https://lgtravels.in
curl -s https://lgtravels.in/packages | grep -o "Maldives Overwater Escape"
pm2 status                                            # both apps "online"
```

## Redeploy later (after a git push)
```bash
cd ~/LG-Travel-website && git pull
cd backend && npm install --include=dev && npm run build && npx prisma db push
cd ../frontend && npm install --include=dev && npm run build
pm2 restart all
```
