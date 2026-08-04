import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { toPersianDigits } from '../utils';
import { SeylanehLogo } from './SeylanehLogo';
import { Icon } from './Icon';

export const Header: React.FC = () => {
  const { viewScreen, navigateTo, cartTotalCount, currentCustomer, orders } = useApp();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const isSubPage = ['product-detail', 'checkout', 'order-success'].includes(viewScreen);

  const myRecentOrders = orders
    .filter((o) => o.customerId === currentCustomer.id)
    .slice(0, 5);

  return (
    <header className="bg-white/85 backdrop-blur-xl sticky top-0 z-30 border-b border-x border-[#e2e8f0] rounded-b-2xl grid grid-cols-3 items-center px-4 py-2.5 w-full max-w-md mx-auto h-16 shadow-sm relative">
      {/* Right column: back button on sub-pages, otherwise empty (logo moved to center) */}
      <div className="flex items-center justify-start">
        {isSubPage && (
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
        )}
      </div>

      {/* Center column: logo, always centered */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center justify-center bg-transparent border-none shadow-none"
        >
          <SeylanehLogo className="h-10 sm:h-11" />
        </button>
      </div>

      {/* Left column: notifications, orders, profile, cart */}
      {!isSubPage && (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setIsNotifOpen((v) => !v)}
            className="relative p-2 rounded-full hover:bg-[#f0f4f8] active:scale-95 transition-transform text-[#022c22] flex items-center justify-center"
            title="اعلان‌ها"
            aria-label="اعلان‌ها"
          >
            <Icon name="notifications" size={22} />
            {myRecentOrders.some((o) => o.status === 'pending') && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          <button
            onClick={() => navigateTo('my-orders')}
            className="relative p-2 rounded-full hover:bg-[#f0f4f8] active:scale-95 transition-transform text-[#022c22] flex items-center justify-center"
            title="سفارشات"
            aria-label="سفارشات"
          >
            <Icon name="receipt_long" size={22} />
          </button>

          <button
            onClick={() => navigateTo('account')}
            className="relative p-2 rounded-full hover:bg-[#f0f4f8] active:scale-95 transition-transform text-[#022c22] flex items-center justify-center"
            title="حساب کاربری"
            aria-label="حساب کاربری"
          >
            <Icon name="account_circle" size={22} />
          </button>

          <button
            onClick={() => navigateTo('cart')}
            className="relative p-2 rounded-full hover:bg-[#f0f4f8] active:scale-95 transition-transform text-[#022c22] flex items-center justify-center"
            title="سبد خرید"
            aria-label="سبد خرید"
          >
            <Icon name="shopping_cart" size={22} />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#006c4a] text-white text-[10px] font-extrabold min-w-[20px] h-5 px-0.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {toPersianDigits(cartTotalCount)}
              </span>
            )}
          </button>
        </div>
      )}

      {isNotifOpen && (
        <div className="absolute top-[calc(100%+6px)] left-3 w-72 bg-white border border-[#e2e8f0] rounded-2xl shadow-lg overflow-hidden z-50">
          <div className="p-3 text-[12px] font-extrabold text-[#022c22] bg-[#f0f4f8] border-b border-[#e2e8f0]">
            اعلان‌های سفارش
          </div>
          {myRecentOrders.length === 0 ? (
            <p className="text-[12px] text-[#6f7973] text-center py-5">هنوز سفارشی ثبت نکرده‌اید.</p>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {myRecentOrders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setIsNotifOpen(false);
                    navigateTo('my-orders', { order: o });
                  }}
                  className="w-full px-3.5 py-2.5 flex flex-col items-start text-right border-b border-[#f1f5f9] last:border-none hover:bg-[#f6fafe] transition-colors"
                >
                  <span className="text-[12px] font-bold text-[#171c1f]">{o.orderNumber}</span>
                  <span className="text-[11px] text-[#006c4a] mt-0.5">{o.statusText}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
