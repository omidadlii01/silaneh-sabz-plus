import React from 'react';
import { useApp } from '../context/AppContext';
import { toPersianDigits } from '../utils';
import { SeylanehLogo } from './SeylanehLogo';
import { Icon } from './Icon';

export const Header: React.FC = () => {
  const { viewScreen, navigateTo, cartTotalCount, isAdmin } = useApp();

  const isSubPage = ['product-detail', 'checkout', 'order-success'].includes(viewScreen);

  return (
    <header className="bg-white/85 backdrop-blur-xl sticky top-0 z-30 border-b border-[#e2e8f0] flex justify-between items-center px-4 py-2.5 w-full max-w-md mx-auto h-16 shadow-sm">
      {/* Right side (RTL): back button on sub-pages, otherwise logo + brand name */}
      <div className="flex items-center gap-2.5 flex-row-reverse">
        {isSubPage ? (
          <button
            onClick={() => {
              if (viewScreen === 'product-detail') navigateTo('products');
              else if (viewScreen === 'checkout') navigateTo('cart');
              else navigateTo('home');
            }}
            className="flex items-center gap-1 text-[#022c22] font-bold text-sm p-1.5 -mr-1.5 rounded-lg hover:bg-[#f0f4f8] active:scale-95 transition-all"
          >
            <Icon name="arrow_forward" size={22} />
            <span>بازگشت</span>
          </button>
        ) : (
          <>
            <div className="flex flex-col text-right">
              <span className="font-['Vazirmatn'] text-[18px] sm:text-[19px] font-black text-[#022c22] leading-tight">
                سیلانه <span className="text-[#006c4a] font-black">سبز</span>
              </span>
              <span className="text-[10px] text-[#006c4a] font-bold tracking-wide">پلاس B2B</span>
            </div>
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center justify-center bg-transparent border-none shadow-none"
            >
              <SeylanehLogo className="h-10 sm:h-11" />
            </button>
          </>
        )}
      </div>

      {/* Left side (RTL): actions */}
      <div className="flex items-center gap-1.5">
        {isAdmin && !isSubPage && (
          <button
            onClick={() => navigateTo('admin')}
            className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] px-2.5 py-1 rounded-full font-bold ml-1"
          >
            <Icon name="verified_user" size={14} />
            <span>مدیریت</span>
          </button>
        )}

        <button
          onClick={() => navigateTo('cart')}
          className="relative p-2 rounded-full hover:bg-[#f0f4f8] active:scale-95 transition-transform text-[#022c22] flex items-center justify-center"
          title="سبد خرید"
          aria-label="سبد خرید"
        >
          <Icon name="shopping_cart" size={24} />
          {cartTotalCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#006c4a] text-white text-[10px] font-extrabold min-w-[20px] h-5 px-0.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              {toPersianDigits(cartTotalCount)}
            </span>
          )}
        </button>

        <button
          onClick={() => navigateTo('my-orders')}
          className="relative p-2 rounded-full hover:bg-[#f0f4f8] active:scale-95 transition-transform text-[#022c22] flex items-center justify-center"
          title="سفارشات"
          aria-label="سفارشات"
        >
          <Icon name="receipt_long" size={24} />
        </button>

        <button
          onClick={() => navigateTo('account')}
          className="relative p-2 rounded-full hover:bg-[#f0f4f8] active:scale-95 transition-transform text-[#022c22] flex items-center justify-center"
          title="حساب کاربری"
          aria-label="حساب کاربری"
        >
          <Icon name="account_circle" size={24} />
        </button>
      </div>
    </header>
  );
};
