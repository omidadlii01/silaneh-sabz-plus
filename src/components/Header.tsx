import React from 'react';
import { ShoppingBag, ArrowRight, ShieldCheck, Bell, User, ClipboardList } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toPersianDigits } from '../utils';
import { SeylanehLogo } from './SeylanehLogo';

export const Header: React.FC = () => {
  const {
    viewScreen,
    navigateTo,
    cartTotalCount,
    isAdmin,
  } = useApp();

  const isSubPage = ['product-detail', 'checkout', 'order-success'].includes(viewScreen);

  return (
    <header className="sticky top-0 z-30 bg-white text-slate-900 shadow-sm border-b border-slate-200">
      <div className="max-w-md mx-auto px-3 h-14 grid grid-cols-3 items-center">
        {/* Right column: back button on sub-pages, admin badge otherwise */}
        <div className="flex items-center justify-start">
          {isSubPage ? (
            <button
              onClick={() => {
                if (viewScreen === 'product-detail') navigateTo('products');
                else if (viewScreen === 'checkout') navigateTo('cart');
                else navigateTo('home');
              }}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-1 text-sm font-medium"
            >
              <ArrowRight className="w-5 h-5" />
              <span>بازگشت</span>
            </button>
          ) : isAdmin ? (
            <button
              onClick={() => navigateTo('admin')}
              className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>مدیریت</span>
            </button>
          ) : null}
        </div>

        {/* Center column: logo, always visible and centered */}
        <div className="flex items-center justify-center">
          <div
            onClick={() => navigateTo('home')}
            className="flex items-center cursor-pointer"
          >
            <SeylanehLogo className="h-8" />
          </div>
        </div>

        {/* Left column: notification, orders, profile, cart */}
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => navigateTo('account')}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="اعلان‌ها"
          >
            <Bell className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigateTo('my-orders')}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="سفارشات"
          >
            <ClipboardList className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigateTo('account')}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="حساب کاربری"
          >
            <User className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigateTo('cart')}
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="سبد خرید"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-extrabold min-w-[18px] h-[18px] px-0.5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {toPersianDigits(cartTotalCount)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
