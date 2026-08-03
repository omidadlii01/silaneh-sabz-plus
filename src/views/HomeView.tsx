import React, { useState, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  Flame,
  Award,
  ArrowLeft,
  Clock,
  AlertTriangle,
  Baby,
  Heart,
  Smile,
  Scissors,
  Droplet,
  Truck,
  BadgePercent,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { StatusBadge } from '../components/StatusBadge';
import { AppBanner } from '../components/AppBanner';
import { Product } from '../types';
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
      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden mb-1 p-1 group-hover:scale-105 transition-transform duration-200">
        {brand.imageUrl && !hasError ? (
          <img
            src={resolveAssetUrl(brand.imageUrl)}
            alt={brand.name}
            onError={() => setHasError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
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
    className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform group"
  >
    {/* Square "bento" tile: soft green-tinted glass surface (not a solid
        color fill) with a thin ring — matches the reference design's
        aspect-square category tiles — housing a crisp, large vector icon. */}
    <div className="aspect-square w-full rounded-2xl bg-emerald-50/60 backdrop-blur-sm border border-emerald-600/15 flex items-center justify-center p-3.5 shadow-2xs group-hover:bg-emerald-50 transition-colors">
      <Icon className="w-full h-full text-emerald-700" strokeWidth={1.5} />
    </div>
    <span className="text-[10.5px] font-bold text-slate-700 text-center leading-tight">
      {name}
    </span>
  </button>
);

// ---- Promo Carousel -------------------------------------------------------
// 3 auto-rotating promotional slides (advance every 5s) built from real,
// live app data — each slide shows an actual product/brand photo from the
// catalog (not a flat icon-on-color block), matching the reference design's
// "Weekly Offer" card (photo on one side, copy + CTA on the other).

interface PromoSlide {
  key: string;
  tint: string; // light gradient background classes
  imageUrl?: string;
  fallbackIcon: React.FC<{ className?: string; strokeWidth?: number }>;
  eyebrow: string;
  title: string;
  highlight: string; // large emphasized line, e.g. "تا ۳۴٪ سود"
  cta: string;
  onClick: () => void;
}

const PROMO_INTERVAL_MS = 5000;

const PromoCarousel: React.FC<{ slides: PromoSlide[] }> = ({ slides }) => {
  const [index, setIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  // Auto-advance every 5 seconds. Reset/clear the timer whenever the slide
  // set changes so we never leak intervals or advance past the end.
  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, PROMO_INTERVAL_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  // Clamp index if the slide list shrinks (e.g. catalog reload).
  useEffect(() => {
    if (index >= slides.length && slides.length > 0) setIndex(0);
  }, [slides.length, index]);

  useEffect(() => setImgError(false), [index]);

  if (slides.length === 0) return null;
  const slide = slides[Math.min(index, slides.length - 1)];
  const FallbackIcon = slide.fallbackIcon;

  return (
    <div>
      <div
        onClick={slide.onClick}
        className={`rounded-[20px] p-3.5 flex items-center gap-3.5 cursor-pointer active:scale-[0.99] transition-transform shadow-sm border border-emerald-900/5 bg-gradient-to-l ${slide.tint}`}
      >
        {/* Real product/brand photo, not a flat color block */}
        <div className="w-24 h-24 shrink-0 bg-white rounded-xl border border-emerald-900/10 shadow-2xs overflow-hidden flex items-center justify-center p-2">
          {slide.imageUrl && !imgError ? (
            <img
              src={resolveAssetUrl(slide.imageUrl)}
              alt={slide.title}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          ) : (
            <FallbackIcon className="w-10 h-10 text-emerald-600" strokeWidth={1.5} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-extrabold text-emerald-700/80 tracking-wide">
            {slide.eyebrow}
          </span>
          <h3 className="text-[13px] font-black text-emerald-950 mt-0.5 leading-snug line-clamp-1">
            {slide.title}
          </h3>
          <div className="text-emerald-700 font-black text-[15px] mt-0.5">
            {slide.highlight}
          </div>
          <span className="inline-flex items-center gap-1 mt-2 text-[10.5px] font-extrabold text-white bg-emerald-900 px-3 py-1.5 rounded-full">
            {slide.cta}
            <ChevronLeft className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-1.5 mt-2.5">
        {slides.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setIndex(i)}
            aria-label={`اسلاید ${toPersianDigits(i + 1)}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-5 bg-emerald-700' : 'w-1.5 bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// ---- Category Product Row --------------------------------------------------
// Horizontally-scrolling row of real products for a given category, mirroring
// the per-category sections in the design (e.g. "پوست و بدن", "بهداشت و سلامت").

interface CategoryProductsRowProps {
  title: string;
  icon: React.FC<{ className?: string }>;
  products: Product[];
  onSeeAll: () => void;
}

const CategoryProductsRow: React.FC<CategoryProductsRowProps> = ({
  title,
  icon: Icon,
  products,
  onSeeAll,
}) => {
  if (products.length === 0) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Icon className="w-4 h-4 text-emerald-700" />
          <h3 className="text-xs font-extrabold text-slate-900">{title}</h3>
        </div>
        <button
          onClick={onSeeAll}
          className="text-[11px] font-bold text-emerald-700 flex items-center hover:underline"
        >
          <span>مشاهده همه</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3">
        {products.map((product) => (
          <div key={product.id} className="w-[168px] shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
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

  // Categories ranked by how many active products they contain — used both
  // for the promo carousel copy and for the per-category horizontal rows
  // below the brands section.
  const categoryCounts: Record<string, number> = {};
  products.forEach((p) => {
    if (p.category) categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });
  const rankedCategories = HOME_CATEGORIES
    .map((cat) => ({ ...cat, count: categoryCounts[cat.name] || 0 }))
    .filter((cat) => cat.count > 0)
    .sort((a, b) => b.count - a.count);
  const topCategory = rankedCategories[0];

  // ---- 3 auto-rotating promo slides (every 5s) — built from live catalog
  // data, each backed by a real photo (product/brand) from the catalog. ----
  const promoSlides: PromoSlide[] = [];

  if (specialOfferProducts.length > 0) {
    const bestDiscount = Math.max(
      ...specialOfferProducts.map((p) => p.discountPercentage || 0),
    );
    promoSlides.push({
      key: 'special-offers',
      tint: 'from-rose-50 to-orange-50',
      imageUrl: specialOfferProducts[0].imageUrl,
      fallbackIcon: Flame,
      eyebrow: 'پیشنهاد این هفته',
      title: `${toPersianDigits(specialOfferProducts.length)} کالا با تخفیف ویژه`,
      highlight: bestDiscount > 0 ? `تا ${toPersianDigits(bestDiscount)}٪ سود` : 'فرصت محدود همکاری',
      cta: 'مشاهده تخفیف‌ها',
      onClick: () => {
        updateFilter('specialOfferOnly', true);
        navigateTo('products');
      },
    });
  }

  if (topCategory) {
    const topCategoryProduct = products.find((p) => p.category === topCategory.name);
    promoSlides.push({
      key: 'top-category',
      tint: 'from-emerald-50 to-teal-50',
      imageUrl: topCategoryProduct?.imageUrl,
      fallbackIcon: topCategory.icon,
      eyebrow: 'پرطرفدارترین دسته',
      title: topCategory.name,
      highlight: `${toPersianDigits(topCategory.count)} کالای متنوع`,
      cta: 'مشاهده محصولات',
      onClick: () => {
        updateFilter('category', topCategory.name);
        navigateTo('products');
      },
    });
  }

  if (brands.length > 0) {
    promoSlides.push({
      key: 'brands',
      tint: 'from-teal-50 to-emerald-50',
      imageUrl: brands[0]?.imageUrl,
      fallbackIcon: Award,
      eyebrow: 'اعتبار سیلانه سبز',
      title: 'برندهای معتبر، زیر یک سقف',
      highlight: `${toPersianDigits(brands.length)} برند`,
      cta: 'مشاهده برندها',
      onClick: () => {
        updateFilter('brand', 'همه');
        navigateTo('products');
      },
    });
  }

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
      <div className="grid grid-cols-3 gap-3">
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

      {/* Promo Carousel — 3 auto-advancing slides (every 5 seconds) built
          from live catalog data (special offers / top category / brands). */}
      <PromoCarousel slides={promoSlides} />

      {/* Static (non-rotating) promo — the app's real automatic wholesale
          discount rule, always visible regardless of carousel position. */}
      <div className="bg-gradient-to-l from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3.5 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-white border border-amber-200 flex items-center justify-center shrink-0">
          <BadgePercent className="w-5 h-5 text-amber-600" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[12px] font-black text-amber-900">۵٪ تخفیف خودکار همکاری</h4>
          <p className="text-[10.5px] text-amber-700 mt-0.5 leading-relaxed">
            سفارش‌های عمده بالای {formatCurrency(5000000)} شامل ۵٪ تخفیف خودکار می‌شوند.
          </p>
        </div>
        <Truck className="w-5 h-5 text-amber-500 shrink-0" strokeWidth={1.75} />
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

      {/* Per-category horizontal rows — real products from the 2nd/3rd most
          stocked categories (the #1 category is already featured in the
          promo carousel above), so the whole catalog stays discoverable. */}
      {rankedCategories.slice(1, 3).map((cat) => (
        <CategoryProductsRow
          key={cat.name}
          title={cat.name}
          icon={cat.icon}
          products={products.filter((p) => p.category === cat.name).slice(0, 8)}
          onSeeAll={() => {
            updateFilter('category', cat.name);
            navigateTo('products');
          }}
        />
      ))}

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
