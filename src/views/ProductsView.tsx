import React, { useMemo, useState } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  Flame,
  CheckCircle2,
  ArrowRight,
  Plus,
  Minus,
  Box,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { toPersianDigits, formatCurrency } from '../utils';
import { Product } from '../types';

// Single-row product item used on the dedicated brand page (matches the
// reference layout: name + packaging + price on the right, product image
// with an add-to-cart button on the left).
const BrandProductRow: React.FC<{ product: Product }> = ({ product }) => {
  const { cart, addToCart, updateCartQuantity, navigateTo } = useApp();
  const [imgError, setImgError] = useState(false);
  const cartItem = cart.find((item) => item.product.id === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="flex items-center gap-3 bg-white border-b border-slate-100 py-3.5 px-1">
      <div className="flex-1 min-w-0">
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

      <div
        className="relative w-24 h-24 flex-shrink-0 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden cursor-pointer"
        onClick={() => navigateTo('product-detail', { product })}
      >
        {product.imageUrl && !imgError ? (
          <img
            src={product.imageUrl}
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
    </div>
  );
};

export const ProductsView: React.FC = () => {
  const { products, brands, filters, updateFilter, resetFilters, navigateTo } = useApp();

  // When a specific brand is selected (e.g. tapped from the brand grid on
  // Home), this becomes a dedicated "brand page": no global search box, no
  // brand tabs, no category tabs — just that brand's banner + product list.
  const isBrandView = filters.brand !== 'همه';
  const selectedBrand = useMemo(
    () => brands.find((b) => b.name === filters.brand),
    [brands, filters.brand],
  );

  // Distinct Categories list from products
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
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
      return true;
    });
  }, [products, filters]);

  // ---------- Dedicated brand page ----------
  if (isBrandView) {
    return (
      <div className="pb-20 max-w-md mx-auto">
        {/* Banner */}
        <div
          className={`relative h-40 bg-gradient-to-br ${selectedBrand?.logoColor || 'from-emerald-700 to-emerald-900'} flex items-end px-3 pb-3`}
        >
          <button
            onClick={resetFilters}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-xs"
            aria-label="بازگشت"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateTo('products')}
            className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-xs"
            aria-label="جستجو"
          >
            <Search className="w-4 h-4" />
          </button>

          <div className="w-full flex items-center justify-between">
            <h2 className="text-white text-base font-extrabold drop-shadow-sm">
              محصولات {filters.brand}
            </h2>
            <div className="w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center flex-shrink-0">
              {selectedBrand?.imageUrl ? (
                <img src={selectedBrand.imageUrl} alt={filters.brand} className="w-full h-full object-contain p-1" />
              ) : (
                <span className="text-emerald-800 font-black text-lg">{filters.brand.slice(0, 2)}</span>
              )}
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-4 pt-3 space-y-3">
          {/* Count + quick filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-extrabold text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-xl whitespace-nowrap">
              {toPersianDigits(filteredProducts.length)} کالا
            </span>
            <button
              onClick={() => updateFilter('inStockOnly', !filters.inStockOnly)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 border transition-all whitespace-nowrap ${
                filters.inStockOnly
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${filters.inStockOnly ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span>فقط موجود</span>
            </button>
            <button
              onClick={() => updateFilter('specialOfferOnly', !filters.specialOfferOnly)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 border transition-all whitespace-nowrap ${
                filters.specialOfferOnly
                  ? 'bg-rose-100 text-rose-900 border-rose-300'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${filters.specialOfferOnly ? 'text-rose-600' : 'text-slate-400'}`} />
              <span>آفر ویژه</span>
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
