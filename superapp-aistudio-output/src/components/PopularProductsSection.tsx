// src/components/PopularProductsSection.tsx
import React from 'react';
import { ProductItem } from '../types';

export interface PopularProductsSectionProps {
  products?: ProductItem[];
  onViewAll?: () => void;
  onOrderProduct?: (productId: string) => void;
}

const defaultProducts: ProductItem[] = [
  {
    id: 'prod-1',
    title: 'کرم آبرسان سیلانه',
    priceFormatted: '۱,۲۰۰,۰۰۰',
    currency: 'ریال',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    isNew: true,
  },
  {
    id: 'prod-2',
    title: 'کرم آبرسان سیلانه',
    priceFormatted: '۱,۲۰۰,۰۰۰',
    currency: 'ریال',
    imageUrl: 'https://images.unsplash.com/photo-1608248597263-0057e57b4524?auto=format&fit=crop&w=400&q=80',
    isNew: true,
  },
];

export const PopularProductsSection: React.FC<PopularProductsSectionProps> = ({
  products = defaultProducts,
  onViewAll,
  onOrderProduct,
}) => {
  return (
    <section className="px-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">محبوب‌ترین اقلام</h2>
        <button
          type="button"
          onClick={onViewAll || (() => {/* TODO: wire navigation */})}
          className="text-emerald-700 text-sm font-bold hover:text-emerald-900 transition-colors"
        >
          مشاهده همه
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[180px] w-[180px] bg-white rounded-xl p-3 shadow-xs border border-gray-100 flex flex-col snap-start shrink-0"
          >
            {/* Image Container */}
            <div className="relative mb-3 bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-32 object-cover rounded-lg"
                loading="lazy"
              />
              {product.isNew && (
                <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                  جدید
                </span>
              )}
            </div>

            {/* Content */}
            <h3 className="text-sm font-bold text-gray-700 mb-1 line-clamp-1">
              {product.title}
            </h3>

            <p className="text-emerald-800 font-bold mb-4 text-base">
              {product.priceFormatted}{' '}
              <small className="text-[10px] font-normal text-gray-600">
                {product.currency}
              </small>
            </p>

            {/* Order Action */}
            <button
              type="button"
              onClick={() => onOrderProduct ? onOrderProduct(product.id) : {/* TODO: wire navigation */}}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-bold hover:bg-emerald-50 hover:text-emerald-800 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              سفارش
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularProductsSection;
