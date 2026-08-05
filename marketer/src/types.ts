export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'cancelled';

export type BusinessType = 'pharmacy' | 'cosmetics' | 'supermarket' | 'hypermarket' | 'other';

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
  active: number | boolean;
  city?: string;
  total_orders_count?: number;
  total_spent?: number;
  last_order_date?: string;
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: number | string;
  product_name: string;
  quantity: number; // number of cartons or units
  unit_price: number;
  total_price: number;
  carton_quantity?: number;
  image_url?: string;
  barcode?: string;
}

export interface Order {
  id: number;
  order_code?: string;
  customer_id: number;
  customer_name?: string;
  store_name?: string;
  customer_phone?: string;
  customer_address?: string;
  business_type?: BusinessType;
  order_date: string;
  initial_amount: number;
  discount: number;
  final_amount: number;
  status: OrderStatus;
  customer_note?: string;
  admin_note?: string;
  marketer_note?: string;
  marketer_id?: number;
  items?: OrderItem[];
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number | string;
  code: string;
  name: string;
  brand: string;
  category: string;
  image_url?: string;
  carton_quantity: number;
  price: number; // carton price
  unit_price: number; // single item price
  in_stock: number | boolean;
  stock_count: number;
  special_offer?: number | boolean;
  discount_percentage?: number;
  is_new?: number | boolean;
  description?: string;
  barcode?: string;
}

export interface Marketer {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  region: string;
  personnel_code?: string;
  avatar_url?: string;
  active: boolean | number;
  monthly_target?: number;
  achieved_sales?: number;
}

export interface MarketerSignupData {
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  region?: string;
}

export interface Notification {
  id: number;
  recipient_type: 'marketer' | 'customer' | 'admin';
  recipient_id: number;
  type: 'new_order' | 'order_status_change' | 'customer_registered' | 'system_alert';
  related_order_id?: number;
  title: string;
  message: string;
  is_read: number | boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number; // in cartons
}

export type TabType = 'dashboard' | 'orders' | 'customers' | 'catalog' | 'profile';
