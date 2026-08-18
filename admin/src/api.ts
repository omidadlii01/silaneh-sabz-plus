const API_BASE_URL = 'https://silaneh-sabz-api.omidadli78.workers.dev';
const TOKEN_KEY = 'silaneh_admin_token'; // legacy super-admin shared token
const SESSION_KEY = 'silaneh_admin_session'; // per-user session token

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
export function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}
export function setSession(session: string) {
  localStorage.setItem(SESSION_KEY, session);
}
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
export function clearAuth() {
  clearToken();
  clearSession();
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const token = getToken();
  const session = getSession();
  if (token) headers['X-Admin-Token'] = token;
  if (session) headers['X-Admin-Session'] = session;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `خطای درخواست (${res.status})`);
  return data as T;
}

// ---------- Auth ----------
export const authApi = {
  userSignup: (first_name: string, last_name: string, phone: string, password: string) =>
    request<{ message: string; adminUser: any }>('/api/admin/user-signup', {
      method: 'POST',
      body: JSON.stringify({ first_name, last_name, phone, password }),
    }),
  userLogin: async (phone: string, password: string) => {
    const res = await request<{ adminUser: any; session: string }>('/api/admin/user-login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
    setSession(res.session);
    return res.adminUser;
  },
  tokenLogin: async (token: string) => {
    await request('/api/admin/login', { method: 'POST', body: JSON.stringify({ token }) });
    setToken(token);
    return { id: 0, first_name: 'مدیر', last_name: 'کل', phone: '', role: 'مدیرکل', status: 'active', created_at: '' };
  },
  me: () => request<{ adminUser: any }>('/api/admin/me'),
  listUsers: () => request<{ adminUsers: any[] }>('/api/admin/users'),
  approveUser: (id: number, role: string) =>
    request<{ adminUser: any }>(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  rejectUser: (id: number) => request<{ ok: boolean }>(`/api/admin/users/${id}`, { method: 'DELETE' }),
};

// ---------- snake_case <-> camelCase helpers (products/brands/offers use camelCase on the wire) ----------
function productFromApi(p: any) {
  return {
    id: p.id,
    code: p.code,
    barcode: p.barcode,
    name: p.name,
    brand: p.brand,
    category: p.category,
    image_url: p.imageUrl,
    carton_quantity: p.cartonQuantity,
    price: p.price,
    unit_price: p.unitPrice,
    in_stock: !!p.inStock,
    stock_count: p.stockCount,
    special_offer: !!p.specialOffer,
    discount_percentage: p.discountPercentage,
    is_new: !!p.isNew,
    description: p.description,
    active: !!p.active,
  };
}
function productToApi(p: any) {
  return {
    code: p.code,
    barcode: p.barcode,
    name: p.name,
    brand: p.brand,
    category: p.category,
    imageUrl: p.image_url,
    cartonQuantity: p.carton_quantity,
    price: p.price,
    unitPrice: p.unit_price,
    inStock: p.in_stock,
    stockCount: p.stock_count,
    specialOffer: p.special_offer,
    discountPercentage: p.discount_percentage,
    isNew: p.is_new,
    description: p.description,
    active: p.active,
  };
}
function offerFromApi(o: any) {
  return {
    id: o.id,
    title: o.title,
    image_url: o.imageUrl,
    discount_percentage: o.discountPercentage,
    price: o.price,
    consumer_price: o.consumerPrice,
    expires_at: o.expiresAt,
    active: !!o.active,
    items: (o.items || []).map((it: any) => ({ product_id: it.productId, quantity: it.qty ?? it.quantity })),
  };
}
function offerToApi(o: any) {
  return {
    title: o.title,
    imageUrl: o.image_url,
    discountPercentage: o.discount_percentage,
    price: o.price,
    consumerPrice: o.consumer_price,
    expiresAt: o.expires_at,
    active: o.active,
    items: (o.items || []).map((it: any) => ({ productId: it.product_id, quantity: it.quantity })),
  };
}

// ---------- Data ----------
export const dataApi = {
  // Marketers
  listMarketers: () => request<{ marketers: any[] }>('/api/admin/marketers'),
  createMarketer: (m: any) =>
    request<{ marketer: any }>('/api/admin/marketers', { method: 'POST', body: JSON.stringify(m) }),
  updateMarketer: (id: number, data: any) =>
    request<{ marketer: any }>(`/api/admin/marketers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Customers
  listCustomers: () => request<{ customers: any[] }>('/api/admin/customers'),
  getCustomerNotifications: (customerId: number) =>
    request<{ notifications: any[] }>(`/api/admin/customers/${customerId}/notifications`),
  sendPush: (title: string, message: string, audience: 'all' | 'customers', extra?: { imageUrl?: string; color?: string; url?: string }) =>
    request<{ ok: boolean; totalTokens: number; successCount: number; failCount: number; staleRemoved: number }>(
      '/api/admin/push/send',
      { method: 'POST', body: JSON.stringify({ title, message, audience, ...extra }) },
    ),
  updateCustomer: (id: number, data: any) =>
    request<{ customer: any }>(`/api/admin/customers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Orders
  listOrders: () => request<{ orders: any[] }>('/api/admin/orders'),
  createOrder: (body: any) => request<{ orderId: number; orderNumber: string }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  updateOrderStatus: (id: number, status: string, admin_note?: string) =>
    request<{ order: any }>(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, admin_note }),
    }),

  // Products
  listProducts: async () => {
    const r = await request<{ products: any[] }>('/api/products');
    return r.products.map(productFromApi);
  },
  createProduct: (p: any) =>
    request<{ product: any }>('/api/products', { method: 'POST', body: JSON.stringify(productToApi(p)) }),
  updateProduct: (id: string, p: any) =>
    request<{ product: any }>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(productToApi(p)) }),

  // Brands
  listBrands: () => request<{ brands: any[] }>('/api/brands'),
  createBrand: (b: any) => request<{ brand: any }>('/api/brands', { method: 'POST', body: JSON.stringify(b) }),
  updateBrand: (id: number, b: any) =>
    request<{ brand: any }>(`/api/brands/${id}`, { method: 'PUT', body: JSON.stringify(b) }),

  // Weekly offers (manager sees active + inactive)
  listOffers: async () => {
    const r = await request<{ offers: any[] }>('/api/admin/weekly-offers');
    return r.offers.map(offerFromApi);
  },
  createOffer: (o: any) =>
    request<{ id: string }>('/api/weekly-offers', { method: 'POST', body: JSON.stringify(offerToApi(o)) }),
  updateOffer: (id: string, o: any) =>
    request(`/api/weekly-offers/${id}`, { method: 'PUT', body: JSON.stringify(offerToApi(o)) }),

  // Settings
  getSettings: async () => {
    const r = await request<{ settings: Record<string, string> }>('/api/settings');
    return {
      banner_text: r.settings.banner_text || '',
      banner_active: r.settings.banner_active === '1',
      welcome_message: r.settings.welcome_message || '',
      support_phone: r.settings.support_phone || '',
      announcement: r.settings.announcement || '',
    };
  },
  updateSettings: (s: any) => {
    const payload: Record<string, string> = {};
    if (s.banner_text !== undefined) payload.banner_text = s.banner_text;
    if (s.banner_active !== undefined) payload.banner_active = s.banner_active ? '1' : '0';
    if (s.welcome_message !== undefined) payload.welcome_message = s.welcome_message;
    if (s.support_phone !== undefined) payload.support_phone = s.support_phone;
    if (s.announcement !== undefined) payload.announcement = s.announcement;
    return request('/api/settings', { method: 'PUT', body: JSON.stringify(payload) });
  },
};
