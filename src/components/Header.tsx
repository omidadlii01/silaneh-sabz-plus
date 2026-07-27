import React from 'react';
import { ShoppingBag, ArrowRight, ShieldCheck, Store, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toPersianDigits } from '../utils';
import { SeylanehLogo } from './SeylanehLogo';

export const Header: React.FC = () => {
  const {
    viewScreen,
    navigateTo,
    cartTotalCount,
    currentCustomer,
    isAdmin,
  } = useApp();

  const isSubPage = ['product-detail', 'checkout', 'order-success'].includes(viewScreen);

  return (
    <header className="sticky top-0 z-30 bg-emerald-950 text-white shadow-md border-b border-emerald-900">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left/Right depending on RTL: Back button or Logo */}
        <div className="flex items-center gap-2.5">
          {isSubPage ? (
            <button
              onClick={() => {
                if (viewScreen === 'product-detail') navigateTo('products');
                else if (viewScreen === 'checkout') navigateTo('cart');
                else navigateTo('home');
              }}
              className="p-1.5 rounded-lg text-emerald-200 hover:bg-emerald-900/60 active:scale-95 transition-all flex items-center gap-1 text-sm font-medium"
            >
              <ArrowRight className="w-5 h-5" />
              <span>بازگشت</span>
            </button>
          ) : (
            <div
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 cursor-pointer group py-1"
            >
              <SeylanehLogo className="h-9" lightText={true} />
            </div>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Admin badge if active */}
          {isAdmin ? (
            <button
              onClick={() => navigateTo('admin')}
              className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-1 rounded-full font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>مدیریت</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 text-xs text-emerald-200 bg-emerald-900/50 px-2 py-1 rounded-md">
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[100px]">{currentCustomer.storeName}</span>
            </div>
          )}

          {/* Cart Icon */}
          <button
            onClick={() => navigateTo('cart')}
            className="relative p-2 rounded-xl bg-emerald-900/70 border border-emerald-800 hover:bg-emerald-800 text-white active:scale-95 transition-all"
            aria-label="سبد خرید"
          >
            <ShoppingBag className="w-5 h-5 text-emerald-100" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-emerald-950 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-emerald-950 shadow-sm animate-pulse">
                {toPersianDigits(cartTotalCount)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
