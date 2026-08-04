import React from 'react';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/Icon';

export const VisitorView: React.FC = () => {
  const { currentCustomer, orders } = useApp();

  const myOrders = orders.filter((o) => o.customerId === currentCustomer.id);
  const totalOrdersCount = myOrders.length;

  const hasMarketer = !!currentCustomer.marketerName;

  return (
    <div className="pb-28 pt-4 px-4 space-y-5">
      <h1 className="text-[18px] font-extrabold text-[#022c22]">ارتباط با ویزیتور</h1>

      {hasMarketer ? (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#0F5338] text-white flex items-center justify-center font-black text-[18px] shrink-0">
              {currentCustomer.marketerName?.slice(0, 2)}
            </div>
            <div>
              <span className="text-[11px] text-[#006c4a] font-bold block">ویزیتور اختصاصی شما</span>
              <span className="text-[15px] font-extrabold text-[#022c22]">{currentCustomer.marketerName}</span>
              {currentCustomer.marketerPhone && (
                <span className="text-[12px] text-[#6f7973] block dir-ltr text-right">
                  {currentCustomer.marketerPhone}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={`tel:${currentCustomer.marketerPhone}`}
              className="flex items-center justify-center gap-1.5 bg-[#0F5338] hover:bg-[#004532] text-white rounded-xl py-2.5 text-[13px] font-bold active:scale-95 transition-all shadow-xs"
            >
              <Icon name="schedule" size={16} />
              تماس تلفنی
            </a>
            <a
              href={`https://wa.me/${(currentCustomer.marketerPhone || '').replace(/^0/, '98')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 border border-[#006c4a] text-[#006c4a] hover:bg-[#006c4a]/5 rounded-xl py-2.5 text-[13px] font-bold active:scale-95 transition-all"
            >
              <Icon name="history" size={16} />
              واتس‌اپ
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 text-[13px] leading-relaxed">
          هنوز ویزیتوری برای حساب شما ثبت نشده است. برای هماهنگی، لطفاً با پشتیبانی سیلانه سبز تماس بگیرید.
        </div>
      )}

      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-xs">
        <h3 className="text-[13px] font-extrabold text-[#171c1f] mb-2">سابقه‌ی همکاری شما</h3>
        <p className="text-[12px] text-[#6f7973] leading-relaxed">
          تاکنون <span className="font-black text-[#006c4a]">{totalOrdersCount}</span> سفارش از طریق سامانه سیلانه
          سبز ثبت کرده‌اید. ویزیتور شما می‌تواند در تعیین زمان تحویل، شرایط پرداخت و پیشنهادهای خرید عمده به شما
          کمک کند.
        </p>
      </div>
    </div>
  );
};
