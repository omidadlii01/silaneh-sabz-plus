import React from 'react';
import { Category } from '../types';

interface CategoryGridProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  selectedCategory?: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onSelectCategory,
  selectedCategory,
}) => {
  return (
    <section className="mt-6 px-4">
      <div className="grid grid-cols-3 gap-4">
        {categories.map((cat: Category) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition-all duration-200 ${
                isSelected ? 'scale-105' : ''
              }`}
            >
              <div
                className={`aspect-square w-full rounded-2xl bg-[#eaeef2]/40 backdrop-blur-md flex items-center justify-center p-2.5 border transition-all shadow-xs ${
                  isSelected
                    ? 'border-[#006c4a] bg-[#82f5c1]/20 ring-2 ring-[#006c4a]/30'
                    : 'border-[#006c4a]/20 group-hover:border-[#006c4a]/50 group-hover:bg-white'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <span
                className={`text-[12px] font-semibold text-center mt-1 leading-tight ${
                  isSelected ? 'text-[#004532] font-black' : 'text-[#171c1f]'
                }`}
              >
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
