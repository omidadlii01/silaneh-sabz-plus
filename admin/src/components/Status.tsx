import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export function Loading() {
  return (
    <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
      <Loader2 className="animate-spin" size={20} />
      <span className="text-sm">در حال بارگذاری...</span>
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
      <AlertCircle size={18} />
      {message}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
