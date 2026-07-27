import React from 'react';
import { Home, Package, ClipboardList, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, viewScreen, navigateTo } = useApp();

  // Hide bottom nav on login screen
  if (viewScreen === 'login') return null;

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'خانه', icon: Home },
    { id: 'products', label: 'محصولات', icon: Package },
    { id: 'orders', label: 'سفارشات', icon: ClipboardList },
    { id: 'account', label: 'حساب کاربری', icon: User },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    if (tabId === 'home') navigateTo('home');
    else if (tabId === 'products') navigateTo('products');
    else if (tabId === 'orders') navigateTo('my-orders');
    else if (tabId === 'account') navigateTo('account');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-lg pb-safe">
      <div className="max-w-md mx-auto h-16 flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && viewScreen !== 'admin';

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-all duration-200 relative ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-emerald-50 text-emerald-700 scale-105' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5 leading-none">{item.label}</span>
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
