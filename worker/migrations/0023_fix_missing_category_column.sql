-- Migration 0023: URGENT FIX -- the notifications INSERT statements added in
-- the "customer notifications" work (order placed / order status changed)
-- write a `category` column that migration 0021 never actually created.
-- This was silently breaking POST /api/orders and PATCH /api/orders/:id/status
-- with a raw D1_ERROR any time those notification inserts ran.

ALTER TABLE notifications ADD COLUMN category TEXT;
