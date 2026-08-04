-- Weekly/recommended package bundles feature (2026-08-05)
-- Requested UI feature from AI Studio redesign: shows a bundle of products
-- at a discounted combined price, with an expiry countdown.

CREATE TABLE IF NOT EXISTS weekly_offers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT,
  discount_percentage INTEGER NOT NULL DEFAULT 0,
  price INTEGER NOT NULL,           -- wholesale bundle price (Tomans)
  consumer_price INTEGER NOT NULL,  -- reference retail price (Tomans)
  expires_at TEXT,                  -- ISO date/time the offer expires
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS weekly_offer_items (
  id TEXT PRIMARY KEY,
  offer_id TEXT NOT NULL REFERENCES weekly_offers(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1
);
