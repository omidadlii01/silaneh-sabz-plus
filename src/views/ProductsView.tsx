import React, { useMemo, useState } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  Flame,
  CheckCircle2,
  ArrowRight,
  ArrowUpDown,
  SlidersHorizontal,
  Plus,
  Minus,
  Box,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { toPersianDigits, formatCurrency, resolveAssetUrl } from '../utils';
import { Product } from '../types';

// Single-row product item used on the dedicated brand page (matches the
// reference layout: product image on the right (with add-to-cart button),
// name + packaging + price on the left).
const BrandProductRow: React.FC<{ product: Product }> = ({ product }) => {
  const { cart, addToCart, updateCartQuantity, navigateTo } = useApp();
  const [imgError, setImgError] = useState(false);
  const cartItem = cart.find((item) => item.product.id === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="flex items-center gap-3 bg-white border-b border-slate-100 py-3.5 px-1">
      <div
        className="relative w-24 h-24 flex-shrink-0 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden cursor-pointer"
        onClick={() => navigateTo('product-detail', { product })}
      >
        {product.imageUrl && !imgError ? (
          <img
            src={resolveAssetUrl(product.imageUrl)}
            alt={product.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain p-1.5"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full ${product.imageColor} flex items-center justify-center`}>
            <Box className="w-8 h-8 opacity-90" />
          </div>
        )}

        {product.inStock && (
          cartQuantity === 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="absolute bottom-1.5 left-1.5 w-7 h-7 bg-white text-rose-600 border border-rose-200 rounded-full flex items-center justify-center shadow-xs active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <div
              className="absolute bottom-1.5 left-1.5 right-1.5 bg-white border border-emerald-200 rounded-full flex items-center justify-between px-1 py-0.5 shadow-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => updateCartQuantity(product.id, cartQuantity + 1)}
                className="w-5 h-5 bg-emerald-700 text-white rounded-full flex items-center justify-center active:scale-95 transition-transform"
              >
                <Plus className="w-3 h-3" />
              </button>
              <span className="text-[10px] font-black text-emerald-900">{toPersianDigits(cartQuantity)}</span>
              <button
                onClick={() => updateCartQuantity(product.id, cartQuantity - 1)}
                className="w-5 h-5 bg-white text-emerald-800 border border-emerald-300 rounded-full flex items-center justify-center active:scale-95 transition-transform"
              >
                <Minus className="w-3 h-3" />
              </button>
            </div>
          )
        )}
      </div>

      <div className="flex-1 min-w-0 text-right">
        <h3
          onClick={() => navigateTo('product-detail', { product })}
          className="text-xs font-extrabold text-slate-900 leading-snug line-clamp-2 cursor-pointer hover:text-emerald-800 transition-colors"
        >
          {product.name}
        </h3>
        <div className="text-[11px] text-slate-500 mt-1.5">
          {toPersianDigits(product.cartonQuantity)} عدد
        </div>

        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          {!!product.discountPercentage && (
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
              {toPersianDigits(product.discountPercentage)}٪
            </span>
          )}
          <span className="text-sm font-black text-slate-900">{formatCurrency(product.price)}</span>
        </div>
        {product.unitPrice > 0 && (
          <div className="text-[11px] text-slate-400 mt-0.5">
            مصرف‌کننده: {formatCurrency(product.unitPrice)}
          </div>
        )}
        {!product.inStock && (
          <span className="inline-block mt-1.5 text-[10px] font-extrabold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-100">
            ناموجود
          </span>
        )}
      </div>
    </div>
  );
};

