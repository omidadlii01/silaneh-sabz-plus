import React, { useState } from 'react';
import {
  Store,
  MapPin,
  UserCheck,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Phone,
  Package,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, toPersianDigits } from '../utils';

export const CheckoutView: React.FC = () => {
  const {
    currentCustomer,
    cart,
    cartInitialAmount,
    cartDiscountAmount,
    cartFinalAmount,
    cartTotalCount,
    submitOrder,
    navigateTo,
  } = useApp();

  const [customerNote, setCustomerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitOrder(customerNote);
      navigateTo('order-success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-24 pt-3 px-3 sm:px-4 max-w-md mx-auto space-y-4">
      {/* Back Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigateTo('cart')}
          className="p-1.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-base font-extrabold text-slate-900">تأیید نهایی فاکتور سفارش</h2>
          <p className="text-[11px] text-slate-500">بررسی مشخصات تحویل‌گیرنده و آدرس</p>
        </div>
      </div>

      {/* Customer / Store Details Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs border-b border-slate-100 pb-2">
          <Store className="w-4 h-4" />
          <span>مشخصات تحویل‌گیرنده (فروشگاه/داروخانه)</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">نام فروشگاه:</span>
            <span className="font-bold text-slate-800">{currentCustomer.storeName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">مدیر/صاحب امتیاز:</span>
            <span className="font-bold text-slate-800">{currentCustomer.ownerName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">شماره تماس:</span>
            <span className="font-bold text-slate-800">{currentCustomer.phone}</span>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-slate-400 block mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              آدرس دقیق ارسال انبار:
            </span>
            <p className="text-slate-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
              {currentCustomer.address}
            </p>
          </div>
        </div>
      </div>

      {/* Sales Representative Card */}
      <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-700 block font-medium">ویزیتور علمی/فروش شما</span>
            <span className="font-extrabold text-emerald-950">{currentCustomer.marketerName}</span>
          </div>
        </div>

        <a
          href={`tel:${currentCustomer.marketerPhone}`}
          className="bg-white text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1 text-[11px]"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>تماس</span>
        </a>
      </div>

      {/* Items Summary Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-emerald-700" />
            خلاصه اقلام فاکتور ({toPersianDigits(cart.length)} نوع کالا)
          </span>
          <span className="text-xs font-bold text-emerald-800">
            {toPersianDigits(cartTotalCount)} کارتن
          </span>
        </div>

        <div className="max-h-36 overflow-y-auto space-y-1.5 pl-1 text-xs">
          {cart.map((item) => (
            <div key={item.product.id} className="flex justify-between py-1 border-b border-slate-50">
              <span className="truncate max-w-[200px] text-slate-700 font-medium">
                {item.product.name}
              </span>
              <span className="font-bold text-slate-900">
                {toPersianDigits(item.quantity)} کارتن × {formatCurrency(item.product.price)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>مبلغ کل کالاها:</span>
            <span>{formatCurrency(cartInitialAmount)}</span>
          </div>

          {cartDiscountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>تخفیف ویژه همکاری:</span>
              <span>-{formatCurrency(cartDiscountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between font-black text-slate-900 text-sm pt-1 border-t border-slate-100">
            <span>مبلغ نهایی قابل پرداخت:</span>
            <span className="text-emerald-800">{formatCurrency(cartFinalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Order Notes Text Area */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-emerald-700" />
          یادداشت و توضیحات تکمیلی سفارش (اختیاری):
        </label>
        <textarea
          rows={3}
          value={customerNote}
          onChange={(e) => setCustomerNote(e.target.value)}
          placeholder="مثلاً: ترجیحاً تحویل صبح، یا شماره فاکتور رسمی..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Final Confirm Button */}
      <button
        onClick={handleFinalConfirm}
        disabled={isSubmitting}
        className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-2xl shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 text-sm"
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-300" />
        <span>{isSubmitting ? 'در حال ثبت سفارش...' : 'تأیید نهایی و ارسال به انبار'}</span>
      </button>
    </div>
  );
};
