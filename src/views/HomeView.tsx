import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AppBanner } from '../components/AppBanner';
import { StatusBadge } from '../components/StatusBadge';
import { Product } from '../types';
import { formatCurrency, toPersianDigits, resolveAssetUrl } from '../utils';

// ---- Search bar (navigates to Products view; live suggestions dropdown) ---

const HomeSearchBar: React.FC<{ products: Product[] }> = ({ products }) => {
  const { navigateTo, updateFilter } = useApp();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = query.trim()
    ? products
        .filter(
          (p) =>
            p.name.includes(query) || p.brand.includes(query) || (p.category || '').includes(query)
        )
        .slice(0, 5)
    : [];

  const goToProduct = (p: Product) => {
    setIsFocused(false);
    setQuery('');
    navigateTo('product-detail', { product: p });
  };

  const runSearch = () => {
    updateFilter('search', query);
    navigateTo('products');
  };

  return (
    <div className="relative z-30">
      <div className="relative flex items-center">
        {!query && !isFocused && (
          <div className="absolute right-12 pointer-events-none text-[14px] text-[#6f7973] select-none flex items-center gap-1">
            <span>جست‌وجو در</span>
            <span className="text-[#006c4a] font-black">سیلانه سبز</span>
          </div>
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={(e) => e.key === 'Enter' && runSearch()}
          className="w-full h-[52px] bg-white border border-[#bec9c2]/40 rounded-xl px-4 pr-12 pl-10 focus:ring-2 focus:ring-[#006c4a]/20 focus:border-[#006c4a] transition-all text-right shadow-xs text-[14px] text-[#171c1f]"
        />
        <div className="absolute right-4 flex items-center pointer-events-none text-[#006c4a]">
          <span className="material-symbols-outlined text-[22px]">search</span>
        </div>
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute left-3 p-1 rounded-full text-[#6f7973] hover:text-[#171c1f]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {isFocused && suggestions.length > 0 && (
        <div className="absolute top-[58px] right-0 left-0 bg-white border border-[#e2e8f0] rounded-xl shadow-lg overflow-hidden z-50">
          <div className="p-2.5 text-[11px] font-bold text-[#006c4a] bg-[#f0f4f8] border-b border-[#e2e8f0] text-right">
            نتایج پیشنهادی ({toPersianDigits(suggestions.length)})
          </div>
          {suggestions.map((item) => (
            <button
              key={item.id}
              onClick={() => goToProduct(item)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#f6fafe] border-b border-[#f1f5f9] last:border-none text-right transition-colors"
            >
              <div className="flex flex-col text-right">
                <span className="text-[13px] font-bold text-[#171c1f]">{item.name}</span>
                <span className="text-[11px] text-[#6f7973]">
                  برند: {item.brand} | کارتنی ({toPersianDigits(item.cartonQuantity)} عددی)
                </span>
              </div>
              <span className="material-symbols-outlined text-[#006c4a] text-[18px]">chevron_left</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Category grid (real 6 fixed categories, icon tiles) ------------------

const HOME_CATEGORIES: { name: string; icon: string }[] = [
  { name: 'مراقبت از کودک', icon: 'child_care' },
  { name: 'زیبایی و آرایش بانوان', icon: 'auto_awesome' },
  { name: 'بهداشت و مراقبت‌های جنسی', icon: 'favorite' },
  { name: 'بهداشت دهان و دندان', icon: 'sentiment_satisfied' },
  { name: 'مراقبت مو', icon: 'content_cut' },
  { name: 'مراقبت پوست و بدن', icon: 'water_drop' },
];

const HomeCategoryGrid: React.FC = () => {
  const { navigateTo, updateFilter } = useApp();
  return (
    <section>
      <div className="grid grid-cols-3 gap-4">
        {HOME_CATEGORIES.map((cat) => (
          <div
            key={cat.name}
            onClick={() => {
              updateFilter('category', cat.name);
              navigateTo('products');
            }}
            className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition-all duration-200"
          >
            <div className="aspect-square w-full rounded-2xl bg-[#eaeef2]/40 backdrop-blur-md flex items-center justify-center p-2.5 border border-[#006c4a]/20 group-hover:border-[#006c4a]/50 group-hover:bg-white transition-all shadow-xs">
              <span className="material-symbols-outlined text-[#006c4a] text-[30px]">{cat.icon}</span>
            </div>
            <span className="text-[12px] font-semibold text-center mt-1 leading-tight text-[#171c1f]">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

// ---- Product card (real product data) --------------------------------------

const HomeProductCard: React.FC<{ product: Product; className?: string }> = ({
  product,
  className = '',
}) => {
  const { cart, addToCart, navigateTo } = useApp();
  const [imgError, setImgError] = useState(false);
  const cartItem = cart.find((ci) => ci.product.id === product.id);
  const qty = cartItem ? cartItem.quantity : 0;

  return (
    <div
      className={`bg-white/75 backdrop-blur-xl border border-[#006c4a]/30 shadow-[0_4px_16px_rgba(0,108,74,0.08)] hover:shadow-[0_6px_24px_rgba(0,108,74,0.16)] hover:border-[#006c4a]/60 rounded-2xl p-3.5 flex flex-col justify-between relative text-right transition-all duration-200 group ${className}`}
    >
      {qty === 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (product.inStock) addToCart(product, 1);
          }}
          disabled={!product.inStock}
          className="absolute top-2.5 left-2.5 z-10 w-8 h-8 rounded-xl bg-white border border-[#006c4a]/30 text-[#006c4a] hover:bg-[#006c4a] hover:text-white flex items-center justify-center transition-all shadow-xs active:scale-90 disabled:opacity-40"
          title="افزودن به سبد خرید"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
      )}

      <div
        onClick={() => navigateTo('product-detail', { product })}
        className="cursor-pointer flex flex-col"
      >
        <div className="aspect-square w-full flex items-center justify-center mb-2 p-1.5 bg-[#f8fafc]/50 rounded-xl">
          {product.imageUrl && !imgError ? (
            <img
              src={resolveAssetUrl(product.imageUrl)}
              alt={product.name}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <span className="material-symbols-outlined text-[#cbd5e1] text-[36px]">inventory_2</span>
          )}
        </div>

        <span className="text-[10px] text-[#006c4a] font-black mb-0.5">{product.brand}</span>

        <h3 className="text-[#171c1f] text-[12px] font-bold line-clamp-2 min-h-[34px] leading-tight">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 text-[#6f7973] text-[10px] mt-1.5">
          <span className="material-symbols-outlined text-[14px]">inventory_2</span>
          <span>{toPersianDigits(product.cartonQuantity)} عدد در کارتن</span>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-[#f1f5f9]">
        {qty > 0 ? (
          <div className="bg-[#f0f4f8] border border-[#e2e8f0] rounded-xl p-1 flex items-center justify-between mb-2 shadow-inner">
            <button
              onClick={() => addToCart(product, 1)}
              className="w-8 h-8 bg-[#006c4a] hover:bg-[#022c22] text-white rounded-lg flex items-center justify-center font-black text-[16px] active:scale-95 transition-transform shadow-xs"
            >
              +
            </button>
            <span className="text-[13px] font-black text-[#022c22] px-2">{toPersianDigits(qty)}</span>
            <button
              onClick={() => addToCart(product, -1)}
              className="w-8 h-8 bg-white hover:bg-[#fff5f5] text-[#ba1a1a] border border-[#e2e8f0] rounded-lg flex items-center justify-center font-black text-[16px] active:scale-95 transition-transform shadow-xs"
            >
              -
            </button>
          </div>
        ) : (
          <div className="h-2" />
        )}

        {!product.inStock ? (
          <span className="text-[10px] font-bold text-[#ba1a1a]">ناموجود</span>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-1">
              <div className="flex flex-col">
                <div className="flex items-center gap-0.5">
                  <span className="text-[#022c22] font-black text-[14px]">
                    {formatCurrency(product.price).replace(' تومان', '')}
                  </span>
                  <span className="text-[9px] text-[#6f7973]">تومان</span>
                </div>
                <span className="text-[9px] text-[#6f7973] font-semibold">قیمت محصول</span>
              </div>

              {!!product.discountPercentage && (
                <span className="bg-[#ecfdf5] text-[#006c4a] border border-[#059669]/20 px-2 py-0.5 rounded-md text-[10px] font-black">
                  {toPersianDigits(product.discountPercentage)}٪
                </span>
              )}
            </div>

            {product.unitPrice > 0 && (
              <div className="flex items-center justify-between text-[10px] text-[#6f7973] pt-0.5 border-t border-dashed border-[#e2e8f0]/80">
                <span className="text-[11px] font-bold text-[#334155]">
                  {formatCurrency(product.unitPrice)}
                </span>
                <span className="text-[9px] text-[#6f7973]">قیمت مصرف‌کننده</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ---- Horizontal product section (Popular / per-category) ------------------

const HomeProductSection: React.FC<{
  title: string;
  iconName: string;
  products: Product[];
  onViewAll: () => void;
}> = ({ title, iconName, products, onViewAll }) => {
  if (!products || products.length === 0) return null;
  return (
    <section>
      <div className="flex justify-between items-center mb-3.5">
        <div className="flex items-center gap-1.5 flex-row-reverse">
          <h2 className="font-['Vazirmatn'] text-[17px] font-extrabold text-[#022c22]">{title}</h2>
          <span className="material-symbols-outlined text-[#006c4a] text-[20px]">{iconName}</span>
        </div>
        <button
          onClick={onViewAll}
          className="text-[#006c4a] text-[12px] font-bold flex items-center gap-0.5 hover:underline"
        >
          مشاهده همه
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
        </button>
      </div>

      <div className="flex gap-3.5 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4">
        {products.map((product) => (
          <HomeProductCard key={product.id} product={product} className="min-w-[168px] w-[168px]" />
        ))}
      </div>
    </section>
  );
};

// ---- Brands grid (real brands from D1) -------------------------------------

const HomeBrandsGrid: React.FC<{ brands: any[] }> = ({ brands }) => {
  const { navigateTo, updateFilter } = useApp();
  if (brands.length === 0) return null;

  return (
    <section>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5 flex-row-reverse">
          <h2 className="font-['Vazirmatn'] text-[16px] font-extrabold text-[#022c22]">
            برندهای سیلانه سبز
          </h2>
          <span className="material-symbols-outlined text-[#006c4a] text-[20px]">military_tech</span>
        </div>
        <button
          onClick={() => {
            updateFilter('brand', 'همه');
            navigateTo('products');
          }}
          className="text-[#006c4a] text-[12px] font-bold flex items-center gap-0.5 hover:underline"
        >
          مشاهده همه
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {brands.slice(0, 8).map((brand) => (
          <HomeBrandTile key={brand.id} brand={brand} />
        ))}
      </div>
    </section>
  );
};

const HomeBrandTile: React.FC<{ brand: any }> = ({ brand }) => {
  const { navigateTo, updateFilter } = useApp();
  const [hasError, setHasError] = useState(false);

  return (
    <div
      onClick={() => {
        updateFilter('brand', brand.name);
        navigateTo('products');
      }}
      className="bg-white border border-[#bec9c2]/30 hover:border-[#006c4a]/40 hover:bg-[#f6fafe] rounded-2xl p-2 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-all shadow-xs"
    >
      <div className="aspect-square w-full p-1.5 flex items-center justify-center">
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
            className={`w-full h-full rounded-lg bg-gradient-to-tr ${brand.logoColor || 'from-emerald-600 to-teal-700'} text-white font-black text-[11px] flex items-center justify-center`}
          >
            {brand.name.slice(0, 2)}
          </div>
        )}
      </div>
      <span className="font-bold text-[11px] text-[#171c1f] truncate w-full">{brand.name}</span>
      {brand.englishName && (
        <span className="text-[9px] text-[#6f7973] truncate w-full">{brand.englishName}</span>
      )}
    </div>
  );
};

// ---- Weekly-offer carousel --------------------------------------------------
// No dedicated "weekly offer" data model exists in D1, so this rotates
// through real, currently-active special-offer products (real photo/name/
// discount) rather than fabricated banner content.

interface PromoSlide {
  key: string;
  imageUrl?: string;
  fallbackIcon: string;
  title: string;
  discountText: string;
  subTitle: string;
  onClick: () => void;
}

const HomeWeeklyOffer: React.FC<{ slides: PromoSlide[] }> = ({ slides }) => {
  const [index, setIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [slides.length, index]);

  useEffect(() => setImgError(false), [index]);

  if (slides.length === 0) return null;
  const slide = slides[Math.min(index, slides.length - 1)];

  return (
    <section>
      <div
        onClick={slide.onClick}
        className="bg-gradient-to-l from-[#f0fdf4] to-[#ecfdf5] rounded-[20px] p-4 flex items-center gap-4 shadow-xs border border-[#e2e8f0] cursor-pointer active:scale-[0.99] transition-transform"
      >
        <div className="w-1/3 aspect-square bg-white rounded-xl shadow-xs border border-[#f0fdf4] overflow-hidden p-2 flex items-center justify-center shrink-0">
          {slide.imageUrl && !imgError ? (
            <img
              src={resolveAssetUrl(slide.imageUrl)}
              alt={slide.title}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="material-symbols-outlined text-[#006c4a] text-[40px]">{slide.fallbackIcon}</span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between h-full py-1 text-right">
          <div>
            <h3 className="font-['Vazirmatn'] text-[16px] font-extrabold text-[#022c22] mb-0.5 line-clamp-1">
              {slide.title}
            </h3>
            <div className="text-[#006c4a] font-extrabold text-[17px]">{slide.discountText}</div>
            <div className="text-[#3f4944] text-[12px] font-semibold">{slide.subTitle}</div>
          </div>

          <span className="bg-[#0F5338] hover:bg-[#004532] text-white rounded-full py-2 px-5 text-[13px] font-bold w-fit active:scale-95 transition-all shadow-xs mt-2">
            مشاهده
          </span>
        </div>
      </div>

      <div className="flex justify-center items-center gap-1.5 mt-3">
        {slides.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setIndex(i)}
            className={`transition-all ${
              i === index ? 'w-3 h-1.5 rounded-full bg-[#006c4a]' : 'w-1.5 h-1.5 rounded-full bg-[#bec9c2]'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

// ---- Featured offer block (best real special-offer product) ---------------

const HomeFeaturedOffer: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, navigateTo } = useApp();
  const [imgError, setImgError] = useState(false);

  return (
    <section>
      <div className="bg-[#0F5338] rounded-2xl p-3 flex gap-3 flex-row-reverse shadow-md">
        {/* Main product card */}
        <div className="flex-[3] bg-white rounded-xl p-3 flex flex-col gap-2 relative shadow-xs text-right">
          {!!product.discountPercentage && (
            <div className="absolute top-2 left-2 bg-[#f97316] text-white px-3 py-1 rounded-lg text-[10px] font-black shadow-xs">
              {toPersianDigits(product.discountPercentage)}٪ تخفیف
            </div>
          )}

          <div
            onClick={() => navigateTo('product-detail', { product })}
            className="w-full aspect-[4/3] mb-1 flex items-center justify-center overflow-hidden rounded-lg bg-[#f8fafc] cursor-pointer"
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
              <span className="material-symbols-outlined text-[#cbd5e1] text-[40px]">card_giftcard</span>
            )}
          </div>

          <div className="flex flex-col gap-0.5">
            <h4 className="font-extrabold text-[14px] text-[#022c22] line-clamp-1">{product.name}</h4>
            <span className="text-[#6f7973] text-[11px]">{product.brand}</span>
          </div>

          <div className="flex flex-col gap-1 my-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[#006c4a] font-black text-[14px]">{formatCurrency(product.price)}</span>
              <span className="text-[9px] text-[#6f7973]">قیمت عمده</span>
            </div>
            {product.unitPrice > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[#6f7973] text-[11px] line-through decoration-[#7e0021]/50">
                  {formatCurrency(product.unitPrice)}
                </span>
                <span className="text-[9px] text-[#6f7973]">قیمت مصرف‌کننده</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-[#b45309] text-[10px] font-bold">
            <span className="material-symbols-outlined text-[14px]">local_offer</span>
            <span>پیشنهاد ویژه همکاری — موجودی محدود</span>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => navigateTo('product-detail', { product })}
              className="flex-1 py-2 border border-[#006c4a] text-[#006c4a] hover:bg-[#006c4a]/5 rounded-lg font-bold text-[12px] active:scale-95 transition-all text-center"
            >
              جزئیات
            </button>
            <button
              onClick={() => product.inStock && addToCart(product, 1)}
              disabled={!product.inStock}
              className="flex-1 py-2 bg-[#0F5338] hover:bg-[#004532] text-white rounded-lg font-bold text-[12px] active:scale-95 transition-all text-center shadow-xs disabled:opacity-40"
            >
              افزودن
            </button>
          </div>
        </div>

        {/* Side promo column */}
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[26px]">redeem</span>
          </div>
          <div className="text-white font-bold text-[13px]">پیشنهادهای ویژه</div>
          <button
            onClick={() => navigateTo('products')}
            className="text-white/80 hover:text-white font-semibold flex items-center gap-0.5 text-[10px] hover:underline"
          >
            مشاهده همه
            <span className="material-symbols-outlined text-[12px]">chevron_left</span>
          </button>
        </div>
      </div>
    </section>
  );
};

// ---- HomeView ---------------------------------------------------------------

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

  const popularProducts = [...products]
    .filter((p) => p.inStock)
    .sort((a, b) => Number(b.specialOffer) - Number(a.specialOffer))
    .slice(0, 8);

  const specialOfferProducts = products.filter((p) => p.specialOffer && p.inStock);
  const bestOfferProduct = [...specialOfferProducts].sort(
    (a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0)
  )[0];

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
  const rowCategories = rankedCategories.slice(0, 3);

  const promoSlides: PromoSlide[] = specialOfferProducts.slice(0, 3).map((p) => ({
    key: p.id,
    imageUrl: p.imageUrl,
    fallbackIcon: 'local_fire_department',
    title: p.name,
    discountText: p.discountPercentage ? `تا ${toPersianDigits(p.discountPercentage)}٪ سود` : 'پیشنهاد ویژه',
    subTitle: p.brand,
    onClick: () => navigateTo('product-detail', { product: p }),
  }));

  const recentOrders = orders.filter((o) => o.customerId === currentCustomer.id).slice(0, 3);
  const mostRecentOrder = recentOrders[0];

  return (
    <div className="pb-28 pt-4 space-y-7">
      <div className="px-4">
        <AppBanner />
      </div>

      {catalogError && (
        <div className="mx-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3.5 flex items-start gap-2.5">
          <span className="material-symbols-outlined text-rose-600 text-[20px] shrink-0 mt-0.5">warning</span>
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
        <div className="mx-4 bg-[#ecfdf5] rounded-xl px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c4a] text-[16px]">history</span>
            <span className="text-[11px] font-bold text-[#022c22]">تکرار سفارش قبلی</span>
          </div>
          <button
            onClick={() => reorder(mostRecentOrder)}
            className="bg-[#006c4a] hover:bg-[#004532] text-white text-[10.5px] font-extrabold px-2.5 py-1 rounded-lg active:scale-95 transition-all flex items-center gap-1"
          >
            <span>ثبت مجدد ({toPersianDigits(mostRecentOrder.items.length)} کالا)</span>
            <span className="material-symbols-outlined text-[13px]">arrow_back</span>
          </button>
        </div>
      )}

      <div className="px-4">
        <HomeSearchBar products={products} />
      </div>

      <div className="px-4">
        <HomeCategoryGrid />
      </div>

      <div className="px-4">
        <HomeProductSection
          title="محبوب‌ترین اقلام"
          iconName="local_fire_department"
          products={popularProducts}
          onViewAll={() => navigateTo('products')}
        />
      </div>

      <div className="px-4">
        <HomeBrandsGrid brands={brands} />
      </div>

      {promoSlides.length > 0 && (
        <div className="px-4">
          <HomeWeeklyOffer slides={promoSlides} />
        </div>
      )}

      <div className="mx-4 flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-2">
        <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0">sell</span>
        <p className="text-[10.5px] text-amber-800 font-semibold leading-relaxed">
          سفارش‌های عمده بالای {formatCurrency(5000000)} شامل ۵٪ تخفیف خودکار همکاری می‌شوند.
        </p>
      </div>

      {bestOfferProduct && (
        <div className="px-4">
          <HomeFeaturedOffer product={bestOfferProduct} />
        </div>
      )}

      {rowCategories.map((cat) => (
        <div className="px-4" key={cat.name}>
          <HomeProductSection
            title={cat.name}
            iconName={cat.icon}
            products={products.filter((p) => p.category === cat.name).slice(0, 8)}
            onViewAll={() => {
              updateFilter('category', cat.name);
              navigateTo('products');
            }}
          />
        </div>
      ))}

      {/* Recent orders */}
      <div className="mx-4 bg-white rounded-2xl border border-[#e2e8f0] p-3.5 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-[#f1f5f9] pb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#022c22] text-[18px]">schedule</span>
            <h3 className="text-xs font-extrabold text-[#171c1f]">آخرین سفارشات ثبت‌شده</h3>
          </div>
          <button
            onClick={() => navigateTo('my-orders')}
            className="text-[11px] font-bold text-[#006c4a] hover:underline"
          >
            مشاهده سوابق
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-[#6f7973] py-3 text-center">هنوز سفارشی ثبت نشده است.</p>
        ) : (
          <div className="space-y-2.5">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigateTo('my-orders', { order })}
                className="p-2.5 bg-[#f8fafc] hover:bg-[#f0fdf4] border border-[#e2e8f0]/80 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#171c1f]">{order.orderNumber}</span>
                    <StatusBadge status={order.status} size="sm" />
                  </div>
                  <div className="text-[11px] text-[#6f7973] mt-1 flex items-center gap-2">
                    <span>{order.orderDate}</span>
                    <span>•</span>
                    <span>{toPersianDigits(order.items.length)} قلم کالا</span>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-xs font-black text-[#006c4a] block">
                    {formatCurrency(order.finalAmount)}
                  </span>
                  <span className="text-[10px] text-[#6f7973]">نمایش جزئیات</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
