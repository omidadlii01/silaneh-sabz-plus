import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { Customer, Order, Product, Notification, CartItem, OrderStatus, BusinessType, TabType } from '../types';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';
import { toPersianDigits } from '../utils/persian';

const POLLING_INTERVAL_MS = 15000;

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  // State
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  orders: Order[];
  customers: Customer[];
  products: Product[];
  notifications: Notification[];
  cart: CartItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  selectedCustomerIdForOrder: number | null;
  selectedOrderForDetails: Order | null;
  unreadNotificationsCount: number;
  pendingOrdersCount: number;

  // Search & Filters
  orderStatusFilter: OrderStatus | 'all';
  setOrderStatusFilter: (status: OrderStatus | 'all') => void;
  orderSearchQuery: string;
  setOrderSearchQuery: (q: string) => void;
  customerSearchQuery: string;
  setCustomerSearchQuery: (q: string) => void;
  productSearchQuery: string;
  setProductSearchQuery: (q: string) => void;
  selectedProductCategory: string;
  setSelectedProductCategory: (cat: string) => void;

  // Modal / Sheet visibility states
  isOrderDetailsOpen: boolean;
  setIsOrderDetailsOpen: (open: boolean) => void;
  isAddCustomerOpen: boolean;
  setIsAddCustomerOpen: (open: boolean) => void;
  isNewOrderOpen: boolean;
  setIsNewOrderOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isSimulatorOpen: boolean;
  setIsSimulatorOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isApiConfigOpen: boolean;
  setIsApiConfigOpen: (open: boolean) => void;

  // Actions
  refreshData: () => Promise<void>;
  updateOrderStatus: (orderId: number, status: OrderStatus, marketerNote?: string) => Promise<boolean>;
  addNewCustomer: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    storeName: string;
    businessType: BusinessType;
    address: string;
    city?: string;
  }) => Promise<Customer | null>;
  placeNewOrder: (customerNote?: string, marketerNote?: string) => Promise<Order | null>;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number | string) => void;
  updateCartQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  cartTotalAmount: number;
  cartTotalCartons: number;

  // Navigation helpers
  openOrderDetails: (order: Order) => void;
  closeOrderDetails: () => void;
  startOrderForCustomer: (customerId: number) => void;
  setSelectedCustomerIdForOrder: (id: number | null) => void;

  // Notifications
  markNotificationRead: (id: number) => Promise<void>;
  markAllNotificationsRead: () => void;

  // Simulation & Toast
  simulateIncomingOrder: (customerId?: number) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { marketer, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('همه');

  // Modals
  const [selectedCustomerIdForOrder, setSelectedCustomerIdForOrder] = useState<number | null>(null);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isApiConfigOpen, setIsApiConfigOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Refs for background polling to prevent stale closures and extra re-renders
  const ordersRef = useRef<Order[]>(orders);
  ordersRef.current = orders;
  const marketerRef = useRef(marketer);
  marketerRef.current = marketer;

  // Fetch initial data
  const loadData = useCallback(async (isRefresh = false) => {
    if (!marketer?.id) {
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const marketerId = marketer.id;
      const [ordersData, customersData, productsData, notifsData] = await Promise.all([
        apiService.getOrders(marketerId),
        apiService.getCustomers(marketerId),
        apiService.getProducts(),
        apiService.getNotifications(marketerId),
      ]);

      setOrders(ordersData);
      setCustomers(customersData);
      setProducts(productsData);
      setNotifications(notifsData);
    } catch (err) {
      console.error('Error loading data', err);
      showToast('خطا در دریافت اطلاعات از سرور', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [marketer?.id, showToast]);

  useEffect(() => {
    if (isAuthenticated && marketer?.id) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, marketer?.id, loadData]);

  // Silent background polling for orders and notifications
  const pollOrdersAndNotifications = useCallback(async () => {
    const currentMarketer = marketerRef.current;
    if (!currentMarketer?.id) return;

    try {
      const [ordersData, notifsData] = await Promise.all([
        apiService.getOrders(currentMarketer.id),
        apiService.getNotifications(currentMarketer.id),
      ]);

      const prevPendingCount = ordersRef.current.filter((o) => o.status === 'pending').length;
      const newPendingCount = ordersData.filter((o) => o.status === 'pending').length;

      if (newPendingCount > prevPendingCount) {
        const diff = newPendingCount - prevPendingCount;
        showToast(
          diff === 1 ? '۱ سفارش جدید دریافت شد' : `${toPersianDigits(diff)} سفارش جدید دریافت شد`,
          'info'
        );
      }

      setOrders(ordersData);
      setNotifications(notifsData);
    } catch (err) {
      console.warn('Background polling warning (silent)', err);
    }
  }, [showToast]);

  // Polling lifecycle with visibilitychange
  useEffect(() => {
    if (!isAuthenticated || !marketer?.id) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startPolling = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (!document.hidden) {
          pollOrdersAndNotifications();
        }
      }, POLLING_INTERVAL_MS);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } else {
        // Immediately fetch once when returning to foreground, then resume interval
        pollOrdersAndNotifications();
        startPolling();
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, marketer?.id, pollOrdersAndNotifications]);

  const refreshData = async () => {
    await loadData(true);
    showToast('اطلاعات با موفقیت به‌روزرسانی شد', 'info');
  };

  // Status updates
  const updateOrderStatus = async (orderId: number, status: OrderStatus, marketerNote?: string): Promise<boolean> => {
    if (!marketer?.id) {
      console.warn('Authentication error: marketer is not logged in');
      showToast('خطای احراز هویت — لطفاً دوباره وارد شوید', 'error');
      return false;
    }

    try {
      const updated = await apiService.updateOrderStatus(orderId, status, marketerNote);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...updated, status, marketer_note: marketerNote } : o)));
      
      if (selectedOrderForDetails && selectedOrderForDetails.id === orderId) {
        setSelectedOrderForDetails((prev) => (prev ? { ...prev, ...updated, status, marketer_note: marketerNote } : null));
      }

      // Reload notifications
      const notifs = await apiService.getNotifications(marketer.id);
      setNotifications(notifs);

      const statusNames: Record<OrderStatus, string> = {
        pending: 'در انتظار بررسی',
        confirmed: 'تایید شد',
        processing: 'در حال آماده‌سازی',
        shipped: 'ارسال شد',
        cancelled: 'لغو شد',
      };

      showToast(`وضعیت سفارش به «${statusNames[status]}» تغییر یافت`, 'success');
      return true;
    } catch (err) {
      console.error('Failed updating status', err);
      showToast('خطا در تغییر وضعیت سفارش', 'error');
      return false;
    }
  };

  // Add Customer
  const addNewCustomer = async (data: {
    firstName: string;
    lastName: string;
    phone: string;
    storeName: string;
    businessType: BusinessType;
    address: string;
    city?: string;
  }): Promise<Customer | null> => {
    if (!marketer?.id) {
      console.warn('Authentication error: marketer is not logged in');
      showToast('خطای احراز هویت — لطفاً دوباره وارد شوید', 'error');
      return null;
    }

    try {
      const newCustomer = await apiService.createCustomer(marketer.id, data);
      setCustomers((prev) => [newCustomer, ...prev]);
      
      // Reload notifications
      const notifs = await apiService.getNotifications(marketer.id);
      setNotifications(notifs);

      showToast(`مشتری «${newCustomer.store_name}» با موفقیت افزوده شد`, 'success');
      setIsAddCustomerOpen(false);
      return newCustomer;
    } catch (err) {
      console.error('Failed creating customer', err);
      showToast('خطا در ثبت مشتری جدید', 'error');
      return null;
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`«${product.name.slice(0, 25)}...» به سبد اضافه شد`, 'success');
  };

  const removeFromCart = (productId: number | string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartTotalCartons = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Place order for customer
  const placeNewOrder = async (customerNote?: string, marketerNote?: string): Promise<Order | null> => {
    if (!marketer?.id) {
      console.warn('Authentication error: marketer is not logged in');
      showToast('خطای احراز هویت — لطفاً دوباره وارد شوید', 'error');
      return null;
    }
    if (!selectedCustomerIdForOrder) {
      showToast('لطفاً ابتدا مشتری مورد نظر را انتخاب کنید', 'warning');
      return null;
    }
    if (cart.length === 0) {
      showToast('سبد سفارش خالی است! لطفاً محصولاتی را اضافه کنید', 'warning');
      return null;
    }

    try {
      const initialAmount = cartTotalAmount;
      // 5% standard partner discount
      const discount = Math.round(initialAmount * 0.05);
      const finalAmount = initialAmount - discount;

      const items = cart.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity,
        carton_quantity: item.product.carton_quantity,
      }));

      const newOrder = await apiService.createOrder({
        customerId: selectedCustomerIdForOrder,
        items,
        initialAmount,
        discount,
        finalAmount,
        customerNote,
        marketerNote,
        marketerId: marketer.id,
      });

      setOrders((prev) => [newOrder, ...prev]);
      
      // Update customers
      const updatedCustomers = await apiService.getCustomers(marketer.id);
      setCustomers(updatedCustomers);

      // Reload notifications
      const notifs = await apiService.getNotifications(marketer.id);
      setNotifications(notifs);

      clearCart();
      setIsNewOrderOpen(false);
      setSelectedCustomerIdForOrder(null);
      showToast(`سفارش شماره ${newOrder.order_code} با موفقیت ثبت شد`, 'success');
      return newOrder;
    } catch (err) {
      console.error('Failed creating order', err);
      showToast('خطا در ثبت سفارش', 'error');
      return null;
    }
  };

  // Helper flows
  const openOrderDetails = (order: Order) => {
    setSelectedOrderForDetails(order);
    setIsOrderDetailsOpen(true);
  };

  const closeOrderDetails = () => {
    setIsOrderDetailsOpen(false);
    setSelectedOrderForDetails(null);
  };

  const startOrderForCustomer = (customerId: number) => {
    setSelectedCustomerIdForOrder(customerId);
    setIsNewOrderOpen(true);
  };

  // Notifications
  const markNotificationRead = async (id: number) => {
    await apiService.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    apiService.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    showToast('همه اعلان‌ها به عنوان خوانده شده علامت‌گذاری شدند', 'info');
  };

  // Real-time Order Simulation
  const simulateIncomingOrder = (customerId?: number) => {
    if (!marketer?.id) {
      console.warn('Authentication error: marketer is not logged in');
      showToast('خطای احراز هویت — لطفاً دوباره وارد شوید', 'error');
      return;
    }

    const newOrder = apiService.simulateCustomerPlacingOrder(customerId, marketer.id);
    setOrders((prev) => [newOrder, ...prev]);
    
    // Refresh notifications list
    const notifs = getStoredNotifications();
    setNotifications(notifs);

    showToast(`سفارش جدید از «${newOrder.store_name}» دریافت شد!`, 'info');
  };

  function getStoredNotifications(): Notification[] {
    try {
      const raw = localStorage.getItem('silaneh_notifications_data');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.is_read).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        orders,
        customers,
        products,
        notifications,
        cart,
        isLoading,
        isRefreshing,
        selectedCustomerIdForOrder,
        selectedOrderForDetails,
        unreadNotificationsCount,
        pendingOrdersCount,
        orderStatusFilter,
        setOrderStatusFilter,
        orderSearchQuery,
        setOrderSearchQuery,
        customerSearchQuery,
        setCustomerSearchQuery,
        productSearchQuery,
        setProductSearchQuery,
        selectedProductCategory,
        setSelectedProductCategory,
        isOrderDetailsOpen,
        setIsOrderDetailsOpen,
        isAddCustomerOpen,
        setIsAddCustomerOpen,
        isNewOrderOpen,
        setIsNewOrderOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isSimulatorOpen,
        setIsSimulatorOpen,
        isCartOpen,
        setIsCartOpen,
        isApiConfigOpen,
        setIsApiConfigOpen,
        refreshData,
        updateOrderStatus,
        addNewCustomer,
        placeNewOrder,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalAmount,
        cartTotalCartons,
        openOrderDetails,
        closeOrderDetails,
        startOrderForCustomer,
        setSelectedCustomerIdForOrder,
        markNotificationRead,
        markAllNotificationsRead,
        simulateIncomingOrder,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
