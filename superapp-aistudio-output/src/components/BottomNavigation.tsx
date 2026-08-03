// src/components/BottomNavigation.tsx
import React from 'react';
import { ShoppingBag, ClipboardList, ShieldCheck, User, Wallet } from 'lucide-react';
import { NavTabId } from '../types';

export interface BottomNavigationProps {
  activeTab?: NavTabId;
  onTabSelect?: (tabId: NavTabId) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab = 'shop',
  onTabSelect,
}) => {
  const navItems: { id: NavTabId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'shop',
      label: 'فروشگاه',
      icon: <ShoppingBag className="h-6 w-6" />,
    },
    {
      id: 'orders',
      label: 'سفارشات',
      icon: <ClipboardList className="h-6 w-6" />,
    },
    {
      id: 'missions',
      label: 'ماموریت',
      icon: <ShieldCheck className="h-6 w-6" />,
    },
    {
      id: 'visitor',
      label: 'ویزیتور',
      icon: <User className="h-6 w-6" />,
    },
    {
      id: 'wallet',
      label: 'کیف پول',
      icon: <Wallet className="h-6 w-6" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around py-2.5 px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.04)] z-50">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (onTabSelect) {
                onTabSelect(item.id);
              } else {
                // TODO: wire navigation
              }
            }}
            className={`flex flex-col items-center gap-1 transition-all duration-150 relative cursor-pointer ${
              isActive ? 'text-emerald-700 font-bold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {/* Top Indicator bar for active tab */}
            {isActive && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-600 rounded-b-full" />
            )}
            <div className={`p-1 rounded-full ${isActive ? 'bg-emerald-50' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
