#!/usr/bin/env bash
# LG Travels — one-shot AWS EC2 provisioning (Ubuntu 22.04 / 24.04).
# Runs the whole box: PostgreSQL + NestJS API + Next.js frontend + nginx + SSL.
# Safe to re-run (idempotent-ish). Run as the `ubuntu` user:
#   bash deploy/aws/setup.sh
set -euo pipefail

REPO_URL="https://github.com/mail2saravanainbox/LG-Travel-website.git"
APP_DIR="$HOME/LG-Travel-website"
NODE_MAJOR=22

echo "==> 1/8  System packages"
sudo apt-get update -y
sudo apt-get install -y curl git nginx postgresql postgresql-contrib ca-certificates gnupg

echo "==> 2/8  Swap (build headroom on small instances)"
if [ ! -f /swapfile ]; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo "==> 3/8  Node.js ${NODE_MAJOR} + pm2"
if ! command -v node >/dev/null || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt "$NODE_MAJOR" ]; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | sudo -E bash -
  sudo apt-get install -y nodejs
fi
sudo npm install -g pm2

echo "==> 4/8  PostgreSQL role + database"
# Password for the app DB user — CHANGE THIS or export DB_PASSWORD before running.
DB_PASSWORD="${DB_PASSWORD:-lg_local_pw_change_me}"
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='lg'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE USER lg WITH PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='lg_travels'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE lg_travels OWNER lg;"

echo "==> 5/8  Clone / update repo"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" pull --ff-only
else
  git clone "$REPO_URL" "$APP_DIR"
fi

echo "==> 6/8  Backend build"
cd "$APP_DIR/backend"
if [ ! -f .env ]; then
  echo "!! MISSING backend/.env — create it from deploy/aws/RUNBOOK.md before continuing." >&2
  exit 1
fi
npm install --include=dev
npx prisma generate
npx prisma db push
npm run build

echo "==> 7/8  Frontend build"
cd "$APP_DIR/frontend"
if [ ! -f .env.production.local ]; then
  echo "!! MISSING frontend/.env.production.local — create it from deploy/aws/RUNBOOK.md before continuing." >&2
  exit 1
fi
npm install --include=dev
npm run build

echo "==> 8/8  pm2 (start both apps, persist across reboots)"
cd "$APP_DIR"
pm2 start deploy/aws/ecosystem.config.js
pm2 save
sudo env PATH=$PATH pm2 startup systemd -u "$USER" --hp "$HOME" | tail -1 | bash || true

echo
echo "==> Done. Next: nginx + SSL. See deploy/aws/RUNBOOK.md §5-6."
echo "    Seed the DB ONCE (skip if you restored a dump): cd backend && npm run db:seed"
