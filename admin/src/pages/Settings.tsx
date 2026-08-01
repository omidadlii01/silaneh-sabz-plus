import React, { useEffect, useState } from 'react';
import { Save, Check } from 'lucide-react';
import { api } from '../api';
import { Loading, ErrorBox, PageHeader } from '../components/Status';

export default function Settings() {
  const [settings, setSettings] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .settings()
      .then((r) => setSettings(r.settings))
      .catch((e) => setError(e.message));
  }, []);

  const update = (key: string, value: string) => setSettings((prev) => ({ ...(prev || {}), [key]: value }));

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const r = await api.updateSettings(settings);
      setSettings(r.settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <PageHeader title="تنظیمات اپ" subtitle="مدیریت بنر، پیام‌ها و اطلاعات عمومی اپلیکیشن" />

      {error && <ErrorBox message={error} />}
      {!settings && !error && <Loading />}

      {settings && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.banner_active === '1'}
              onChange={(e) => update('banner_active', e.target.checked ? '1' : '0')}
              className="accent-emerald-700"
            />
            نمایش بنر در اپ
          </label>

          <div>
            <label className="block text-xs text-gray-500 mb-1">متن بنر</label>
            <textarea
              value={settings.banner_text || ''}
              onChange={(e) => update('banner_text', e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">پیام خوش‌آمدگویی</label>
            <input
              value={settings.welcome_message || ''}
              onChange={(e) => update('welcome_message', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">شماره پشتیبانی</label>
            <input
              value={settings.support_phone || ''}
              onChange={(e) => update('support_phone', e.target.value)}
              dir="ltr"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">اطلاعیه (در صورت نیاز)</label>
            <textarea
              value={settings.announcement || ''}
              onChange={(e) => update('announcement', e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-emerald-800 transition disabled:opacity-50"
          >
            {saved ? <Check size={16} /> : <Save size={16} />}
            {saving ? 'در حال ذخیره...' : saved ? 'ذخیره شد' : 'ذخیره تغییرات'}
          </button>
        </div>
      )}
    </div>
  );
}
