-- Seed 4 real promotional weekly_offers using real catalog products
-- (2026-08-05). First 3 are shown in the rotating "WeeklyOffer" banner
-- (front-end cycles through them every 5s); the 4th (wo-recommended-01)
-- is the single "RecommendedPackage" box shown right below it.

-- 1) Kodex festival — matches the promo the user asked to recreate
INSERT INTO weekly_offers (id, title, image_url, discount_percentage, price, consumer_price, expires_at, active)
VALUES (
  'wo-kodex-01',
  'جشنواره فروش کدکس',
  'https://raw.githubusercontent.com/omidadlii01/images_png/main/600610103_%DA%A9%D8%A7%D9%86%D8%AF%D9%88%D9%85%20%DA%A9%D8%AF%DA%A9%D8%B3%2010%20%D8%B9%D8%AF%D8%AF%DB%8C%20%DA%A9%D9%84%D8%A7%D8%B3%DB%8C%DA%A9%2030%20%D9%85%DB%8C%DA%A9%D8%B1%D9%88%D9%86.png',
  28, 35200000, 48890000, '2026-08-08 23:59:59', 1
);
INSERT INTO weekly_offer_items (id, offer_id, product_id, quantity) VALUES
  ('woi-kodex-01a', 'wo-kodex-01', 'sb-600610103', 4),
  ('woi-kodex-01b', 'wo-kodex-01', 'sb-600612101', 4);

-- 2) Dafi wet-wipes bundle
INSERT INTO weekly_offers (id, title, image_url, discount_percentage, price, consumer_price, expires_at, active)
VALUES (
  'wo-dafi-01',
  'پیشنهاد ویژه دستمال مرطوب دافی',
  'https://raw.githubusercontent.com/omidadlii01/images_png/main/100103101_%D8%AF%D8%B3%D8%AA%D9%85%D8%A7%D9%84%20%D9%85%D8%B1%D8%B7%D9%88%D8%A8%20%D9%BE%D8%A7%DA%A9%20%DA%A9%D9%86%D9%86%D8%AF%D9%87%20%D8%A2%D8%B1%D8%A7%DB%8C%D8%B4%20%D8%AF%D8%A7%D9%81%DB%8C.png',
  20, 13090908, 16363000, '2026-08-10 23:59:59', 1
);
INSERT INTO weekly_offer_items (id, offer_id, product_id, quantity) VALUES
  ('woi-dafi-01a', 'wo-dafi-01', 'sb-100103115', 6),
  ('woi-dafi-01b', 'wo-dafi-01', 'sb-100103101', 6);

-- 3) Misswake toothpaste bundle
INSERT INTO weekly_offers (id, title, image_url, discount_percentage, price, consumer_price, expires_at, active)
VALUES (
  'wo-misswake-01',
  'تخفیف کارتنی خمیردندان میسویک',
  'https://raw.githubusercontent.com/omidadlii01/images_png/main/400142101_%D8%AE%D9%85%DB%8C%D8%B1%D8%AF%D9%86%D8%AF%D8%A7%D9%86%20%D8%AA%D9%88%D8%AA%D8%A7%D9%84%20%D9%85%DB%8C%D8%B3%D9%88%DB%8C%DA%A9.png',
  15, 21723318, 25557000, '2026-08-09 23:59:59', 1
);
INSERT INTO weekly_offer_items (id, offer_id, product_id, quantity) VALUES
  ('woi-misswake-01a', 'wo-misswake-01', 'sb-400142101', 3),
  ('woi-misswake-01b', 'wo-misswake-01', 'sb-400142211', 3);

-- 4) Recommended package (the single non-rotating box) — a cross-brand
-- multi-category bundle (deodorant + wipes + toothpaste), 3 product types,
-- mirroring the "3 نوع محصول" style of the original AI Studio design.
INSERT INTO weekly_offers (id, title, image_url, discount_percentage, price, consumer_price, expires_at, active)
VALUES (
  'wo-recommended-01',
  'پکیج پیشنهادی سیلانه سبز',
  'https://raw.githubusercontent.com/omidadlii01/images_png/main/160152102_%D8%A7%D8%B3%D8%AA%DB%8C%DA%A9%20%D8%B2%D9%86%D8%A7%D9%86%D9%87%20%D8%A7%D9%86%D8%B1%DA%98%DB%8C%20%D8%A2%D9%85%D8%A8%D8%B1%D9%84%D8%A7.png',
  22, 32189720, 41269000, '2026-08-08 23:59:59', 1
);
INSERT INTO weekly_offer_items (id, offer_id, product_id, quantity) VALUES
  ('woi-rec-01a', 'wo-recommended-01', 'sb-160152102', 4),
  ('woi-rec-01b', 'wo-recommended-01', 'sb-100107101', 6),
  ('woi-rec-01c', 'wo-recommended-01', 'sb-400142101', 4);
