import React from 'react';
import { CheckCircle, Home, ClipboardList, ShieldCheck, FileCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils';

export const OrderSuccessView: React.FC = () => {
  const { lastSubmittedOrder, navigateTo } = useApp();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 max-w-md mx-auto text-center space-y-5">
      {/* Animated Success Icon */}
      <div className="relative">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
          <CheckCircle className="w-14 h-14" />
        </div>
        <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 p-1.5 rounded-full shadow-xs">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Confirmation Title */}
      <div className="space-y-1">
        <h1 className="text-xl font-black text-slate-900">سفارش شما با موفقیت ثبت شد!</h1>
        <p className="text-xs text-slate-500 font-medium">
          پیش‌فاکتور سفارش عمده برای واحد پردازش انبار سیلانه سبز ارسال گردید.
        </p>
      </div>

      {/* Order Tracking Box */}
      {lastSubmittedOrder && (
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 shadow-xs text-right space-y-2.5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-xs text-slate-400 font-medium">کد پیگیری سفارش:</span>
            <span className="text-sm font-black text-emerald-800 font-mono">
              {lastSubmittedOrder.orderNumber}
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-slate-500">تاریخ ثبت:</span>
            <span className="font-bold text-slate-800">{lastSubmittedOrder.orderDate}</span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-slate-500">مبلغ کل فاکتور:</span>
            <span className="font-black text-slate-900">
              {formatCurrency(lastSubmittedOrder.finalAmount)}
            </span>
          </div>

          <div className="flex justify-between text-xs border-t border-slate-100 pt-2">
            <span className="text-slate-500">وضعیت سفارش:</span>
            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              در انتظار بررسی واحد فروش
            </span>
          </div>
        </div>
      )}

      {/* Informational Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-right text-xs text-amber-900 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-amber-950">
          <FileCheck className="w-4 h-4 text-amber-700" />
          <span>توضیحات فرآیند بررسی:</span>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-800">
          کارشناس فروش مربوطه جهت هماهنگی زمان تحویل بار و صدور فاکتور نهایی به زودی با شما تماس خواهند گرفت.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2 pt-2">
        <button
          onClick={() => {
            if (lastSubmittedOrder) {
              navigateTo('my-orders', { order: lastSubmittedOrder });
            } else {
              navigateTo('my-orders');
            }
          }}
          className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 text-xs"
        >
          <ClipboardList className="w-4 h-4" />
          <span>مشاهده وضعیت سفارش در سوابق</span>
        </button>

        <button
          onClick={() => navigateTo('home')}
          className="w-full py-3 bg-white text-slate-700 hover:bg-slate-50 font-bold border border-slate-200 rounded-2xl active:scale-98 transition-all flex items-center justify-center gap-2 text-xs"
        >
          <Home className="w-4 h-4" />
          <span>بازگشت به صفحه اصلی</span>
        </button>
      </div>
    </div>
  );
};
