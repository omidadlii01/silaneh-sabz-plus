import { BusinessType, Customer, Order, OrderItem, OrderStatus } from './types';

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
    items: [] as OrderItem[],
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
