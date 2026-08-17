import {
  Product,
  Brand,
  Category,
  Order,
  PackageBundle,
  VisitorInfo,
  UserProfileData,
} from './types';
import { assetUrl } from './utils/assets';
import { IMAGE_FALLBACK } from './utils/image';

export const API_BASE_URL = 'https://silaneh-sabz-api.omidadli78.workers.dev';

export interface ApiError {
  error: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as ApiError).error || 'خطای ناشناخته رخ داد.');
  }
  return data as T;
}

// ---------------------------------------------------------------------------
// Customer (real backend shape, kept internal to this file)
// ---------------------------------------------------------------------------

export type BusinessType =
  | 'داروخانه'
  | 'سوپرمارکت'
  | 'فروشگاه آرایشی و بهداشتی'
  | 'هایپرمارکت'
  | 'گالری زیبایی';

export interface Customer {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  phone: string;
  storeName: string;
  ownerName: string;
  businessType: BusinessType;
  address: string;
  marketerName: string;
  marketerPhone: string;
  active: boolean;
}

interface ApiCustomer {
  id: number;
  customerCode: string;
  firstName: string;
  lastName: string;
  phone: string;
  storeName: string;
  businessType: string;
  address: string;
  marketerName: string;
  marketerPhone: string;
}

function mapCustomer(c: ApiCustomer): Customer {
  return {
    id: String(c.id),
    code: c.customerCode,
    firstName: c.firstName,
    lastName: c.lastName,
    storeName: c.storeName,
    ownerName: `${c.firstName} ${c.lastName}`.trim(),
    phone: c.phone,
    businessType: c.businessType as BusinessType,
    address: c.address,
    marketerName: c.marketerName,
    marketerPhone: c.marketerPhone,
    active: true,
  };
}

// Maps a real Customer to the AI-Studio UI's UserProfileData shape.
// NOTE: creditLimit / creditUsed / licenseNumber / city do not exist in the
// real backend yet (Customer table has no such columns). They default to 0/''
// until a decision is made on whether to add them to D1. Flagged in handoff notes.
export function customerToProfile(c: Customer): UserProfileData {
  return {
    storeName: c.storeName,
    customerCode: c.code,
    ownerName: c.ownerName,
    phone: c.phone,
    address: c.address,
    city: '',
    creditLimit: 0,
    creditUsed: 0,
    licenseNumber: '',
  };
}

// Maps a real Customer's marketer fields to the UI's VisitorInfo shape.
// NOTE: there's no dedicated "visitor/marketer" entity with rating/avatar/status
// in the backend — only marketerName/marketerPhone strings on the customer row.
// Sensible display defaults are used for the fields that don't exist yet.
export function customerToVisitorInfo(c: Customer): VisitorInfo | null {
  if (!c.marketerName) return null;
  return {
    name: c.marketerName,
    code: '',
    phone: c.marketerPhone || '',
    region: '',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(c.marketerName),
    rating: 5,
    status: 'online',
  };
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function apiSignup(payload: {
  firstName: string;
  lastName: string;
  phone: string;
  password?: string;
  storeName: string;
  businessType?: BusinessType;
  address: string;
}): Promise<Customer> {
  const data = await request<{ customer: ApiCustomer }>('/api/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapCustomer(data.customer);
}

export async function apiLogin(phone: string): Promise<Customer> {
  const data = await request<{ customer: ApiCustomer }>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
  return mapCustomer(data.customer);
}

// ---------------------------------------------------------------------------
// Products / Brands / Categories
// ---------------------------------------------------------------------------

interface ApiProduct {
  id: string;
  code: string;
  name: string;
  brand: string;
  category: string;
  imageUrl?: string;
  cartonQuantity: number;
  price: number;
  unitPrice: number;
  inStock: boolean;
  stockCount: number;
  specialOffer: boolean;
  discountPercentage?: number | null;
  isNew?: boolean;
  description?: string;
  active: boolean;
}

function slugify(text: string): string {
  return text
    .trim()
    .replace(/[\s/]+/g, '-')
    .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, '');
}

function mapProduct(p: ApiProduct, brandEnByName: Record<string, string>): Product {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    brandEn: brandEnByName[p.brand] || '',
    category: p.category,
    categoryId: slugify(p.category || 'سایر'),
    // assetUrl() is a no-op for the absolute raw.githubusercontent.com URLs
    // already stored for products, but fixes any local '/...' path (and
    // accounts for the GitHub Pages subpath the app is deployed under).
    image: assetUrl(p.imageUrl || ''),
    cartonCount: p.cartonQuantity ?? 1,
    price: p.price ?? 0,
    consumerPrice: p.unitPrice ?? 0,
    discountPercent: p.discountPercentage ?? 0,
    inStock: !!p.inStock,
    stockCount: p.stockCount ?? 0,
    description: p.description || '',
  };
}

