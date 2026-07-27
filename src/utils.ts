import { OrderStatus } from './types';

// Convert English numbers to Persian digits
export function toPersianDigits(n: number | string): string {
  if (n === null || n === undefined) return '';
  const str = n.toString();
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (x) => persianDigits[parseInt(x, 10)]);
}

// Format numbers with commas (e.g., 1,250,000 تومان)
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '۰ تومان';
  const formatted = amount.toLocaleString('fa-IR');
  return `${formatted} تومان`;
}

// Get status styling and Persian text
export function getStatusBadgeInfo(status: OrderStatus): {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
} {
  switch (status) {
    case 'ثبت شده':
      return {
        label: 'ثبت شده',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
      };
    case 'در حال بررسی':
      return {
        label: 'در حال بررسی',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
      };
    case 'تأیید شده':
      return {
        label: 'تأیید شده',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
      };
    case 'آماده ارسال':
      return {
        label: 'آماده ارسال',
        bgColor: 'bg-teal-50',
        textColor: 'text-teal-700',
        borderColor: 'border-teal-200',
      };
    case 'ارسال شده':
      return {
        label: 'ارسال شده',
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-700',
        borderColor: 'border-indigo-200',
      };
    case 'تحویل شده':
      return {
        label: 'تحویل شده',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-300',
      };
    case 'لغو شده':
      return {
        label: 'لغو شده',
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-700',
        borderColor: 'border-rose-200',
      };
    default:
      return {
        label: status,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-200',
      };
  }
}
