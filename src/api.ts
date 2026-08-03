import { Brand, BusinessType, Customer, Order, OrderItem, OrderStatus, Product } from './types';

const API_BASE_URL = 'https://silaneh-sabz-api.omidadli78.workers.dev';

export interface ApiError {
  error: string;
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

interface ApiProduct {
  id: string;
  code: string;
  name: string;
  brand: string;
  category: string;
  imageUrl?: string;
  barcode?: string;
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

const ICON_TYPES = ['spray', 'bottle', 'tube', 'box', 'jar', 'wipes'];
const IMAGE_COLORS = [
  'from-emerald-100 to-emerald-50',
  'from-sky-100 to-sky-50',
  'from-amber-100 to-amber-50',
  'from-rose-100 to-rose-50',
  'from-violet-100 to-violet-50',
  'from-teal-100 to-teal-50',
];

function hashToIndex(str: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % mod;
}

function mapProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    code: p.code,
    name: p.name,
    brand: p.brand,
    category: p.category,
    imageColor: IMAGE_COLORS[hashToIndex(p.id, IMAGE_COLORS.length)],
    imageUrl: p.imageUrl || undefined,
    iconType: ICON_TYPES[hashToIndex(p.id, ICON_TYPES.length)],
    cartonQuantity: p.cartonQuantity ?? 1,
    price: p.price ?? 0,
    unitPrice: p.unitPrice ?? 0,
    inStock: !!p.inStock,
    stockCount: p.stockCount ?? 0,
    specialOffer: !!p.specialOffer,
    discountPercentage: p.discountPercentage ?? undefined,
    isNew: !!p.isNew,
    description: p.description || '',
    active: !!p.active,
  };
}

export async function apiGetProducts(): Promise<Product[]> {
  const data = await request<{ products: ApiProduct[] }>('/api/products');
  return data.products.map(mapProduct);
}

interface ApiBrand {
  id: string;
  name: string;
  englishName?: string;
  imageUrl?: string;
  logoColor?: string;
  active: boolean;
}

const LOGO_COLORS = [
  'bg-emerald-700',
  'bg-sky-700',
  'bg-amber-600',
  'bg-rose-700',
  'bg-violet-700',
  'bg-teal-700',
];

export async function apiGetBrands(): Promise<Brand[]> {
  const data = await request<{ brands: ApiBrand[] }>('/api/brands');
  return data.brands.map((b) => ({
    id: b.id,
    name: b.name,
    englishName: b.englishName || '',
    logoColor: b.logoColor || LOGO_COLORS[hashToIndex(b.id, LOGO_COLORS.length)],
    imageUrl: b.imageUrl || undefined,
    active: !!b.active,
  }));
}

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

export async function apiGetOrders(customerId: string, storeName: string): Promise<Order[]> {
  const data = await request<{ orders: any[] }>(`/api/customers/${customerId}/orders`);
  return data.orders.map((o) => ({
    id: String(o.id),
    orderNumber: `SB-${String(o.id).padStart(6, '0')}`,
    customerId: String(o.customer_id),
    storeName,
    orderDate: o.order_date,
    items: (o.items || []).map((it: any): OrderItem => ({
      id: String(it.id),
      orderId: String(it.order_id),
      productId: it.product_id,
      productName: it.product_name,
      brand: '',
      quantity: it.quantity,
      cartonQuantity: 1,
      unitPrice: it.unit_price,
      totalPrice: it.total_price,
    })),
    initialAmount: o.initial_amount,
    discount: o.discount,
    finalAmount: o.final_amount,
    status: o.status as OrderStatus,
    customerNote: o.customer_note || '',
    adminNote: o.admin_note || '',
  }));
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
