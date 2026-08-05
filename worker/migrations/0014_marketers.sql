-- Migration 0014: Marketer app backend support
-- Adds marketers table, notifications table (for polling), links customers
-- to a marketer via marketer_id, and adds a marketer_note column to orders
-- (kept separate from the existing admin_note column).

CREATE TABLE IF NOT EXISTS marketers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  region TEXT,
  personnel_code TEXT,
  active INTEGER NOT NULL DEFAULT 0,
  monthly_target REAL DEFAULT 0,
  achieved_sales REAL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Default marketer used to migrate all existing customers onto the new
-- marketer_id relationship. Seeded active so existing data keeps working.
INSERT INTO marketers (first_name, last_name, phone, password, region, personnel_code, active)
VALUES ('بازاریاب', 'عمومی', '09000000000', 'CHANGE_ME_ON_FIRST_LOGIN', 'سراسری', 'MK-0000', 1);

ALTER TABLE customers ADD COLUMN marketer_id INTEGER REFERENCES marketers(id);
UPDATE customers SET marketer_id = (SELECT id FROM marketers WHERE phone = '09000000000') WHERE marketer_id IS NULL;

-- Separate from the existing admin_note column (used by the admin dashboard).
ALTER TABLE orders ADD COLUMN marketer_note TEXT;

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipient_type TEXT NOT NULL, -- 'marketer' | 'customer' | 'admin'
  recipient_id INTEGER NOT NULL,
  type TEXT NOT NULL,           -- 'new_order' | 'order_status_change' | 'customer_registered' | 'system_alert'
  related_order_id INTEGER,
  title TEXT,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_customers_marketer ON customers(marketer_id);
CREATE INDEX IF NOT EXISTS idx_marketers_phone ON marketers(phone);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_type, recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_orders_customer_marketer ON orders(customer_id);
