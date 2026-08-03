-- Migration 0007: group each product's category by its own brand,
-- so the customer app's category tabs mirror brand groupings as requested.
UPDATE products SET category = brand WHERE id LIKE 'sb-%';
