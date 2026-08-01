CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

INSERT OR IGNORE INTO app_settings (key, value) VALUES
  ('banner_text', ''),
  ('banner_active', '0'),
  ('welcome_message', ''),
  ('support_phone', '۰۹۱۲۰۰۰۰۰۰۰'),
  ('announcement', '');
