import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { api } from '../api';
import { Loading, ErrorBox, PageHeader } from '../components/Status';

const EMPTY_PRODUCT = {
  code: '',
  name: '',
  brand: '',
  category: '',
  imageUrl: '',
  cartonQuantity: 1,
  price: 0,
  unitPrice: 0,
  inStock: true,
  stockCount: 0,
  specialOffer: false,
  discountPercentage: '',
  isNew: false,
  description: '',
  active: true,
};

export default function Products() {
  const [products, setProducts] = useState<any[] | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api
      .products()
      .then((r) => setProducts(r.products))
      .catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const openNew = () => {
    setEditing({ ...EMPTY_PRODUCT });
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setEditing({ ...p });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('این محصول غیرفعال شود؟')) return;
    try {
      await api.deleteProduct(id);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      if (editing.id) {
        await api.updateProduct(editing.id, editing);
      } else {
        await api.createProduct(editing);
      }
      setShowForm(false);
      setEditing(null);
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="محصولات"
        subtitle="افزودن، ویرایش و مدیریت کاتالوگ محصولات"
        action={
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-800 transition"
          >
            <Plus size={16} /> محصول جدید
          </button>
        }
      />

      {error && <ErrorBox message={error} />}
      {!products && !error && <Loading />}

      {products && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="text-right px-4 py-3">نام</th>
                <th className="text-right px-4 py-3">برند</th>
                <th className="text-right px-4 py-3">قیمت</th>
                <th className="text-right px-4 py-3">موجودی</th>
                <th className="text-right px-4 py-3">وضعیت</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.brand}</td>
                  <td className="px-4 py-3">{Number(p.price).toLocaleString('fa-IR')}</td>
                  <td className="px-4 py-3">{p.stockCount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        p.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {p.inStock ? 'موجود' : 'ناموجود'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className="text-gray-500 hover:text-emerald-700">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="text-gray-500 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    محصولی ثبت نشده.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{editing.id ? 'ویرایش محصول' : 'محصول جدید'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="نام محصول" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} full />
              <Field label="کد" value={editing.code} onChange={(v) => setEditing({ ...editing, code: v })} />
              <Field label="برند" value={editing.brand} onChange={(v) => setEditing({ ...editing, brand: v })} />
              <Field label="دسته‌بندی" value={editing.category} onChange={(v) => setEditing({ ...editing, category: v })} />
              <Field
                label="آدرس تصویر"
                value={editing.imageUrl}
                onChange={(v) => setEditing({ ...editing, imageUrl: v })}
                full
              />
              <Field
                label="تعداد در کارتن"
                type="number"
                value={editing.cartonQuantity}
                onChange={(v) => setEditing({ ...editing, cartonQuantity: Number(v) })}
              />
              <Field
                label="قیمت کارتن"
                type="number"
                value={editing.price}
                onChange={(v) => setEditing({ ...editing, price: Number(v) })}
              />
              <Field
                label="قیمت واحد"
                type="number"
                value={editing.unitPrice}
                onChange={(v) => setEditing({ ...editing, unitPrice: Number(v) })}
              />
              <Field
                label="موجودی (تعداد)"
                type="number"
                value={editing.stockCount}
                onChange={(v) => setEditing({ ...editing, stockCount: Number(v) })}
              />
              <Field
                label="درصد تخفیف"
                type="number"
                value={editing.discountPercentage}
                onChange={(v) => setEditing({ ...editing, discountPercentage: v })}
              />
              <Field
                label="توضیحات"
                value={editing.description}
                onChange={(v) => setEditing({ ...editing, description: v })}
                full
                textarea
              />
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <Checkbox label="موجود است" checked={editing.inStock} onChange={(v) => setEditing({ ...editing, inStock: v })} />
              <Checkbox label="پیشنهاد ویژه" checked={editing.specialOffer} onChange={(v) => setEditing({ ...editing, specialOffer: v })} />
              <Checkbox label="محصول جدید" checked={editing.isNew} onChange={(v) => setEditing({ ...editing, isNew: v })} />
              <Checkbox label="فعال" checked={editing.active} onChange={(v) => setEditing({ ...editing, active: v })} />
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !editing.name || !editing.brand}
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

function Field({
  label,
  value,
  onChange,
  type = 'text',
  full = false,
  textarea = false,
}: {
  label: string;
  value: any;
  onChange: (v: string) => void;
  type?: string;
  full?: boolean;
  textarea?: boolean;
}) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {textarea ? (
        <textarea
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
      ) : (
        <input
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
      )}
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} className="accent-emerald-700" />
      {label}
    </label>
  );
}
