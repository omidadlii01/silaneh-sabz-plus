import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import { Icon } from './Icon';

export const BottomNav: React.FC = () => {
  const { activeTab, viewScreen, navigateTo } = useApp();

  // Hide bottom nav on login screen
  if (viewScreen === 'login') return null;

  const navItems: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'home', label: 'خانه', icon: 'home' },
    { id: 'products', label: 'محصولات', icon: 'inventory_2' },
    { id: 'orders', label: 'سفارشات', icon: 'receipt_long' },
    { id: 'visitor', label: 'ارتباط با ویزیتور', icon: 'support_agent' },
    { id: 'account', label: 'حساب کاربری', icon: 'account_circle' },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    if (tabId === 'home') navigateTo('home');
    else if (tabId === 'products') navigateTo('products');
    else if (tabId === 'orders') navigateTo('my-orders');
    else if (tabId === 'visitor') navigateTo('visitor');
    else if (tabId === 'account') navigateTo('account');
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[424px] z-40 p-[2px] rounded-2xl bg-gradient-to-r from-[#10b981] via-[#34d399] to-[#059669] shadow-[0_0_20px_rgba(16,185,129,0.35),0_10px_25px_-5px_rgba(0,108,74,0.3)]">
      <nav className="w-full bg-[#f4fbf7]/95 backdrop-blur-2xl rounded-[14px] h-16 px-1 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id && viewScreen !== 'admin';

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full px-1 active:scale-95 transition-all relative ${
                isActive ? 'text-[#006c4a]' : 'text-[#6f7973]'
              }`}
            >
              {isActive && (
                <span className="absolute top-1.5 inset-x-4 h-1 bg-[#006c4a] rounded-full shadow-[0_0_8px_rgba(0,108,74,0.6)]" />
              )}
              <Icon
                name={item.icon}
                size={22}
                className="mb-0.5"
                style={isActive ? { fill: 'currentColor', fillOpacity: 0.15 } : undefined}
              />
              <span className={`text-[10.5px] leading-none ${isActive ? 'font-black' : 'font-semibold'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
