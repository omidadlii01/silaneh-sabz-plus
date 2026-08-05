-- Migration 0016: temporarily hide products that have no real product photo
-- (image_url is empty/NULL). These were rendering as broken images in the
-- app. Per user decision (2026-08-05): remove them from the customer-facing
-- catalog for now; they will be re-activated from the admin panel once a
-- real photo is uploaded for each. Soft-deleted via active=0 (same pattern
-- already used for the old demo catalog in migration 0006), so no data is
-- lost and they can be brought back at any time.

UPDATE products SET active = 0 WHERE id IN (
  'sb-100102102', -- دستمال مرطوب بزرگسالان درب دار دافی
  'sb-100103112', -- دستمال مرطوب پاک کننده آرایش 10Q آووکادو درب دار دافی
  'sb-100127101', -- کرم عطری ورساچه تیوپی دافی
  'sb-100127102', -- کرم عطری شنل تیوپی دافی
  'sb-100127103', -- کرم عطری گود گرل تیوپی دافی
  'sb-100127105', -- کرم عطری جادور تیوپی دافی
  'sb-100127106', -- کرم عطری ایفوریا تیوپی دافی
  'sb-160111101', -- دستمال مرطوب خوشبو کننده بدن توتال آمبرال
  'sb-220306101', -- کرم گرم کننده و ضد درد کتف و گردن آتل
  'sb-300128108', -- کرم پمپی ب کمپلکس ویتامین سی 400 میل
  'sb-300128403', -- کرم پمپی ویتامین سی 200 میل کامان
  'sb-300176111', -- بالم لب نرم و براق کننده ویتامین سی کامان
  'sb-300301101', -- بالم پای شی باتر کامان
  'sb-300998109', -- استند 25 عددی بالم دست و پا کامان
  'sb-400147111', -- خمیر دندان کودک استیچ میسویک
  'sb-400271101', -- مسواک بزرگسالان سافت کلینیکال میسویک
  'sb-600603101', -- کاندوم کدکس 3 عددی کلاسیک
  'sb-600603105', -- کاندوم کدکس 3 عددی تاخیری
  'sb-600603125', -- کاندوم کدکس 3 عددی الترا نوبل ساده
  'sb-600612131', -- کاندوم کدکس 12 عددی جنسینگ ساده
  'sb-600612133', -- کاندوم کدکس 12 عددی ماتادور ساده
  'sb-600998104', -- استند ورقه ای 12 عددی کدکس
  'sb-600998105', -- استند کدکس 2 طبقه مارکت
  'sb-600998106', -- استند کدکس 1 طبقه مارکت
  'sb-610603109'  -- کاندوم کاپوت 3 عددی 7 کاره گرم ساده
) AND (image_url IS NULL OR image_url = '');
