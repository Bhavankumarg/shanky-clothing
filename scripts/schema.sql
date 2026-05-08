-- Shanky storefront — Postgres schema bootstrap.
-- Run once in the Supabase SQL editor (or psql against DATABASE_URL) before
-- running scripts/migrate-from-json.js. Safe to re-run thanks to IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS products (
  slug            TEXT        PRIMARY KEY,
  name            TEXT        NOT NULL,
  price           INTEGER     NOT NULL,
  original_price  INTEGER,
  category        TEXT        NOT NULL,
  gender          TEXT        NOT NULL DEFAULT 'Men',
  badge           TEXT,
  colors          JSONB       NOT NULL DEFAULT '[]'::jsonb,
  sizes           JSONB       NOT NULL DEFAULT '[]'::jsonb,
  material        TEXT        NOT NULL DEFAULT '',
  care            TEXT        NOT NULL DEFAULT '',
  description     TEXT        NOT NULL DEFAULT '',
  images          JSONB       NOT NULL DEFAULT '[]'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_badge ON products (badge);

CREATE TABLE IF NOT EXISTS users (
  id              TEXT        PRIMARY KEY,
  email           TEXT        NOT NULL UNIQUE,
  name            TEXT        NOT NULL,
  password_hash   TEXT        NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE TABLE IF NOT EXISTS addresses (
  id          TEXT    PRIMARY KEY,
  user_id     TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name   TEXT    NOT NULL DEFAULT '',
  phone       TEXT    NOT NULL DEFAULT '',
  address     TEXT    NOT NULL DEFAULT '',
  address2    TEXT    NOT NULL DEFAULT '',
  city        TEXT    NOT NULL DEFAULT '',
  state       TEXT    NOT NULL DEFAULT '',
  pincode     TEXT    NOT NULL DEFAULT '',
  label       TEXT    NOT NULL DEFAULT 'Home',
  created_at  BIGINT  NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses (user_id);

CREATE TABLE IF NOT EXISTS orders (
  order_id    TEXT    PRIMARY KEY,
  email       TEXT    NOT NULL,
  items       JSONB   NOT NULL,
  address     JSONB   NOT NULL,
  payment     TEXT    NOT NULL DEFAULT 'Online',
  totals      JSONB   NOT NULL,
  eta_text    TEXT    NOT NULL DEFAULT '',
  status      TEXT    NOT NULL DEFAULT 'placed',
  created_at  BIGINT  NOT NULL,
  updated_at  BIGINT
);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders (email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders (created_at DESC);

CREATE TABLE IF NOT EXISTS coupons (
  code          TEXT    PRIMARY KEY,
  percent       INTEGER NOT NULL,
  description   TEXT    NOT NULL DEFAULT '',
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  min_subtotal  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS theme (
  id          INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  cream       TEXT NOT NULL,
  cream2      TEXT NOT NULL,
  black       TEXT NOT NULL,
  rust        TEXT NOT NULL,
  rust_light  TEXT NOT NULL,
  sand        TEXT NOT NULL,
  muted       TEXT NOT NULL
);