interface ApiBrand {
  id: string;
  name: string;
  englishName?: string;
  imageUrl?: string;
  logoColor?: string;
  active: boolean;
}

function mapBrand(b: ApiBrand): Brand {
  return {
    id: b.id,
    nameFa: b.name,
    nameEn: b.englishName || '',
    // Brand logos are stored as local root-relative paths (e.g. '/brands/kodex.png');
    // assetUrl() resolves them against the app's actual base path so they load
    // correctly under the GitHub Pages subpath deployment.
    logo: assetUrl(b.imageUrl || ''),
    gradient: b.logoColor || '',
  };
}

export async function apiGetBrands(): Promise<Brand[]> {
  const data = await request<{ brands: ApiBrand[] }>('/api/brands');
  return data.brands.map(mapBrand);
}

export async function apiGetProducts(brands: Brand[]): Promise<Product[]> {
  const brandEnByName: Record<string, string> = {};
  for (const b of brands) brandEnByName[b.nameFa] = b.nameEn || '';
  const data = await request<{ products: ApiProduct[] }>('/api/products');
  return data.products.map((p) => mapProduct(p, brandEnByName));
}

// Categories don't have their own backend table — they're derived dynamically
// from the distinct `category` string already present on each product.
// Each of the 6 real category names gets its custom-designed icon (provided
// by the user); any category outside this known set falls back to a
// product photo so nothing renders broken if the backend's categories change.
import skinBodyIcon from './assets/categories/skin-body.png';
import beautyMakeupIcon from './assets/categories/beauty-makeup.png';
import healthSafetyIcon from './assets/categories/health-safety.png';
import babyCareIcon from './assets/categories/baby-care.png';
import dentalCareIcon from './assets/categories/dental-care.png';
import hairCareIcon from './assets/categories/hair-care.png';

const CATEGORY_ICONS: Record<string, string> = {
  'مراقبت پوست و بدن': skinBodyIcon,
  'زیبایی و آرایش بانوان': beautyMakeupIcon,
  'بهداشت و مراقبت‌های جنسی': healthSafetyIcon,
  'مراقبت از کودک': babyCareIcon,
  'بهداشت دهان و دندان': dentalCareIcon,
  'مراقبت مو': hairCareIcon,
};

export function deriveCategories(products: Product[]): Category[] {
  const seen = new Map<string, Category>();
  for (const p of products) {
    if (!p.category || seen.has(p.categoryId)) continue;
    seen.set(p.categoryId, {
      id: p.categoryId,
      name: p.category,
      image: CATEGORY_ICONS[p.category] || p.image || IMAGE_FALLBACK,
    });
  }
  return Array.from(seen.values());
}

// ---------------------------------------------------------------------------
// Weekly / recommended offer bundles (new real backend feature)
// ---------------------------------------------------------------------------

interface ApiWeeklyOffer {
  id: string;
  title: string;
  imageUrl?: string;
  discountPercentage: number;
  price: number;
  consumerPrice: number;
  expiresAt?: string | null;
  items: { productId: string; productName: string; qty: number; unitPrice: number }[];
}

