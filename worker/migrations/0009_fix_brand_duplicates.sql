-- Migration 0009: fix duplicate brand rows.
-- The old demo brands (ids b1..b9) had real logos but their brand *names*
-- (e.g. "آمبرلا", "پیکسلی", "میس‌ویک") did not exactly match the real
-- product data's brand text (e.g. "آمبرال", "پیکسل", "میسویک") — that
-- mismatch is why tapping some brand tiles on Home showed "no products
-- found". We now: (1) copy each old demo brand's logo/english-name onto
-- the correct real brand row (matched by product line), and (2) deactivate
-- the old demo brand rows so they stop appearing as duplicates.

UPDATE brands SET image_url = '/brands/kodex.png', logo_color = 'from-purple-600 to-indigo-700', english_name = 'Kodex' WHERE id = 'brand-sb-3';       -- کدکس
UPDATE brands SET image_url = '/brands/umbrella.png', logo_color = 'from-amber-500 to-orange-600', english_name = 'Umbrella' WHERE id = 'brand-sb-1';  -- آمبرال
UPDATE brands SET image_url = '/brands/pixel.png', logo_color = 'from-blue-600 to-cyan-600', english_name = 'Pixel' WHERE id = 'brand-sb-5';           -- پیکسل
UPDATE brands SET image_url = '/brands/misswake.png', logo_color = 'from-emerald-600 to-teal-700', english_name = 'Misswake' WHERE id = 'brand-sb-4';  -- میسویک
UPDATE brands SET image_url = '/brands/kaput.png', logo_color = 'from-rose-600 to-red-700', english_name = 'Kaput' WHERE id = 'brand-sb-6';            -- کاپوت
UPDATE brands SET image_url = '/brands/dafi.png', logo_color = 'from-sky-500 to-blue-600', english_name = 'Dafi' WHERE id = 'brand-sb-2';              -- دافی
UPDATE brands SET image_url = '/brands/comeon.png', logo_color = 'from-emerald-500 to-green-700', english_name = 'Comeon' WHERE id = 'brand-sb-7';     -- کامان
UPDATE brands SET image_url = '/brands/nino.png', logo_color = 'from-cyan-500 to-blue-600', english_name = 'Nino' WHERE id = 'brand-sb-8';             -- نینو

-- Deactivate the old demo brand rows entirely (b1..b9) — they are now
-- fully superseded by the brand-sb-* rows above.
UPDATE brands SET active = 0 WHERE id IN ('b1','b2','b3','b4','b5','b6','b7','b8','b9');
