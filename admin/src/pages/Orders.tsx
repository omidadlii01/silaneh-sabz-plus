import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Loading, ErrorBox, PageHeader } from '../components/Status';

const STATUS_OPTIONS = ['ثبت‌شده', 'در حال پردازش', 'ارسال‌شده', 'تحویل‌شده', 'لغو‌شده'];

const STATUS_COLOR: Record<string, string> = {
  'ثبت‌شده': 'bg-amber-100 text-amber-700',
  'در حال پردازش': 'bg-sky-100 text-sky-700',
  'ارسال‌شده': 'bg-violet-100 text-violet-700',
  'تحویل‌شده': 'bg-emerald-100 text-emerald-700',
  'لغو‌شده': 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState<any[] | null>(null);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  const load = () => {
    api
      .orders()
      .then((r) => setOrders(r.orders))
      .catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const handleStatusChange = async (id: number, status: string) => {
    setUpdating(id);
    try {
      await api.updateOrderStatus(id, status);
      setOrders((prev) => prev && prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <PageHeader title="سفارش‌ها" subtitle="مشاهده و تغییر وضعیت سفارش‌های ثبت‌شده" />
      {error && <ErrorBox message={error} />}
      {!orders && !error && <Loading />}

      {orders && orders.length === 0 && <p className="text-gray-400 text-sm">هنوز سفارشی ثبت نشده.</p>}

      <div className="space-y-3">
        {orders?.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div
              className="p-4 flex items-center justify-between cursor-pointer flex-wrap gap-2"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            >
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  #{order.id} — {order.customer_store_name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {order.customer_phone} · {order.order_date || ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-emerald-700 text-sm">
                  {Number(order.final_amount).toLocaleString('fa-IR')} تومان
                </span>
                <select
                  value={order.status}
                  disabled={updating === order.id}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className={`text-xs font-medium rounded-full px-3 py-1.5 border-0 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {expanded === order.id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs">
                      <th className="text-right pb-2">محصول</th>
                      <th className="text-right pb-2">تعداد</th>
                      <th className="text-right pb-2">قیمت واحد</th>
                      <th className="text-right pb-2">جمع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((item: any) => (
                      <tr key={item.id} className="border-t border-gray-200">
                        <td className="py-2">{item.product_name}</td>
                        <td className="py-2">{item.quantity}</td>
                        <td className="py-2">{Number(item.unit_price).toLocaleString('fa-IR')}</td>
                        <td className="py-2">{Number(item.total_price).toLocaleString('fa-IR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {order.customer_note && (
                  <p className="text-xs text-gray-500 mt-3">یادداشت مشتری: {order.customer_note}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
