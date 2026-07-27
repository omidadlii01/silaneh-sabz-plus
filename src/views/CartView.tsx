import React from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, Box, Tag, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, toPersianDigits } from '../utils';

interface CartItemImageProps {
  product: any;
  onClick: () => void;
}

const CartItemImage: React.FC<CartItemImageProps> = ({ product, onClick }) => {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div
      onClick={onClick}
      className="w-14 h-14 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-center flex-none cursor-pointer overflow-hidden p-1"
    >
      {product.imageUrl && !hasError ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain rounded-lg"
        />
      ) : (
        <div className={`w-full h-full ${product.imageColor || 'bg-emerald-100 text-emerald-800'} rounded-lg flex items-center justify-center`}>
          <Box className="w-5 h-5 opacity-80" />
        </div>
      )}
    </div>
  );
};

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartInitialAmount,
    cartDiscountAmount,
    cartFinalAmount,
    cartTotalCount,
    navigateTo,
  } = useApp();

  if (cart.length === 0) {
    return (
      <div className="pb-20 pt-8 px-4 max-w-md mx-auto text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-base font-black text-slate-800">سبد خرید شما خالی است</h2>
          <p className="text-xs text-slate-500 mt-1">
            جهت مشاهده و افزودن محصولات به کاتالوگ مراجعه کنید.
          </p>
        </div>
        <button
          onClick={() => navigateTo('products')}
          className="bg-emerald-800 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-sm hover:bg-emerald-900 active:scale-95 transition-all inline-flex items-center gap-2"
        >
          <span>مشاهده کاتالوگ محصولات</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-3 px-3 sm:px-4 max-w-md mx-auto space-y-4">
      {/* Top Title Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('products')}
            className="p-1.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">سبد خرید و فاکتور پیش‌فرض</h2>
            <p className="text-[11px] text-slate-500">
              {toPersianDigits(cartTotalCount)} کارتن محصول انتخاب شده است
            </p>
          </div>
        </div>

        <button
          onClick={clearCart}
          className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>حذف همه</span>
        </button>
      </div>

      {/* Cart Items List */}
      <div className="space-y-2.5">
        {cart.map((item) => {
          const rowSubtotal = item.product.price * item.quantity;

          return (
            <div
              key={item.product.id}
              className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs flex flex-col gap-2.5"
            >
              <div className="flex items-start gap-3">
                {/* Visual Image / Icon Box */}
                <CartItemImage
                  product={item.product}
                  onClick={() => navigateTo('product-detail', { product: item.product })}
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3
                      onClick={() => navigateTo('product-detail', { product: item.product })}
                      className="text-xs font-bold text-slate-900 leading-snug truncate cursor-pointer hover:text-emerald-800"
                    >
                      {item.product.name}
                    </h3>

                    {/* Red trash button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="حذف از سبد"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </button>
                  </div>

                  <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>برند: {item.product.brand}</span>
                    <span>•</span>
                    <span>{toPersianDigits(item.product.cartonQuantity)} عدد در کارتن</span>
                  </div>

                  <div className="text-xs font-bold text-emerald-800 mt-1">
                    قیمت کارتن: {formatCurrency(item.product.price)}
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Row Total */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-2 bg-slate-50/50 p-2 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-600">تعداد:</span>
                  <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 bg-emerald-800 text-white rounded-lg flex items-center justify-center active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-xs font-extrabold text-slate-900 w-6 text-center">
                      {toPersianDigits(item.quantity)}
                    </span>

                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 bg-slate-100 text-slate-800 rounded-lg flex items-center justify-center active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block">جمع کل این کالا</span>
                  <span className="text-xs font-black text-slate-900">
                    {formatCurrency(rowSubtotal)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoice Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
        <h3 className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2">
          خلاصه فاکتور سفارش عمده
        </h3>

        <div className="flex justify-between text-xs text-slate-600">
          <span>مجموع اولیه سفارش ({toPersianDigits(cartTotalCount)} کارتن):</span>
          <span className="font-bold text-slate-800">{formatCurrency(cartInitialAmount)}</span>
        </div>

        {cartDiscountAmount > 0 ? (
          <div className="flex justify-between text-xs text-emerald-700 bg-emerald-50 p-2 rounded-xl">
            <span className="flex items-center gap-1 font-bold">
              <Tag className="w-3.5 h-3.5" />
              تخفیف ویژه همکاری/حجم خرید:
            </span>
            <span className="font-black">-{formatCurrency(cartDiscountAmount)}</span>
          </div>
        ) : (
          <div className="text-[11px] text-slate-400 bg-slate-50 p-2 rounded-xl flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>خرید بالای ۵ میلیون تومان مشمول ۵٪ تخفیف همکاری می‌شود.</span>
          </div>
        )}

        <div className="border-t border-slate-200 pt-2.5 flex justify-between items-baseline">
          <span className="text-xs font-black text-slate-900">مبلغ قابل پرداخت:</span>
          <span className="text-base font-black text-emerald-800">
            {formatCurrency(cartFinalAmount)}
          </span>
        </div>
      </div>

      {/* Checkout Submit Button */}
      <button
        onClick={() => navigateTo('checkout')}
        className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 text-xs"
      >
        <span>ادامه جهت تأیید و ثبت نهایی سفارش</span>
        <ArrowLeft className="w-4 h-4" />
      </button>
    </div>
  );
};
