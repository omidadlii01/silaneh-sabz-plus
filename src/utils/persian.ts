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
