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
  Plus,
  Box,
  Gift,
  BadgePercent,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { AppBanner } from '../components/AppBanner';
import { Product } from '../types';
import { formatCurrency, toPersianDigits, resolveAssetUrl } from '../utils';

// ---- Brand tile -------------------------------------------------------

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

// ---- Category quick-access grid ----------------------------------------
// The 6 fixed product categories (mirrors products.category values written
// by migration 0013_six_categories.sql — keep this list in sync with that
// migration).
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
    <div className="aspect-square w-full rounded-2xl bg-emerald-50 flex items-center justify-center p-3.5 group-hover:bg-emerald-100/70 transition-colors">
      <Icon className="w-full h-full text-emerald-700" strokeWidth={1.5} />
    </div>
    <span className="text-[10.5px] font-bold text-slate-700 text-center leading-tight">
      {name}
    </span>
  </button>
);

// ---- Compact product card ------------------------------------------------
// Matches the reference's horizontally-scrolling item card: floating "+"
// button (top-left), square photo, name, packaging-spec chip, and a price
// row with an optional discount pill + consumer price underneath.

interface CompactProductCardProps {
  product: Product;
}

const CompactProductCard: React.FC<CompactProductCardProps> = ({ product }) => {
  const { cart, addToCart, navigateTo } = useApp();
  const [imgError, setImgError] = useState(false);
  const cartItem = cart.find((item) => item.product.id === product.id);
  const qty = cartItem ? cartItem.quantity : 0;

  return (
    <div className="min-w-[152px] w-[152px] shrink-0 bg-white border border-slate-200/70 rounded-2xl p-2.5 flex flex-col gap-1.5 relative text-right">
      <button
        onClick={() => product.inStock && addToCart(product, 1)}
        disabled={!product.inStock}
        className="absolute top-2 left-2 z-10 w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-2xs active:scale-90 transition-transform disabled:opacity-40"
        aria-label="افزودن کارتن"
      >
        <Plus className="w-3.5 h-3.5 text-emerald-700" />
        {qty > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-emerald-700 text-white text-[8.5px] font-black min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center border border-white">
            {toPersianDigits(qty)}
          </span>
        )}
      </button>

      <div
        onClick={() => navigateTo('product-detail', { product })}
        className="aspect-square w-full flex items-center justify-center cursor-pointer"
      >
        {product.imageUrl && !imgError ? (
          <img
            src={resolveAssetUrl(product.imageUrl)}
            alt={product.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="h-full w-auto object-contain"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full rounded-xl bg-slate-50 flex items-center justify-center">
            <Box className="w-8 h-8 text-slate-300" />
          </div>
        )}
      </div>

      <span className="text-[11px] font-bold text-slate-800 leading-snug line-clamp-2 min-h-[30px]">
        {product.name}
      </span>

      <div className="flex items-center gap-1 text-slate-400 text-[10px]">
        <Box className="w-3 h-3" />
        <span>{toPersianDigits(product.cartonQuantity)} عدد</span>
      </div>

      {!product.inStock ? (
        <span className="text-[10px] font-bold text-rose-600 mt-0.5">ناموجود</span>
      ) : (
        <div className="mt-0.5">
          <div className="flex items-center justify-between gap-1">
            <span className="text-emerald-900 font-black text-[12.5px]">
              {formatCurrency(product.price)}
            </span>
            {!!product.discountPercentage && (
              <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[9.5px] font-bold shrink-0">
                {toPersianDigits(product.discountPercentage)}٪
              </span>
            )}
          </div>
          {product.unitPrice > 0 && (
            <span className="text-[9px] text-slate-400 block mt-0.5">
              مصرف‌کننده: {formatCurrency(product.unitPrice)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ---- Horizontal product row (Popular items / per-category sections) ------

interface ProductRowProps {
  title: string;
  icon: React.FC<{ className?: string }>;
  products: Product[];
  onSeeAll: () => void;
  accentColor?: string;
}

const ProductRow: React.FC<ProductRowProps> = ({
  title,
  icon: Icon,
  products,
  onSeeAll,
  accentColor = 'text-emerald-700',
}) => {
  if (products.length === 0) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <h2 className="text-[13.5px] font-extrabold text-emerald-950">{title}</h2>
          <Icon className={`w-4 h-4 ${accentColor}`} />
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
          <CompactProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

// ---- Weekly-offer promo carousel ------------------------------------------
// 3 auto-rotating slides (advance every 5s), each backed by a real
// product/brand photo from the catalog — mirrors the reference's "آفر هفته"
// card (photo on one side, copy + CTA on the other, dots below).

interface PromoSlide {
  key: string;
  tint: string;
  imageUrl?: string;
  fallbackIcon: React.FC<{ className?: string; strokeWidth?: number }>;
  eyebrow: string;
  title: string;
  highlight: string;
  cta: string;
  onClick: () => void;
}

const PROMO_INTERVAL_MS = 5000;

const PromoCarousel: React.FC<{ slides: PromoSlide[] }> = ({ slides }) => {
  const [index, setIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, PROMO_INTERVAL_MS);
    return () => clearInterval(id);
  }, [slides.length]);

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

// ---- Featured-offer block --------------------------------------------------
// Mirrors the reference's dark-green "Recommended Package" module — a
// full-bleed emerald box holding a white product card (badge, image, price,
// action buttons) plus a slim side column. Since the catalog has no
// bundle/package data model, this is built from the single most-discounted
// real special-offer product (real name/price/actions) rather than a
// fabricated multi-item bundle.

interface FeaturedOfferBlockProps {
  product: Product;
}

const FeaturedOfferBlock: React.FC<FeaturedOfferBlockProps> = ({ product }) => {
  const { addToCart, navigateTo } = useApp();
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-emerald-900 rounded-2xl p-2.5 flex gap-2.5">
      {/* Main product card */}
      <div className="flex-[3] bg-white rounded-xl p-3 flex flex-col gap-2 relative">
        {!!product.discountPercentage && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold z-10">
            {toPersianDigits(product.discountPercentage)}٪ تخفیف
          </div>
        )}

        <div
          onClick={() => navigateTo('product-detail', { product })}
          className="w-full aspect-[4/3] mb-0.5 flex items-center justify-center overflow-hidden rounded-lg bg-slate-50 cursor-pointer"
        >
          {product.imageUrl && !imgError ? (
            <img
              src={resolveAssetUrl(product.imageUrl)}
              alt={product.name}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          ) : (
            <Gift className="w-10 h-10 text-slate-300" />
          )}
        </div>

        <div className="flex flex-col gap-0.5">
          <h4 className="font-bold text-[12.5px] text-emerald-950 line-clamp-1">{product.name}</h4>
          <span className="text-slate-400 text-[10.5px]">{product.brand}</span>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            <span className="text-emerald-700 font-bold text-[13px]">
              {formatCurrency(product.price)}
            </span>
            <span className="text-[9px] text-slate-400">قیمت عمده</span>
          </div>
          {product.unitPrice > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-slate-400 text-[10px] line-through">
                {formatCurrency(product.unitPrice)}
              </span>
              <span className="text-[9px] text-slate-400">قیمت مصرف‌کننده</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-amber-600 text-[10px] font-bold">
          <BadgePercent className="w-3.5 h-3.5" />
          <span>پیشنهاد ویژه همکاری — موجودی محدود</span>
        </div>

        <div className="flex gap-1.5 mt-0.5">
          <button
            onClick={() => navigateTo('product-detail', { product })}
            className="flex-1 py-2 border border-emerald-700 text-emerald-800 rounded-lg font-bold text-[11px] active:scale-95 transition-all"
          >
            جزئیات
          </button>
          <button
            onClick={() => product.inStock && addToCart(product, 1)}
            disabled={!product.inStock}
            className="flex-1 py-2 bg-emerald-900 text-white rounded-lg font-bold text-[11px] active:scale-95 transition-all disabled:opacity-40"
          >
            افزودن
          </button>
        </div>
      </div>

      {/* Side column */}
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-2">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
          <Gift className="w-6 h-6 text-white" strokeWidth={1.5} />
        </div>
        <div className="text-white font-bold text-[12.5px]">پیشنهادهای ویژه</div>
        <button
          onClick={() => navigateTo('products')}
          className="text-white/80 font-body-small flex items-center gap-1 text-[10px]"
        >
          مشاهده همه
          <ChevronLeft className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

// ---- HomeView -------------------------------------------------------------

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

  // Popular items: in-stock products, special offers first (mirrors the
  // reference's "محبوب‌ترین اقلام" horizontal row).
  const popularProducts = [...products]
    .filter((p) => p.inStock)
    .sort((a, b) => Number(b.specialOffer) - Number(a.specialOffer))
    .slice(0, 8);

  const specialOfferProducts = products.filter((p) => p.specialOffer && p.inStock);
  const bestOfferProduct = [...specialOfferProducts].sort(
    (a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0),
  )[0];

  // Categories ranked by how many active products they contain.
  const categoryCounts: Record<string, number> = {};
  products.forEach((p) => {
    if (p.category) categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });
  const rankedCategories = HOME_CATEGORIES.map((cat) => ({
    ...cat,
    count: categoryCounts[cat.name] || 0,
  }))
    .filter((cat) => cat.count > 0)
    .sort((a, b) => b.count - a.count);
  const topCategory = rankedCategories[0];

  // ---- 3 auto-rotating promo slides ----
  const promoSlides: PromoSlide[] = [];

  if (specialOfferProducts.length > 0) {
    const bestDiscount = Math.max(...specialOfferProducts.map((p) => p.discountPercentage || 0));
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

  // Category rows: 3 highest-stocked categories, mirroring the reference's
  // health / beauty / skin sections (with our real 6-category taxonomy).
  const rowCategories = rankedCategories.slice(0, 3);

  // 3 Recent orders for current customer
  const recentOrders = orders.filter((o) => o.customerId === currentCustomer.id).slice(0, 3);
  const mostRecentOrder = recentOrders[0];

  return (
    <div className="pb-20 pt-3 px-3 sm:px-4 max-w-md mx-auto space-y-6">
      <AppBanner />

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

      {mostRecentOrder && (
        <div className="bg-emerald-50 rounded-xl px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
            <span className="text-[11px] font-bold text-emerald-900">تکرار سفارش قبلی</span>
          </div>
          <button
            onClick={() => reorder(mostRecentOrder)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-[10.5px] font-extrabold px-2.5 py-1 rounded-lg active:scale-95 transition-all flex items-center gap-1"
          >
            <span>ثبت مجدد ({toPersianDigits(mostRecentOrder.items.length)} کالا)</span>
            <ArrowLeft className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Search bar */}
      <button
        onClick={() => navigateTo('products')}
        className="w-full flex items-center gap-2.5 bg-white border border-slate-200 rounded-2xl py-3.5 px-3.5 text-xs font-medium text-slate-500 active:scale-[0.99] transition-transform shadow-2xs"
      >
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          جست‌وجو در{' '}
          <span className="font-extrabold text-emerald-700">سیلانه سبز</span>
        </span>
      </button>

      {/* Categories */}
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

      {/* Popular Items */}
      <ProductRow
        title="محبوب‌ترین اقلام"
        icon={Flame}
        accentColor="text-rose-600"
        products={popularProducts}
        onSeeAll={() => navigateTo('products')}
      />

      {/* Brands */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[13.5px] font-extrabold text-emerald-950">برندهای سیلانه سبز</h2>
            <Award className="w-4 h-4 text-emerald-700" />
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

      {/* Weekly-offer carousel */}
      <PromoCarousel slides={promoSlides} />

      {/* Compact real-discount strip (the app's automatic wholesale rule) */}
      <div className="flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-2">
        <BadgePercent className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="text-[10.5px] text-amber-800 font-semibold leading-relaxed">
          سفارش‌های عمده بالای {formatCurrency(5000000)} شامل ۵٪ تخفیف خودکار همکاری می‌شوند.
        </p>
      </div>

      {/* Featured offer block */}
      {bestOfferProduct && <FeaturedOfferBlock product={bestOfferProduct} />}

      {/* Per-category rows */}
      {rowCategories.map((cat) => (
        <ProductRow
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

      {/* Recent orders */}
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
