import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tags,
  Users,
  UserCheck,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import Login from './Login';
import { getToken, clearToken } from './api';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Brands from './pages/Brands';
import Customers from './pages/Customers';
import Marketers from './pages/Marketers';
import Settings from './pages/Settings';

type Tab = 'dashboard' | 'orders' | 'products' | 'brands' | 'customers' | 'marketers' | 'settings';

const NAV: { id: Tab; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { id: 'orders', label: 'سفارش‌ها', icon: ShoppingCart },
  { id: 'products', label: 'محصولات', icon: Package },
  { id: 'brands', label: 'برندها', icon: Tags },
  { id: 'customers', label: 'مشتری‌ها', icon: Users },
  { id: 'marketers', label: 'بازاریاب‌ها', icon: UserCheck },
  { id: 'settings', label: 'تنظیمات اپ', icon: SettingsIcon },
];

export default function App() {
  const [authed, setAuthed] = useState(!!getToken());
  const [tab, setTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [tab]);

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />;
  }

  const handleLogout = () => {
    clearToken();
    setAuthed(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-30 w-64 bg-emerald-900 text-white flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-emerald-800 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-base">سیلانه سبز</h1>
            <p className="text-emerald-300 text-xs mt-0.5">پنل مدیریت</p>
          </div>
          <button className="lg:hidden text-emerald-200" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active ? 'bg-emerald-700 text-white' : 'text-emerald-200 hover:bg-emerald-800'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-emerald-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-200 hover:bg-emerald-800 transition"
          >
            <LogOut size={18} />
            خروج
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-emerald-900">
            <Menu size={22} />
          </button>
          <h1 className="font-bold text-emerald-900">{NAV.find((n) => n.id === tab)?.label}</h1>
          <div className="w-6" />
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {tab === 'dashboard' && <Dashboard />}
          {tab === 'orders' && <Orders />}
          {tab === 'products' && <Products />}
          {tab === 'brands' && <Brands />}
          {tab === 'customers' && <Customers />}
          {tab === 'marketers' && <Marketers />}
          {tab === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}
