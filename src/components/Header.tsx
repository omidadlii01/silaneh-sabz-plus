import React from 'react';
import { toPersianDigits } from '../utils/persian';
import logoImg from '../assets/logo-header-new.png';

const LOGO_URL = logoImg;

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenCart: () => void;
  cartItemCount: number;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenCart,
  cartItemCount,
  unreadNotificationsCount = 2,
}) => {
  return (
    <header
      className="bg-white/85 backdrop-blur-xl sticky top-0 z-40 border-b border-x border-[#e2e8f0]/70 rounded-b-2xl flex justify-between items-center px-4 pb-2.5 w-full max-w-[448px] mx-auto min-h-16 flex-row shadow-[0_1px_0_rgba(2,44,34,0.03),0_8px_22px_-14px_rgba(2,44,34,0.18)]"
      style={{ paddingTop: 'calc(0.625rem + env(safe-area-inset-top))' }}
    >
      {/* Brand Title and Logo (RTL side right) */}
      <div className="flex items-center gap-2.5 flex-row-reverse shrink-0 min-w-0">
        <div className="flex flex-col text-right">
          <span className="font-['Vazirmatn'] text-[18px] sm:text-[19px] font-black text-[#022c22] leading-tight tracking-tight">
            سیلانه{' '}
            <span className="bg-gradient-to-l from-[#006c4a] to-[#059669] bg-clip-text text-transparent font-black">
              سبز
            </span>
          </span>
          <span className="text-[10px] text-[#006c4a]/90 font-bold tracking-wider">پلاس B2B</span>
        </div>
        <div className="relative flex items-center justify-center bg-transparent border-none shadow-none">
          <div className="absolute inset-0 rounded-full bg-[#34d399]/25 blur-md scale-90" />
          <img
            src={LOGO_URL}
            alt="سیلانه سبز"
            className="relative h-10 sm:h-11 w-auto object-contain bg-transparent mix-blend-multiply drop-shadow-[0_2px_6px_rgba(0,108,74,0.18)]"
          />
        </div>
      </div>

      {/* Action Buttons (Left Side in RTL layout) */}
      <div className="flex items-center gap-1.5">
        {/* Shopping Cart Button */}
        <button
          onClick={onOpenCart}
          className="relative p-2 rounded-full hover:bg-[#ecfdf5] active:bg-[#d1fae5] active:scale-90 transition-all duration-150 text-[#022c22] flex items-center justify-center"
          title="سبد خرید"
        >
          <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[#059669] to-[#006c4a] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-[0_2px_6px_rgba(0,108,74,0.4)]">
              {toPersianDigits(cartItemCount)}
            </span>
          )}
        </button>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-full hover:bg-[#ecfdf5] active:bg-[#d1fae5] active:scale-90 transition-all duration-150 text-[#022c22] flex items-center justify-center"
          title="اعلا‌ن‌ها"
        >
          <span className="material-symbols-outlined text-[24px]">notifications</span>
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-br from-[#f87171] to-[#ba1a1a] rounded-full ring-2 ring-white animate-pulse shadow-[0_0_6px_rgba(186,26,26,0.6)]" />
          )}
        </button>
      </div>
    </header>
  );
};
