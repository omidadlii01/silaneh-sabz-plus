-- Migration 0022: device push tokens (Firebase Cloud Messaging).
-- customer_id is nullable: a device can register a token before login (or
-- while browsing as a guest), and we still want to be able to push a
-- "you're missing out, sign up" style message to it later if ever needed.
-- One row per physical device token; re-registering the same token just
-- upserts (keeps last_seen_at fresh, re-links to whichever customer is
-- currently logged in on that device).

CREATE TABLE IF NOT EXISTS device_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT UNIQUE NOT NULL,
  customer_id INTEGER REFERENCES customers(id),
  platform TEXT NOT NULL DEFAULT 'android',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_seen_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_device_tokens_customer ON device_tokens(customer_id);
