export type AdminRole = 'مدیرکل' | 'مدیر فروش' | 'مدیر محتوا' | 'مدیر بازاریابی' | null;
export type AdminStatus = 'pending' | 'active';

export type BusinessType = 'pharmacy' | 'cosmetics' | 'supermarket' | 'hypermarket' | 'other';
export type OrderStatus = 'ثبت‌شده' | 'تایید شده' | 'در حال پردازش' | 'ارسال شده' | 'لغو شده';

export interface Product {
  id: string; // e.g. "sb-160152102"
  code: string;
  barcode?: string;
  name: string;
  brand: string; // plain text string brand name
  category: string;
  image_url?: string;
  carton_quantity: number;
  price: number; // carton price
  unit_price: number; // single unit price
  in_stock: boolean;
  stock_count: number;
  special_offer?: boolean;
  discount_percentage?: number;
  is_new?: boolean;
  description?: string;
  active: boolean;
}

export interface Brand {
  id: number;
  name: string;
  english_name?: string;
  image_url?: string;
  logo_color?: string;
  active: boolean;
}

export interface OfferItem {
  product_id: string;
  quantity: number;
}

export interface Offer {
  id: string;
  title: string;
  image_url?: string;
  discount_percentage: number;
  price: number; // package price
  consumer_price: number; // reference price
  expires_at?: string;
  active: boolean;
  items: OfferItem[];
}

export interface AppSettings {
  banner_text?: string;
  banner_active: boolean;
  welcome_message?: string;
  support_phone?: string;
  announcement?: string;
}

export interface Marketer {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  region: string;
  personnel_code: string;
  active: boolean;
  monthly_target: number;
  achieved_sales: number;
  created_at: string;
  customers_count?: number;
}

export interface Customer {
  id: number;
  customer_code: string;
  first_name: string;
  last_name: string;
  phone: string;
  store_name: string;
  business_type: BusinessType;
  address: string;
  marketer_id: number;
  active: boolean;
  total_orders_count?: number;
  total_spent?: number;
  city?: string;
  created_at?: string;
}

export interface OrderItem {
  id: number;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: number;
  order_code: string;
  customer_id: number;
  customer_name: string;
  store_name: string;
  order_date: string;
  initial_amount: number;
  discount: number;
  final_amount: number;
  status: OrderStatus;
  marketer_id: number;
  marketer_name: string;
  items: OrderItem[];
  marketer_note?: string;
  admin_note?: string;
}

export interface AdminUser {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  password?: string;
  role: AdminRole;
  status: AdminStatus;
  created_at: string;
}
