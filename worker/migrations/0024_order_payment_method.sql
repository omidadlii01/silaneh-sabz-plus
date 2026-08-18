-- Add payment method tracking to orders, for the new checkout/payment flow.
-- payment_details stores a small JSON blob with method-specific info
-- (cheque number/bank/due date, or bank-transfer/cash-on-delivery choice).
-- This is sample/manual-entry only for now (no real payment gateway wired
-- yet) — these columns are exactly what a real gateway integration will
-- read from/write to later.

ALTER TABLE orders ADD COLUMN payment_method TEXT NOT NULL DEFAULT 'اعتباری';
ALTER TABLE orders ADD COLUMN payment_details TEXT;
