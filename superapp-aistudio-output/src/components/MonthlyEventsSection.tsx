// src/components/MonthlyEventsSection.tsx
import React from 'react';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { EventItem } from '../types';

export interface MonthlyEventsSectionProps {
  events?: EventItem[];
  onViewAll?: () => void;
  onEventClick?: (eventId: string) => void;
}

const defaultEvents: EventItem[] = [
  {
    id: 'event-1',
    title: 'مدیریت نوین زنجیره تامین',
    badge: 'وبینار آموزشی',
    badgeBgClass: 'bg-emerald-800',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80',
    infoText: '۱۵ مهر ماه - ساعت ۱۶:۰۰',
    infoType: 'date',
  },
  {
    id: 'event-2',
    title: 'گردهمایی سیلانه',
    badge: 'جشنواره فروش',
    badgeBgClass: 'bg-orange-600',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    infoText: 'هتل اسپیناس',
    infoType: 'location',
  },
];

export const MonthlyEventsSection: React.FC<MonthlyEventsSectionProps> = ({
  events = defaultEvents,
  onViewAll,
  onEventClick,
}) => {
  return (
    <section className="px-4 mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">ایونت‌های ماهانه</h2>
        <button
          type="button"
          onClick={onViewAll || (() => {/* TODO: wire navigation */})}
          className="text-emerald-700 text-sm font-bold hover:text-emerald-900 transition-colors"
        >
          مشاهده همه
        </button>
      </div>

      {/* Events Carousel */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => onEventClick ? onEventClick(event.id) : {/* TODO: wire navigation */}}
            className="min-w-[260px] sm:min-w-[280px] bg-white rounded-2xl overflow-hidden shadow-xs border border-gray-100 snap-start shrink-0 cursor-pointer group active:scale-98 transition-all duration-150"
          >
            {/* Image & Badge Container */}
            <div className="relative h-32 bg-gray-100 overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <span
                className={`absolute bottom-2 right-2 ${event.badgeBgClass} text-white text-[10px] font-bold px-2 py-1 rounded shadow-xs`}
              >
                {event.badge}
              </span>
            </div>

            {/* Content */}
            <div className="p-3">
              <h3 className="font-bold text-sm text-gray-800 mb-2 line-clamp-1">
                {event.title}
              </h3>

              <div className="flex items-center text-[10px] text-gray-400 gap-1 font-medium">
                {event.infoType === 'date' ? (
                  <CalendarIcon className="h-3 w-3 shrink-0 text-emerald-600" />
                ) : (
                  <MapPin className="h-3 w-3 shrink-0 text-orange-500" />
                )}
                <span>{event.infoText}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MonthlyEventsSection;