function daysUntil(iso?: string | null): number {
  if (!iso) return 0;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function mapWeeklyOffer(o: ApiWeeklyOffer): PackageBundle {
  return {
    id: o.id,
    title: o.title,
    itemTypesCount: o.items.length,
    image: o.imageUrl || '',
    discountPercent: o.discountPercentage,
    price: o.price,
    consumerPrice: o.consumerPrice,
    expiresInDays: daysUntil(o.expiresAt),
    items: o.items.map((it) => ({
      productId: it.productId,
      productName: it.productName,
      qty: it.qty,
      unitPrice: it.unitPrice,
    })),
  };
}

export async function apiGetWeeklyOffers(): Promise<PackageBundle[]> {
  const data = await request<{ offers: ApiWeeklyOffer[] }>('/api/weekly-offers');
  return data.offers.map(mapWeeklyOffer);
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

const STATUS_MAP: Record<string, Order['status']> = {
  'ثبت شده': 'pending',
  'در حال بررسی': 'pending',
  'تأیید شده': 'confirmed',
  'آماده ارسال': 'confirmed',
  'ارسال شده': 'shipping',
  'تحویل شده': 'delivered',
  'لغو شده': 'pending',
};

interface ApiOrderItem {
  id: number;
  order_id: number;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface ApiOrder {
  id: number;
  customer_id: number;
  order_date: string;
  initial_amount: number;
  discount: number;
  final_amount: number;
  status: string;
  customer_note?: string;
  admin_note?: string;
  items: ApiOrderItem[];
}

function mapOrder(o: ApiOrder, storeName: string, storeLogo: string, address: string): Order {
  return {
    id: String(o.id),
    orderNumber: `SB-${String(o.id).padStart(6, '0')}`,
    date: o.order_date,
    storeName,
    storeLogo,
    itemsCount: o.items.reduce((sum, it) => sum + it.quantity, 0),
    totalAmount: o.final_amount,
    status: STATUS_MAP[o.status] || 'pending',
    statusText: o.status,
    items: o.items.map((it) => ({
      productId: it.product_id,
      productName: it.product_name,
      quantity: it.quantity,
      unitPrice: it.unit_price,
    })),
    deliveryAddress: address,
    paymentMethod: 'اعتباری',
  };
}

export async function apiGetOrders(
  customerId: string,
  storeName: string,
  storeLogo: string,
  address: string,
): Promise<Order[]> {
  const data = await request<{ orders: ApiOrder[] }>(`/api/customers/${customerId}/orders`);
  return data.orders.map((o) => mapOrder(o, storeName, storeLogo, address));
}

export async function apiCreateOrder(payload: {
  customerId: string;
  items: { productId: string; productName: string; quantity: number; unitPrice: number; totalPrice: number }[];
  initialAmount: number;
  discount: number;
  finalAmount: number;
  customerNote?: string;
}): Promise<{ orderId: number; orderNumber: string }> {
  return request('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export interface ApiNotification {
  id: string;
  category: 'orders' | 'wallet' | 'offers' | 'products' | string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  icon: string;
  amount?: string;
  badgeText?: string;
  badgeColor?: string;
  relatedOrderId?: number;
}

export async function apiGetNotifications(customerId: string): Promise<ApiNotification[]> {
  const data = await request<{ notifications: ApiNotification[] }>(`/api/customers/${customerId}/notifications`);
  return data.notifications;
}

export async function apiMarkNotificationRead(notificationId: string): Promise<void> {
  await request(`/api/notifications/${notificationId}/read`, { method: 'PATCH' });
}

export async function apiMarkAllNotificationsRead(customerId: string): Promise<void> {
  await request(`/api/customers/${customerId}/notifications/read-all`, { method: 'PATCH' });
}

export async function apiDeleteNotification(notificationId: string): Promise<void> {
  await request(`/api/notifications/${notificationId}`, { method: 'DELETE' });
}

// ---------------------------------------------------------------------------
// Local session persistence (kept simple, mirrors the previous app's pattern)
// ---------------------------------------------------------------------------

const SESSION_KEY = 'silaneh_app_customer';

export function saveSession(customer: Customer) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(customer));
}

export function loadSession(): Customer | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Customer) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
