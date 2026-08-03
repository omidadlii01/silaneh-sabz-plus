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
  AlertTriangle,
  Baby,
  Heart,
  Smile,
  Scissors,
  Droplet,
  Grip,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { StatusBadge } from '../components/StatusBadge';
import { AppBanner } from '../components/AppBanner';
import { formatCurrency, toPersianDigits, resolveAssetUrl } from '../utils';

interface BrandCardButtonProps {
  brand: any;
  onClick: () => void;
}

const BrandCardButton: React.FC<BrandCardButtonProps> = ({ brand, onClick }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-2 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-emerald-600 hover:shadow-xs active:scale-95 transition-all w-full group"
    >
      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden mb-1 p-0.5 group-hover:scale-105 transition-transform duration-200">
        {brand.imageUrl && !hasError ? (
          <img
            src={resolveAssetUrl(brand.imageUrl)}
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
      {brand.englishName && (
        <span className="text-[9px] font-semibold text-slate-400">
          {brand.englishName}
        </span>
      )}
    </button>
  );
};

// The 6 fixed product categories shown as quick-access buttons on the home
// screen (mirrors the values written into products.category by migration
// 0013_six_categories.sql — keep this list in sync with that migration).
const HOME_CATEGORIES: { name: string; icon: React.FC<{ className?: string }> }[] = [
  { name: 'مراقبت از کودک', icon: Baby },
  { name: 'زیبایی و آرایش بانوان', icon: Sparkles },
  { name: 'بهداشت و مراقبت‌های جنسی', icon: Heart },
  { name: 'بهداشت دهان و دندان', icon: Smile },
  { name: 'مراقبت مو', icon: Scissors },
  { name: 'مراقبت پوست و بدن', icon: Droplet },
];

interface CategoryButtonProps {
  name: string;
  icon: React.FC<{ className?: string }>;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ name, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-start gap-1.5 active:scale-95 transition-transform"
  >
    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-2xs">
      <Icon className="w-6 h-6 text-emerald-700" />
    </div>
    <span className="text-[10.5px] font-bold text-slate-700 text-center leading-tight max-w-[64px]">
      {name}
    </span>
  </button>
);

export const HomeView: React.FC = () => {
  const {
    currentCustomer,
    products,
    brands,
    orders,
    navigateTo,
    updateFilter,
    reorder,
    catalogError,
    isLoadingCatalog,
    retryLoadCatalog,
  } = useApp();

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
      <AppBanner />

      {/* Catalog load error — shown instead of silently displaying the
          small placeholder demo catalog when the API is unreachable
          (e.g. the device can't reach the Worker without a VPN). */}
      {catalogError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3.5 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-extrabold">اتصال به سرور محصولات برقرار نشد</p>
            <p className="text-[11px] text-rose-700 mt-0.5">
              محصولات و برندهای نمایش داده‌شده ممکن است کامل/به‌روز نباشند. لطفاً اتصال اینترنت (یا فیلترشکن) خود را بررسی کنید.
            </p>
            <button
              onClick={retryLoadCatalog}
              disabled={isLoadingCatalog}
              className="mt-2 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-60 px-3 py-1.5 rounded-lg transition-colors"
            >
              {isLoadingCatalog ? 'در حال تلاش مجدد...' : 'تلاش مجدد'}
            </button>
          </div>
        </div>
      )}

      {/* Quick Reorder — kept as a slim bar (no green welcome card) so the
          reorder shortcut is still reachable, without the previous full-width
          green banner. */}
      {mostRecentOrder && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-emerald-900">تکرار سفارش قبلی</span>
          </div>
          <button
            onClick={() => reorder(mostRecentOrder)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1"
          >
            <span>ثبت مجدد ({toPersianDigits(mostRecentOrder.items.length)} کالا)</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search bar — styled per brand: "سیلانه سبز" in bold green.
          Acts as a button (navigates to the search/products screen) rather
          than a live input, matching the reference design. */}
      <button
        onClick={() => navigateTo('products')}
        className="w-full flex items-center gap-2.5 bg-slate-100 border border-slate-200 rounded-2xl py-3 px-3.5 text-xs font-medium text-slate-500 active:scale-[0.99] transition-transform"
      >
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          جست‌وجو در{' '}
          <span className="font-extrabold text-emerald-700">سیلانه سبز</span>
        </span>
      </button>

      {/* Category Quick-Access Grid */}
      <div className="grid grid-cols-3 gap-y-3 gap-x-1">
        {HOME_CATEGORIES.map((cat) => (
          <CategoryButton
            key={cat.name}
            name={cat.name}
            icon={cat.icon}
            onClick={() => {
              updateFilter('category', cat.name);
              navigateTo('products');
            }}
          />
        ))}
      </div>

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

        <div className="grid grid-cols-4 gap-2.5">
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
