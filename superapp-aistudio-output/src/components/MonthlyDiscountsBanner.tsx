// src/components/MonthlyDiscountsBanner.tsx
import React from 'react';
import { DiscountBanner } from '../types';

export interface MonthlyDiscountsBannerProps {
  banners?: DiscountBanner[];
  onViewAll?: () => void;
  onBannerClick?: (bannerId: string) => void;
}

const defaultBanners: DiscountBanner[] = [
  {
    id: 'banner-1',
    tag: 'ویژه جشنواره مهر',
    title: '۴۰٪ تخفیف محصولات بهداشتی',
    description: 'برای خریدهای بالای ۱۰ میلیون تومان',
    bgClass: 'bg-gradient-to-r from-orange-400 to-orange-600',
  },
  {
    id: 'banner-2',
    tag: 'باشگاه مشتریان',
    title: 'جایزه نقدی',
    description: 'قرعه‌کشی ماهیانه خریداران عمده',
    bgClass: 'bg-emerald-800',
  },
];

export const MonthlyDiscountsBanner: React.FC<MonthlyDiscountsBannerProps> = ({
  banners = defaultBanners,
  onViewAll,
  onBannerClick,
}) => {
  return (
    <section className="px-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">تخفیفات ماهانه</h2>
        <button
          type="button"
          onClick={onViewAll || (() => {/* TODO: wire navigation */})}
          className="text-emerald-700 text-sm font-bold hover:text-emerald-900 transition-colors"
        >
          مشاهده همه
        </button>
      </div>

      {/* Banners Carousel */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x">
        {banners.map((banner) => (
          <div
            key={banner.id}
            onClick={() => onBannerClick ? onBannerClick(banner.id) : {/* TODO: wire navigation */}}
            className={`min-w-[280px] sm:min-w-[300px] h-40 ${banner.bgClass} rounded-2xl p-5 text-white flex flex-col justify-center relative shadow-sm snap-start shrink-0 cursor-pointer active:scale-98 transition-transform`}
          >
            <span className="bg-white/20 backdrop-blur-xs self-end px-3 py-1 rounded-full text-[10px] font-bold mb-auto">
              {banner.tag}
            </span>
            <h3 className="text-xl sm:text-2xl font-black mb-1">{banner.title}</h3>
            {banner.description && (
              <p className="text-xs opacity-90 font-medium">{banner.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default MonthlyDiscountsBanner;
