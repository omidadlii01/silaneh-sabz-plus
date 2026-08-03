export type BusinessType = 'داروخانه' | 'سوپرمارکت' | 'فروشگاه آرایشی و بهداشتی' | 'هایپرمارکت' | 'گالری زیبایی';

export type OrderStatus =
  | 'ثبت شده'
  | 'در حال بررسی'
  | 'تأیید شده'
  | 'آماده ارسال'
  | 'ارسال شده'
  | 'تحویل شده'
  | 'لغو شده';

export interface Brand {
  id: string;
  name: string; // e.g. کدکس, آمبرلا, پیکسلی, ...
  englishName: string;
  logoColor: string; // Tailwind background gradient/color for placeholder
  imageUrl?: string; // Brand logo URL (small square, shown on the banner)
  bannerImageUrl?: string; // Wide banner/cover image for the dedicated brand page
  active: boolean;
}

export interface Product {
  id: string;
  code: string; // e.g. PRD-101
  name: string; // Persian full name
  brand: string; // e.g. کدکس
  category: string; // e.g. بهداشت زناشویی, مراقبت پوست, بهداشت دهان, ...
  imageColor: string; // Solid background/accent color for image box
  imageUrl?: string; // Product photo URL
  iconType: string; // Icon identifier for visual mock fallback
  cartonQuantity: number; // تعداد در کارتن/بسته
  price: number; // قیمت عمده (تومان) برای هر کارتن/بسته
  unitPrice: number; // قیمت تک فروشی/مصرف‌کننده یا واحد
  inStock: boolean;
  stockCount: number; // تعداد کارتن موجود
  specialOffer: boolean;
  discountPercentage?: number;
  isNew?: boolean;
  description: string;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number; // Number of cartons
}

export interface Customer {
  id: string;
  code: string; // e.g. CUST-40892
  firstName?: string;
  lastName?: string;
  password?: string;
  storeName: string; // e.g. داروخانه دکتر رضایی
  ownerName: string; // e.g. دکتر علی رضایی
  phone: string;
  businessType: BusinessType;
  address: string;
  marketerName: string; // نام ویزیتور
  marketerPhone: string; // شماره ویزیتور
  active: boolean;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  brand: string;
  quantity: number; // تعداد کارتن
  cartonQuantity: number; // تعداد در کارتن
  unitPrice: number; // قیمت هر کارتن
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. SS-14030521
  customerId: string;
  storeName: string;
  orderDate: string; // e.g. ۱۴۰۳/۰۵/۱۰ - ۱۴:۳۰
  items: OrderItem[];
  initialAmount: number;
  discount: number;
  finalAmount: number;
  status: OrderStatus;
  customerNote?: string;
  adminNote?: string;
}

export type ActiveTab = 'home' | 'products' | 'orders' | 'account';
export type ViewScreen =
  | 'login'
  | 'home'
  | 'products'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'my-orders'
  | 'account'
  | 'admin';

export interface FilterOptions {
  brand: string;
  category: string;
  inStockOnly: boolean;
  specialOfferOnly: boolean;
  isNewOnly: boolean;
  searchQuery: string;
}
