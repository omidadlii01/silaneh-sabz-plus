// Helper functions for Persian language, numbers, currency and date formatting

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Converts English/Arabic numbers into Persian digits (e.g. 1234 -> ۱۲۳۴)
 */
export function toPersianDigits(input: number | string | null | undefined): string {
  if (input === null || input === undefined) return '';
  const str = input.toString();
  return str.replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);
}

/**
 * Converts Persian/Arabic digits to standard English digits for API submissions
 */
export function toEnglishDigits(str: string): string {
  if (!str) return '';
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(PERSIAN_DIGITS[i], 'g'), i.toString());
    result = result.replace(new RegExp(ARABIC_DIGITS[i], 'g'), i.toString());
  }
  return result;
}

/**
 * Format monetary amount in Tomans with Persian separators and digits
 * Example: 1250000 -> ۱,۲۵۰,۰۰۰ تومان
 */
export function formatToman(amount: number | string | null | undefined, includeUnit = true): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return includeUnit ? '۰ تومان' : '۰';
  }
  const numeric = Math.round(Number(amount));
  const parts = numeric.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const persianFormatted = toPersianDigits(parts);
  return includeUnit ? `${persianFormatted} تومان` : persianFormatted;
}

/**
 * Validates 11-digit Iranian mobile number (e.g., 09121234567)
 */
export function isValidIranianMobile(phone: string): boolean {
  if (!phone) return false;
  const englishPhone = toEnglishDigits(phone).trim();
  const regex = /^09\d{9}$/;
  return regex.test(englishPhone);
}

/**
 * Converts Gregorian date string / timestamp to readable Persian Solar date
 */
export function formatShamsiDate(dateInput: string | number | Date | null | undefined): string {
  if (!dateInput) return '—';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);

    // Using Intl.DateTimeFormat with Persian calendar
    const formatter = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      calendar: 'persian',
    });

    return formatter.format(d);
  } catch {
    return String(dateInput);
  }
}

/**
 * Short Shamsi date (e.g. ۱۴ مرداد - ۱۴:۳۰)
 */
export function formatShortDate(dateInput: string | number | Date | null | undefined): string {
  if (!dateInput) return '—';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);

    const formatter = new Intl.DateTimeFormat('fa-IR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      calendar: 'persian',
    });

    return formatter.format(d);
  } catch {
    return String(dateInput);
  }
}

/**
 * Human-readable relative time in Persian (e.g. ۵ دقیقه پیش, ۲ ساعت پیش, دیروز)
 */
export function formatRelativeTime(dateInput: string | number | Date | null | undefined): string {
  if (!dateInput) return '';
  try {
    const now = new Date().getTime();
    const target = new Date(dateInput).getTime();
    if (isNaN(target)) return '';

    const diffSeconds = Math.floor((now - target) / 1000);

    if (diffSeconds < 60) {
      return 'لحظاتی پیش';
    }
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
      return `${toPersianDigits(diffMinutes)} دقیقه پیش`;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `${toPersianDigits(diffHours)} ساعت پیش`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) {
      return 'دیروز';
    }
    if (diffDays < 7) {
      return `${toPersianDigits(diffDays)} روز پیش`;
    }
    return formatShortDate(dateInput);
  } catch {
    return '';
  }
}

/**
 * Business type Persian label helper
 */
export function getBusinessTypeLabel(type: string): string {
  switch (type) {
    case 'pharmacy':
      return 'داروخانه';
    case 'cosmetics':
      return 'فروشگاه آرایشی و بهداشتی';
    case 'supermarket':
      return 'سوپرمارکت';
    case 'hypermarket':
      return 'هایپرمارکت';
    default:
      return 'فروشگاه / گالری';
  }
}

/**
 * Order status label and styling configurations
 */
export function getStatusConfig(status: string) {
  switch (status) {
    case 'pending':
      return {
        label: 'در انتظار بررسی',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        iconName: 'Clock',
      };
    case 'confirmed':
      return {
        label: 'تایید شده',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
        iconName: 'CheckCircle2',
      };
    case 'processing':
      return {
        label: 'در حال آماده‌سازی',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        dot: 'bg-purple-500',
        iconName: 'Package',
      };
    case 'shipped':
      return {
        label: 'ارسال شده',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        iconName: 'Truck',
      };
    case 'cancelled':
      return {
        label: 'لغو شده',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
        iconName: 'XCircle',
      };
    default:
      return {
        label: status,
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-500',
        iconName: 'HelpCircle',
      };
  }
}
