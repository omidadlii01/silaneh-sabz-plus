-- Fix two banner image URLs in 0017 that didn't exactly match the real
-- product image_url values (off by Persian-digit/extra-text differences
-- in the filename), which would have shown as broken images.

UPDATE weekly_offers SET image_url =
  'https://raw.githubusercontent.com/omidadlii01/images_png/main/600610103_%DA%A9%D8%A7%D9%86%D8%AF%D9%88%D9%85%20%DA%A9%D8%AF%DA%A9%D8%B3%20%DB%B1%DB%B0%20%D8%B9%D8%AF%D8%AF%DB%8C%20%DB%B3%20%D9%85%DB%8C%DA%A9%D8%B1%D9%88%D9%86.png'
  WHERE id = 'wo-kodex-01';

UPDATE weekly_offers SET image_url =
  'https://raw.githubusercontent.com/omidadlii01/images_png/main/400142101_%D8%AE%D9%85%DB%8C%D8%B1%20%D8%AF%D9%86%D8%AF%D8%A7%D9%86%20%D9%85%DB%8C%D8%B3%D9%88%DB%8C%DA%A9%20%D9%85%D8%AF%D9%84%20Total%208%20%D8%AD%D8%AC%D9%85%20100%20%D9%85%DB%8C%D9%84%DB%8C%20%D9%84%DB%8C%D8%AA%D8%B1.png'
  WHERE id = 'wo-misswake-01';
