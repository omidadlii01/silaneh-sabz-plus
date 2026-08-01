import React, { useEffect, useState } from 'react';
import { ShoppingCart, Clock, Wallet, Users, Package } from 'lucide-react';
import { api } from '../api';
import { Loading, ErrorBox, PageHeader } from '../components/Status';

const CARDS = [
  { key: 'totalOrders', label: 'کل سفارش‌ها', icon: ShoppingCart, color: 'bg-emerald-100 text-emerald-700' },
  { key: 'newOrders', label: 'سفارش‌های جدید', icon: Clock, color: 'bg-amber-100 text-amber-700' },
  { key: 'totalAmount', label: 'مجموع فروش (تومان)', icon: Wallet, color: 'bg-sky-100 text-sky-700', isMoney: true },
  { key: 'totalCustomers', label: 'مشتری‌ها', icon: Users, color: 'bg-violet-100 text-violet-700' },
  { key: 'totalProducts', label: 'محصولات فعال', icon: Package, color: 'bg-rose-100 text-rose-700' },
] as const;

export default function Dashboard() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .stats()
      .then(setStats as any)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <PageHeader title="داشبورد" subtitle="نمای کلی وضعیت فروشگاه" />
      {error && <ErrorBox message={error} />}
      {!stats && !error && <Loading />}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {CARDS.map((c) => {
            const Icon = c.icon;
            const value = (stats as any)[c.key] ?? 0;
            return (
              <div key={c.key} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${c.color}`}>
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {(c as any).isMoney ? Number(value).toLocaleString('fa-IR') : value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{c.label}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
