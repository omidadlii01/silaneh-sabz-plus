// src/components/QuickAccessGrid.tsx
import React from 'react';
import { ShoppingBag, Gift, Calendar, Tag } from 'lucide-react';
import { QuickAccessItem, QuickAccessType } from '../types';

export interface QuickAccessGridProps {
  items?: QuickAccessItem[];
  onItemClick?: (id: QuickAccessType) => void;
}

const defaultItems: QuickAccessItem[] = [
  { id: 'shop', title: 'فروشگاه', iconType: 'shop' },
  { id: 'awards', title: 'جوایز', iconType: 'awards' },
  { id: 'events', title: 'ایونت‌ها', iconType: 'events' },
  { id: 'discounts', title: 'تخفیفات', iconType: 'discounts' },
];

export const QuickAccessGrid: React.FC<QuickAccessGridProps> = ({
  items = defaultItems,
  onItemClick,
}) => {
  const renderIcon = (type: QuickAccessType) => {
    switch (type) {
      case 'shop':
        return (
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-800">
            <ShoppingBag className="h-6 w-6" />
          </div>
        );
      case 'awards':
        return (
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
            <Gift className="h-6 w-6" />
          </div>
        );
      case 'events':
        return (
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <Calendar className="h-6 w-6" />
          </div>
        );
      case 'discounts':
        return (
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
            <Tag className="h-6 w-6" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="px-4 -mt-8 relative z-10">
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onItemClick ? onItemClick(item.id) : {/* TODO: wire navigation */}}
            className="bg-white p-4 rounded-xl shadow-xs border border-emerald-50/80 flex flex-col items-center justify-center gap-2 group active:scale-95 transition-all duration-150 hover:shadow-md cursor-pointer"
          >
            {renderIcon(item.iconType)}
            <span className="font-bold text-gray-700 text-sm group-hover:text-emerald-800 transition-colors">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickAccessGrid;
