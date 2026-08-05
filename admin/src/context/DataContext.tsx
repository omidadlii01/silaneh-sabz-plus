import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Marketer, Customer, Order, AdminUser, Product, Brand, Offer, AppSettings, OrderStatus, AdminRole,
} from '../types';
import { dataApi, authApi } from '../api';
import { useAuth } from './AuthContext';

const emptySettings: AppSettings = {
  banner_text: '',
  banner_active: false,
  welcome_message: '',
  support_phone: '',
  announcement: '',
};

interface DataContextType {
  marketers: Marketer[];
  customers: Customer[];
  orders: Order[];
  brands: Brand[];
  products: Product[];
  offers: Offer[];
  adminUsers: AdminUser[];
  appSettings: AppSettings;
  loading: boolean;
  error: string;
  refresh: () => void;

  updateOrderStatus: (orderId: number, status: OrderStatus, adminNote?: string) => Promise<void>;
  addOrder: (data: {
    customer_id: number; items: { product_id: string; product_name: string; quantity: number; unit_price: number; total_price: number }[];
    initial_amount: number; discount: number; final_amount: number; marketer_note?: string;
  }) => Promise<void>;
  updateCustomerMarketer: (customerId: number, marketerId: number) => Promise<void>;
  updateCustomerStatus: (customerId: number, active: boolean) => Promise<void>;
  updateMarketer: (marketerId: number, data: Partial<Marketer>) => Promise<void>;
  addMarketer: (marketer: { first_name: string; last_name: string; phone: string; region?: string; monthly_target?: number }) => Promise<void>;
  approveAdminUser: (adminId: number, role: AdminRole) => Promise<void>;
  rejectAdminUser: (adminId: number) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (productId: string, data: Partial<Product>) => Promise<void>;
  addBrand: (brand: Omit<Brand, 'id' | 'products_count'>) => Promise<void>;
  updateBrand: (brandId: number, data: Partial<Brand>) => Promise<void>;
  addOffer: (offer: Omit<Offer, 'id'>) => Promise<void>;
  updateOfferStatus: (offerId: string, active: boolean) => Promise<void>;
  updateAppSettings: (settings: Partial<AppSettings>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [marketers, setMarketers] = useState<Marketer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings>(emptySettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(() => {
    if (!currentUser) return;
    setLoading(true);
    setError('');
    Promise.all([
      dataApi.listMarketers().then((r) => setMarketers(r.marketers)).catch(() => {}),
      dataApi.listCustomers().then((r) => setCustomers(r.customers)).catch(() => {}),
      dataApi.listOrders().then((r) => setOrders(r.orders)).catch(() => {}),
      dataApi.listProducts().then(setProducts).catch(() => {}),
      dataApi.listBrands().then((r) => setBrands(r.brands)).catch(() => {}),
      dataApi.listOffers().then(setOffers).catch(() => {}),
      dataApi.getSettings().then(setAppSettings).catch(() => {}),
      authApi.listUsers().then((r) => setAdminUsers(r.adminUsers)).catch(() => {}),
    ])
      .catch((e) => setError(e.message || 'خطا در دریافت اطلاعات'))
      .finally(() => setLoading(false));
  }, [currentUser]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const updateOrderStatus = async (orderId: number, status: OrderStatus, adminNote?: string) => {
    await dataApi.updateOrderStatus(orderId, status, adminNote);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status, admin_note: adminNote ?? o.admin_note } : o)));
  };

  const addOrder = async (data: {
    customer_id: number; items: { product_id: string; product_name: string; quantity: number; unit_price: number; total_price: number }[];
    initial_amount: number; discount: number; final_amount: number; marketer_note?: string;
  }) => {
    await dataApi.createOrder({
      customerId: data.customer_id,
      items: data.items,
      initialAmount: data.initial_amount,
      discount: data.discount,
      finalAmount: data.final_amount,
      marketerNote: data.marketer_note,
    });
    refresh();
  };

  const updateCustomerMarketer = async (customerId: number, marketerId: number) => {
    await dataApi.updateCustomer(customerId, { marketer_id: marketerId });
    setCustomers((prev) => prev.map((c) => (c.id === customerId ? { ...c, marketer_id: marketerId } : c)));
  };

  const updateCustomerStatus = async (customerId: number, active: boolean) => {
    await dataApi.updateCustomer(customerId, { active });
    setCustomers((prev) => prev.map((c) => (c.id === customerId ? { ...c, active } : c)));
  };

  const updateMarketer = async (marketerId: number, data: Partial<Marketer>) => {
    await dataApi.updateMarketer(marketerId, data);
    setMarketers((prev) => prev.map((m) => (m.id === marketerId ? { ...m, ...data } : m)));
  };

  const addMarketer = async (data: { first_name: string; last_name: string; phone: string; region?: string; monthly_target?: number }) => {
    const res = await dataApi.createMarketer(data);
    setMarketers((prev) => [res.marketer, ...prev]);
  };

  const approveAdminUser = async (adminId: number, role: AdminRole) => {
    if (!role) return;
    const res = await authApi.approveUser(adminId, role);
    setAdminUsers((prev) => prev.map((u) => (u.id === adminId ? res.adminUser : u)));
  };

  const rejectAdminUser = async (adminId: number) => {
    await authApi.rejectUser(adminId);
    setAdminUsers((prev) => prev.filter((u) => u.id !== adminId));
  };

  const addProduct = async (data: Omit<Product, 'id'>) => {
    const res = await dataApi.createProduct(data);
    setProducts((prev) => [res.product, ...prev]);
  };

  const updateProduct = async (productId: string, data: Partial<Product>) => {
    await dataApi.updateProduct(productId, { ...products.find((p) => p.id === productId), ...data });
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...data } : p)));
  };

  const addBrand = async (data: Omit<Brand, 'id' | 'products_count'>) => {
    const res = await dataApi.createBrand(data);
    setBrands((prev) => [res.brand, ...prev]);
  };

  const updateBrand = async (brandId: number, data: Partial<Brand>) => {
    await dataApi.updateBrand(brandId, { ...brands.find((b) => b.id === brandId), ...data });
    setBrands((prev) => prev.map((b) => (b.id === brandId ? { ...b, ...data } : b)));
  };

  const addOffer = async (data: Omit<Offer, 'id'>) => {
    await dataApi.createOffer(data);
    refresh();
  };

  const updateOfferStatus = async (offerId: string, active: boolean) => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return;
    await dataApi.updateOffer(offerId, { ...offer, active });
    setOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, active } : o)));
  };

  const updateAppSettings = async (settings: Partial<AppSettings>) => {
    await dataApi.updateSettings(settings);
    setAppSettings((prev) => ({ ...prev, ...settings }));
  };

  return (
    <DataContext.Provider
      value={{
        marketers, customers, orders, brands, products, offers, adminUsers, appSettings, loading, error, refresh,
        updateOrderStatus, addOrder, updateCustomerMarketer, updateCustomerStatus, updateMarketer, addMarketer,
        approveAdminUser, rejectAdminUser, addProduct, updateProduct, addBrand, updateBrand, addOffer,
        updateOfferStatus, updateAppSettings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
