-- Soft-delete 4 brands requested by user (2026-08-03): فورمی، آیس بابل، ویت آس، زِن
-- Deactivates both the brand row and its associated product(s) so they disappear
-- from GET /api/brands and GET /api/products (both endpoints filter on active=1).

UPDATE brands SET active = 0 WHERE id IN ('brand-sb-13', 'brand-sb-14', 'brand-sb-16', 'brand-sb-17');

UPDATE products SET active = 0 WHERE brand IN ('زِن', 'ویت آس', 'آیس بابل', 'فورمی');
