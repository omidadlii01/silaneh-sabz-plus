import { Marketer, Customer, Order, AdminUser, Product, Brand, Offer, AppSettings } from '../types';

export const initialMarketers: Marketer[] = [
  {
    id: 101,
    first_name: 'علی',
    last_name: 'محمدی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    region: 'منطقه ۱ - شمال تهران',
    personnel_code: 'MK-8801',
    active: true,
    monthly_target: 350000000,
    achieved_sales: 295000000,
    created_at: '۱۴۰۲/۰۶/۱۵',
    customers_count: 14
  },
  {
    id: 102,
    first_name: 'مریم',
    last_name: 'رضایی',
    phone: '۰۹۱۹۸۷۶۵۴۳۲',
    region: 'منطقه ۲ - غرب تهران',
    personnel_code: 'MK-8802',
    active: true,
    monthly_target: 400000000,
    achieved_sales: 420000000,
    created_at: '۱۴۰۲/۰۴/۱۰',
    customers_count: 19
  },
  {
    id: 103,
    first_name: 'امیرحسین',
    last_name: 'قاسمی',
    phone: '۰۹۳۵۱۱۲۲۳۳۴',
    region: 'منطقه ۳ - مرکز و بازار',
    personnel_code: 'MK-8803',
    active: true,
    monthly_target: 300000000,
    achieved_sales: 185000000,
    created_at: '۱۴۰۲/۰۹/۰۱',
    customers_count: 11
  },
  {
    id: 104,
    first_name: 'سارا',
    last_name: 'کاظمی',
    phone: '۰۹۱۲۹۹۸۸۷۷۶',
    region: 'منطقه ۴ - شرق تهران',
    personnel_code: 'MK-8804',
    active: true,
    monthly_target: 280000000,
    achieved_sales: 260000000,
    created_at: '۱۴۰۳/۰۱/۱۵',
    customers_count: 9
  },
  {
    id: 105,
    first_name: 'رضا',
    last_name: 'عباسی',
    phone: '۰۹۳۰۵۵۴۴۳۳۲',
    region: 'منطقه ۵ - کرج و استان البرز',
    personnel_code: 'MK-8805',
    active: false,
    monthly_target: 250000000,
    achieved_sales: 80000000,
    created_at: '۱۴۰۳/۰۳/۲۰',
    customers_count: 6
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 201,
    customer_code: 'CST-4001',
    first_name: 'دکتر',
    last_name: 'حسینی',
    phone: '۰۲۱۸۸۷۷۶۶۵۵',
    store_name: 'داروخانه دکتر حسینی (پاسداران)',
    business_type: 'pharmacy',
    address: 'تهران، پاسداران، بالاتر از برج سفید، پلاک ۱۲۴',
    marketer_id: 101,
    active: true,
    total_orders_count: 18,
    total_spent: 185000000,
    city: 'تهران'
  },
  {
    id: 202,
    customer_code: 'CST-4002',
    first_name: 'کامران',
    last_name: 'صداقت',
    phone: '۰۲۱۴۴۳۳۲۲۱۱',
    store_name: 'فروشگاه آرایشی و بهداشتی صدف',
    business_type: 'cosmetics',
    address: 'تهران، صادقیه، خیابان آیت‌الله کاشانی، پاساژ یاران',
    marketer_id: 102,
    active: true,
    total_orders_count: 24,
    total_spent: 240000000,
    city: 'تهران'
  },
  {
    id: 203,
    customer_code: 'CST-4003',
    first_name: 'مسعود',
    last_name: 'کریمی',
    phone: '۰۲۱۵۵۶۶۷۷۸۸',
    store_name: 'هایپرمارکت جامع بازار',
    business_type: 'hypermarket',
    address: 'تهران، بازار بزرگ، خیابان ۱۵ خرداد، پلاک ۸۵',
    marketer_id: 103,
    active: true,
    total_orders_count: 12,
    total_spent: 140000000,
    city: 'تهران'
  },
  {
    id: 204,
    customer_code: 'CST-4004',
    first_name: 'دکتر',
    last_name: 'شریفی',
    phone: '۰۲۱۲۲۱۱۰۰۹۹',
    store_name: 'داروخانه شبانه‌روزی شریفی',
    business_type: 'pharmacy',
    address: 'تهران، سعادت‌آباد، میدان کاج، جنب بانک ملی',
    marketer_id: 102,
    active: true,
    total_orders_count: 31,
    total_spent: 310000000,
    city: 'تهران'
  },
  {
    id: 205,
    customer_code: 'CST-4005',
    first_name: 'فرهاد',
    last_name: 'احمدی',
    phone: '۰۲۱۷۷۸۸۹۹۰۰',
    store_name: 'سوپرمارکت لاله',
    business_type: 'supermarket',
    address: 'تهران، تهرانپارس، فلکه دوم، خیابان ۱۶۸ غربی',
    marketer_id: 104,
    active: true,
    total_orders_count: 9,
    total_spent: 65000000,
    city: 'تهران'
  },
  {
    id: 206,
    customer_code: 'CST-4006',
    first_name: 'مریم',
    last_name: 'شایان',
    phone: '۰۲۶۳۲۵۰۹۰۹۰',
    store_name: 'گالری زیبایی رویال',
    business_type: 'cosmetics',
    address: 'کرج، عظیمیه، میدان طالقانی، برج پارس',
    marketer_id: 105,
    active: false,
    total_orders_count: 4,
    total_spent: 28000000,
    city: 'کرج'
  }
];

