import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, viewScreen, navigateTo } = useApp();

  // Hide bottom nav on login screen
  if (viewScreen === 'login') return null;

  const navItems: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'home', label: 'خانه', icon: 'home' },
    { id: 'products', label: 'محصولات', icon: 'inventory_2' },
    { id: 'orders', label: 'سفارشات', icon: 'receipt_long' },
    { id: 'account', label: 'حساب کاربری', icon: 'account_circle' },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    if (tabId === 'home') navigateTo('home');
    else if (tabId === 'products') navigateTo('products');
    else if (tabId === 'orders') navigateTo('my-orders');
    else if (tabId === 'account') navigateTo('account');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-t border-[#e2e8f0] shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-safe">
      <div className="max-w-md mx-auto h-16 flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id && viewScreen !== 'admin';

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="flex flex-col items-center justify-center flex-1 py-1.5 transition-all duration-200 relative"
            >
              <div
                className={`px-3.5 py-0.5 rounded-full transition-all ${
                  isActive ? 'bg-[#82f5c1]/30' : ''
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    isActive ? 'text-[#006c4a]' : 'text-[#6f7973]'
                  }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24" } : undefined}
                >
                  {item.icon}
                </span>
              </div>
              <span
                className={`text-[10.5px] mt-0.5 leading-none ${
                  isActive ? 'font-black text-[#022c22]' : 'font-semibold text-[#6f7973]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
