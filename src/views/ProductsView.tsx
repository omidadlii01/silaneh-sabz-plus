import React, { useMemo } from 'react';
import { Search, Filter, RotateCcw, Check, Sparkles, Flame, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { toPersianDigits } from '../utils';

export const ProductsView: React.FC = () => {
  const { products, brands, filters, updateFilter, resetFilters } = useApp();

  // When a specific brand is selected (e.g. tapped from the brand grid on
  // Home), this becomes a dedicated "brand page": no global search box, no
  // brand tabs, no category tabs — just that brand's products, per request.
  const isBrandView = filters.brand !== 'همه';

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

      // Brand filter
      if (filters.brand !== 'همه' && p.brand !== filters.brand) return false;

      // Category filter
      if (filters.category !== 'همه' && p.category !== filters.category) return false;

      // In Stock filter
      if (filters.inStockOnly && !p.inStock) return false;

      // Special Offer filter
      if (filters.specialOfferOnly && !p.specialOffer) return false;

      // Is New filter
      if (filters.isNewOnly && !p.isNew) return false;

      // Search Query
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

  return (
    <div className="pb-20 pt-3 px-3 sm:px-4 max-w-md mx-auto space-y-3.5">
      {/* Header & Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isBrandView && (
            <button
              onClick={resetFilters}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              aria-label="بازگشت"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              {isBrandView ? `محصولات ${filters.brand}` : 'کاتالوگ محصولات عمده'}
            </h2>
            <p className="text-[11px] text-slate-500">
              {isBrandView
                ? `${toPersianDigits(filteredProducts.length)} کالا`
                : 'لیست قیمت و موجودی انبار سیلانه سبز'}
            </p>
          </div>
        </div>

        {!isBrandView &&
          (filters.brand !== 'همه' ||
            filters.category !== 'همه' ||
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
      {!isBrandView && (
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
      )}

      {/* Brand Horizontal Filter Tabs */}
      {!isBrandView && (
        <div>
          <span className="text-[11px] font-bold text-slate-500 mb-1.5 block">فیلتر برند:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3">
            <button
              onClick={() => updateFilter('brand', 'همه')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                filters.brand === 'همه'
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              همه برندها
            </button>

            {brands.map((b) => (
              <button
                key={b.id}
                onClick={() => updateFilter('brand', b.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  filters.brand === b.name
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Horizontal Filter Tabs */}
      {!isBrandView && (
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
      )}

      {/* Quick Checkbox Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {/* In stock only */}
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

        {/* Special Offer */}
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

        {/* New */}
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
