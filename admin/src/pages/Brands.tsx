import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { api } from '../api';
import { Loading, ErrorBox, PageHeader } from '../components/Status';

const EMPTY_BRAND = { name: '', englishName: '', imageUrl: '', logoColor: '#0F5338', active: true };

export default function Brands() {
  const [brands, setBrands] = useState<any[] | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api
      .brands()
      .then((r) => setBrands(r.brands))
      .catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      if (editing.id) await api.updateBrand(editing.id, editing);
      else await api.createBrand(editing);
      setShowForm(false);
      setEditing(null);
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('این برند غیرفعال شود؟')) return;
    try {
      await api.deleteBrand(id);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="برندها"
        subtitle="مدیریت برندهای فروشگاه"
        action={
          <button
            onClick={() => {
              setEditing({ ...EMPTY_BRAND });
              setShowForm(true);
            }}
            className="flex items-center gap-1.5 bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-800 transition"
          >
            <Plus size={16} /> برند جدید
          </button>
        }
      />

      {error && <ErrorBox message={error} />}
      {!brands && !error && <Loading />}

      {brands && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((b) => (
            <div key={b.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 text-sm">{b.name}</p>
                <p className="text-xs text-gray-500">{b.englishName}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditing({ ...b });
                    setShowForm(true);
                  }}
                  className="text-gray-500 hover:text-emerald-700"
                >
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(b.id)} className="text-gray-500 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {brands.length === 0 && <p className="text-gray-400 text-sm">برندی ثبت نشده.</p>}
        </div>
      )}

      {showForm && editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{editing.id ? 'ویرایش برند' : 'برند جدید'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">نام برند (فارسی)</label>
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">نام انگلیسی</label>
                <input
                  value={editing.englishName}
                  onChange={(e) => setEditing({ ...editing, englishName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">آدرس تصویر لوگو</label>
                <input
                  value={editing.imageUrl}
                  onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!editing.active}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  className="accent-emerald-700"
                />
                فعال
              </label>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !editing.name}
                className="flex-1 bg-emerald-700 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-emerald-800 transition disabled:opacity-50"
              >
                {saving ? 'در حال ذخیره...' : 'ذخیره'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-5 bg-gray-100 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-200 transition"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
