-- Migration 0008: seed real product brands into brands table (used for brand filter/list in the customer app)
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-1', 'آمبرال', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-2', 'دافی', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-3', 'کدکس', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-4', 'میسویک', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-5', 'پیکسل', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-6', 'کاپوت', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-7', 'کامان', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-8', 'نینو', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-9', 'هیر واتر', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-10', 'آیس بال', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-11', 'کالمین', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-12', 'میس لیپ', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-13', 'زِن', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-14', 'ویت آس', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-15', 'اتو', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-16', 'آیس بابل', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-17', 'فورمی', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;
INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES ('brand-sb-18', 'آتل', '', '', '', 1) ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=1;