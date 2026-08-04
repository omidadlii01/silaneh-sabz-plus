import React from 'react';
import { toPersianDigits } from '../utils/persian';

// Real app logo (already deployed under /public), replacing the AI Studio
// placeholder googleusercontent URL.
const LOGO_URL = '/logo-full.png';

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
    <header className="bg-white/85 backdrop-blur-xl sticky top-0 z-40 border-b border-x border-[#e2e8f0] rounded-b-2xl flex justify-between items-center px-4 py-2.5 w-full max-w-[448px] mx-auto h-16 flex-row shadow-sm">
      {/* Brand Title and Logo (RTL side right) */}
      <div className="flex items-center gap-2.5 flex-row-reverse">
        <div className="flex flex-col text-right">
          <span className="font-['Vazirmatn'] text-[18px] sm:text-[19px] font-black text-[#022c22] leading-tight">
            سیلانه <span className="text-[#006c4a] font-black">سبز</span>
          </span>
          <span className="text-[10px] text-[#006c4a] font-bold tracking-wide">پلاس B2B</span>
        </div>
        <div className="flex items-center justify-center bg-transparent border-none shadow-none">
          <img
            src={LOGO_URL}
            alt="سیلانه سبز"
            className="h-10 sm:h-11 w-auto object-contain bg-transparent mix-blend-multiply"
          />
        </div>
      </div>

      {/* Action Buttons (Left Side in RTL layout) */}
      <div className="flex items-center gap-1.5">
        {/* Shopping Cart Button */}
        <button
          onClick={onOpenCart}
          className="relative p-2 rounded-full hover:bg-[#f0f4f8] active:scale-95 transition-transform text-[#022c22] flex items-center justify-center"
          title="سبد خرید"
        >
          <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#006c4a] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              {toPersianDigits(cartItemCount)}
            </span>
          )}
        </button>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-full hover:bg-[#f0f4f8] active:scale-95 transition-transform text-[#022c22] flex items-center justify-center"
          title="اعلا‌ن‌ها"
        >
          <span className="material-symbols-outlined text-[24px]">notifications</span>
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
};
