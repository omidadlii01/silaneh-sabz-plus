import React from 'react';
import { Brand } from '../types';
import { handleImgError } from '../utils/image';

interface BrandsGridProps {
  brands: Brand[];
  onSelectBrand: (brandNameFa: string) => void;
  selectedBrand?: string | null;
  onViewAllBrands: () => void;
}

export const BrandsGrid: React.FC<BrandsGridProps> = ({
  brands,
  onSelectBrand,
  selectedBrand,
  onViewAllBrands,
}) => {
  return (
    <section id="brands-section" className="mt-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5 flex-row-reverse">
          <h2 className="font-['Vazirmatn'] text-[16px] font-extrabold text-[#022c22]">
            برندهای سیلانه سبز
          </h2>
          <span className="material-symbols-outlined text-[#006c4a] text-[20px]">
            military_tech
          </span>
        </div>
        <button
          onClick={onViewAllBrands}
          className="text-[#006c4a] text-[12px] font-bold flex items-center gap-0.5 hover:underline"
        >
          مشاهده همه
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2.5 auto-rows-fr">
        {brands.map((brand: Brand) => {
          const isSelected = selectedBrand === brand.nameFa;
          return (
            <div
              key={brand.id}
              onClick={() => onSelectBrand(brand.nameFa)}
              className={`h-full bg-white border rounded-2xl p-2 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-all shadow-xs ${
                isSelected
                  ? 'border-[#006c4a] bg-[#82f5c1]/10 ring-2 ring-[#006c4a]/30 scale-105'
                  : 'border-[#bec9c2]/30 hover:border-[#006c4a]/40 hover:bg-[#f6fafe]'
              }`}
            >
              <div className="aspect-square w-full p-1.5 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={brand.logo}
                  alt={brand.nameFa}
                  onError={handleImgError}
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                  loading="lazy"
                />
              </div>
              <span className="font-bold text-[11px] text-[#171c1f] truncate w-full">
                {brand.nameFa}
              </span>
              <span className="text-[9px] text-[#6f7973] truncate w-full">
                {brand.nameEn}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
