import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { adminLogin } from './api';

export default function Login({ onSuccess }: { onSuccess: () => void }) {
  const [token, setTokenInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!token.trim()) return;
    setLoading(true);
    try {
      await adminLogin(token.trim());
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'ورود ناموفق بود.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-700 flex items-center justify-center mb-3">
            <Lock className="text-white" size={24} />
          </div>
          <h1 className="text-lg font-bold text-emerald-900">پنل مدیریت سیلانه سبز</h1>
          <p className="text-sm text-gray-500 mt-1">برای ورود، توکن ادمین را وارد کنید</p>
        </div>

        <input
          type="password"
          value={token}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="توکن ادمین"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-left"
          dir="ltr"
          autoFocus
        />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-700 text-white rounded-lg py-3 font-semibold text-sm hover:bg-emerald-800 transition disabled:opacity-60"
        >
          {loading ? 'در حال ورود...' : 'ورود'}
        </button>
      </form>
    </div>
  );
}
