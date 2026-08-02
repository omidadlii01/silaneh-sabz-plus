-- Migration 0005: add barcode column to products
ALTER TABLE products ADD COLUMN barcode TEXT;
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
