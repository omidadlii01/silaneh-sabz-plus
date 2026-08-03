import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  ActiveTab,
  Brand,
  BusinessType,
  CartItem,
  Customer,
  FilterOptions,
  Order,
  OrderStatus,
  Product,
  ViewScreen,
} from '../types';
import {
  INITIAL_BRANDS,
  INITIAL_PRODUCTS,
} from '../mockData';
import { apiSignup, apiLogin, apiGetOrders, apiCreateOrder, apiGetProducts, apiGetBrands } from '../api';
import { toPersianDigits } from '../utils';

interface AppContextType {
  // Navigation & User
  currentCustomer: Customer;
  setCurrentCustomer: React.Dispatch<React.SetStateAction<Customer>>;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  viewScreen: ViewScreen;
  activeTab: ActiveTab;
  navigateTo: (screen: ViewScreen, params?: { product?: Product; order?: Order }) => void;
  goBack: () => void;
  login: (phone: string) => Promise<void>;
  signup: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    password?: string;
    storeName: string;
    address: string;
    businessType?: BusinessType;
  }) => Promise<void>;
  logout: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotalCount: number; // Total carton count
  cartInitialAmount: number;
  cartDiscountAmount: number;
  cartFinalAmount: number;

  // Data Collections
  products: Product[];
  brands: Brand[];
  catalogError: boolean;
  isLoadingCatalog: boolean;
  retryLoadCatalog: () => void;
  orders: Order[];
  customers: Customer[];
  selectedProduct: Product | null;
  selectedOrder: Order | null;
  lastSubmittedOrder: Order | null;

  // Filters
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  updateFilter: (key: keyof FilterOptions, value: any) => void;
  resetFilters: () => void;

  // Actions
  submitOrder: (customerNote?: string) => Promise<Order>;
  reorder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, adminNote?: string) => void;
  updateProduct: (updatedProduct: Product) => void;
  addProduct: (newProduct: Omit<Product, 'id'>) => void;
}

const EMPTY_CUSTOMER: Customer = {
  id: '',
  code: '',
  firstName: '',
  lastName: '',
  storeName: '',
  ownerName: '',
  phone: '',
  businessType: 'داروخانه',
  address: '',
  marketerName: '',
  marketerPhone: '',
  active: false,
};