export const initialOrders: Order[] = [
  {
    id: 301,
    order_code: 'SSP-1094',
    customer_id: 202,
    customer_name: 'کامران صداقت',
    store_name: 'فروشگاه آرایشی و بهداشتی صدف',
    order_date: '۱۴۰۳/۰۵/۱۴ - ۱۰:۳۰',
    initial_amount: 45000000,
    discount: 4500000,
    final_amount: 40500000,
    status: 'تایید شده',
    marketer_id: 102,
    marketer_name: 'مریم رضایی',
    marketer_note: 'سفارش فوری جهت جشنواره فروش تابستانه صدف.',
    admin_note: 'تایید شده توسط مدیر فروش. حواله انبار صادر شد.',
    items: [
      { id: 1, product_id: 'sb-501', product_name: 'کرم آبرسان پمپی واتربمب هیالورونیک اسید کامان', quantity: 40, unit_price: 450000, total_price: 18000000 },
      { id: 2, product_id: 'sb-503', product_name: 'دستمال مرطوب آرایشی ۷۰ عددی لیمویی دافی', quantity: 100, unit_price: 150000, total_price: 15000000 },
      { id: 3, product_id: 'sb-504', product_name: 'خمیردندان سفیدکننده تخصصی پلاک اِریز میس‌ویک', quantity: 30, unit_price: 400000, total_price: 12000000 }
    ]
  },
  {
    id: 302,
    order_code: 'SSP-1093',
    customer_id: 201,
    customer_name: 'دکتر حسینی',
    store_name: 'داروخانه دکتر حسینی (پاسداران)',
    order_date: '۱۴۰۳/۰۵/۱۴ - ۰۹:۱۵',
    initial_amount: 82000000,
    discount: 8200000,
    final_amount: 73800000,
    status: 'در حال پردازش',
    marketer_id: 101,
    marketer_name: 'علی محمدی',
    marketer_note: 'درخواست تحویل صبح فروردینماه.',
    admin_note: 'بسته‌بندی در انبار مرکزی چیتگر انجام گردید.',
    items: [
      { id: 1, product_id: 'sb-502', product_name: 'ژل شستشوی صورت پوست چرب ۵۰۰ میل کامان', quantity: 60, unit_price: 520000, total_price: 31200000 },
      { id: 2, product_id: 'sb-505', product_name: 'دستمال مرطوب کودک حساس نینو ۶۴ عددی', quantity: 120, unit_price: 190000, total_price: 22800000 },
      { id: 3, product_id: 'sb-506', product_name: 'دهان‌شویه تخصصی توتال کیر ۴۰۰ میل میس‌ویک', quantity: 80, unit_price: 350000, total_price: 28000000 }
    ]
  },
  {
    id: 303,
    order_code: 'SSP-1092',
    customer_id: 204,
    customer_name: 'دکتر شریفی',
    store_name: 'داروخانه شبانه‌روزی شریفی',
    order_date: '۱۴۰۳/۰۵/۱۳ - ۱۶:۴۵',
    initial_amount: 115000000,
    discount: 13800000,
    final_amount: 101200000,
    status: 'ارسال شده',
    marketer_id: 102,
    marketer_name: 'مریم رضایی',
    marketer_note: 'مشتری طلایی - شامل ۱۰٪ تخفیف اضافه حجمی.',
    admin_note: 'تحویل باربری تیپاکس با کد پیگیری ۹۹۸۲۷۱۱.',
    items: [
      { id: 1, product_id: 'sb-501', product_name: 'کرم آبرسان پمپی واتربمب هیالورونیک اسید کامان', quantity: 100, unit_price: 450000, total_price: 45000000 },
      { id: 2, product_id: 'sb-507', product_name: 'میسلار واتر پاک‌کننده آرایش ۵۰۰ میل کامان', quantity: 80, unit_price: 480000, total_price: 38400000 },
      { id: 3, product_id: 'sb-503', product_name: 'دستمال مرطوب آرایشی ۷۰ عددی لیمویی دافی', quantity: 210, unit_price: 150000, total_price: 31600000 }
    ]
  },
  {
    id: 304,
    order_code: 'SSP-1091',
    customer_id: 203,
    customer_name: 'مسعود کریمی',
    store_name: 'هایپرمارکت جامع بازار',
    order_date: '۱۴۰۳/۰۵/۱۳ - ۱۱:۲۰',
    initial_amount: 29000000,
    discount: 1450000,
    final_amount: 27550000,
    status: 'ثبت‌شده',
    marketer_id: 103,
    marketer_name: 'امیرحسین قاسمی',
    marketer_note: 'منتظر استعلام چک امانی مشتری.',
    admin_note: 'در انتظار بررسی بخش اعتبارات.',
    items: [
      { id: 1, product_id: 'sb-503', product_name: 'دستمال مرطوب آرایشی ۷۰ عددی لیمویی دافی', quantity: 100, unit_price: 150000, total_price: 15000000 },
      { id: 2, product_id: 'sb-508', product_name: 'شامپو بدن مغذی با عصاره عسل و آووکادو پنو', quantity: 70, unit_price: 200000, total_price: 14000000 }
    ]
  },
  {
    id: 305,
    order_code: 'SSP-1090',
    customer_id: 205,
    customer_name: 'فرهاد احمدی',
    store_name: 'سوپرمارکت لاله',
    order_date: '۱۴۰۳/۰۵/۱۲ - ۱۴:۱۰',
    initial_amount: 18000000,
    discount: 0,
    final_amount: 18000000,
    status: 'لغو شده',
    marketer_id: 104,
    marketer_name: 'سارا کاظمی',
    marketer_note: 'عدم توافق بر سر تسویه نقدی.',
    admin_note: 'لغو توسط بازاریاب به علت انصراف خریدار.',
    items: [
      { id: 1, product_id: 'sb-505', product_name: 'دستمال مرطوب کودک حساس نینو ۶۴ عددی', quantity: 60, unit_price: 190000, total_price: 11400000 },
      { id: 2, product_id: 'sb-508', product_name: 'شامپو بدن مغذی با عصاره عسل و آووکادو پنو', quantity: 33, unit_price: 200000, total_price: 6600000 }
    ]
  }
];

