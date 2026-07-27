import React, { useState } from 'react';
import {
  ArrowRight,
  Plus,
  Minus,
  Box,
  Shield,
  Sparkles,
  Droplet,
  Sun,
  Layers,
  Heart,
  Zap,
  Smile,
  ShieldCheck,
  Activity,
  Feather,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  FileText,
  Tag,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, toPersianDigits } from '../utils';

export const ProductDetailView: React.FC = () => {
  const { selectedProduct, cart, addToCart, updateCartQuantity, navigateTo } = useApp();

  if (!selectedProduct) {
    navigateTo('products');
    return null;
  }

  const cartItem = cart.find((item) => item.product.id === selectedProduct.id);
  const initialQty = cartItem ? cartItem.quantity : 1;
  const [qty, setQty] = useState<number>(initialQty);
  const [imgError, setImgError] = useState(false);

  // Icon mapping
  const renderIcon = (iconType: string) => {
    const props = { className: 'w-16 h-16 opacity-90' };
    switch (iconType) {
      case 'shield':
        return <Shield {...props} />;
      case 'sparkles':
        return <Sparkles {...props} />;
      case 'droplet':
        return <Droplet {...props} />;
      case 'sun':
        return <Sun {...props} />;
      case 'layers':
        return <Layers {...props} />;
      case 'heart':
        return <Heart {...props} />;
      case 'zap':
        return <Zap {...props} />;
      case 'smile':
        return <Smile {...props} />;
      case 'shieldCheck':
        return <ShieldCheck {...props} />;
      case 'activity':
        return <Activity {...props} />;
      case 'feather':
        return <Feather {...props} />;
      default:
        return <Box {...props} />;
    }
  };

  const handleAddToCart = () => {
    if (cartItem) {
      updateCartQuantity(selectedProduct.id, qty);
    } else {
      addToCart(selectedProduct, qty);
    }
    navigateTo('cart');
  };

  return (
    <div className="pb-24 pt-3 px-3 sm:px-4 max-w-md mx-auto space-y-4">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('products')}
          className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-800 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به محصولات</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">کد کالا: {selectedProduct.code}</span>
      </div>

      {/* Main Image Header */}
      <div className="w-full h-64 bg-slate-50 border border-slate-200/90 rounded-3xl flex items-center justify-center relative shadow-xs overflow-hidden p-4">
        {selectedProduct.imageUrl && !imgError ? (
          <img
            src={selectedProduct.imageUrl}
            alt={selectedProduct.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain rounded-2xl"
          />
        ) : (
          <div className={`w-full h-full ${selectedProduct.imageColor || 'bg-emerald-100 text-emerald-800'} rounded-2xl flex items-center justify-center`}>
            {renderIcon(selectedProduct.iconType)}
          </div>
        )}

        {selectedProduct.specialOffer && (
          <span className="absolute top-3 right-3 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
            پیشنهاد ویژه
          </span>
        )}

        <span className="absolute bottom-3 left-3 bg-white/95 text-slate-800 text-xs font-black px-3 py-1 rounded-xl shadow-sm border border-slate-200">
          برند: {selectedProduct.brand}
        </span>
      </div>

      {/* Product Information Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3.5">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
              دسته: {selectedProduct.category}
            </span>

            {selectedProduct.inStock ? (
              <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                موجود در انبار ({toPersianDigits(selectedProduct.stockCount)} کارتن)
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                <XCircle className="w-3.5 h-3.5 ml-1 text-rose-600" />
                اتمام موجودی
              </span>
            )}
          </div>

          <h1 className="text-base font-black text-slate-900 leading-snug mt-1">
            {selectedProduct.name}
          </h1>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-emerald-700" />
            <div>
              <span className="text-[10px] text-slate-400 block">بسته‌بندی در کارتن</span>
              <span className="text-xs font-bold text-slate-800">
                {toPersianDigits(selectedProduct.cartonQuantity)} عدد
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-700" />
            <div>
              <span className="text-[10px] text-slate-400 block">قیمت مصوب واحد</span>
              <span className="text-xs font-bold text-slate-800">
                {formatCurrency(selectedProduct.unitPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>شرح و مشخصات فنی محصول:</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
            {selectedProduct.description}
          </p>
        </div>

        {/* Pricing Summary */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">قیمت هر کارتن عمده</span>
            <span className="text-lg font-black text-emerald-800">
              {formatCurrency(selectedProduct.price)}
            </span>
          </div>

          <div className="text-left">
            <span className="text-[10px] text-slate-400 block">مبلغ کل سفارش کالا</span>
            <span className="text-sm font-extrabold text-slate-900">
              {formatCurrency(selectedProduct.price * qty)}
            </span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Panel */}
      {selectedProduct.inStock && (
        <div className="bg-white border-t border-slate-200 p-3 rounded-3xl shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">تعداد کارتن سفارشی:</span>

            <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-8 bg-emerald-800 text-white rounded-xl flex items-center justify-center active:scale-95 transition-transform"
              >
                <Plus className="w-4 h-4" />
              </button>

              <span className="text-sm font-black text-slate-900 w-8 text-center">
                {toPersianDigits(qty)}
              </span>

              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 bg-white text-slate-800 border border-slate-300 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 text-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>افزودن به سبد خرید و مشاهده فاکتور</span>
          </button>
        </div>
      )}
    </div>
  );
};
