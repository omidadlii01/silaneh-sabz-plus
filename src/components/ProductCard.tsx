import React, { useState } from 'react';
import {
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
} from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatCurrency, toPersianDigits } from '../utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateCartQuantity, navigateTo } = useApp();
  const [imgError, setImgError] = useState(false);

  // Find if item is already in cart
  const cartItem = cart.find((item) => item.product.id === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  // Icon mapping for fallback
  const renderIcon = (iconType: string) => {
    const props = { className: 'w-8 h-8 opacity-90' };
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden relative group">
      {/* Product Image / Visual Header */}
      <div
        onClick={() => navigateTo('product-detail', { product })}
        className="h-36 bg-slate-50 flex items-center justify-center relative cursor-pointer overflow-hidden p-2 border-b border-slate-100"
      >
        {product.imageUrl && !imgError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 rounded-xl"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full ${product.imageColor} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
            {renderIcon(product.iconType)}
          </div>
        )}

        {/* Special Offer / Discount Tag */}
        {product.specialOffer && (
          <span className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
            پیشنهاد ویژه
          </span>
        )}

        {/* New Tag */}
        {product.isNew && !product.specialOffer && (
          <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
            جدید
          </span>
        )}

        {/* Brand Tag */}
        <span className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
          {product.brand}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Product Title */}
          <h3
            onClick={() => navigateTo('product-detail', { product })}
            className="text-xs font-extrabold text-slate-900 leading-snug line-clamp-2 cursor-pointer hover:text-emerald-800 transition-colors h-9"
          >
            {product.name}
          </h3>

          {/* Carton Units Specs */}
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 w-fit">
            <Box className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-semibold">بسته‌بندی: {toPersianDigits(product.cartonQuantity)} عدد در کارتن</span>
          </div>

          {/* Price & Stock */}
          <div className="mt-3 flex items-baseline justify-between border-t border-slate-100 pt-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium">قیمت عمده کارتن</span>
              <span className="text-sm font-black text-emerald-800">
                {formatCurrency(product.price)}
              </span>
            </div>

            {/* Stock status */}
            <div>
              {product.inStock ? (
                <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3 ml-0.5 text-emerald-600" />
                  موجود
                </span>
              ) : (
                <span className="inline-flex items-center text-[10px] font-extrabold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-100">
                  <XCircle className="w-3 h-3 ml-0.5 text-rose-600" />
                  ناموجود
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Button / Stepper */}
        <div className="mt-3">
          {!product.inStock ? (
            <button
              disabled
              className="w-full py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed text-center"
            >
              اتمام موجودی انبار
            </button>
          ) : cartQuantity === 0 ? (
            <button
              onClick={() => addToCart(product, 1)}
              className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold rounded-xl active:scale-98 transition-all flex items-center justify-center gap-1 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن کارتن به سبد</span>
            </button>
          ) : (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-1">
              <button
                onClick={() => updateCartQuantity(product.id, cartQuantity + 1)}
                className="w-7 h-7 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg flex items-center justify-center active:scale-95 transition-transform"
                title="افزودن کارتن"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              <div className="flex flex-col items-center">
                <span className="text-xs font-black text-emerald-900">
                  {toPersianDigits(cartQuantity)} کارتن
                </span>
              </div>

              <button
                onClick={() => updateCartQuantity(product.id, cartQuantity - 1)}
                className="w-7 h-7 bg-white text-emerald-800 border border-emerald-300 rounded-lg flex items-center justify-center active:scale-95 transition-transform shadow-2xs"
                title="کاهش کارتن"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
