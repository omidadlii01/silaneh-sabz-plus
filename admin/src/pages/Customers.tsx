import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Loading, ErrorBox, PageHeader } from '../components/Status';

export default function Customers() {
  const [customers, setCustomers] = useState<any[] | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .customers()
      .then((r) => setCustomers(r.customers))
      .catch((e) => setError(e.message));
  }, []);

  const filtered = customers?.filter(
    (c) =>
      !search ||
      c.storeName?.includes(search) ||
      c.phone?.includes(search) ||
      `${c.firstName} ${c.lastName}`.includes(search),
  );

  return (
    <div>
      <PageHeader title="مشتری‌ها" subtitle="لیست کامل مشتری‌های ثبت‌نام‌شده" />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="جستجو بر اساس نام فروشگاه یا شماره موبایل..."
        className="w-full sm:w-80 border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
      />

      {error && <ErrorBox message={error} />}
      {!customers && !error && <Loading />}

      {customers && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="text-right px-4 py-3">کد مشتری</th>
                <th className="text-right px-4 py-3">فروشگاه</th>
                <th className="text-right px-4 py-3">نام و نام‌خانوادگی</th>
                <th className="text-right px-4 py-3">موبایل</th>
                <th className="text-right px-4 py-3">نوع کسب‌وکار</th>
                <th className="text-right px-4 py-3">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((c) => (
                <tr key={c.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-500">{c.customerCode}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.storeName}</td>
                  <td className="px-4 py-3">
                    {c.firstName} {c.lastName}
                  </td>
                  <td className="px-4 py-3" dir="ltr">
                    {c.phone}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.businessType}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        c.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {c.active ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    مشتری‌ای یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
