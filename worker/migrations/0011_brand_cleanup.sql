-- Migration 0011: brand cleanup per user request.
-- "اتو" is not a real brand -- it's a single product line under "آمبرال"
-- (Umbrella). Reassign its product to the Umbrella brand and remove the
-- "اتو" brand tile. Also remove the "آتل" brand tile entirely (its single
-- product stays in the catalog, just without a quick-filter brand chip).
-- Finally, wire up the Hair Water logo the user provided.

UPDATE products SET brand = 'آمبرال' WHERE brand = 'اتو';

UPDATE brands SET active = 0 WHERE id = 'brand-sb-15'; -- اتو
UPDATE brands SET active = 0 WHERE id = 'brand-sb-18'; -- آتل

UPDATE brands SET image_url = '/brands/hairwater.png' WHERE id = 'brand-sb-9'; -- هیر واتر