export const initialBrands: Brand[] = [
  {
    id: 601,
    name: 'کامان (Comeon)',
    english_name: 'Comeon',
    image_url: '',
    logo_color: '#006c4a',
    active: true
  },
  {
    id: 602,
    name: 'میس‌ویک (Misswake)',
    english_name: 'Misswake',
    image_url: '',
    logo_color: '#0284c7',
    active: true
  },
  {
    id: 603,
    name: 'دافی (Dafi)',
    english_name: 'Dafi',
    image_url: '',
    logo_color: '#d97706',
    active: true
  },
  {
    id: 604,
    name: 'نینو (Nino)',
    english_name: 'Nino',
    image_url: '',
    logo_color: '#e11d48',
    active: true
  },
  {
    id: 605,
    name: 'پنو (Peno)',
    english_name: 'Peno',
    image_url: '',
    logo_color: '#059669',
    active: true
  },
  {
    id: 606,
    name: 'آمبرا (Amber)',
    english_name: 'Amber',
    image_url: '',
    logo_color: '#7c3aed',
    active: true
  }
];

export const initialProducts: Product[] = [
  {
    id: 'sb-501',
    code: 'CMN-HYD-500',
    barcode: '62601001',
    name: 'کرم آبرسان واتربمب کامان حاوی هیالورونیک اسید ۵۰۰ میل',
    brand: 'کامان (Comeon)',
    category: 'مراقبت پوست',
    carton_quantity: 24,
    price: 9600000,
    unit_price: 400000,
    in_stock: true,
    stock_count: 1450,
    special_offer: true,
    discount_percentage: 20,
    is_new: false,
    description: 'کرم واتربمب آبرسان کامان غنی شده با ویتامین B5 و هیالورونیک اسید.',
    active: true
  },
  {
    id: 'sb-504',
    code: 'MSW-TP-75',
    barcode: '62601004',
    name: 'خمیردندان سفیدکننده تخصصی پلاک اِریز ۷۵ میل',
    brand: 'میس‌ویک (Misswake)',
    category: 'دهان و دندان',
    carton_quantity: 36,
    price: 14400000,
    unit_price: 400000,
    in_stock: true,
    stock_count: 2100,
    special_offer: false,
    discount_percentage: 16,
    is_new: true,
    description: 'خمیردندان ترمیمی پلاک اریز میس‌ویک جهت محافظت کامل از مینای دندان.',
    active: true
  }
];