export const ProductsView: React.FC = () => {
  const { products, brands, filters, updateFilter, resetFilters, navigateTo, goBack } = useApp();

  // When a specific brand is selected (e.g. tapped from the brand grid on
  // Home), this becomes a dedicated "brand page": no global search box, no
  // brand tabs, no category tabs — just that brand's banner + product list.
  const isBrandView = filters.brand !== 'همه';
  const selectedBrand = useMemo(
    () => brands.find((b) => b.name === filters.brand),
    [brands, filters.brand],
  );

  // Brand-scoped search: tapping the search icon on the brand page opens an
  // inline search box that filters only within this brand's products (it
  // does NOT navigate away to the global catalog).
  const [brandSearchOpen, setBrandSearchOpen] = useState(false);
  const [brandSearchTerm, setBrandSearchTerm] = useState('');
  const [brandSortOrder, setBrandSortOrder] = useState<'none' | 'price-asc' | 'price-desc'>('none');

  const handleBrandBack = () => {
    resetFilters();
    goBack();
  };

  const cycleBrandSort = () => {
    setBrandSortOrder((prev) =>
      prev === 'none' ? 'price-asc' : prev === 'price-asc' ? 'price-desc' : 'none',
    );
  };

  // Distinct Categories list from products
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      if (!p.active) return false;
      if (filters.brand !== 'همه' && p.brand !== filters.brand) return false;
      if (filters.category !== 'همه' && p.category !== filters.category) return false;
      if (filters.inStockOnly && !p.inStock) return false;
      if (filters.specialOfferOnly && !p.specialOffer) return false;
      if (filters.isNewOnly && !p.isNew) return false;
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.trim().toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchBrand = p.brand.toLowerCase().includes(query);
        const matchCode = p.code.toLowerCase().includes(query);
        if (!matchName && !matchBrand && !matchCode) return false;
      }
      if (isBrandView && brandSearchTerm.trim()) {
        const q = brandSearchTerm.trim().toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.code.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    if (isBrandView && brandSortOrder !== 'none') {
      list.sort((a, b) => (brandSortOrder === 'price-asc' ? a.price - b.price : b.price - a.price));
    }

    return list;
  }, [products, filters, isBrandView, brandSearchTerm, brandSortOrder]);

  // ---------- Dedicated brand page ----------
  if (isBrandView) {
    return (
      <div className="pb-20 max-w-md mx-auto">
        {/* Banner */}
        <div
          className={`relative h-40 bg-gradient-to-br ${selectedBrand?.logoColor || 'from-emerald-700 to-emerald-900'} overflow-hidden`}
        >
          {/* Wide banner/cover image slot */}
          {selectedBrand?.bannerImageUrl && (
            <img
              src={resolveAssetUrl(selectedBrand.bannerImageUrl)}
              alt={filters.brand}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/10" />

          {/* Back button — fixed top-right corner. Returns to whichever
              screen the user actually came from (e.g. Home), not a fixed page. */}
          <button
            onClick={handleBrandBack}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-xs"
            aria-label="بازگشت"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Top-left: brand-scoped search toggle */}
          <button
            onClick={() => setBrandSearchOpen((v) => !v)}
            className={`absolute top-3 left-3 z-10 w-8 h-8 flex items-center justify-center rounded-full shadow-xs transition-colors ${
              brandSearchOpen ? 'bg-emerald-800 text-white' : 'bg-white/90 text-slate-700'
            }`}
            aria-label="جستجو در محصولات این برند"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Bottom-right: logo + brand name together, both anchored to the right */}
          <div className="absolute bottom-3 right-3 left-3 z-10 flex items-center gap-2.5">
            <div className="w-14 h-14 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center flex-shrink-0">
              {selectedBrand?.imageUrl ? (
                <img src={resolveAssetUrl(selectedBrand.imageUrl)} alt={filters.brand} className="w-full h-full object-contain p-1" />
              ) : (
                <span className="text-emerald-800 font-black text-base">{filters.brand.slice(0, 2)}</span>
              )}
            </div>
            <h2 className="flex-1 min-w-0 truncate text-right text-white text-sm font-extrabold drop-shadow-sm">
              محصولات {filters.brand}
            </h2>
          </div>
        </div>

        {/* Inline brand-scoped search bar (shown when the search icon is tapped) */}
        {brandSearchOpen && (
          <div className="px-3 sm:px-4 pt-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                autoFocus
                type="text"
                value={brandSearchTerm}
                onChange={(e) => setBrandSearchTerm(e.target.value)}
                placeholder={`جستجو در محصولات ${filters.brand}...`}
                className="w-full bg-white border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>
          </div>
        )}

        <div className="px-3 sm:px-4 pt-3 space-y-3">
          {/* Count + quick filter/sort chips — right to left: تعداد کالا، آفر ویژه، مرتب‌سازی، فیلترها */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-extrabold text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-xl whitespace-nowrap flex-shrink-0">
              {toPersianDigits(filteredProducts.length)} کالا
            </span>
            <button
              onClick={() => updateFilter('specialOfferOnly', !filters.specialOfferOnly)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 border transition-all whitespace-nowrap flex-shrink-0 ${
                filters.specialOfferOnly
                  ? 'bg-rose-100 text-rose-900 border-rose-300'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${filters.specialOfferOnly ? 'text-rose-600' : 'text-slate-400'}`} />
              <span>آفر ویژه</span>
            </button>

            <div className="flex-1" />

            <button
              onClick={cycleBrandSort}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 border transition-all whitespace-nowrap flex-shrink-0 ${
                brandSortOrder !== 'none'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <ArrowUpDown className={`w-3.5 h-3.5 ${brandSortOrder !== 'none' ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span>
                {brandSortOrder === 'none' && 'مرتب‌سازی'}
                {brandSortOrder === 'price-asc' && 'ارزان‌ترین'}
                {brandSortOrder === 'price-desc' && 'گران‌ترین'}
              </span>
            </button>
            <button
              onClick={() => updateFilter('inStockOnly', !filters.inStockOnly)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 border transition-all whitespace-nowrap flex-shrink-0 ${
                filters.inStockOnly
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <SlidersHorizontal className={`w-3.5 h-3.5 ${filters.inStockOnly ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span>فیلترها</span>
            </button>
          </div>

          {/* Product list */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center my-6">
              <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">محصولی با این مشخصات یافت نشد</h3>
              <button
                onClick={resetFilters}
                className="mt-3 bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                بازگشت به همه محصولات
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 px-2">
              {filteredProducts.map((product) => (
                <BrandProductRow key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------- Full catalog view (all brands / all categories) ----------
  return (
    <div className="pb-20 pt-3 px-3 sm:px-4 max-w-md mx-auto space-y-3.5">
      {/* Header & Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">کاتالوگ محصولات عمده</h2>
          <p className="text-[11px] text-slate-500">لیست قیمت و موجودی انبار سیلانه سبز</p>
        </div>

        {(filters.category !== 'همه' ||
          filters.inStockOnly ||
          filters.specialOfferOnly ||
          filters.isNewOnly ||
          filters.searchQuery) && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-xl border border-rose-200"
          >
            <RotateCcw className="w-3 h-3" />
            <span>حذف فیلترها</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => updateFilter('searchQuery', e.target.value)}
          placeholder="جستجو بر اساس نام محصول، برند یا کد کالا..."
          className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pr-10 pl-4 text-xs font-medium text-slate-800 shadow-2xs focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
        />
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
      </div>

      {/* Brand Horizontal Filter Tabs */}
      <div>
        <span className="text-[11px] font-bold text-slate-500 mb-1.5 block">فیلتر برند:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3">
          <button
            onClick={() => updateFilter('brand', 'همه')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border bg-emerald-800 text-white border-emerald-800 shadow-2xs"
          >
            همه برندها
          </button>

          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => updateFilter('brand', b.name)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Category Horizontal Filter Tabs */}
      <div>
        <span className="text-[11px] font-bold text-slate-500 mb-1.5 block">فیلتر دسته‌بندی:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3">
          <button
            onClick={() => updateFilter('category', 'همه')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              filters.category === 'همه'
                ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            همه دسته‌ها
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter('category', cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                filters.category === cat
                  ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Checkbox Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => updateFilter('inStockOnly', !filters.inStockOnly)}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 border transition-all whitespace-nowrap ${
            filters.inStockOnly
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
              : 'bg-white text-slate-600 border-slate-200'
          }`}
        >
          <CheckCircle2 className={`w-3.5 h-3.5 ${filters.inStockOnly ? 'text-emerald-700' : 'text-slate-400'}`} />
          <span>فقط موجود در انبار</span>
        </button>

        <button
          onClick={() => updateFilter('specialOfferOnly', !filters.specialOfferOnly)}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 border transition-all whitespace-nowrap ${
            filters.specialOfferOnly
              ? 'bg-rose-100 text-rose-900 border-rose-300'
              : 'bg-white text-slate-600 border-slate-200'
          }`}
        >
          <Flame className={`w-3.5 h-3.5 ${filters.specialOfferOnly ? 'text-rose-600' : 'text-slate-400'}`} />
          <span>پیشنهاد ویژه</span>
        </button>

        <button
          onClick={() => updateFilter('isNewOnly', !filters.isNewOnly)}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 border transition-all whitespace-nowrap ${
            filters.isNewOnly
              ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
              : 'bg-white text-slate-600 border-slate-200'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${filters.isNewOnly ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>محصولات جدید</span>
        </button>
      </div>

      {/* Product List Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center my-6">
          <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">محصولی با این مشخصات یافت نشد</h3>
          <p className="text-xs text-slate-400 mt-1">لطفاً عبارات جستجو یا فیلترها را تغییر دهید.</p>
          <button
            onClick={resetFilters}
            className="mt-3 bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            مشاهده همه محصولات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
