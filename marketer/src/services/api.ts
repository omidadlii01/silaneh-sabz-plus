import { Customer, Order, OrderItem, Product, Marketer, MarketerSignupData, Notification, OrderStatus, BusinessType } from '../types';
import { toEnglishDigits } from '../utils/persian';

// Default initial data for Silaneh Sabz Plus
const INITIAL_MARKETER: Marketer = {
  id: 101,
  first_name: 'علیرضا',
  last_name: 'کاظمی',
  phone: '09123456789',
  region: 'تهران - منطقه ۱ و ۲ (شمال)',
  personnel_code: 'MK-8842',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  active: true,
  monthly_target: 350000000, // 350 Million Tomans target
  achieved_sales: 248500000,
};

const INITIAL_MARKETERS: Marketer[] = [
  INITIAL_MARKETER,
  {
    id: 102,
    first_name: 'رضا',
    last_name: 'صالحی',
    phone: '09129998877',
    region: 'تهران - منطقه ۵',
    personnel_code: 'MK-1099',
    active: false,
    monthly_target: 200000000,
    achieved_sales: 0,
  },
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 201,
    customer_code: 'CUS-1084',
    first_name: 'دکتر محمدرضا',
    last_name: 'حسینی',
    phone: '09121112233',
    store_name: 'داروخانه شبانه‌روزی دکتر حسینی',
    business_type: 'pharmacy',
    address: 'تهران، تجریش، خیابان فناخسرو، پلاک ۴۲',
    marketer_id: 101,
    active: true,
    city: 'تهران',
    total_orders_count: 14,
    total_spent: 68400000,
    last_order_date: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 202,
    customer_code: 'CUS-1092',
    first_name: 'سارا',
    last_name: 'صادقی',
    phone: '09353334455',
    store_name: 'گالری آرایشی و بهداشتی روژا',
    business_type: 'cosmetics',
    address: 'تهران، پاسداران، نبش بوستان پنجم، مرکز خرید پادیسار',
    marketer_id: 101,
    active: true,
    city: 'تهران',
    total_orders_count: 9,
    total_spent: 42300000,
    last_order_date: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 203,
    customer_code: 'CUS-1105',
    first_name: 'دکتر مریم',
    last_name: 'کیانی',
    phone: '09128889900',
    store_name: 'داروخانه تخصصی ونک',
    business_type: 'pharmacy',
    address: 'تهران، میدان ونک، ابتدای خیابان ملاصدرا، پلاک ۱۸',
    marketer_id: 101,
    active: true,
    city: 'تهران',
    total_orders_count: 22,
    total_spent: 115000000,
    last_order_date: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 204,
    customer_code: 'CUS-1118',
    first_name: 'حسین',
    last_name: 'مرادی',
    phone: '09127776655',
    store_name: 'هایپرمارکت ستاره شمیران',
    business_type: 'hypermarket',
    address: 'تهران، زعفرانیه، خیابان آصف، برج نگین',
    marketer_id: 101,
    active: true,
    city: 'تهران',
    total_orders_count: 6,
    total_spent: 31200000,
    last_order_date: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: 205,
    customer_code: 'CUS-1142',
    first_name: 'نیلوفر',
    last_name: 'بهبهانی',
    phone: '09364445566',
    store_name: 'فروشگاه تخصصی پوست و مو نیلوفر',
    business_type: 'cosmetics',
    address: 'تهران، سعادت‌آباد، علامه طباطبایی شمالی، پلاک ۵۶',
    marketer_id: 101,
    active: true,
    city: 'تهران',
    total_orders_count: 4,
    total_spent: 18900000,
    last_order_date: new Date(Date.now() - 3600000 * 120).toISOString(),
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 301,
    code: 'PRD-801',
    name: 'کرم ضد آفتاب بی‌رنگ SPF50 دکتر ژیلا (بسته ۲۴ عددی)',
    brand: 'دکتر ژیلا',
    category: 'مراقبت پوست',
    carton_quantity: 24,
    price: 3600000, // carton price
    unit_price: 150000,
    in_stock: true,
    stock_count: 140,
    special_offer: true,
    discount_percentage: 8,
    is_new: false,
    description: 'حاوی فیلترهای فیزیکی و شیمیایی پیشرفته، محافظ کامل در برابر UVA و UVB، مناسب انواع پوست.',
    barcode: '6260123450012',
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 302,
    code: 'PRD-802',
    name: 'لوسیون مرطوب‌کننده قوی هیدرودرم (کارتن ۳۶ عددی)',
    brand: 'هیدرودرم',
    category: 'مراقبت پوست',
    carton_quantity: 36,
    price: 4320000,
    unit_price: 120000,
    in_stock: true,
    stock_count: 85,
    special_offer: false,
    discount_percentage: 0,
    is_new: false,
    description: 'رفع سریع خشکی و زبری پوست دست و صورت، حاوی اسید هیالورونیک و ویتامین E.',
    barcode: '6260123450029',
    image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 303,
    code: 'PRD-803',
    name: 'شامپو تقویت‌کننده ضدریزش کافئین فولیکا (کارتن ۱۲ عددی)',
    brand: 'فولیکا',
    category: 'مراقبت مو',
    carton_quantity: 12,
    price: 2160000,
    unit_price: 180000,
    in_stock: true,
    stock_count: 60,
    special_offer: true,
    discount_percentage: 5,
    is_new: true,
    description: 'حاوی کافئین و زینک پیریتیون، جلوگیری از ریزش مو و تحریک رشد فولیکول‌های ضعیف.',
    barcode: '6260123450036',
    image_url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 304,
    code: 'PRD-804',
    name: 'ژل شستشوی صورت ویتامین C سی‌گل (کارتن ۲۴ عددی)',
    brand: 'سی‌گل',
    category: 'شوینده و پاک‌کننده',
    carton_quantity: 24,
    price: 2640000,
    unit_price: 110000,
    in_stock: true,
    stock_count: 110,
    special_offer: true,
    discount_percentage: 10,
    is_new: false,
    description: 'روشن‌کننده پوست، حذف چربی اضافه بدون خشکی، غنی از ویتامین C پایدار و عصاره چای سبز.',
    barcode: '6260123450043',
    image_url: 'https://images.unsplash.com/photo-1608248597359-009778280628?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 305,
    code: 'PRD-805',
    name: 'خمیر دندان تخصصی سفیدکننده سیلانه سبز (کارتن ۴۸ عددی)',
    brand: 'سیلانه سبز',
    category: 'بهداشت دهان و دندان',
    carton_quantity: 48,
    price: 4800000,
    unit_price: 100000,
    in_stock: true,
    stock_count: 230,
    special_offer: true,
    discount_percentage: 12,
    is_new: true,
    description: 'فرمولاسیون اختصاصی سیلانه سبز پلاس، ضد حساسیت و محافظ لثه با ماندگاری طولانی.',
    barcode: '6260123450050',
    image_url: 'https://images.unsplash.com/photo-1559567241-4775d71c6670?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 306,
    code: 'PRD-806',
    name: 'میسلار واتر پاک‌کننده آرایش چشم و لب مای (کارتن ۱۸ عددی)',
    brand: 'مای',
    category: 'شوینده و پاک‌کننده',
    carton_quantity: 18,
    price: 2340000,
    unit_price: 130000,
    in_stock: true,
    stock_count: 95,
    special_offer: false,
    discount_percentage: 0,
    is_new: false,
    description: 'پاک‌کننده سریع آرایش ضدآب، بدون نیاز به آبکشی، فاقد الکل و پارابن.',
    barcode: '6260123450067',
    image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 307,
    code: 'PRD-807',
    name: 'کرم ترمیم‌کننده پوست آسیب‌دیده سینره (کارتن ۲۴ عددی)',
    brand: 'سینره',
    category: 'مراقبت پوست',
    carton_quantity: 24,
    price: 4560000,
    unit_price: 190000,
    in_stock: true,
    stock_count: 42,
    special_offer: false,
    discount_percentage: 0,
    is_new: false,
    description: 'تسریع بازسازی سلولی پس از لیزر، لایه‌برداری و سوختگی سطحی با عصاره میموزا.',
    barcode: '6260123450074',
    image_url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 308,
    code: 'PRD-808',
    name: 'دستمال مرطوب بهداشتی و ضدباکتری دافی (کارتن ۳۶ عددی)',
    brand: 'دافی',
    category: 'بهداشت فردی',
    carton_quantity: 36,
    price: 1800000,
    unit_price: 50000,
    in_stock: true,
    stock_count: 310,
    special_offer: true,
    discount_percentage: 15,
    is_new: false,
    description: 'بسته‌های ۷۰ برگی درب‌دار، با اسانس آلوئه‌ورا و بابونه جهت استفاده روزانه.',
    barcode: '6260123450081',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 501,
    order_code: 'ORD-9840',
    customer_id: 201,
    customer_name: 'دکتر محمدرضا حسینی',
    store_name: 'داروخانه شبانه‌روزی دکتر حسینی',
    customer_phone: '09121112233',
    customer_address: 'تهران، تجریش، خیابان فناخسرو، پلاک ۴۲',
    business_type: 'pharmacy',
    order_date: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    initial_amount: 14880000,
    discount: 880000,
    final_amount: 14000000,
    status: 'pending',
    customer_note: 'لطفاً فاکتور رسمی به همراه سفارش ارسال شود. ساعت تحویل قبل از ۱۲ ظهر باشد.',
    marketer_note: 'مشتری وی‌آی‌پی منطقه تجریش. اولویت ارسال بالا.',
    marketer_id: 101,
    items: [
      {
        product_id: 301,
        product_name: 'کرم ضد آفتاب بی‌رنگ SPF50 دکتر ژیلا (بسته ۲۴ عددی)',
        quantity: 2, // 2 cartons
        unit_price: 3600000,
        total_price: 7200000,
        carton_quantity: 24,
      },
      {
        product_id: 305,
        product_name: 'خمیر دندان تخصصی سفیدکننده سیلانه سبز (کارتن ۴۸ عددی)',
        quantity: 1,
        unit_price: 4800000,
        total_price: 4800000,
        carton_quantity: 48,
      },
      {
        product_id: 304,
        product_name: 'ژل شستشوی صورت ویتامین C سی‌گل (کارتن ۲۴ عددی)',
        quantity: 1,
        unit_price: 2640000,
        total_price: 2640000,
        carton_quantity: 24,
      },
    ],
  },
  {
    id: 502,
    order_code: 'ORD-9831',
    customer_id: 202,
    customer_name: 'سارا صادقی',
    store_name: 'گالری آرایشی و بهداشتی روژا',
    customer_phone: '09353334455',
    customer_address: 'تهران، پاسداران، نبش بوستان پنجم، مرکز خرید پادیسار',
    business_type: 'cosmetics',
    order_date: new Date(Date.now() - 3600000 * 18).toISOString(),
    initial_amount: 9000000,
    discount: 500000,
    final_amount: 8500000,
    status: 'confirmed',
    customer_note: 'تحویل به خانم صادقی در طبقه همکف.',
    marketer_note: 'سفارش بررسی و تایید شد. هماهنگی با انبار مرکزی صورت گرفت.',
    marketer_id: 101,
    items: [
      {
        product_id: 306,
        product_name: 'میسلار واتر پاک‌کننده آرایش چشم و لب مای (کارتن ۱۸ عددی)',
        quantity: 2,
        unit_price: 2340000,
        total_price: 4680000,
        carton_quantity: 18,
      },
      {
        product_id: 302,
        product_name: 'لوسیون مرطوب‌کننده قوی هیدرودرم (کارتن ۳۶ عددی)',
        quantity: 1,
        unit_price: 4320000,
        total_price: 4320000,
        carton_quantity: 36,
      },
    ],
  },
  {
    id: 503,
    order_code: 'ORD-9812',
    customer_id: 203,
    customer_name: 'دکتر مریم کیانی',
    store_name: 'داروخانه تخصصی ونک',
    customer_phone: '09128889900',
    customer_address: 'تهران، میدان ونک، ابتدای خیابان ملاصدرا، پلاک ۱۸',
    business_type: 'pharmacy',
    order_date: new Date(Date.now() - 3600000 * 36).toISOString(),
    initial_amount: 15680000,
    discount: 1180000,
    final_amount: 14500000,
    status: 'processing',
    customer_note: 'اقلام شکننده را با بسته‌بندی حباب‌دار ارسال کنید.',
    marketer_note: 'در حال بسته‌بندی در انبار غرب.',
    marketer_id: 101,
    items: [
      {
        product_id: 303,
        product_name: 'شامپو تقویت‌کننده ضدریزش کافئین فولیکا (کارتن ۱۲ عددی)',
        quantity: 3,
        unit_price: 2160000,
        total_price: 6480000,
        carton_quantity: 12,
      },
      {
        product_id: 307,
        product_name: 'کرم ترمیم‌کننده پوست آسیب‌دیده سینره (کارتن ۲۴ عددی)',
        quantity: 2,
        unit_price: 4560000,
        total_price: 9120000,
        carton_quantity: 24,
      },
    ],
  },
  {
    id: 504,
    order_code: 'ORD-9780',
    customer_id: 204,
    customer_name: 'حسین مرادی',
    store_name: 'هایپرمارکت ستاره شمیران',
    customer_phone: '09127776655',
    customer_address: 'تهران، زعفرانیه، خیابان آصف، برج نگین',
    business_type: 'hypermarket',
    order_date: new Date(Date.now() - 3600000 * 60).toISOString(),
    initial_amount: 10200000,
    discount: 700000,
    final_amount: 9500000,
    status: 'shipped',
    customer_note: 'تحویل بارانداز فروشگاه.',
    marketer_note: 'توسط راننده شرکت (آقای رضایی) تحویل شد.',
    marketer_id: 101,
    items: [
      {
        product_id: 308,
        product_name: 'دستمال مرطوب بهداشتی و ضدباکتری دافی (کارتن ۳۶ عددی)',
        quantity: 4,
        unit_price: 1800000,
        total_price: 7200000,
        carton_quantity: 36,
      },
      {
        product_id: 305,
        product_name: 'خمیر دندان تخصصی سفیدکننده سیلانه سبز (کارتن ۴۸ عددی)',
        quantity: 1,
        unit_price: 4800000,
        total_price: 4800000,
        carton_quantity: 48,
      },
    ],
  },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 701,
    recipient_type: 'marketer',
    recipient_id: 101,
    type: 'new_order',
    related_order_id: 501,
    title: 'سفارش جدید از اپلیکیشن مشتریان',
    message: 'داروخانه شبانه‌روزی دکتر حسینی یک سفارش جدید به ارزش ۱۴,۰۰۰,۰۰۰ تومان ثبت کرد. لطفاً بررسی کنید.',
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 2.5).toISOString(),
  },
  {
    id: 702,
    recipient_type: 'marketer',
    recipient_id: 101,
    type: 'order_status_change',
    related_order_id: 504,
    title: 'سفارش تحویل شد',
    message: 'سفارش شماره ORD-9780 (هایپرمارکت ستاره شمیران) به مشتری تحویل داده شد.',
    is_read: true,
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: 703,
    recipient_type: 'marketer',
    recipient_id: 101,
    type: 'system_alert',
    title: 'طرح تخفیف ویژه محصولات سیلانه سبز',
    message: 'از تاریخ ۱۵ مرداد، تخفیف کارتنی خمیردندان‌های سیلانه سبز تا ۱۲٪ افزایش یافت.',
    is_read: true,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

// Local storage storage keys
const STORAGE_KEYS = {
  MARKETER: 'silaneh_marketer_session',
  MARKETERS: 'silaneh_marketers_list',
  CUSTOMERS: 'silaneh_customers_data',
  ORDERS: 'silaneh_orders_data',
  PRODUCTS: 'silaneh_products_data',
  NOTIFICATIONS: 'silaneh_notifications_data',
  API_BASE_URL: 'silaneh_api_base_url',
};

// Storage helper functions
function getStoredData<T>(key: string, defaultData: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultData;
    return JSON.parse(raw) as T;
  } catch {
    return defaultData;
  }
}

function saveStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

// Helper to sanitize marketer object and strip any password field
function sanitizeMarketer(marketerData: unknown): Marketer {
  if (!marketerData || typeof marketerData !== 'object') {
    return marketerData as Marketer;
  }
  const { password: _p, ...safeMarketer } = marketerData as { password?: unknown; [key: string]: unknown };
  return safeMarketer as unknown as Marketer;
}

export class ApiService {
  private static instance: ApiService;
  private baseUrl: string = '';

  private constructor() {
    // Defaults to the real live Worker API, same as the admin dashboard.
    // Can still be overridden via ApiConfigModal (dev builds only) or
    // VITE_API_BASE_URL for local testing.
    const DEFAULT_API_BASE_URL = 'https://silaneh-sabz-api.omidadli78.workers.dev';
    this.baseUrl =
      localStorage.getItem(STORAGE_KEYS.API_BASE_URL) ||
      (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ||
      DEFAULT_API_BASE_URL;
    this.initializeLocalDatabase();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url.trim();
    localStorage.setItem(STORAGE_KEYS.API_BASE_URL, this.baseUrl);
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Initializes local mock database if empty
   */
  private initializeLocalDatabase(): void {
    if (!localStorage.getItem(STORAGE_KEYS.MARKETERS)) {
      saveStoredData(STORAGE_KEYS.MARKETERS, INITIAL_MARKETERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MARKETER)) {
      saveStoredData(STORAGE_KEYS.MARKETER, INITIAL_MARKETER);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      saveStoredData(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      saveStoredData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      saveStoredData(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      saveStoredData(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    }
  }

  /**
   * Reset local storage to clean factory initial state
   */
  public resetToFactoryData(): void {
    saveStoredData(STORAGE_KEYS.MARKETERS, INITIAL_MARKETERS);
    saveStoredData(STORAGE_KEYS.MARKETER, INITIAL_MARKETER);
    saveStoredData(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    saveStoredData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    saveStoredData(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    saveStoredData(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  // --- Marketer Authentication ---
  public async loginMarketer(phone: string, password?: string): Promise<{ marketer: Marketer; token: string }> {
    const cleanPhone = toEnglishDigits(phone).trim();

    if (this.baseUrl) {
      try {
        const response = await fetch(`${this.baseUrl}/api/marketer/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: cleanPhone, password }),
        });
        const data = await response.json().catch(() => ({}));
        if (response.ok && (data.marketer || data.user)) {
          const rawMarketer = data.marketer || data.user || data;
          const marketerData: Marketer = sanitizeMarketer(rawMarketer);
          if (marketerData.active === false || marketerData.active === 0) {
            const err = new Error('حساب شما هنوز توسط مدیر سیستم تایید نشده است');
            (err as unknown as { code?: string }).code = 'ACCOUNT_NOT_ACTIVE';
            throw err;
          }
          saveStoredData(STORAGE_KEYS.MARKETER, marketerData);
          return { marketer: marketerData, token: data.token || 'mock-jwt-token' };
        } else {
          const isPending =
            data.active === false ||
            data.code === 'ACCOUNT_NOT_ACTIVE' ||
            data.error?.includes('تایید نشده') ||
            data.message?.includes('تایید نشده');

          const err = new Error(isPending ? 'حساب شما هنوز توسط مدیر سیستم تایید نشده است' : (data.message || data.error || 'ورود با خطا مواجه شد. لطفاً مجدداً بررسی نمایید.'));
          (err as unknown as { code?: string }).code = isPending ? 'ACCOUNT_NOT_ACTIVE' : (data.code || 'LOGIN_FAILED');
          throw err;
        }
      } catch (err: unknown) {
        const errObj = err as { code?: string; message?: string };
        if (errObj?.code === 'ACCOUNT_NOT_ACTIVE' || errObj?.message === 'حساب شما هنوز توسط مدیر سیستم تایید نشده است') {
          throw err;
        }
        console.warn('Backend API login error, falling back to local auth', err);
      }
    }

    // Local authentication fallback
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const marketers = getStoredData<Marketer[]>(STORAGE_KEYS.MARKETERS, INITIAL_MARKETERS);
        const found = marketers.find((m) => toEnglishDigits(m.phone).trim() === cleanPhone);

        if (found) {
          const safeFound = sanitizeMarketer(found);
          if (safeFound.active === false || safeFound.active === 0) {
            const err = new Error('حساب شما هنوز توسط مدیر سیستم تایید نشده است');
            (err as unknown as { code?: string }).code = 'ACCOUNT_NOT_ACTIVE';
            reject(err);
            return;
          }
          saveStoredData(STORAGE_KEYS.MARKETER, safeFound);
          resolve({ marketer: safeFound, token: `local-auth-token-${safeFound.id}` });
          return;
        }

        // Demo fallback for initial marketer
        if (cleanPhone === toEnglishDigits(INITIAL_MARKETER.phone).trim()) {
          const safeInitial = sanitizeMarketer(INITIAL_MARKETER);
          saveStoredData(STORAGE_KEYS.MARKETER, safeInitial);
          resolve({ marketer: safeInitial, token: 'local-auth-token-101' });
          return;
        }

        // If phone not found in mock DB
        const err = new Error('حسابی با این شماره موبایل یافت نشد. لطفاً ابتدا ثبت‌نام کنید.');
        (err as unknown as { code?: string }).code = 'USER_NOT_FOUND';
        reject(err);
      }, 400);
    });
  }

  public async signupMarketer(data: MarketerSignupData): Promise<{ success: boolean; message: string; marketer?: Marketer }> {
    const cleanPhone = toEnglishDigits(data.phone).trim();

    if (this.baseUrl) {
      try {
        const response = await fetch(`${this.baseUrl}/api/marketer/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: data.first_name.trim(),
            last_name: data.last_name.trim(),
            phone: cleanPhone,
            password: data.password,
            region: data.region?.trim() || 'تهران',
          }),
        });
        const resData = await response.json().catch(() => ({}));
        if (response.ok) {
          const safeMarketer = resData.marketer ? sanitizeMarketer(resData.marketer) : undefined;
          return {
            success: true,
            message: resData.message || 'ثبت‌نام شما با موفقیت انجام شد. حساب شما پس از تایید مدیر سیستم فعال خواهد شد.',
            marketer: safeMarketer,
          };
        } else {
          throw new Error(resData.message || resData.error || 'خطا در انجام ثبت‌نام');
        }
      } catch (err: unknown) {
        console.warn('Backend API signup error, falling back to local simulation', err);
      }
    }

    // Local simulation fallback
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const marketers = getStoredData<Marketer[]>(STORAGE_KEYS.MARKETERS, INITIAL_MARKETERS);
        const exists = marketers.some((m) => toEnglishDigits(m.phone).trim() === cleanPhone);

        if (exists) {
          const err = new Error('این شماره موبایل قبلاً در سامانه ثبت شده است.');
          (err as unknown as { code?: string }).code = 'USER_EXISTS';
          reject(err);
          return;
        }

        const newMarketer: Marketer = {
          id: Date.now(),
          first_name: data.first_name.trim(),
          last_name: data.last_name.trim(),
          phone: cleanPhone,
          region: data.region?.trim() || 'تهران - منطقه عمومی',
          personnel_code: `MK-${Math.floor(1000 + Math.random() * 9000)}`,
          active: false, // Inactive pending approval by admin
          monthly_target: 200000000,
          achieved_sales: 0,
        };

        const safeMarketer = sanitizeMarketer(newMarketer);
        marketers.push(safeMarketer);
        saveStoredData(STORAGE_KEYS.MARKETERS, marketers);

        // Add a notification about pending registration
        const notifications = getStoredData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
        notifications.unshift({
          id: Date.now() + 1,
          recipient_type: 'marketer',
          recipient_id: safeMarketer.id,
          type: 'system_alert',
          title: 'درخواست ثبت‌نام ارسال شد',
          message: `ثبت‌نام شما برای منطقه ${safeMarketer.region} در نوبت بررسی مدیر سیستم قرار گرفت.`,
          is_read: false,
          created_at: new Date().toISOString(),
        });
        saveStoredData(STORAGE_KEYS.NOTIFICATIONS, notifications);

        resolve({
          success: true,
          message: 'ثبت‌نام شما با موفقیت انجام شد. حساب شما پس از تایید مدیر سیستم فعال خواهد شد.',
          marketer: safeMarketer,
        });
      }, 500);
    });
  }

  // --- Customers ---
  public async getCustomers(marketerId: number): Promise<Customer[]> {
    if (this.baseUrl) {
      try {
        const response = await fetch(`${this.baseUrl}/api/marketer/${marketerId}/customers`);
        if (response.ok) {
          const data = await response.json();
          const list = data.customers || data;
          saveStoredData(STORAGE_KEYS.CUSTOMERS, list);
          return list;
        }
      } catch (err) {
        console.warn('Failed fetching customers from API, using cached data', err);
      }
    }

    return new Promise((resolve) => {
      const customers = getStoredData<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
      setTimeout(() => resolve(customers), 250);
    });
  }

  public async createCustomer(
    marketerId: number,
    payload: {
      firstName: string;
      lastName: string;
      phone: string;
      storeName: string;
      businessType: BusinessType;
      address: string;
      city?: string;
    }
  ): Promise<Customer> {
    const cleanPhone = toEnglishDigits(payload.phone).trim();

    if (this.baseUrl) {
      try {
        const response = await fetch(`${this.baseUrl}/api/marketer/${marketerId}/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: payload.firstName,
            lastName: payload.lastName,
            phone: cleanPhone,
            storeName: payload.storeName,
            businessType: payload.businessType,
            address: payload.address,
            city: payload.city || 'تهران',
          }),
        });
        if (response.ok) {
          const data = await response.json();
          const newCustomer = data.customer || data;
          const list = getStoredData<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
          saveStoredData(STORAGE_KEYS.CUSTOMERS, [newCustomer, ...list]);
          return newCustomer;
        }
      } catch (err) {
        console.warn('Failed saving customer to API, saving locally', err);
      }
    }

    // Local storage persistence
    return new Promise((resolve) => {
      const list = getStoredData<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
      const newId = Date.now();
      const codeNumber = 1100 + list.length + 1;
      const newCustomer: Customer = {
        id: newId,
        customer_code: `CUS-${codeNumber}`,
        first_name: payload.firstName,
        last_name: payload.lastName,
        phone: cleanPhone,
        store_name: payload.storeName,
        business_type: payload.businessType,
        address: payload.address,
        city: payload.city || 'تهران',
        marketer_id: marketerId,
        active: true,
        total_orders_count: 0,
        total_spent: 0,
        last_order_date: new Date().toISOString(),
      };

      const updated = [newCustomer, ...list];
      saveStoredData(STORAGE_KEYS.CUSTOMERS, updated);

      // Create notification
      this.addNotification({
        recipient_type: 'marketer',
        recipient_id: marketerId,
        type: 'customer_registered',
        title: 'مشتری جدید ثبت شد',
        message: `مشتری «${newCustomer.store_name}» (${newCustomer.first_name} ${newCustomer.last_name}) با موفقیت به لیست شما اضافه شد.`,
      });

      setTimeout(() => resolve(newCustomer), 300);
    });
  }

  // --- Orders ---
  public async getOrders(marketerId: number): Promise<Order[]> {
    if (this.baseUrl) {
      try {
        const response = await fetch(`${this.baseUrl}/api/marketer/${marketerId}/orders`);
        if (response.ok) {
          const data = await response.json();
          const list = data.orders || data;
          saveStoredData(STORAGE_KEYS.ORDERS, list);
          return list;
        }
      } catch (err) {
        console.warn('Failed fetching orders from API, using cached data', err);
      }
    }

    return new Promise((resolve) => {
      const orders = getStoredData<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      setTimeout(() => resolve(orders), 250);
    });
  }

  public async createOrder(orderPayload: {
    customerId: number;
    items: OrderItem[];
    initialAmount: number;
    discount: number;
    finalAmount: number;
    customerNote?: string;
    marketerNote?: string;
    marketerId?: number;
  }): Promise<Order> {
    if (this.baseUrl) {
      try {
        const response = await fetch(`${this.baseUrl}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });
        if (response.ok) {
          const data = await response.json();
          const newOrder = data.order || data;
          const list = getStoredData<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
          saveStoredData(STORAGE_KEYS.ORDERS, [newOrder, ...list]);
          return newOrder;
        }
      } catch (err) {
        console.warn('Failed saving order to API, saving locally', err);
      }
    }

    return new Promise((resolve) => {
      const orders = getStoredData<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      const customers = getStoredData<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
      const customer = customers.find((c) => c.id === orderPayload.customerId);

      const newId = Date.now();
      const codeNumber = 9850 + orders.length + 1;

      const newOrder: Order = {
        id: newId,
        order_code: `ORD-${codeNumber}`,
        customer_id: orderPayload.customerId,
        customer_name: customer ? `${customer.first_name} ${customer.last_name}` : 'مشتری ثبت شده',
        store_name: customer ? customer.store_name : 'فروشگاه',
        customer_phone: customer?.phone,
        customer_address: customer?.address,
        business_type: customer?.business_type,
        order_date: new Date().toISOString(),
        initial_amount: orderPayload.initialAmount,
        discount: orderPayload.discount,
        final_amount: orderPayload.finalAmount,
        status: 'confirmed', // Order created by marketer directly is confirmed by default
        customer_note: orderPayload.customerNote,
        marketer_note: orderPayload.marketerNote || 'سفارش توسط بازاریاب ثبت شد.',
        marketer_id: orderPayload.marketerId || 101,
        items: orderPayload.items,
        created_at: new Date().toISOString(),
      };

      const updatedOrders = [newOrder, ...orders];
      saveStoredData(STORAGE_KEYS.ORDERS, updatedOrders);

      // Update customer stats
      if (customer) {
        customer.total_orders_count = (customer.total_orders_count || 0) + 1;
        customer.total_spent = (customer.total_spent || 0) + newOrder.final_amount;
        customer.last_order_date = new Date().toISOString();
        saveStoredData(STORAGE_KEYS.CUSTOMERS, customers);
      }

      // Add notification
      this.addNotification({
        recipient_type: 'marketer',
        recipient_id: orderPayload.marketerId || 101,
        type: 'new_order',
        related_order_id: newOrder.id,
        title: 'سفارش جدید با موفقیت ثبت شد',
        message: `سفارش شماره ${newOrder.order_code} برای «${newOrder.store_name}» به مبلغ ${newOrder.final_amount.toLocaleString('fa-IR')} تومان ثبت گردید.`,
      });

      setTimeout(() => resolve(newOrder), 350);
    });
  }

  public async updateOrderStatus(orderId: number, status: OrderStatus, marketerNote?: string): Promise<Order> {
    if (this.baseUrl) {
      try {
        const response = await fetch(`${this.baseUrl}/api/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, marketer_note: marketerNote }),
        });
        if (response.ok) {
          const data = await response.json();
          const updated = data.order || data;
          const list = getStoredData<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
          const idx = list.findIndex((o) => o.id === orderId);
          if (idx !== -1) {
            list[idx] = { ...list[idx], ...updated, status, marketer_note: marketerNote };
            saveStoredData(STORAGE_KEYS.ORDERS, list);
          }
          return updated;
        }
      } catch (err) {
        console.warn('Failed updating order status in API, updating locally', err);
      }
    }

    return new Promise((resolve, reject) => {
      const orders = getStoredData<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      const index = orders.findIndex((o) => o.id === orderId);
      if (index === -1) {
        reject(new Error('سفارش یافت نشد'));
        return;
      }

      orders[index].status = status;
      if (marketerNote !== undefined) {
        orders[index].marketer_note = marketerNote;
      }
      orders[index].updated_at = new Date().toISOString();

      saveStoredData(STORAGE_KEYS.ORDERS, orders);

      // Trigger notification
      const statusTitles: Record<OrderStatus, string> = {
        pending: 'در انتظار بررسی',
        confirmed: 'تایید شد',
        processing: 'در حال آماده‌سازی در انبار',
        shipped: 'ارسال شد',
        cancelled: 'لغو گردید',
      };

      this.addNotification({
        recipient_type: 'marketer',
        recipient_id: orders[index].marketer_id || 101,
        type: 'order_status_change',
        related_order_id: orderId,
        title: `وضعیت سفارش تغییر کرد: ${statusTitles[status]}`,
        message: `سفارش ${orders[index].order_code || `شماره ${orderId}`} برای مشتری «${orders[index].store_name}» به وضعیت «${statusTitles[status]}» تغییر یافت.`,
      });

      setTimeout(() => resolve(orders[index]), 300);
    });
  }

  // --- Products Catalog ---
  public async getProducts(): Promise<Product[]> {
    if (this.baseUrl) {
      try {
        const response = await fetch(`${this.baseUrl}/api/products`);
        if (response.ok) {
          const data = await response.json();
          // The shared /api/products endpoint (also used by the customer app)
          // returns camelCase fields; this app's types use snake_case, so
          // translate here rather than touching the shared endpoint.
          const raw = data.products || data;
          const list: Product[] = (raw as any[]).map((p) => ({
            id: p.id,
            code: p.code,
            name: p.name,
            brand: p.brand,
            category: p.category,
            image_url: p.imageUrl ?? p.image_url,
            carton_quantity: p.cartonQuantity ?? p.carton_quantity,
            price: p.price,
            unit_price: p.unitPrice ?? p.unit_price,
            in_stock: p.inStock ?? p.in_stock,
            stock_count: p.stockCount ?? p.stock_count,
            special_offer: p.specialOffer ?? p.special_offer,
            discount_percentage: p.discountPercentage ?? p.discount_percentage,
            is_new: p.isNew ?? p.is_new,
            description: p.description,
            barcode: p.barcode,
          }));
          saveStoredData(STORAGE_KEYS.PRODUCTS, list);
          return list;
        }
      } catch (err) {
        console.warn('Failed fetching products from API, using cached data', err);
      }
    }

    return new Promise((resolve) => {
      const products = getStoredData<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      setTimeout(() => resolve(products), 200);
    });
  }

  // --- Notifications ---
  public async getNotifications(marketerId: number): Promise<Notification[]> {
    if (this.baseUrl) {
      try {
        const response = await fetch(`${this.baseUrl}/api/marketer/${marketerId}/notifications`);
        if (response.ok) {
          const data = await response.json();
          const list = data.notifications || data;
          saveStoredData(STORAGE_KEYS.NOTIFICATIONS, list);
          return list;
        }
      } catch (err) {
        console.warn('Failed fetching notifications from API', err);
      }
    }

    return new Promise((resolve) => {
      const list = getStoredData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
      setTimeout(() => resolve(list), 200);
    });
  }

  public async markNotificationRead(id: number): Promise<void> {
    if (this.baseUrl) {
      try {
        await fetch(`${this.baseUrl}/api/notifications/${id}/read`, { method: 'PATCH' });
      } catch (err) {
        console.warn('Failed marking notification read in API', err);
      }
    }

    const list = getStoredData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const item = list.find((n) => n.id === id);
    if (item) {
      item.is_read = true;
      saveStoredData(STORAGE_KEYS.NOTIFICATIONS, list);
    }
  }

  public markAllNotificationsRead(): void {
    const list = getStoredData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    list.forEach((n) => (n.is_read = true));
    saveStoredData(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  private addNotification(notif: Omit<Notification, 'id' | 'is_read' | 'created_at'>): void {
    const list = getStoredData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif: Notification = {
      ...notif,
      id: Date.now(),
      is_read: false,
      created_at: new Date().toISOString(),
    };
    saveStoredData(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...list]);
  }

  /**
   * Simulation utility: Simulates a customer placing a new wholesale order in the Customer App
   * This proves the real-time interaction flow requested in the prompt!
   */
  public simulateCustomerPlacingOrder(customerId?: number, marketerId?: number): Order {
    const customers = getStoredData<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const products = getStoredData<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const orders = getStoredData<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);

    const targetCustomer = customerId ? customers.find((c) => c.id === customerId) || customers[0] : customers[Math.floor(Math.random() * customers.length)];
    const assignedMarketerId = targetCustomer?.marketer_id || marketerId || 101;

    // Pick 2 random products
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const item1 = shuffled[0];
    const item2 = shuffled[1];

    const qty1 = Math.floor(Math.random() * 2) + 1;
    const qty2 = Math.floor(Math.random() * 2) + 1;

    const initialAmount = item1.price * qty1 + item2.price * qty2;
    const discount = Math.round(initialAmount * 0.05);
    const finalAmount = initialAmount - discount;

    const newOrder: Order = {
      id: Date.now(),
      order_code: `ORD-${9860 + orders.length + 1}`,
      customer_id: targetCustomer.id,
      customer_name: `${targetCustomer.first_name} ${targetCustomer.last_name}`,
      store_name: targetCustomer.store_name,
      customer_phone: targetCustomer.phone,
      customer_address: targetCustomer.address,
      business_type: targetCustomer.business_type,
      order_date: new Date().toISOString(),
      initial_amount: initialAmount,
      discount: discount,
      final_amount: finalAmount,
      status: 'pending', // Needs marketer review!
      customer_note: 'سفارش ثبت شده از طریق اپلیکیشن مشتریان. لطفاً هرچه سریع‌تر ارسال نمایید.',
      marketer_id: assignedMarketerId,
      items: [
        {
          product_id: item1.id,
          product_name: item1.name,
          quantity: qty1,
          unit_price: item1.price,
          total_price: item1.price * qty1,
          carton_quantity: item1.carton_quantity,
        },
        {
          product_id: item2.id,
          product_name: item2.name,
          quantity: qty2,
          unit_price: item2.price,
          total_price: item2.price * qty2,
          carton_quantity: item2.carton_quantity,
        },
      ],
    };

    const updated = [newOrder, ...orders];
    saveStoredData(STORAGE_KEYS.ORDERS, updated);

    // Add notification
    this.addNotification({
      recipient_type: 'marketer',
      recipient_id: assignedMarketerId,
      type: 'new_order',
      related_order_id: newOrder.id,
      title: 'سفارش جدید از اپلیکیشن مشتریان!',
      message: `«${targetCustomer.store_name}» سفارش جدیدی به ارزش ${finalAmount.toLocaleString('fa-IR')} تومان ثبت کرد.`,
    });

    return newOrder;
  }
}

export const apiService = ApiService.getInstance();
