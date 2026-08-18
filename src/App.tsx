import React, { useState, useEffect } from 'react';
import { TabType, Product, CartItem, PackageBundle, Order, UserProfileData, Category, Brand, VisitorInfo } from './types';
import {
  apiGetBrands,
  apiGetProducts,
  apiGetWeeklyOffers,
  apiGetOrders,
  apiCreateOrder,
  apiUpdateCustomerProfile,
  deriveCategories,
  customerToProfile,
  customerToVisitorInfo,
  loadSession,
  saveSession,
  clearSession,
  Customer,
} from './api';
import { assetUrl } from './utils/assets';
import { usePushNotifications, unregisterDevicePush } from './hooks/usePushNotifications';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CategoryGrid } from './components/CategoryGrid';
import { PopularProducts } from './components/PopularProducts';
import { BrandsGrid } from './components/BrandsGrid';
import { WeeklyOffer, OfferSlide } from './components/WeeklyOffer';
import { RecommendedPackage } from './components/RecommendedPackage';
import { ProductSection } from './components/ProductSection';
import { ProductModal } from './components/ProductModal';
import { PackageModal } from './components/PackageModal';
import { OfferModal } from './components/OfferModal';
import { CartDrawer } from './components/CartDrawer';
import { NotificationsModal } from './components/NotificationsModal';
import { SearchOverlay } from './components/SearchOverlay';
import { BottomNav } from './components/BottomNav';

import { ProductsView } from './components/ProductsView';
import { OrdersView } from './components/OrdersView';
import { VisitorView } from './components/VisitorView';
import { ProfileView } from './components/ProfileView';
import { AuthView } from './components/AuthView';
import { OfflineOverlay } from './components/OfflineOverlay';
import { useOnlineStatus } from './hooks/useOnlineStatus';

const GUEST_PROFILE: UserProfileData = {
  storeName: '',
  customerCode: '',
  ownerName: 'مهمان',
  phone: '',
  address: '',
  city: '',
  creditLimit: 0,
  creditUsed: 0,
  licenseNumber: '',
};

