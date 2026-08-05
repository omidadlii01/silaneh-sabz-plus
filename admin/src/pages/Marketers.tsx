import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Loading, ErrorBox, PageHeader } from '../components/Status';

export default function Marketers() {
  const [marketers, setMarketers] = useState<any[] | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<number | string | null>(null);

  const load = () => {
    api
      .marketers()
      .then((r) => setMarketers(r.marketers))
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (m: any) => {
    setBusyId(m.id);
    setError('');
    try {
      await api.setMarketerActive(m.id, !m.active);
      setMarketers((prev) => prev && prev.map((x) => (x.id === m.id ? { ...x, active: !m.active } : x)));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const filtered = marketers?.filter(
    (m) =>
      !search ||
      m.phone?.includes(search) ||
      `${m.first_name} ${m.last_name}`.includes(search) ||
      m.region?.includes(search),
  );

  const pendingCount = marketers?.filter((m) => !m.active).length || 0;

  return (
    <div>
      <PageHeader title="بازاریاب‌ها" subtitle="تایید ثبت‌نام بازاریاب‌های جدید و مدیریت وضعیت حساب‌ها" />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو بر اساس نام، شماره موبایل یا منطقه..."
          className="w-full sm:w-80 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
        {pendingCount > 0 && (
          <span className="text-xs px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 w-fit">
            {pendingCount} بازاریاب در انتظار تایید
          </span>
        )}
      </div>

      {error && <ErrorBox message={error} />}
      {!marketers && !error && <Loading />}

      {marketers && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="text-right px-4 py-3">کد پرسنلی</th>
                <th className="text-right px-4 py-3">نام و نام‌خانوادگی</th>
                <th className="text-right px-4 py-3">موبایل</th>
                <th className="text-right px-4 py-3">منطقه</th>
                <th className="text-right px-4 py-3">تاریخ ثبت‌نام</th>
                <th className="text-right px-4 py-3">وضعیت</th>
                <th className="text-right px-4 py-3">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((m) => (
                <tr key={m.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-500">{m.personnel_code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {m.first_name} {m.last_name}
                  </td>
                  <td className="px-4 py-3" dir="ltr">
                    {m.phone}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{m.region}</td>
                  <td className="px-4 py-3 text-gray-500">{m.created_at}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        m.active ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {m.active ? 'فعال' : 'در انتظار تایید'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(m)}
                      disabled={busyId === m.id}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium disabled:opacity-50 ${
                        m.active
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {busyId === m.id ? '...' : m.active ? 'غیرفعال کردن' : 'تایید و فعال‌سازی'}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered?.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    بازاریابی یافت نشد.
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
