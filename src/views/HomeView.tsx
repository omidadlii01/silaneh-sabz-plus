import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  Flame,
  Award,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency, toPersianDigits } from '../utils';

interface BrandCardButtonProps {
  brand: any;
  onClick: () => void;
}

const BrandCardButton: React.FC<BrandCardButtonProps> = ({ brand, onClick }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <button
      onClick={onClick}
      className="flex-none flex flex-col items-center justify-center p-2 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-emerald-600 hover:shadow-xs active:scale-95 transition-all w-20 group"
    >
      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden mb-1 p-0.5 group-hover:scale-105 transition-transform duration-200">
        {brand.imageUrl && !hasError ? (
          <img
            src={brand.imageUrl}
            alt={brand.name}
            onError={() => setHasError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full rounded-lg bg-gradient-to-tr ${brand.logoColor || 'from-emerald-600 to-teal-700'} text-white font-black text-xs flex items-center justify-center shadow-2xs`}
          >
            {brand.name.slice(0, 2)}
          </div>
        )}
      </div>
      <span className="text-[11px] font-extrabold text-slate-900 truncate max-w-full">
        {brand.name}
      </span>
      <span className="text-[9px] font-semibold text-slate-400">
        {brand.englishName}
      </span>
    </button>
  );
};

export const HomeView: React.FC = () => {
  const {
    currentCustomer,
    products,
    brands,
    orders,
    navigateTo,
    updateFilter,
    reorder,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      updateFilter('searchQuery', searchQuery);
      navigateTo('products');
    }
  };

  const handleBrandClick = (brandName: string) => {
    updateFilter('brand', brandName);
    navigateTo('products');
  };

  // Special offers & recommended products
  const specialOfferProducts = products.filter((p) => p.specialOffer).slice(0, 4);
  const recommendedProducts = products.filter((p) => p.inStock && !p.specialOffer).slice(0, 4);

  // 3 Recent orders for current customer
  const recentOrders = orders
    .filter((o) => o.customerId === currentCustomer.id)
    .slice(0, 3);

  const mostRecentOrder = recentOrders[0];

  return (
    <div className="pb-20 pt-3 px-3 sm:px-4 max-w-md mx-auto space-y-5">
      {/* Greeting Banner */}
      <div className="bg-gradient-to-l from-emerald-900 to-emerald-800 text-white p-4 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-emerald-300 text-xs font-semibold">خوش آمدید 👋</span>
          <h2 className="text-base font-extrabold mt-0.5">{currentCustomer.storeName}</h2>
          <p className="text-[11px] text-emerald-100/90 mt-1">
            کد مشتری: {currentCustomer.code} | ویزیتور: {currentCustomer.marketerName}
          </p>
        </div>

        {/* Quick Reorder Floating Banner if last order exists */}
        {mostRecentOrder && (
          <div className="mt-3.5 pt-3 border-t border-emerald-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-300 animate-spin-slow" />
              <span className="text-xs font-bold text-emerald-50">تکرار سفارش قبلی</span>
            </div>
            <button
              onClick={() => reorder(mostRecentOrder)}
              className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1"
            >
              <span>ثبت مجدد ({toPersianDigits(mostRecentOrder.items.length)} کالا)</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Quick Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجوی نام محصول، برند، کد کالا..."
          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pr-10 pl-12 text-xs font-medium text-slate-800 shadow-xs focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
        />
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
        <button
          type="submit"
          className="absolute left-2 top-2 bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-emerald-900 transition-colors"
        >
          جستجو
        </button>
      </form>

      {/* Brands Horizontal Carousel / Grid */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-extrabold text-slate-900">برندهای سیلانه سبز</h3>
          </div>
          <button
            onClick={() => {
              updateFilter('brand', 'همه');
              navigateTo('products');
            }}
            className="text-[11px] font-bold text-emerald-700 flex items-center hover:underline"
          >
            <span>مشاهده همه</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3">
          {brands.map((brand) => (
            <BrandCardButton
              key={brand.id}
              brand={brand}
              onClick={() => handleBrandClick(brand.name)}
            />
          ))}
        </div>
      </div>

      {/* Special Offers Section */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
            <h3 className="text-xs font-extrabold text-slate-900">پیشنهادهای ویژه همکاری</h3>
          </div>
          <button
            onClick={() => {
              updateFilter('specialOfferOnly', true);
              navigateTo('products');
            }}
            className="text-[11px] font-bold text-rose-600 flex items-center hover:underline"
          >
            <span>مشاهده همه</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {specialOfferProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Recommended Products */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-extrabold text-slate-900">محصولات پرفروش عمده</h3>
          </div>
          <button
            onClick={() => {
              updateFilter('brand', 'همه');
              navigateTo('products');
            }}
            className="text-[11px] font-bold text-emerald-700 flex items-center hover:underline"
          >
            <span>لیست کامل</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Recent 3 Orders with Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-800" />
            <h3 className="text-xs font-extrabold text-slate-900">آخرین سفارشات ثبت‌شده</h3>
          </div>
          <button
            onClick={() => navigateTo('my-orders')}
            className="text-[11px] font-bold text-emerald-700 hover:underline"
          >
            مشاهده سوابق
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 text-center">هنوز سفارشی ثبت نشده است.</p>
        ) : (
          <div className="space-y-2.5">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigateTo('my-orders', { order })}
                className="p-2.5 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">
                      {order.orderNumber}
                    </span>
                    <StatusBadge status={order.status} size="sm" />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                    <span>{order.orderDate}</span>
                    <span>•</span>
                    <span>{toPersianDigits(order.items.length)} قلم کالا</span>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-xs font-black text-emerald-800 block">
                    {formatCurrency(order.finalAmount)}
                  </span>
                  <span className="text-[10px] text-slate-400">نمایش جزئیات</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