export default function App() {
  const { isOnline, recheckNow } = useOnlineStatus();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // ------------------------------------------------------------------
  // Real catalog data (products/brands/categories) loaded from the
  // Cloudflare Worker API on mount, replacing the AI Studio mock data.
  // ------------------------------------------------------------------
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [weeklyOffers, setWeeklyOffers] = useState<PackageBundle[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(false);

  const loadCatalog = () => {
    setIsCatalogLoading(true);
    setCatalogError(false);
    apiGetBrands()
      .then(async (brandList) => {
        setBrands(brandList);
        const productList = await apiGetProducts(brandList);
        setProducts(productList);
        setCategories(deriveCategories(productList));
      })
      .catch(() => setCatalogError(true))
      .finally(() => setIsCatalogLoading(false));

    apiGetWeeklyOffers()
      .then(setWeeklyOffers)
      .catch(() => setWeeklyOffers([]));
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  // ------------------------------------------------------------------
  // Auth / customer session (persisted in localStorage, backed by the
  // real /api/login and /api/signup endpoints)
  // ------------------------------------------------------------------
  const [customer, setCustomer] = useState<Customer | null>(() => loadSession());
  usePushNotifications(customer?.id);
  const isLoggedIn = !!customer;
  const userProfile: UserProfileData = customer ? customerToProfile(customer) : GUEST_PROFILE;
  const visitorInfo: VisitorInfo | null = customer ? customerToVisitorInfo(customer) : null;

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('silaneh_app_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('silaneh_app_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Previous tab & scroll position tracking for smooth back navigation
  const [previousTab, setPreviousTab] = useState<TabType>('home');
  const [savedScrollPos, setSavedScrollPos] = useState<number>(0);

  // Total items in cart
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Header should ONLY show in products tab if user has at least 1 item in cart
  const isHeaderHidden = activeTab === 'products' && totalCartCount === 0;

  // Helper to open products tab
  const handleOpenProductsTab = (catId?: string, brandName?: string | null) => {
    if (activeTab !== 'products') {
      setPreviousTab(activeTab);
      setSavedScrollPos(window.scrollY || document.documentElement.scrollTop || 0);
    }
    if (catId !== undefined) setSelectedCategory(catId);
    if (brandName !== undefined) setSelectedBrand(brandName);
    setActiveTab('products');
  };

  const handleBackFromProducts = () => {
    setSelectedBrand(null);
    const targetTab = previousTab || 'home';
    setActiveTab(targetTab);

    setTimeout(() => {
      if (savedScrollPos > 0) {
        window.scrollTo({ top: savedScrollPos, behavior: 'smooth' });
      } else {
        const brandsEl = document.getElementById('brands-section');
        if (brandsEl) {
          brandsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 50);
  };

  const handleTabChange = (tab: TabType) => {
    if ((tab === 'orders' || tab === 'profile' || tab === 'visitor') && !isLoggedIn) {
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  // Modals State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageBundle | null>(null);
  const [selectedOfferSlide, setSelectedOfferSlide] = useState<OfferSlide | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(() => !loadSession());
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleLoginSuccess = (loggedInCustomer: Customer) => {
    saveSession(loggedInCustomer);
    setCustomer(loggedInCustomer);
    setIsAuthOpen(false);
    showToast(`ورود با موفقیت انجام شد. خوش آمدید ${loggedInCustomer.ownerName}!`);
    refreshOrders(loggedInCustomer);
  };

  const handleLogout = () => {
    unregisterDevicePush();
    clearSession();
    setCustomer(null);
    setOrders([]);
    setActiveTab('home');
  };

  // ------------------------------------------------------------------
  // Orders (loaded from the real backend once a customer is logged in)
  // ------------------------------------------------------------------
  const [orders, setOrders] = useState<Order[]>([]);

  const refreshOrders = (c: Customer) => {
    apiGetOrders(c.id, c.storeName, '', c.address)
      .then(setOrders)
      .catch(() => showToast('خطا در دریافت سفارش‌های قبلی.'));
  };

  useEffect(() => {
    if (customer) refreshOrders(customer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Persists profile edits from ProfileView to the real backend, then
  // updates the logged-in session so the change is reflected everywhere
  // (and survives a refresh) instead of only living in local component state.
  const handleUpdateProfile = async (updated: UserProfileData) => {
    if (!customer) return;
    try {
      const updatedCustomer = await apiUpdateCustomerProfile(customer.id, {
        storeName: updated.storeName,
        ownerName: updated.ownerName,
        phone: updated.phone,
        address: updated.address,
      });
      setCustomer(updatedCustomer);
      saveSession(updatedCustomer);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'ذخیره اطلاعات با خطا مواجه شد.');
      throw err;
    }
  };

  // Helper to get item cart quantity in cartons
  const getCartQuantity = (productId: string) => {
    const found = cartItems.find((ci) => ci.product.id === productId);
    return found ? found.quantity : 0;
  };

  // Add / Update Cart Quantity
  const [cartBumpSignal, setCartBumpSignal] = useState(0);

  const handleAddToCart = (product: Product, delta: number) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.product.id === product.id);
      if (existingIndex > -1) {
        const newQty = prev[existingIndex].quantity + delta;
        if (newQty <= 0) {
          return prev.filter((ci) => ci.product.id !== product.id);
        }
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        if (delta <= 0) return prev;
        return [...prev, { product, quantity: delta }];
      }
    });
    // Previously this always showed a toast reading "... added to cart" —
    // even when delta was negative (i.e. the person was decreasing the
    // quantity), which was both wrong and, per feedback, not a good look
    // (heavy green box, bold font). Now the cart icon in the header bumps
    // and briefly shows a green dot instead, on every add AND remove.
    setCartBumpSignal((s) => s + 1);
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((ci) => {
          if (ci.product.id === productId) {
            const nq = ci.quantity + delta;
            return nq > 0 ? { ...ci, quantity: nq } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
    setCartBumpSignal((s) => s + 1);
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Add a real weekly-offer / recommended package bundle to the cart,
  // using the real product ids stored on each bundle item.
  const addBundleToCart = (pkg: PackageBundle) => {
    let addedAny = false;
    for (const item of pkg.items) {
      const product = item.productId ? products.find((p) => p.id === item.productId) : undefined;
      if (product) {
        handleAddToCart(product, item.qty);
        addedAny = true;
      }
    }
    if (addedAny) {
      showToast(`بستهٔ «${pkg.title}» به سبد خرید افزوده شد.`);
    } else {
      showToast('متاسفانه محصولات این بسته موجود نیست.');
    }
  };

  // The 4th seeded weekly_offer (id 'wo-recommended-01') is the single
  // "RecommendedPackage" box; the rest rotate in the WeeklyOffer carousel.
  const recommendedOffer = weeklyOffers.find((o) => o.id === 'wo-recommended-01') || null;
  const carouselOffers = weeklyOffers.filter((o) => o.id !== 'wo-recommended-01');

  const handleAddPackageToCart = () => {
    if (recommendedOffer) addBundleToCart(recommendedOffer);
  };

  const handleAddWeeklyOfferToCart = () => {
    if (selectedOfferSlide) {
      const pkg = weeklyOffers.find((o) => o.id === selectedOfferSlide.id);
      if (pkg) addBundleToCart(pkg);
    }
  };

  // Checkout Handler — submits the cart as a real order via /api/orders
  const handleCheckout = () => {
    if (!customer) {
      setIsCartOpen(false);
      setAuthMode('login');
      setIsAuthOpen(true);
      showToast('برای ثبت سفارش ابتدا وارد حساب کاربری خود شوید.');
      return;
    }

    const items = cartItems.map((ci) => ({
      productId: ci.product.id,
      productName: ci.product.name,
      quantity: ci.quantity,
      unitPrice: ci.product.price,
      totalPrice: ci.product.price * ci.quantity,
    }));
    const finalAmount = items.reduce((sum, it) => sum + it.totalPrice, 0);

    apiCreateOrder({
      customerId: customer.id,
      items,
      initialAmount: finalAmount,
      discount: 0,
      finalAmount,
    })
      .then(({ orderNumber }) => {
        setCartItems([]);
        setIsCartOpen(false);
        setActiveTab('orders');
        showToast(`فاکتور سفارش ${orderNumber} با موفقیت صادر و ثبت شد!`);
        refreshOrders(customer);
      })
      .catch((err) => {
        showToast(err instanceof Error ? err.message : 'خطا در ثبت سفارش. دوباره تلاش کنید.');
      });
  };

  // Reorder from past orders — re-adds the same products using their
  // real product ids (falls back to skipping items no longer in the catalog).
  const handleReorder = (order: Order) => {
    let addedAny = false;
    for (const item of order.items) {
      const product = item.productId ? products.find((p) => p.id === item.productId) : undefined;
      if (product) {
        handleAddToCart(product, item.quantity);
        addedAny = true;
      }
    }
    setIsCartOpen(true);
    showToast(
      addedAny
        ? `اقلام فاکتور ${order.orderNumber} به سبد خرید منتقل شد.`
        : 'برخی از محصولات این سفارش دیگر در فهرست کالاها موجود نیست.'
    );
  };

  // Product sections for the home page — the first three real categories
  // returned by the backend (there's no fixed healthcare/beauty/skin split
  // in the real data, categories are whatever exists in the products table).
  const homeSections = categories.slice(0, 3).map((cat) => ({
    category: cat,
    products: products.filter((p) => p.categoryId === cat.id),
  }));

  if (!isOnline) {
    return <OfflineOverlay onRetry={recheckNow} />;
  }

  if (isCatalogLoading && products.length === 0) {
    // Matches the original branded splash screen (index.html's #app-splash,
    // shown for the very first paint): dark green background, white circle
    // with the brand mark, and a spinning green ring around it. Previously
    // this state showed a generic thin grey/green spinner instead, because
    // main.tsx removes #app-splash as soon as React mounts — before the
    // catalog has actually finished loading from the API.
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10b981] via-[#059669] to-[#022c22]">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#34d399]/10 blur-2xl animate-glow-pulse" />
            <div className="absolute inset-0 rounded-full border-[3px] border-white/15 border-t-[#34d399] animate-spin" />
            <div className="w-[140px] h-[140px] rounded-full bg-white flex items-center justify-center shadow-[0_4px_18px_rgba(0,0,0,0.25)] overflow-hidden">
              <img
                src={assetUrl('/splash-mark.png')}
                alt="سیلانه سبز"
                className="w-[78%] h-[78%] object-contain animate-float-soft"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (catalogError && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6fafe] px-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[40px] text-[#dc2626]">wifi_off</span>
          <p className="text-[13px] font-bold text-[#3f4944]">
            ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید.
          </p>
          <button
            onClick={loadCatalog}
            className="bg-[#006c4a] text-white px-5 py-2 rounded-xl font-bold text-[12px]"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6fafe] text-[#171c1f] font-['Vazirmatn'] min-h-screen flex flex-col justify-between selection:bg-[#065f46] selection:text-white">
      <div className="max-w-[448px] mx-auto min-h-screen flex flex-col bg-white shadow-sm relative w-full border-x border-[#e2e8f0]/60">

        <div
          className={`sticky top-0 z-40 transition-all duration-300 ease-in-out transform ${
            isHeaderHidden
              ? 'max-h-0 opacity-0 -translate-y-full overflow-hidden pointer-events-none'
              : 'max-h-24 opacity-100 translate-y-0'
          }`}
        >
          <Header
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenAuth={() => {
              setAuthMode('login');
              setIsAuthOpen(true);
            }}
            cartItemCount={totalCartCount}
            unreadNotificationsCount={2}
            cartBumpSignal={cartBumpSignal}
          />
        </div>

        {toastMessage && (
          <div
            className="sticky z-50 px-3 py-2 flex justify-center pointer-events-none"
            style={{ top: 'calc(4rem + env(safe-area-inset-top))' }}
          >
            <div className="bg-white/95 backdrop-blur-xl border-2 border-[#a7f3d0] text-[#044e39] px-5 py-3 rounded-2xl text-[15px] font-black shadow-[0_12px_36px_rgba(5,150,105,0.22)] animate-in fade-in slide-in-from-top-3 duration-300 flex items-center gap-3.5 max-w-[94%] pointer-events-auto ring-4 ring-[#059669]/10">
              <div className="relative shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#ecfdf5] to-[#d1fae5] border border-[#a7f3d0] flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[24px] text-[#059669]">
                  package_2
                </span>
                <span className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-[#059669] text-white flex items-center justify-center border-2 border-white shadow-xs">
                  <span className="material-symbols-outlined text-[13px] font-black">check</span>
                </span>
              </div>
              <span className="leading-snug text-right flex-1">{toastMessage}</span>
            </div>
          </div>
        )}

        <main className="flex-1">
          {activeTab === 'home' && (
            <div
              className="space-y-7"
              style={{ paddingBottom: 'calc(7rem + env(safe-area-inset-bottom))' }}
            >
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                products={products}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onClickSearch={() => setIsSearchOverlayOpen(true)}
              />

              <BrandsGrid
                brands={brands}
                selectedBrand={selectedBrand}
                onSelectBrand={(bName) => handleOpenProductsTab(undefined, bName)}
                onViewAllBrands={() => handleOpenProductsTab()}
              />

              <PopularProducts
                products={products}
                onAddToCart={handleAddToCart}
                getCartQuantity={getCartQuantity}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onViewAll={() => handleOpenProductsTab()}
              />

              <CategoryGrid
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(catId) => handleOpenProductsTab(catId)}
              />

              {carouselOffers.length > 0 && (
                <WeeklyOffer
                  offers={carouselOffers}
                  onOpenOfferModal={(slide) => {
                    setSelectedOfferSlide(slide);
                    setIsOfferModalOpen(true);
                  }}
                />
              )}

              {recommendedOffer && (
                <RecommendedPackage
                  pkg={recommendedOffer}
                  onOpenPackageDetails={() => setSelectedPackage(recommendedOffer)}
                  onAddPackageToCart={handleAddPackageToCart}
                />
              )}

              {homeSections.map(({ category, products: sectionProducts }) =>
                sectionProducts.length > 0 ? (
                  <ProductSection
                    key={category.id}
                    title={category.name}
                    iconName="category"
                    products={sectionProducts}
                    onAddToCart={handleAddToCart}
                    getCartQuantity={getCartQuantity}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                    onViewAll={() => handleOpenProductsTab(category.id)}
                  />
                ) : null
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <ProductsView
              products={products}
              categories={categories}
              brands={brands}
              onAddToCart={handleAddToCart}
              getCartQuantity={getCartQuantity}
              onSelectProduct={(p) => setSelectedProduct(p)}
              initialCategory={selectedCategory}
              initialBrand={selectedBrand}
              onBackToHome={handleBackFromProducts}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView orders={orders} onReorder={handleReorder} />
          )}

          {activeTab === 'visitor' && <VisitorView visitor={visitorInfo} />}

          {activeTab === 'profile' && (
            <ProfileView
              profile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onOpenAuth={(mode) => {
                setAuthMode(mode || 'login');
                setIsAuthOpen(true);
              }}
              onLogout={handleLogout}
            />
          )}
        </main>

        <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />

        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          currentCartQty={selectedProduct ? getCartQuantity(selectedProduct.id) : 0}
        />

        <PackageModal
          packageBundle={selectedPackage}
          onClose={() => setSelectedPackage(null)}
          onAddPackageToCart={handleAddPackageToCart}
        />

        <OfferModal
          isOpen={isOfferModalOpen}
          offer={selectedOfferSlide}
          onClose={() => setIsOfferModalOpen(false)}
          onAddOfferItems={handleAddWeeklyOfferToCart}
        />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onCheckout={handleCheckout}
        />

        <NotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          customerId={customer?.id}
        />

        <SearchOverlay
          isOpen={isSearchOverlayOpen}
          onClose={() => setIsSearchOverlayOpen(false)}
          products={products}
          categories={categories}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={handleAddToCart}
          getCartQuantity={getCartQuantity}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            setActiveTab('products');
          }}
        />

        {isAuthOpen && (
          <AuthView
            initialMode={authMode}
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setIsAuthOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
