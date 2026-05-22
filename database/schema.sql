-- ============================================================================
-- LG Travels — PostgreSQL schema (production)
-- Relational architecture for users, destinations, packages, itineraries,
-- bookings, payments, blogs, testimonials, inquiries (leads) and admin roles.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ---------- Enums -----------------------------------------------------------
CREATE TYPE user_role        AS ENUM ('customer', 'sales_team', 'content_manager', 'travel_manager', 'super_admin');
CREATE TYPE package_category AS ENUM ('Luxury', 'Honeymoon', 'Adventure', 'Family', 'Wellness', 'Cultural');
CREATE TYPE booking_status   AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'refunded');
CREATE TYPE payment_status   AS ENUM ('initiated', 'succeeded', 'failed', 'refunded');
CREATE TYPE payment_provider AS ENUM ('stripe', 'razorpay', 'telr', 'manual');
CREATE TYPE inquiry_status   AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');
CREATE TYPE post_status      AS ENUM ('draft', 'published', 'archived');

-- ---------- Users (synced from Clerk) ---------------------------------------
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id        TEXT UNIQUE NOT NULL,                 -- Clerk user id
  email           CITEXT UNIQUE NOT NULL,
  full_name       TEXT,
  avatar_url      TEXT,
  phone           TEXT,
  nationality     TEXT,
  role            user_role NOT NULL DEFAULT 'customer',
  loyalty_points  INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_role ON users(role);

-- ---------- Destinations ----------------------------------------------------
CREATE TABLE destinations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  country         TEXT NOT NULL,
  continent       TEXT NOT NULL,
  tagline         TEXT,
  description     TEXT,
  hero_image      TEXT,
  gallery         JSONB NOT NULL DEFAULT '[]',
  starting_price  NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency        CHAR(3) NOT NULL DEFAULT 'USD',
  rating          NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count    INTEGER NOT NULL DEFAULT 0,
  best_season     TEXT,
  highlights      JSONB NOT NULL DEFAULT '[]',
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_destinations_featured ON destinations(is_featured);

-- ---------- Packages --------------------------------------------------------
CREATE TABLE packages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  destination_id  UUID REFERENCES destinations(id) ON DELETE SET NULL,
  location        TEXT,
  summary         TEXT,
  description     TEXT,
  hero_image      TEXT,
  gallery         JSONB NOT NULL DEFAULT '[]',
  duration_days   INTEGER NOT NULL,
  duration_nights INTEGER NOT NULL,
  price           NUMERIC(10,2) NOT NULL,
  old_price       NUMERIC(10,2),
  currency        CHAR(3) NOT NULL DEFAULT 'USD',
  rating          NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count    INTEGER NOT NULL DEFAULT 0,
  group_size      TEXT,
  category        package_category NOT NULL DEFAULT 'Luxury',
  highlights      JSONB NOT NULL DEFAULT '[]',
  inclusions      JSONB NOT NULL DEFAULT '[]',
  exclusions      JSONB NOT NULL DEFAULT '[]',
  badge           TEXT,
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_packages_destination ON packages(destination_id);
CREATE INDEX idx_packages_category    ON packages(category);
CREATE INDEX idx_packages_featured    ON packages(is_featured);

-- ---------- Itinerary days (1 package -> many days) -------------------------
CREATE TABLE itineraries (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id      UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  day_number      INTEGER NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  stay            TEXT,
  meals           JSONB NOT NULL DEFAULT '[]',
  UNIQUE (package_id, day_number)
);

-- ---------- Bookings --------------------------------------------------------
CREATE TABLE bookings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference       TEXT UNIQUE NOT NULL,                 -- e.g. LG-ABC123
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  package_id      UUID NOT NULL REFERENCES packages(id) ON DELETE RESTRICT,
  travelers       INTEGER NOT NULL DEFAULT 1,
  start_date      DATE,
  lead_name       TEXT NOT NULL,
  lead_email      CITEXT NOT NULL,
  lead_phone      TEXT,
  subtotal        NUMERIC(10,2) NOT NULL,
  taxes           NUMERIC(10,2) NOT NULL DEFAULT 0,
  total           NUMERIC(10,2) NOT NULL,
  currency        CHAR(3) NOT NULL DEFAULT 'USD',
  status          booking_status NOT NULL DEFAULT 'pending',
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_bookings_user    ON bookings(user_id);
CREATE INDEX idx_bookings_package ON bookings(package_id);
CREATE INDEX idx_bookings_status  ON bookings(status);

-- ---------- Payments (1 booking -> many payment attempts) -------------------
CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id      UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  provider        payment_provider NOT NULL DEFAULT 'stripe',
  provider_ref    TEXT,                                 -- gateway transaction id
  amount          NUMERIC(10,2) NOT NULL,
  currency        CHAR(3) NOT NULL DEFAULT 'USD',
  status          payment_status NOT NULL DEFAULT 'initiated',
  raw_response    JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status  ON payments(status);

-- ---------- Reviews (traveller -> package) ----------------------------------
CREATE TABLE reviews (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id      UUID REFERENCES packages(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  quote           TEXT NOT NULL,
  is_published    BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Testimonials (curated, may be standalone) -----------------------
CREATE TABLE testimonials (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  location        TEXT,
  avatar_url      TEXT,
  rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  quote           TEXT NOT NULL,
  trip            TEXT,
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Blog posts ------------------------------------------------------
CREATE TABLE blog_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  excerpt         TEXT,
  content         TEXT,
  cover_image     TEXT,
  author_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  category        TEXT,
  reading_time    INTEGER,
  tags            JSONB NOT NULL DEFAULT '[]',
  status          post_status NOT NULL DEFAULT 'draft',
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_blog_status ON blog_posts(status);

-- ---------- Inquiries / leads ----------------------------------------------
CREATE TABLE inquiries (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  email           CITEXT NOT NULL,
  phone           TEXT,
  destination     TEXT,
  budget          TEXT,
  message         TEXT,
  status          inquiry_status NOT NULL DEFAULT 'new',
  assigned_to     UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_inquiries_status ON inquiries(status);

-- ---------- Wishlists (user <-> package, many-to-many) ----------------------
CREATE TABLE wishlists (
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  package_id      UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, package_id)
);

-- ---------- Banners (homepage / campaign management) ------------------------
CREATE TABLE banners (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT,
  subtitle        TEXT,
  image_url       TEXT,
  cta_label       TEXT,
  cta_href        TEXT,
  position        TEXT NOT NULL DEFAULT 'hero',
  is_active       BOOLEAN NOT NULL DEFAULT true,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- SEO / site settings (key-value) ---------------------------------
CREATE TABLE settings (
  key             TEXT PRIMARY KEY,
  value           JSONB NOT NULL,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- updated_at trigger ----------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['users','destinations','packages','bookings','blog_posts'])
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%I_updated BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at();',
      t, t);
  END LOOP;
END $$;
