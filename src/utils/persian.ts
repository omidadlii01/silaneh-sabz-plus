// Persian number conversion utility

const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(n: number | string): string {
  if (n === null || n === undefined) return '';
  const str = n.toString();
  return str.replace(/\d/g, (d) => persianDigits[parseInt(d, 10)]);
}

export function formatPrice(price: number): string {
  if (isNaN(price)) return '۰';
  const formatted = price.toLocaleString('fa-IR');
  return formatted;
}

export function formatPriceEnToFa(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(/\d/g, (d) => persianDigits[parseInt(d, 10)]);
}

// --- Jalali (Persian) calendar conversion -------------------------------
// Pure-JS Gregorian <-> Jalali conversion (no external dependency), based
// on the well-known algorithm by Kazimierz M. Borkowski / jalaali-js.

const PERSIAN_MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
];

const PERSIAN_WEEKDAY_NAMES = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
const PERSIAN_WEEKDAY_SHORT = ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'];

function div(a: number, b: number) {
  return ~~(a / b);
}

function jalCal(jy: number) {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
    2192, 2262, 2324, 2394, 2456, 3178,
  ];
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];
  let jump = 0;
  if (jy < jp || jy >= breaks[bl - 1]) {
    throw new Error('Invalid Jalali year ' + jy);
  }
  let jm = 0;
  for (let i = 1; i < bl; i += 1) {
    const jm2 = breaks[i];
    jump = jm2 - jp;
    if (jy < jm2) {
      jm = jm2;
      break;
    }
    leapJ += div(jump, 33) * 8 + div(jump % 33, 4);
    jp = jm2;
  }
  let n = jy - jp;
  leapJ += div(n, 33) * 8 + div((n % 33) + 3, 4);
  if (jump % 33 === 4 && jump - n === 4) leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = ((n + 1) % 33) - 1;
  if (leap === -1) leap = 32;
  return { leap: leap % 4 === 0 ? 1 : 0, gy, march };
}

function g2d(gy: number, gm: number, gd: number) {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * ((gm + 9) % 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number) {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div((j % 1461), 4) * 5 + 308;
  const gd = div(i % 153, 5) + 1;
  const gm = (div(i, 153) % 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

/** Convert a Gregorian date (y, m 1-12, d) to Jalali [jy, jm, jd]. */
export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    div(gy2 + 3, 4) -
    div(gy2 + 99, 100) +
    div(gy2 + 399, 400) -
    80 +
    gd +
    (gm > 2 ? [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334][gm - 1] : (gm - 1) * 31);
  jy += 33 * div(days, 12053);
  days %= 12053;
  jy += 4 * div(days, 1461);
  days %= 1461;
  if (days > 365) {
    jy += div(days - 1, 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + div(days, 31) : 7 + div(days - 186, 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

/** Convert a Jalali date (jy, jm 1-12, jd) to a JS Date (Gregorian, UTC midnight local). */
export function jalaliToGregorian(jy: number, jm: number, jd: number): Date {
  const { gy, march } = jalCal(jy);
  const jdn = g2d(gy, 3, march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
  const { gy: outY, gm: outM, gd: outD } = d2g(jdn);
  return new Date(outY, outM - 1, outD);
}

/** Number of days in a given Jalali month (handles leap Esfand). */
export function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return jalCal(jy).leap ? 30 : 29;
}

/** Today's date as [jy, jm, jd]. */
export function todayJalali(): [number, number, number] {
  const now = new Date();
  return gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function jalaliMonthName(jm: number): string {
  return PERSIAN_MONTH_NAMES[jm - 1] || '';
}

export function jalaliWeekdayName(jw: number, short = false): string {
  return (short ? PERSIAN_WEEKDAY_SHORT : PERSIAN_WEEKDAY_NAMES)[jw] || '';
}

/** 0 (Saturday) .. 6 (Friday) weekday index for a JS Date, Persian-week-start. */
export function jalaliWeekday(date: Date): number {
  // JS getDay(): 0=Sunday..6=Saturday. Persian week starts Saturday.
  return (date.getDay() + 1) % 7;
}

/**
 * Format an ISO-ish / SQL datetime string (e.g. "2026-08-05 22:05:24" or
 * "2026-08-05T22:05:24Z") as a Persian calendar date, e.g. "۱۴ مرداد ۱۴۰۵".
 * Falls back to returning the original string if it can't be parsed.
 */
export function formatJalaliDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '';
  const normalized = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T') + 'Z';
  const d = new Date(normalized);
  if (isNaN(d.getTime())) return dateStr;
  const [jy, jm, jd] = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return `${toPersianDigits(jd)} ${jalaliMonthName(jm)} ${toPersianDigits(jy)}`;
}

/** Same as formatJalaliDate but also appends the HH:MM time. */
export function formatJalaliDateTime(dateStr: string | undefined | null): string {
  if (!dateStr) return '';
  const normalized = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T') + 'Z';
  const d = new Date(normalized);
  if (isNaN(d.getTime())) return dateStr;
  const datePart = formatJalaliDate(dateStr);
  const hh = toPersianDigits(String(d.getHours()).padStart(2, '0'));
  const mm = toPersianDigits(String(d.getMinutes()).padStart(2, '0'));
  return `${datePart} - ساعت ${hh}:${mm}`;
}
