-- Migration 0021: extend the shared `notifications` table (added in 0014 for
-- the marketer app) with the display metadata the customer app's
-- notifications UI needs (icon, badge, amount), and widen recipient_type/type
-- to also cover customer-facing categories: 'orders' | 'wallet' | 'offers' | 'products'.
-- No CHECK constraint existed on these columns, so no schema change is needed
-- for the new string values themselves -- only new columns are added here.

ALTER TABLE notifications ADD COLUMN icon TEXT;
ALTER TABLE notifications ADD COLUMN amount TEXT;
ALTER TABLE notifications ADD COLUMN badge_text TEXT;
ALTER TABLE notifications ADD COLUMN badge_color TEXT;

CREATE INDEX IF NOT EXISTS idx_notifications_customer ON notifications(recipient_type, recipient_id, created_at);