const DEFAULT_FILTERS: FilterOptions = {
  brand: 'همه',
  category: 'همه',
  inStockOnly: false,
  specialOfferOnly: false,
  isNewOnly: false,
  searchQuery: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const SAVED_CUSTOMER_KEY = 'seylaneh_current_customer';

function loadSavedCustomer(): Customer | null {
  try {
    const raw = localStorage.getItem(SAVED_CUSTOMER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.id) return parsed as Customer;
    return null;
  } catch {
    return null;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const savedCustomer = loadSavedCustomer();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer>(savedCustomer || EMPTY_CUSTOMER);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [viewScreen, setViewScreen] = useState<ViewScreen>(savedCustomer ? 'home' : 'login');
  const [previousViewScreen, setPreviousViewScreen] = useState<ViewScreen>('home');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState<Order | null>(null);

  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [catalogError, setCatalogError] = useState(false);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [catalogRetryToken, setCatalogRetryToken] = useState(0);

  const retryLoadCatalog = () => setCatalogRetryToken((t) => t + 1);

  // Load the real product/brand catalog from the Cloudflare Worker API,
  // replacing the placeholder mock data. Products without an approved image
  // yet are held back from the customer-facing app until an image is added
  // in the admin panel.
  //
  // IMPORTANT: on failure (e.g. the device can't reach the Worker API —
  // this has happened for users where the workers.dev domain is blocked
  // without a VPN), we used to silently keep whatever was already loaded,
  // which on first load is the small placeholder mock catalog (~11 demo
  // products). The app would then look "broken" — missing products, missing
  // images, category taps not matching — with zero indication to the user
  // that this was a connectivity problem rather than an app bug. We now
  // surface a real, visible error + retry instead of silently degrading.
  useEffect(() => {
    let cancelled = false;
    setIsLoadingCatalog(true);
    (async () => {
      try {
        const [apiProducts, apiBrands] = await Promise.all([apiGetProducts(), apiGetBrands()]);
        if (cancelled) return;
        setProducts(apiProducts.filter((p) => !!p.imageUrl));
        if (apiBrands.length > 0) setBrands(apiBrands);
        setCatalogError(false);
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load products/brands from API', err);
        setCatalogError(true);
      } finally {
        if (!cancelled) setIsLoadingCatalog(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [catalogRetryToken]);

  // Navigation logic
  const navigateTo = (screen: ViewScreen, params?: { product?: Product; order?: Order }) => {
    if (params?.product) setSelectedProduct(params.product);
    if (params?.order) setSelectedOrder(params.order);

    setPreviousViewScreen((prev) => (screen !== viewScreen ? viewScreen : prev));
    setViewScreen(screen);

    // Sync bottom tab
    if (screen === 'home') setActiveTab('home');
    else if (screen === 'products') setActiveTab('products');
    else if (screen === 'my-orders') setActiveTab('orders');
    else if (screen === 'account') setActiveTab('account');
  };

  // Go back to whatever screen the user was actually on before (e.g. Home),
  // instead of always landing on a hardcoded screen.
  const goBack = () => {
    navigateTo(previousViewScreen);
  };

  const enrichOrderItems = (fetchedOrders: Order[]): Order[] =>
    fetchedOrders.map((order) => ({
      ...order,
      items: order.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return product
          ? { ...item, brand: product.brand, cartonQuantity: product.cartonQuantity, productName: item.productName || product.name }
          : item;
      }),
    }));

  const login = async (phone: string): Promise<void> => {
    const customer = await apiLogin(phone); // throws with Persian error message on failure
    setCurrentCustomer(customer);
    setIsAdmin(false);
    try {
      localStorage.setItem(SAVED_CUSTOMER_KEY, JSON.stringify(customer));
    } catch {
      // ignore storage errors (e.g. private mode)
    }
    try {
      const fetchedOrders = await apiGetOrders(customer.id, customer.storeName);
      setOrders(enrichOrderItems(fetchedOrders));
    } catch {
      setOrders([]);
    }
    navigateTo('home');
  };

  // If a customer was restored from localStorage on app start, fetch their orders once.
  React.useEffect(() => {
    if (currentCustomer.id && orders.length === 0) {
      apiGetOrders(currentCustomer.id, currentCustomer.storeName)
        .then((fetched) => setOrders(enrichOrderItems(fetched)))
        .catch(() => setOrders([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signup = async (data: {
    firstName: string;
    lastName: string;
    phone: string;
    password?: string;
    storeName: string;
    address: string;
    businessType?: BusinessType;
  }): Promise<void> => {
    const customer = await apiSignup(data); // throws 'شماره موبایل تکراری است' on duplicate phone
    setCustomers((prev) => [customer, ...prev]);
    setCurrentCustomer(customer);
    setIsAdmin(false);
    setOrders([]);
    try {
      localStorage.setItem(SAVED_CUSTOMER_KEY, JSON.stringify(customer));
    } catch {
      // ignore storage errors
    }
    navigateTo('home');
  };

  const logout = () => {
    setIsAdmin(false);
    setCart([]);
    setCurrentCustomer(EMPTY_CUSTOMER);
    try {
      localStorage.removeItem(SAVED_CUSTOMER_KEY);
    } catch {
      // ignore
    }
    setViewScreen('login');
  };

  // Cart Management
  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prevCart, { product, quantity: quantityToAdd }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Cart Calculations
  const cartTotalCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartInitialAmount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  // Bulk / Partner Wholesale Discount (e.g. 5% automatic partner discount)
  const cartDiscountAmount = useMemo(() => {
    if (cartInitialAmount > 5000000) {
      return Math.round(cartInitialAmount * 0.05); // 5% for orders over 5,000,000 Toman
    }
    return 0;
  }, [cartInitialAmount]);

  const cartFinalAmount = useMemo(() => {
    return Math.max(0, cartInitialAmount - cartDiscountAmount);
  }, [cartInitialAmount, cartDiscountAmount]);

  // Submit Order
  const submitOrder = async (customerNote?: string): Promise<Order> => {
    const todayStr = new Date().toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const timeStr = new Date().toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const itemsPayload = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price,
      totalPrice: item.product.price * item.quantity,
    }));

    let orderNumber = `SS-${Math.floor(10000000 + Math.random() * 90000000)}`;
    let serverOrderId = `ord-${Date.now()}`;

    try {
      const result = await apiCreateOrder({
        customerId: currentCustomer.id,
        items: itemsPayload,
        initialAmount: cartInitialAmount,
        discount: cartDiscountAmount,
        finalAmount: cartFinalAmount,
        customerNote,
      });
      serverOrderId = String(result.orderId);
      orderNumber = result.orderNumber;
    } catch {
      // If the API call fails, the order still shows locally for this session.
    }

    const newOrder: Order = {
      id: serverOrderId,
      orderNumber,
      customerId: currentCustomer.id,
      storeName: currentCustomer.storeName,
      orderDate: `${todayStr} - ${timeStr}`,
      items: cart.map((item, idx) => ({
        id: `oi-${Date.now()}-${idx}`,
        orderId: serverOrderId,
        productId: item.product.id,
        productName: item.product.name,
        brand: item.product.brand,
        quantity: item.quantity,
        cartonQuantity: item.product.cartonQuantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity,
      })),
      initialAmount: cartInitialAmount,
      discount: cartDiscountAmount,
      finalAmount: cartFinalAmount,
      status: 'ثبت شده',
      customerNote: customerNote || '',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastSubmittedOrder(newOrder);
    clearCart();
    return newOrder;
  };

  // Reorder functionality: adds all products from order back to cart
  const reorder = (order: Order) => {
    let skippedCount = 0;
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod && prod.inStock) {
        addToCart(prod, item.quantity);
      } else {
        // Product no longer exists in the currently loaded catalog (removed,
        // out of stock, or the catalog failed to load) — previously this was
        // silently dropped with no indication to the user of a partial reorder.
        skippedCount += 1;
      }
    });
    if (skippedCount > 0) {
      window.alert(
        `${toPersianDigits(skippedCount)} کالا از سفارش قبلی دیگر موجود نیست و به سبد خرید اضافه نشد.`,
      );
    }
    navigateTo('cart');
  };

  // Admin Actions
  const updateOrderStatus = (orderId: string, status: OrderStatus, adminNote?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              ...(adminNote !== undefined ? { adminNote } : {}),
            }
          : o
      )
    );
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const addProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...newProductData,
      id: `p-${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  // Filter Updates
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <AppContext.Provider
      value={{
        currentCustomer,
        setCurrentCustomer,
        isAdmin,
        setIsAdmin,
        viewScreen,
        activeTab,
        navigateTo,
        goBack,
        login,
        signup,
        logout,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        cartInitialAmount,
        cartDiscountAmount,
        cartFinalAmount,
        products,
        brands,
        catalogError,
        isLoadingCatalog,
        retryLoadCatalog,
        orders,
        customers,
        selectedProduct,
        selectedOrder,
        lastSubmittedOrder,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        submitOrder,
        reorder,
        updateOrderStatus,
        updateProduct,
        addProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
