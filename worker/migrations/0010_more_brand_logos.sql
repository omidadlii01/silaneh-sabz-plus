-- Migration 0010: wire up 5 more brand logos the user provided.
UPDATE brands SET image_url = '/brands/zen.jpg', logo_color = 'from-teal-600 to-cyan-700' WHERE id = 'brand-sb-13';       -- زِن
UPDATE brands SET image_url = '/brands/kalamin.webp', logo_color = 'from-indigo-600 to-blue-700' WHERE id = 'brand-sb-11'; -- کالمین
UPDATE brands SET image_url = '/brands/mislip.png', logo_color = 'from-pink-500 to-rose-600' WHERE id = 'brand-sb-12';    -- میس لیپ
UPDATE brands SET image_url = '/brands/vitas.webp', logo_color = 'from-orange-500 to-amber-600' WHERE id = 'brand-sb-14'; -- ویت آس
UPDATE brands SET image_url = '/brands/icebal.png', logo_color = 'from-sky-500 to-cyan-600' WHERE id = 'brand-sb-10';     -- آیس بال
-- Note: "اتو" (brand-sb-15) logo was not included in this batch; still pending.
