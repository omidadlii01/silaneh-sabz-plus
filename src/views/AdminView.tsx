import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Package,
  Users,
  ClipboardList,
  DollarSign,
  Plus,
  Edit2,
  Check,
  X,
  ArrowRight,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus, Product } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency, toPersianDigits } from '../utils';

export const AdminView: React.FC = () => {
  const {
    orders,
    products,
    customers,
    updateOrderStatus,
    updateProduct,
    addProduct,
    setIsAdmin,
    navigateTo,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'products' | 'customers'>('orders');

  // Stats
  const totalOrdersCount = orders.length;
  const newOrdersCount = orders.filter((o) => o.status === 'ثبت شده' || o.status === 'در حال بررسی').length;
  const totalOrderValue = orders.reduce((acc, o) => acc + o.finalAmount, 0);

  // Edit Product Modal / Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);

  // Form Fields for new/edit product
  const [formData, setFormData] = useState({
    name: '',
    brand: 'کدکس',
    category: 'بهداشت زناشویی',
    price: 2000000,
    unitPrice: 50000,
    cartonQuantity: 24,
    inStock: true,
    stockCount: 50,
    specialOffer: false,
    description: '',
    imageColor: 'bg-emerald-100 text-emerald-800',
    imageUrl: '',
    iconType: 'box',
  });

  const colorOptions = [
    { label: 'زمردی', value: 'bg-emerald-100 text-emerald-800' },
    { label: 'رز / قرمز', value: 'bg-rose-100 text-rose-800' },
    { label: 'آبی / کهربایی', value: 'bg-amber-100 text-amber-800' },
    { label: 'آبی دریا', value: 'bg-blue-100 text-blue-800' },
    { label: 'بنفش', value: 'bg-purple-100 text-purple-800' },
    { label: 'فیروزه‌ای', value: 'bg-teal-100 text-teal-800' },
    { label: 'آسمانی', value: 'bg-sky-100 text-sky-800' },
  ];

  const iconOptions = [
    { label: 'جعبه (کارتن)', value: 'box' },
    { label: 'سپر محافظ', value: 'shield' },
    { label: 'قطره / سرم', value: 'droplet' },
    { label: 'درخشش / زیبایی', value: 'sparkles' },
    { label: 'آفتاب / کرم', value: 'sun' },
    { label: 'لایه‌ای', value: 'layers' },
    { label: 'قلب / مراقبت', value: 'heart' },
    { label: 'انرژی / شوینده', value: 'zap' },
    { label: 'لبخند / بهداشت', value: 'smile' },
  ];

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      unitPrice: p.unitPrice,
      cartonQuantity: p.cartonQuantity,
      inStock: p.inStock,
      stockCount: p.stockCount,
      specialOffer: p.specialOffer,
      description: p.description,
      imageColor: p.imageColor || 'bg-emerald-100 text-emerald-800',
      imageUrl: p.imageUrl || '',
      iconType: p.iconType || 'box',
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        price: Number(formData.price),
        unitPrice: Number(formData.unitPrice),
        cartonQuantity: Number(formData.cartonQuantity),
        inStock: formData.inStock,
        stockCount: Number(formData.stockCount),
        specialOffer: formData.specialOffer,
        description: formData.description,
        imageColor: formData.imageColor,
        imageUrl: formData.imageUrl,
        iconType: formData.iconType,
      });
      setEditingProduct(null);
    } else if (isAddingNewProduct) {
      addProduct({
        code: `PRD-${Math.floor(100 + Math.random() * 900)}`,
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        imageColor: formData.imageColor,
        imageUrl: formData.imageUrl,
        iconType: formData.iconType,
        cartonQuantity: Number(formData.cartonQuantity),
        price: Number(formData.price),
        unitPrice: Number(formData.unitPrice),
        inStock: formData.inStock,
        stockCount: Number(formData.stockCount),
        specialOffer: formData.specialOffer,
        description: formData.description,
        active: true,
      });
      setIsAddingNewProduct(false);
    }
  };

  // Order status options
  const statusOptions: OrderStatus[] = [
    'ثبت شده',
    'در حال بررسی',
    'تأیید شده',
    'آماده ارسال',
    'ارسال شده',
    'تحویل شده',
    'لغو شده',
  ];

  return (
    <div className="pb-20 pt-3 px-3 sm:px-4 max-w-md mx-auto space-y-4">
      {/* Admin Top Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-black text-amber-400">پنل مدیریت فروش سیلانه سبز</h2>
            <p className="text-[10px] text-slate-300">مدیریت سفارشات، قیمت کالاها و مشتریان</p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsAdmin(false);
            navigateTo('home');
          }}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1"
        >
          <ArrowRight className="w-4 h-4" />
          <span>خروج</span>
        </button>
      </div>

      {/* Overview Metric Stats Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white border border-slate-200 rounded-2xl p-2.5 text-center shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold block">کل سفارشات</span>
          <span className="text-sm font-black text-slate-900">
            {toPersianDigits(totalOrdersCount)}
          </span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 text-center shadow-2xs">
          <span className="text-[10px] text-amber-700 font-bold block">سفارشات جدید</span>
          <span className="text-sm font-black text-amber-900">
            {toPersianDigits(newOrdersCount)}
          </span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 text-center shadow-2xs">
          <span className="text-[10px] text-emerald-700 font-bold block">مجموع فروش</span>
          <span className="text-xs font-black text-emerald-900">
            {formatCurrency(totalOrderValue)}
          </span>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setActiveAdminTab('orders')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
            activeAdminTab === 'orders'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="w-4 h-4 text-emerald-700" />
          <span>سفارشات ({toPersianDigits(orders.length)})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('products')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
            activeAdminTab === 'products'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4 text-emerald-700" />
          <span>محصولات ({toPersianDigits(products.length)})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('customers')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
            activeAdminTab === 'customers'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-700" />
          <span>مشتریان ({toPersianDigits(customers.length)})</span>
        </button>
      </div>

      {/* TAB 1: ORDER MANAGEMENT */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 font-mono">
                      {order.orderNumber}
                    </span>
                    <StatusBadge status={order.status} size="sm" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 mt-0.5 block">
                    {order.storeName}
                  </span>
                </div>

                <div className="text-left">
                  <span className="text-xs font-black text-emerald-800 block">
                    {formatCurrency(order.finalAmount)}
                  </span>
                  <span className="text-[10px] text-slate-400">{order.orderDate}</span>
                </div>
              </div>

              {/* Order items count */}
              <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl">
                <span className="font-bold">اقلام: </span>
                {order.items.map((i) => `${i.productName} (${toPersianDigits(i.quantity)} کارتن)`).join('، ')}
              </div>

              {/* Customer note if any */}
              {order.customerNote && (
                <div className="text-[11px] text-slate-500 bg-blue-50/50 p-2 rounded-xl border border-blue-100">
                  <span className="font-bold text-blue-900">یادداشت مشتری: </span>
                  {order.customerNote}
                </div>
              )}

              {/* Status Updater Dropdown */}
              <div className="pt-1 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 flex-none">تغییر وضعیت:</span>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 w-full"
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeAdminTab === 'products' && (
        <div className="space-y-3">
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsAddingNewProduct(true);
            }}
            className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن محصول جدید به کاتالوگ</span>
          </button>

          <div className="space-y-2.5">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                      {p.brand}
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate">{p.name}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                    <span>{formatCurrency(p.price)} / کارتن</span>
                    <span>•</span>
                    <span>{toPersianDigits(p.cartonQuantity)} عدد در کارتن</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-none">
                  {/* Stock Toggle Quick Action */}
                  <button
                    onClick={() =>
                      updateProduct({ ...p, inStock: !p.inStock, stockCount: p.inStock ? 0 : 50 })
                    }
                    className={`px-2 py-1 rounded-xl text-[10px] font-bold border ${
                      p.inStock
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {p.inStock ? 'موجود' : 'ناموجود'}
                  </button>

                  <button
                    onClick={() => handleEditClick(p)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                    title="ویرایش محصول"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER DIRECTORY */}
      {activeAdminTab === 'customers' && (
        <div className="space-y-3">
          {customers.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs space-y-2 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="font-extrabold text-slate-900">{c.storeName}</h3>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold mt-0.5 inline-block">
                    {c.businessType}
                  </span>
                </div>
                <span className="font-mono text-slate-400 font-bold">کد: {c.code}</span>
              </div>

              <div className="space-y-1 text-slate-600">
                <div>مدیر: {c.ownerName} | همراه: {c.phone}</div>
                <div>آدرس: {c.address}</div>
                <div className="text-emerald-800 font-bold pt-1 border-t border-slate-100">
                  ویزیتور مربوطه: {c.marketerName} ({c.marketerPhone})
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal / Form for Product Edit or Create */}
      {(editingProduct || isAddingNewProduct) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-extrabold text-slate-900">
                {editingProduct ? 'ویرایش اطلاعات محصول' : 'افزودن محصول جدید'}
              </h3>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddingNewProduct(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">نام محصول (فارسی)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">برند</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">دسته بندی</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">قیمت کارتن (تومان)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">تعداد در کارتن</label>
                  <input
                    type="number"
                    required
                    value={formData.cartonQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, cartonQuantity: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">رنگ تم تصویر</label>
                  <select
                    value={formData.imageColor}
                    onChange={(e) => setFormData({ ...formData, imageColor: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800"
                  >
                    {colorOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">آیکون کالا</label>
                  <select
                    value={formData.iconType}
                    onChange={(e) => setFormData({ ...formData, iconType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800"
                  >
                    {iconOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>موجود در انبار</span>
                </label>

                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.specialOffer}
                    onChange={(e) => setFormData({ ...formData, specialOffer: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span>پیشنهاد ویژه</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">آدرس تصویر محصول (URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-left font-mono text-xs dir-ltr"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl text-xs mt-2 transition-colors"
              >
                ذخیره تغییرات
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
