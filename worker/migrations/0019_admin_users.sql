-- Migration 0016: Manager app - multi-role admin users
-- Adds admin_users table for the manager app's own login system
-- (separate from the legacy X-Admin-Token shared-secret, which continues
-- to work as an always-super-admin login for the account owner).

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT, -- 'مدیرکل' | 'مدیر فروش' | 'مدیر محتوا' | 'مدیر بازاریابی' | NULL (pending)
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'active'
  session_token TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_admin_users_phone ON admin_users(phone);
CREATE INDEX IF NOT EXISTS idx_admin_users_session ON admin_users(session_token);
