const API_BASE_URL = 'https://silaneh-sabz-api.omidadli78.workers.dev';
const TOKEN_STORAGE_KEY = 'silaneh_admin_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['X-Admin-Token'] = token;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || `خطای درخواست (${res.status})`);
  }
  return data as T;
}

export async function adminLogin(token: string): Promise<boolean> {
  await request('/api/admin/login', { method: 'POST', body: JSON.stringify({ token }) });
  setToken(token);
  return true;
}

export const api = {
  stats: () => request<{ totalOrders: number; newOrders: number; totalAmount: number; totalCustomers: number; totalProducts: number }>('/api/admin/stats'),

  customers: () => request<{ customers: any[] }>('/api/admin/customers'),

  orders: () => request<{ orders: any[] }>('/api/admin/orders'),
  updateOrderStatus: (id: number | string, status: string) =>
    request(`/api/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  products: () => request<{ products: any[] }>('/api/products'),
  createProduct: (product: any) => request('/api/products', { method: 'POST', body: JSON.stringify(product) }),
  updateProduct: (id: string, product: any) => request(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),
  deleteProduct: (id: string) => request(`/api/products/${id}`, { method: 'DELETE' }),

  brands: () => request<{ brands: any[] }>('/api/brands'),
  createBrand: (brand: any) => request('/api/brands', { method: 'POST', body: JSON.stringify(brand) }),
  updateBrand: (id: string, brand: any) => request(`/api/brands/${id}`, { method: 'PUT', body: JSON.stringify(brand) }),
  deleteBrand: (id: string) => request(`/api/brands/${id}`, { method: 'DELETE' }),

  settings: () => request<{ settings: Record<string, string> }>('/api/settings'),
  updateSettings: (settings: Record<string, string>) =>
    request<{ settings: Record<string, string> }>('/api/settings', { method: 'PUT', body: JSON.stringify(settings) }),

  marketers: () => request<{ marketers: any[] }>('/api/admin/marketers'),
  setMarketerActive: (id: number | string, active: boolean) =>
    request(`/api/admin/marketers/${id}`, { method: 'PATCH', body: JSON.stringify({ active }) }),
};