export const initialOffers: Offer[] = [
  {
    id: 'off-701',
    title: 'پکیج جشنواره بهداشتی تابستانه کامان',
    image_url: '',
    discount_percentage: 20,
    price: 40000000,
    consumer_price: 50000000,
    expires_at: '۱۴۰۳/۰۵/۳۱',
    active: true,
    items: [
      { product_id: 'sb-501', quantity: 50 },
      { product_id: 'sb-502', quantity: 30 }
    ]
  },
  {
    id: 'off-702',
    title: 'طرح ویژه خریدهای عمده داروخانه‌ای دافی',
    image_url: '',
    discount_percentage: 15,
    price: 25500000,
    consumer_price: 30000000,
    expires_at: '۱۴۰۳/۰۶/۱۵',
    active: true,
    items: [
      { product_id: 'sb-503', quantity: 150 }
    ]
  },
  {
    id: 'off-703',
    title: 'آفر ترویجی دهان و دندان میس‌ویک',
    image_url: '',
    discount_percentage: 18,
    price: 20500000,
    consumer_price: 25000000,
    expires_at: '۱۴۰۳/۰۵/۱۵',
    active: false,
    items: [
      { product_id: 'sb-504', quantity: 40 },
      { product_id: 'sb-506', quantity: 30 }
    ]
  }
];

export const initialAdminUsers: AdminUser[] = [
  {
    id: 1,
    first_name: 'سید محمد',
    last_name: 'طباطبایی',
    phone: '۰۹۱۲۱۱۱۱۱۱۱',
    password: 'admin',
    role: 'مدیرکل',
    status: 'active',
    created_at: '۱۴۰۱/۰۱/۱۰'
  },
  {
    id: 2,
    first_name: 'پیمان',
    last_name: 'نوری',
    phone: '۰۹۱۲۲۲۲۲۲۲۲',
    password: 'admin',
    role: 'مدیر فروش',
    status: 'active',
    created_at: '۱۴۰۱/۰۶/۱۵'
  },
  {
    id: 3,
    first_name: 'نیلوفر',
    last_name: 'موسوی',
    phone: '۰۹۱۲۳۳۳۳۳۳۳',
    password: 'admin',
    role: 'مدیر محتوا',
    status: 'active',
    created_at: '۱۴۰۲/۰۲/۰۱'
  },
  {
    id: 4,
    first_name: 'کامران',
    last_name: 'کاویانی',
    phone: '۰۹۱۲۴۴۴۴۴۴۴',
    password: 'admin',
    role: 'مدیر بازاریابی',
    status: 'active',
    created_at: '۱۴۰۲/۰۵/۱۰'
  },
  {
    id: 5,
    first_name: 'امید',
    last_name: 'صادقی',
    phone: '۰۹۱۲۵۵۵۵۵۵۵',
    password: 'admin',
    role: null,
    status: 'pending',
    created_at: '۱۴۰۳/۰۵/۱۴'
  },
  {
    id: 6,
    first_name: 'شیما',
    last_name: 'فرهمند',
    phone: '۰۹۱۲۶۶۶۶۶۶۶',
    password: 'admin',
    role: null,
    status: 'pending',
    created_at: '۱۴۰۳/۰۵/۱۴'
  }
];

export const initialAppSettings: AppSettings = {
  banner_text: 'جشنواره فروش ویژه تابستانه سیلانه سبز با تخفیف‌های استثنایی!',
  banner_active: true,
  welcome_message: 'به پنل مدیریت یکپارچه سیلانه سبز پلاس خوش آمدید.',
  support_phone: '۰۲۱۸۸۹۹۰۰۱۱',
  announcement: 'کلیه فاکتورهای ثبت‌شده تا پایان ساعت کاری بررسی می‌گردند.'
};
