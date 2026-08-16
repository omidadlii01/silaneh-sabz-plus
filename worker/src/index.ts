export interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
}

function cors(resp: Response): Response {
  resp.headers.set('Access-Control-Allow-Origin', '*');
  resp.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  resp.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token, X-Admin-Session');
  return resp;
}

function json(data: unknown, status = 200): Response {
  return cors(
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
}

function genCustomerCode(): string {
  return String(Math.floor(10000 + Math.random() * 89999));
}

function genOrderNumber(): string {
  return 'SB-' + Date.now().toString().slice(-8);
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function isAuthorized(request: Request, env: Env): boolean {
  const token = request.headers.get('X-Admin-Token');
  return !!env.ADMIN_TOKEN && token === env.ADMIN_TOKEN;
}

function genSessionToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function getSessionAdminUser(request: Request, env: Env): Promise<any | null> {
  const session = request.headers.get('X-Admin-Session');
  if (!session) return null;
  // Any admin_users row with a matching session token is a valid session —
  // including 'pending' users (they can log in but see only /reports, a
  // restriction enforced by the manager app's own role-based nav/routing).
  const user = await env.DB.prepare(`SELECT * FROM admin_users WHERE session_token = ?`)
    .bind(session)
    .first<any>();
  return user || null;
}

// True if the request carries either the legacy shared X-Admin-Token
// (always full access, used by the account owner) or a valid active
// admin_users session (any approved role — endpoint-level role checks,
// where they matter, are done separately by the caller).
async function isAdminAuthorized(request: Request, env: Env): Promise<boolean> {
  if (isAuthorized(request, env)) return true;
  const user = await getSessionAdminUser(request, env);
  return !!user;
}

function adminUserToJson(u: any) {
  return {
    id: u.id,
    first_name: u.first_name,
    last_name: u.last_name,
    phone: u.phone,
    role: u.role,
    status: u.status,
    created_at: u.created_at,
  };
}

function customerToJson(c: any) {
  return {
    id: c.id,
    customerCode: c.customer_code,
    firstName: c.first_name,
    lastName: c.last_name,
    phone: c.phone,
    storeName: c.store_name,
    businessType: c.business_type,
    address: c.address,
    marketerName: c.marketer_name,
    marketerPhone: c.marketer_phone,
    active: !!c.active,
    createdAt: c.created_at,
  };
}

function productToJson(p: any) {
  return {
    id: p.id,
    code: p.code,
    name: p.name,
    brand: p.brand,
    category: p.category,
    imageUrl: p.image_url,
    barcode: p.barcode,
    cartonQuantity: p.carton_quantity,
    price: p.price,
    unitPrice: p.unit_price,
    inStock: !!p.in_stock,
    stockCount: p.stock_count,
    specialOffer: !!p.special_offer,
    discountPercentage: p.discount_percentage,
    isNew: !!p.is_new,
    description: p.description,
    active: !!p.active,
  };
}

function brandToJson(b: any) {
  return {
    id: b.id,
    name: b.name,
    englishName: b.english_name,
    imageUrl: b.image_url,
    logoColor: b.logo_color,
    active: !!b.active,
  };
}

// The marketer app (unlike the customer/admin apps) works directly with
// snake_case field names matching the DB columns, so marketer-facing JSON
// helpers below intentionally do NOT convert to camelCase.

const STATUS_FA_TO_EN: Record<string, string> = {
  'ثبت‌شده': 'pending',
  'در حال پردازش': 'processing',
  'ارسال‌شده': 'shipped',
  'تحویل‌شده': 'confirmed',
  'لغو‌شده': 'cancelled',
};
const STATUS_EN_TO_FA: Record<string, string> = {
  pending: 'ثبت‌شده',
  confirmed: 'تحویل‌شده',
  processing: 'در حال پردازش',
  shipped: 'ارسال‌شده',
  cancelled: 'لغو‌شده',
};
function statusToEnglish(fa: string): string {
  return STATUS_FA_TO_EN[fa] || fa;
}
function statusToPersian(en: string): string {
  return STATUS_EN_TO_FA[en] || en;
}

function marketerToJson(m: any) {
  return {
    id: m.id,
    first_name: m.first_name,
    last_name: m.last_name,
    phone: m.phone,
    region: m.region,
    personnel_code: m.personnel_code,
    active: !!m.active,
    monthly_target: m.monthly_target,
    achieved_sales: m.achieved_sales,
    created_at: m.created_at,
  };
}

function notificationToJson(n: any) {
  return {
    id: n.id,
    recipient_type: n.recipient_type,
    recipient_id: n.recipient_id,
    type: n.type,
    related_order_id: n.related_order_id,
    title: n.title,
    message: n.message,
    is_read: !!n.is_read,
    created_at: n.created_at,
  };
}

function marketerCustomerToJson(c: any) {
  return {
    id: c.id,
    customer_code: c.customer_code,
    first_name: c.first_name,
    last_name: c.last_name,
    phone: c.phone,
    store_name: c.store_name,
    business_type: c.business_type,
    address: c.address,
    marketer_id: c.marketer_id,
    active: !!c.active,
    total_orders_count: c.total_orders_count || 0,
    total_spent: c.total_spent || 0,
    last_order_date: c.last_order_date || null,
    created_at: c.created_at || null,
  };
}

function marketerOrderToJson(o: any) {
  return {
    id: o.id,
    order_code: o.order_code || `SB-${o.id}`,
    customer_id: o.customer_id,
    customer_name: o.customer_name,
    store_name: o.store_name,
    customer_phone: o.customer_phone,
    customer_address: o.customer_address,
    business_type: o.business_type,
    order_date: o.order_date,
    initial_amount: o.initial_amount,
    discount: o.discount,
    final_amount: o.final_amount,
    status: statusToEnglish(o.status),
    customer_note: o.customer_note,
    admin_note: o.admin_note,
    marketer_note: o.marketer_note,
    marketer_id: o.marketer_id,
    items: o.items || [],
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (method === 'OPTIONS') {
      return cors(new Response(null, { status: 204 }));
    }

    try {
      // ===================== PUBLIC: CUSTOMER-FACING APP =====================

      // --- SIGNUP ---
      if (path === '/api/signup' && method === 'POST') {
        const body = await request.json<any>();
        const { firstName, lastName, phone, password, storeName, businessType, address } = body;

        // NOTE: `address` is intentionally NOT required here. The signup
        // form was redesigned (2026-08-03) to be simpler and no longer
        // collects a separate address field — it always sends address: ''.
        // Requiring it here made EVERY signup fail with a false "اطلاعات
        // ناقص است" error no matter what the user filled in the form. The
        // `address` column still allows an empty string (it's NOT NULL,
        // not NOT NULL-and-non-empty), so this is safe.
        if (!firstName || !lastName || !phone || !storeName) {
          return json({ error: 'اطلاعات ناقص است.' }, 400);
        }

        const existing = await env.DB.prepare('SELECT id FROM customers WHERE phone = ?')
          .bind(phone)
          .first();

        if (existing) {
          return json({ error: 'شماره موبایل تکراری است' }, 409);
        }

        const customerCode = genCustomerCode();
        const result = await env.DB.prepare(
          `INSERT INTO customers (customer_code, first_name, last_name, phone, password, store_name, business_type, address, marketer_name, marketer_phone)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
          .bind(
            customerCode,
            firstName,
            lastName,
            phone,
            password || '',
            storeName,
            businessType || 'داروخانه',
            address,
            'بازاریاب سیلانه سبز',
            '۰۹۱۲۰۰۰۰۰۰۰',
          )
          .run();

        const newCustomer = await env.DB.prepare('SELECT * FROM customers WHERE id = ?')
          .bind(result.meta.last_row_id)
          .first();

        return json({ customer: customerToJson(newCustomer) }, 201);
      }

      // --- LOGIN ---
      if (path === '/api/login' && method === 'POST') {
        const body = await request.json<any>();
        const { phone } = body;
        if (!phone) return json({ error: 'شماره موبایل الزامی است.' }, 400);

        const customer = await env.DB.prepare('SELECT * FROM customers WHERE phone = ?')
          .bind(phone)
          .first();

        if (!customer) {
          return json({ error: 'کاربری با این شماره موبایل یافت نشد. لطفاً ابتدا ثبت‌نام کنید.' }, 404);
        }

        return json({ customer: customerToJson(customer) });
      }

      // --- PUBLIC: LIST PRODUCTS ---
      if (path === '/api/products' && method === 'GET') {
        const rows = await env.DB.prepare('SELECT * FROM products WHERE active = 1 ORDER BY id ASC').all();
        return json({ products: (rows.results as any[]).map(productToJson) });
      }

      // --- PUBLIC: LIST BRANDS ---
      if (path === '/api/brands' && method === 'GET') {
        const rows = await env.DB.prepare('SELECT * FROM brands WHERE active = 1 ORDER BY id ASC').all();
        return json({ brands: (rows.results as any[]).map(brandToJson) });
      }

      // --- PUBLIC: GET WEEKLY OFFERS (with items) ---
      if (path === '/api/weekly-offers' && method === 'GET') {
        const offers = await env.DB.prepare(
          'SELECT * FROM weekly_offers WHERE active = 1 ORDER BY created_at DESC',
        ).all();
        const offerRows = offers.results as any[];
        if (offerRows.length === 0) return json({ offers: [] });

        const offerIds = offerRows.map((o) => o.id);
        const placeholders = offerIds.map(() => '?').join(',');
        const itemsResult = await env.DB.prepare(
          `SELECT woi.offer_id, woi.quantity, p.id as product_id, p.name as product_name, p.unit_price
           FROM weekly_offer_items woi
           JOIN products p ON p.id = woi.product_id
           WHERE woi.offer_id IN (${placeholders})`,
        )
          .bind(...offerIds)
          .all();
        const itemsByOffer: Record<string, any[]> = {};
        for (const it of itemsResult.results as any[]) {
          if (!itemsByOffer[it.offer_id]) itemsByOffer[it.offer_id] = [];
          itemsByOffer[it.offer_id].push({
            productId: it.product_id,
            productName: it.product_name,
            qty: it.quantity,
            unitPrice: it.unit_price,
          });
        }
        const result = offerRows.map((o) => ({
          id: o.id,
          title: o.title,
          imageUrl: o.image_url,
          discountPercentage: o.discount_percentage,
          price: o.price,
          consumerPrice: o.consumer_price,
          expiresAt: o.expires_at,
          items: itemsByOffer[o.id] || [],
        }));
        return json({ offers: result });
      }

      // --- PUBLIC: GET APP SETTINGS (banner, messages, etc) ---
      if (path === '/api/settings' && method === 'GET') {
        const rows = await env.DB.prepare('SELECT key, value FROM app_settings').all();
        const settings: Record<string, string> = {};
        for (const row of rows.results as any[]) settings[row.key] = row.value;
        return json({ settings });
      }

      // --- GET CUSTOMER ORDERS (with items) ---
      const ordersMatch = path.match(/^\/api\/customers\/(\d+)\/orders$/);
      if (ordersMatch && method === 'GET') {
        const customerId = ordersMatch[1];
        const orders = await env.DB.prepare(
          'SELECT * FROM orders WHERE customer_id = ? ORDER BY id DESC',
        )
          .bind(customerId)
          .all();

        const orderRows = orders.results as any[];
        if (orderRows.length === 0) {
          return json({ orders: [] });
        }

        const orderIds = orderRows.map((o) => o.id);
        const placeholders = orderIds.map(() => '?').join(',');
        const itemsResult = await env.DB.prepare(
          `SELECT * FROM order_items WHERE order_id IN (${placeholders}) ORDER BY id ASC`,
        )
          .bind(...orderIds)
          .all();

        const itemsByOrder: Record<number, any[]> = {};
        for (const item of itemsResult.results as any[]) {
          if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
          itemsByOrder[item.order_id].push(item);
        }

        const ordersWithItems = orderRows.map((o) => ({
          ...o,
          items: itemsByOrder[o.id] || [],
        }));

        return json({ orders: ordersWithItems });
      }

      // --- CREATE ORDER (used by the customer app, and by the marketer app
      //     placing an order on behalf of a customer — marketerNote/marketerId
      //     are optional and only used in the latter case) ---
      if (path === '/api/orders' && method === 'POST') {
        const body = await request.json<any>();
        const { customerId, items, initialAmount, discount, finalAmount, customerNote, marketerNote } = body;

        if (!customerId || !items || !items.length) {
          return json({ error: 'اطلاعات سفارش ناقص است.' }, 400);
        }

        // Orders placed directly by a marketer are considered pre-confirmed;
        // orders placed by the customer app itself start at the default status.
        const initialStatus = marketerNote !== undefined || body.marketerId ? 'تحویل‌شده' : 'ثبت‌شده';

        const orderResult = await env.DB.prepare(
          `INSERT INTO orders (customer_id, initial_amount, discount, final_amount, status, customer_note, marketer_note)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
          .bind(customerId, initialAmount, discount || 0, finalAmount, initialStatus, customerNote || '', marketerNote || null)
          .run();

        const orderId = orderResult.meta.last_row_id;

        for (const item of items) {
          const productId = item.productId ?? item.product_id;
          const productName = item.productName ?? item.product_name;
          const unitPrice = item.unitPrice ?? item.unit_price;
          const totalPrice = item.totalPrice ?? item.total_price;
          await env.DB.prepare(
            `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
             VALUES (?, ?, ?, ?, ?, ?)`,
          )
            .bind(orderId, productId, productName, item.quantity, unitPrice, totalPrice)
            .run();
        }

        // Notify the customer's marketer that a new order came in (covers
        // both the customer-app flow and the marketer-app-direct flow).
        const owningCustomer = await env.DB.prepare('SELECT marketer_id, store_name FROM customers WHERE id = ?')
          .bind(customerId)
          .first<any>();
        if (owningCustomer?.marketer_id) {
          await env.DB.prepare(
            `INSERT INTO notifications (recipient_type, recipient_id, type, related_order_id, title, message)
             VALUES ('marketer', ?, 'new_order', ?, ?, ?)`,
          )
            .bind(
              owningCustomer.marketer_id,
              orderId,
              'سفارش جدید دریافت شد',
              `«${owningCustomer.store_name}» سفارش جدیدی به ارزش ${Number(finalAmount).toLocaleString('fa-IR')} تومان ثبت کرد.`,
            )
            .run();
        }

        return json({ orderId, orderNumber: genOrderNumber() }, 201);
      }

      // ===================== MARKETER APP =====================

      // --- MARKETER SIGNUP (public; account stays inactive until admin approval) ---
      if (path === '/api/marketer/signup' && method === 'POST') {
        const body = await request.json<any>();
        const { first_name, last_name, phone, password, region } = body;

        if (!first_name || !last_name || !phone || !password) {
          return json({ error: 'اطلاعات ناقص است.' }, 400);
        }

        const existing = await env.DB.prepare('SELECT id FROM marketers WHERE phone = ?')
          .bind(phone)
          .first();
        if (existing) {
          return json({ error: 'این شماره موبایل قبلاً در سامانه ثبت شده است.' }, 409);
        }

        const personnelCode = 'MK-' + Math.floor(1000 + Math.random() * 9000);
        const result = await env.DB.prepare(
          `INSERT INTO marketers (first_name, last_name, phone, password, region, personnel_code, active)
           VALUES (?, ?, ?, ?, ?, ?, 0)`,
        )
          .bind(first_name, last_name, phone, password, region || 'تهران', personnelCode)
          .run();

        const newMarketer = await env.DB.prepare('SELECT * FROM marketers WHERE id = ?')
          .bind(result.meta.last_row_id)
          .first();

        return json(
          {
            message: 'ثبت‌نام شما با موفقیت انجام شد. حساب شما پس از تایید مدیر سیستم فعال خواهد شد.',
            marketer: marketerToJson(newMarketer),
          },
          201,
        );
      }

      // --- MARKETER LOGIN (public; inactive accounts are allowed to log in so
      //     the app can show them a locked "pending approval" screen instead
      //     of just rejecting the login outright) ---
      if (path === '/api/marketer/login' && method === 'POST') {
        const body = await request.json<any>();
        const { phone, password } = body;
        if (!phone || !password) return json({ error: 'شماره موبایل و رمز عبور الزامی است.' }, 400);

        const marketer = await env.DB.prepare('SELECT * FROM marketers WHERE phone = ?')
          .bind(phone)
          .first<any>();

        if (!marketer) {
          return json({ error: 'حسابی با این شماره موبایل یافت نشد. لطفاً ابتدا ثبت‌نام کنید.' }, 404);
        }
        if (marketer.password !== password) {
          return json({ error: 'رمز عبور اشتباه است.' }, 401);
        }

        return json({ marketer: marketerToJson(marketer), token: `marketer-session-${marketer.id}` });
      }

      // --- MARKETER: GET OWN PROFILE (lightweight, used for polling active-status
      //     while the account is pending approval) ---
      const marketerProfileMatch = path.match(/^\/api\/marketer\/(\d+)$/);
      if (marketerProfileMatch && method === 'GET') {
        const marketer = await env.DB.prepare('SELECT * FROM marketers WHERE id = ?')
          .bind(marketerProfileMatch[1])
          .first<any>();
        if (!marketer) return json({ error: 'بازاریاب یافت نشد.' }, 404);
        return json({ marketer: marketerToJson(marketer) });
      }

      // --- MARKETER: LIST OWN CUSTOMERS ---
      const marketerCustomersMatch = path.match(/^\/api\/marketer\/(\d+)\/customers$/);
      if (marketerCustomersMatch && method === 'GET') {
        const marketerId = marketerCustomersMatch[1];
        const rows = await env.DB.prepare(
          `SELECT c.*,
                  (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) as total_orders_count,
                  (SELECT COALESCE(SUM(o.final_amount),0) FROM orders o WHERE o.customer_id = c.id) as total_spent,
                  (SELECT MAX(o.order_date) FROM orders o WHERE o.customer_id = c.id) as last_order_date
           FROM customers c WHERE c.marketer_id = ? ORDER BY c.id DESC`,
        )
          .bind(marketerId)
          .all();
        return json({ customers: (rows.results as any[]).map(marketerCustomerToJson) });
      }

      // --- MARKETER: CREATE CUSTOMER (on behalf of a new store) ---
      if (marketerCustomersMatch && method === 'POST') {
        const marketerId = marketerCustomersMatch[1];
        const body = await request.json<any>();
        const { firstName, lastName, phone, storeName, businessType, address } = body;

        if (!firstName || !lastName || !phone || !storeName) {
          return json({ error: 'اطلاعات ناقص است.' }, 400);
        }

        const existing = await env.DB.prepare('SELECT id FROM customers WHERE phone = ?')
          .bind(phone)
          .first();
        if (existing) {
          return json({ error: 'شماره موبایل تکراری است' }, 409);
        }

        const customerCode = genCustomerCode();
        const result = await env.DB.prepare(
          `INSERT INTO customers (customer_code, first_name, last_name, phone, password, store_name, business_type, address, marketer_id, marketer_name, marketer_phone)
           VALUES (?, ?, ?, ?, '', ?, ?, ?, ?, ?, ?)`,
        )
          .bind(
            customerCode,
            firstName,
            lastName,
            phone,
            storeName,
            businessType || 'pharmacy',
            address || '',
            marketerId,
            'بازاریاب سیلانه سبز',
            '۰۹۱۲۰۰۰۰۰۰۰',
          )
          .run();

        const newCustomer = await env.DB.prepare('SELECT * FROM customers WHERE id = ?')
          .bind(result.meta.last_row_id)
          .first<any>();

        await env.DB.prepare(
          `INSERT INTO notifications (recipient_type, recipient_id, type, title, message)
           VALUES ('marketer', ?, 'customer_registered', ?, ?)`,
        )
          .bind(marketerId, 'مشتری جدید ثبت شد', `مشتری «${storeName}» با موفقیت به لیست شما اضافه شد.`)
          .run();

        return json({ customer: marketerCustomerToJson({ ...newCustomer, total_orders_count: 0, total_spent: 0 }) }, 201);
      }

      // --- MARKETER: LIST ORDERS FOR OWN CUSTOMERS (with items) ---
      const marketerOrdersMatch = path.match(/^\/api\/marketer\/(\d+)\/orders$/);
      if (marketerOrdersMatch && method === 'GET') {
        const marketerId = marketerOrdersMatch[1];
        const rows = await env.DB.prepare(
          `SELECT o.*, c.store_name as store_name, c.phone as customer_phone, c.address as customer_address,
                  c.business_type as business_type, (c.first_name || ' ' || c.last_name) as customer_name,
                  c.marketer_id as marketer_id
           FROM orders o JOIN customers c ON o.customer_id = c.id
           WHERE c.marketer_id = ? ORDER BY o.id DESC`,
        )
          .bind(marketerId)
          .all();

        const orderRows = rows.results as any[];
        if (orderRows.length === 0) return json({ orders: [] });

        const orderIds = orderRows.map((o) => o.id);
        const placeholders = orderIds.map(() => '?').join(',');
        const itemsResult = await env.DB.prepare(
          `SELECT * FROM order_items WHERE order_id IN (${placeholders}) ORDER BY id ASC`,
        )
          .bind(...orderIds)
          .all();

        const itemsByOrder: Record<number, any[]> = {};
        for (const item of itemsResult.results as any[]) {
          if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
          itemsByOrder[item.order_id].push(item);
        }

        return json({
          orders: orderRows.map((o) => marketerOrderToJson({ ...o, items: itemsByOrder[o.id] || [] })),
        });
      }

      // --- MARKETER: LIST NOTIFICATIONS ---
      const marketerNotificationsMatch = path.match(/^\/api\/marketer\/(\d+)\/notifications$/);
      if (marketerNotificationsMatch && method === 'GET') {
        const marketerId = marketerNotificationsMatch[1];
        const rows = await env.DB.prepare(
          `SELECT * FROM notifications WHERE recipient_type = 'marketer' AND recipient_id = ? ORDER BY id DESC LIMIT 100`,
        )
          .bind(marketerId)
          .all();
        return json({ notifications: (rows.results as any[]).map(notificationToJson) });
      }

      // --- MARK NOTIFICATION READ ---
      const notificationReadMatch = path.match(/^\/api\/notifications\/(\d+)\/read$/);
      if (notificationReadMatch && method === 'PATCH') {
        const id = notificationReadMatch[1];
        await env.DB.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').bind(id).run();
        return json({ ok: true });
      }

      // --- MANAGER APP: PUBLIC admin-user signup/login (no auth required) ---
      if (path === '/api/admin/user-signup' && method === 'POST') {
        const body = await request.json<any>();
        const { first_name, last_name, phone, password } = body;
        if (!first_name || !last_name || !phone || !password) {
          return json({ error: 'اطلاعات ناقص است.' }, 400);
        }
        const existing = await env.DB.prepare('SELECT id FROM admin_users WHERE phone = ?')
          .bind(phone)
          .first();
        if (existing) {
          return json({ error: 'این شماره موبایل قبلاً ثبت شده است.' }, 409);
        }
        const result = await env.DB.prepare(
          `INSERT INTO admin_users (first_name, last_name, phone, password, role, status)
           VALUES (?, ?, ?, ?, NULL, 'pending')`,
        )
          .bind(first_name, last_name, phone, password)
          .run();
        const newUser = await env.DB.prepare('SELECT * FROM admin_users WHERE id = ?')
          .bind(result.meta.last_row_id)
          .first<any>();
        return json(
          {
            message: 'ثبت‌نام شما انجام شد. تا زمان تایید و تخصیص نقش توسط مدیرکل، فقط به گزارشات دسترسی دارید.',
            adminUser: adminUserToJson(newUser),
          },
          201,
        );
      }

      if (path === '/api/admin/user-login' && method === 'POST') {
        const body = await request.json<any>();
        const { phone, password } = body;
        if (!phone || !password) return json({ error: 'شماره موبایل و رمز عبور الزامی است.' }, 400);
        const user = await env.DB.prepare('SELECT * FROM admin_users WHERE phone = ?')
          .bind(phone)
          .first<any>();
        if (!user || user.password !== password) {
          return json({ error: 'شماره موبایل یا رمز عبور اشتباه است.' }, 401);
        }
        const sessionToken = genSessionToken();
        await env.DB.prepare('UPDATE admin_users SET session_token = ? WHERE id = ?')
          .bind(sessionToken, user.id)
          .run();
        return json({ adminUser: adminUserToJson({ ...user, session_token: sessionToken }), session: sessionToken });
      }

      // ===================== ADMIN ONLY (requires X-Admin-Token or X-Admin-Session) =====================

      const requiresAdmin =
        path.startsWith('/api/admin') ||
        (path === '/api/products' && method !== 'GET') ||
        path.startsWith('/api/products/') ||
        (path === '/api/brands' && method !== 'GET') ||
        path.startsWith('/api/brands/') ||
        (path === '/api/settings' && method !== 'GET') ||
        (path === '/api/weekly-offers' && method !== 'GET') ||
        path.startsWith('/api/weekly-offers/');
      // NOTE: PATCH /api/orders/:id/status is intentionally NOT admin-only —
      // both the admin dashboard and the marketer app change order status,
      // and the marketer app only has a simple session token (no real
      // server-side session store exists yet). See MARKETER_APP_HANDOFF.md
      // section 5 for this explicit decision.

      const publicAdminPaths = ['/api/admin/login', '/api/admin/user-signup', '/api/admin/user-login'];

      if (requiresAdmin && !publicAdminPaths.includes(path) && !(await isAdminAuthorized(request, env))) {
        return json({ error: 'دسترسی غیرمجاز. لطفاً دوباره وارد شوید.' }, 401);
      }

      // --- MANAGER APP: WHO AM I (resolve session -> user, for page refresh) ---
      if (path === '/api/admin/me' && method === 'GET') {
        const sessionUser = await getSessionAdminUser(request, env);
        if (sessionUser) return json({ adminUser: adminUserToJson(sessionUser) });
        if (isAuthorized(request, env)) {
          return json({
            adminUser: { id: 0, first_name: 'مدیر', last_name: 'کل', phone: '', role: 'مدیرکل', status: 'active', created_at: '' },
          });
        }
        return json({ error: 'دسترسی غیرمجاز' }, 401);
      }

      // --- MANAGER APP: LIST / APPROVE / REJECT admin users (مدیرکل only) ---
      const isAdminUsersMgmtPath = path === '/api/admin/users' || /^\/api\/admin\/users\/\d+$/.test(path);
      if (isAdminUsersMgmtPath) {
        if (!isAuthorized(request, env)) {
          const sessionUser = await getSessionAdminUser(request, env);
          if (!sessionUser || sessionUser.role !== 'مدیرکل') {
            return json({ error: 'فقط مدیرکل به این بخش دسترسی دارد.' }, 403);
          }
        }
      }

      if (path === '/api/admin/users' && method === 'GET') {
        const rows = await env.DB.prepare('SELECT * FROM admin_users ORDER BY id DESC').all();
        return json({ adminUsers: (rows.results as any[]).map(adminUserToJson) });
      }

      const adminUserMatch = path.match(/^\/api\/admin\/users\/(\d+)$/);
      if (adminUserMatch && method === 'PATCH') {
        const id = adminUserMatch[1];
        const body = await request.json<any>();
        if (body.role !== undefined) {
          await env.DB.prepare(`UPDATE admin_users SET role = ?, status = 'active' WHERE id = ?`)
            .bind(body.role, id)
            .run();
        }
        const updated = await env.DB.prepare('SELECT * FROM admin_users WHERE id = ?').bind(id).first();
        return json({ adminUser: adminUserToJson(updated) });
      }
      if (adminUserMatch && method === 'DELETE') {
        const id = adminUserMatch[1];
        await env.DB.prepare('DELETE FROM admin_users WHERE id = ?').bind(id).run();
        return json({ ok: true });
      }

      // --- ADMIN LOGIN (verify token) ---
      if (path === '/api/admin/login' && method === 'POST') {
        const body = await request.json<any>();
        if (body.token === env.ADMIN_TOKEN) {
          return json({ ok: true });
        }
        return json({ error: 'رمز ورود اشتباه است.' }, 401);
      }

      // --- ADMIN: STATS ---
      if (path === '/api/admin/stats' && method === 'GET') {
        const [orderCount, newOrderCount, totalAmount, customerCount, productCount] = await Promise.all([
          env.DB.prepare('SELECT COUNT(*) as c FROM orders').first<any>(),
          env.DB.prepare("SELECT COUNT(*) as c FROM orders WHERE status = 'ثبت‌شده'").first<any>(),
          env.DB.prepare('SELECT COALESCE(SUM(final_amount),0) as s FROM orders').first<any>(),
          env.DB.prepare('SELECT COUNT(*) as c FROM customers').first<any>(),
          env.DB.prepare('SELECT COUNT(*) as c FROM products WHERE active = 1').first<any>(),
        ]);
        return json({
          totalOrders: orderCount.c,
          newOrders: newOrderCount.c,
          totalAmount: totalAmount.s,
          totalCustomers: customerCount.c,
          totalProducts: productCount.c,
        });
      }

      // --- ADMIN: LIST ALL CUSTOMERS ---
      if (path === '/api/admin/customers' && method === 'GET') {
        const rows = await env.DB.prepare(
          `SELECT c.*,
                  (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) as total_orders_count,
                  (SELECT COALESCE(SUM(o.final_amount),0) FROM orders o WHERE o.customer_id = c.id) as total_spent,
                  (SELECT MAX(o.order_date) FROM orders o WHERE o.customer_id = c.id) as last_order_date
           FROM customers c ORDER BY c.id DESC`,
        ).all();
        return json({ customers: (rows.results as any[]).map(marketerCustomerToJson) });
      }

      // --- ADMIN: LIST ALL ORDERS (with customer + marketer info + items) ---
      if (path === '/api/admin/orders' && method === 'GET') {
        const rows = await env.DB.prepare(
          `SELECT o.*, c.store_name as store_name, c.phone as customer_phone,
                  (c.first_name || ' ' || c.last_name) as customer_name,
                  c.marketer_id as marketer_id,
                  (m.first_name || ' ' || m.last_name) as marketer_name
           FROM orders o
           JOIN customers c ON o.customer_id = c.id
           LEFT JOIN marketers m ON c.marketer_id = m.id
           ORDER BY o.id DESC`,
        ).all();

        const orderRows = rows.results as any[];
        if (orderRows.length === 0) return json({ orders: [] });

        const orderIds = orderRows.map((o) => o.id);
        const placeholders = orderIds.map(() => '?').join(',');
        const itemsResult = await env.DB.prepare(
          `SELECT * FROM order_items WHERE order_id IN (${placeholders}) ORDER BY id ASC`,
        )
          .bind(...orderIds)
          .all();

        const itemsByOrder: Record<number, any[]> = {};
        for (const item of itemsResult.results as any[]) {
          if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
          itemsByOrder[item.order_id].push(item);
        }

        return json({
          orders: orderRows.map((o) => ({
            ...o,
            order_code: 'SB-' + o.id,
            items: itemsByOrder[o.id] || [],
          })),
        });
      }

      // --- ADMIN: UPDATE CUSTOMER (marketer reassignment / active toggle) ---
      const adminCustomerMatch = path.match(/^\/api\/admin\/customers\/(\d+)$/);
      if (adminCustomerMatch && method === 'PATCH') {
        const id = adminCustomerMatch[1];
        const body = await request.json<any>();
        if (body.marketer_id !== undefined) {
          await env.DB.prepare('UPDATE customers SET marketer_id = ? WHERE id = ?')
            .bind(body.marketer_id, id)
            .run();
        }
        if (body.active !== undefined) {
          await env.DB.prepare('UPDATE customers SET active = ? WHERE id = ?')
            .bind(body.active ? 1 : 0, id)
            .run();
        }
        const updated = await env.DB.prepare('SELECT * FROM customers WHERE id = ?').bind(id).first<any>();
        return json({ customer: marketerCustomerToJson({ ...updated, total_orders_count: 0, total_spent: 0 }) });
      }

      // --- ADMIN: CREATE A MARKETER DIRECTLY (active immediately) ---
      if (path === '/api/admin/marketers' && method === 'POST') {
        const body = await request.json<any>();
        const { first_name, last_name, phone, region, monthly_target } = body;
        if (!first_name || !last_name || !phone) return json({ error: 'اطلاعات ناقص است.' }, 400);
        const existing = await env.DB.prepare('SELECT id FROM marketers WHERE phone = ?').bind(phone).first();
        if (existing) return json({ error: 'این شماره موبایل قبلاً ثبت شده است.' }, 409);
        const personnelCode = 'MK-' + Math.floor(1000 + Math.random() * 9000);
        const result = await env.DB.prepare(
          `INSERT INTO marketers (first_name, last_name, phone, password, region, personnel_code, active, monthly_target)
           VALUES (?, ?, ?, 'CHANGE_ME_ON_FIRST_LOGIN', ?, ?, 1, ?)`,
        )
          .bind(first_name, last_name, phone, region || '', personnelCode, monthly_target || 0)
          .run();
        const created = await env.DB.prepare('SELECT * FROM marketers WHERE id = ?')
          .bind(result.meta.last_row_id)
          .first();
        return json({ marketer: marketerToJson(created) }, 201);
      }

      // --- UPDATE ORDER STATUS (admin dashboard or marketer app) ---
      const statusMatch = path.match(/^\/api\/orders\/(\d+)\/status$/);
      if (statusMatch && method === 'PATCH') {
        const orderId = statusMatch[1];
        const body = await request.json<any>();
        // Accept either the admin panel's Persian status values directly,
        // or the marketer app's English status enum (translated here).
        const persianStatus = STATUS_EN_TO_FA[body.status] ? statusToPersian(body.status) : body.status;

        if (body.marketer_note !== undefined) {
          await env.DB.prepare('UPDATE orders SET status = ?, marketer_note = ? WHERE id = ?')
            .bind(persianStatus, body.marketer_note, orderId)
            .run();
        } else {
          await env.DB.prepare('UPDATE orders SET status = ? WHERE id = ?')
            .bind(persianStatus, orderId)
            .run();
        }

        const updatedOrder = await env.DB.prepare(
          `SELECT o.*, c.store_name as store_name, c.marketer_id as marketer_id
           FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.id = ?`,
        )
          .bind(orderId)
          .first<any>();

        if (updatedOrder?.marketer_id) {
          await env.DB.prepare(
            `INSERT INTO notifications (recipient_type, recipient_id, type, related_order_id, title, message)
             VALUES ('marketer', ?, 'order_status_change', ?, ?, ?)`,
          )
            .bind(
              updatedOrder.marketer_id,
              orderId,
              'وضعیت سفارش تغییر کرد',
              `سفارش «${updatedOrder.store_name}» به وضعیت «${persianStatus}» تغییر یافت.`,
            )
            .run();
        }

        return json({ ok: true, order: updatedOrder ? marketerOrderToJson(updatedOrder) : undefined });
      }

      // --- ADMIN: CREATE PRODUCT ---
      if (path === '/api/products' && method === 'POST') {
        const b = await request.json<any>();
        const id = b.id || genId('p');
        await env.DB.prepare(
          `INSERT INTO products (id, code, name, brand, category, image_url, barcode, carton_quantity, price, unit_price, in_stock, stock_count, special_offer, discount_percentage, is_new, description, active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
          .bind(
            id,
            b.code || '',
            b.name,
            b.brand,
            b.category || '',
            b.imageUrl || '',
            b.barcode || '',
            b.cartonQuantity || 1,
            b.price || 0,
            b.unitPrice || 0,
            b.inStock === false ? 0 : 1,
            b.stockCount || 0,
            b.specialOffer ? 1 : 0,
            b.discountPercentage ?? null,
            b.isNew ? 1 : 0,
            b.description || '',
            b.active === false ? 0 : 1,
          )
          .run();
        const created = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
        return json({ product: productToJson(created) }, 201);
      }

      // --- ADMIN: UPDATE PRODUCT ---
      const productMatch = path.match(/^\/api\/products\/([^/]+)$/);
      if (productMatch && method === 'PUT') {
        const id = productMatch[1];
        const b = await request.json<any>();
        await env.DB.prepare(
          `UPDATE products SET code=?, name=?, brand=?, category=?, image_url=?, barcode=?, carton_quantity=?, price=?, unit_price=?, in_stock=?, stock_count=?, special_offer=?, discount_percentage=?, is_new=?, description=?, active=?
           WHERE id=?`,
        )
          .bind(
            b.code || '',
            b.name,
            b.brand,
            b.category || '',
            b.imageUrl || '',
            b.barcode || '',
            b.cartonQuantity || 1,
            b.price || 0,
            b.unitPrice || 0,
            b.inStock === false ? 0 : 1,
            b.stockCount || 0,
            b.specialOffer ? 1 : 0,
            b.discountPercentage ?? null,
            b.isNew ? 1 : 0,
            b.description || '',
            b.active === false ? 0 : 1,
            id,
          )
          .run();
        const updated = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
        return json({ product: productToJson(updated) });
      }

      // --- ADMIN: DELETE PRODUCT (soft delete) ---
      if (productMatch && method === 'DELETE') {
        const id = productMatch[1];
        await env.DB.prepare('UPDATE products SET active = 0 WHERE id = ?').bind(id).run();
        return json({ ok: true });
      }

      // --- ADMIN: CREATE BRAND ---
      if (path === '/api/brands' && method === 'POST') {
        const b = await request.json<any>();
        const id = b.id || genId('b');
        await env.DB.prepare(
          `INSERT INTO brands (id, name, english_name, image_url, logo_color, active) VALUES (?, ?, ?, ?, ?, ?)`,
        )
          .bind(id, b.name, b.englishName || '', b.imageUrl || '', b.logoColor || '', b.active === false ? 0 : 1)
          .run();
        const created = await env.DB.prepare('SELECT * FROM brands WHERE id = ?').bind(id).first();
        return json({ brand: brandToJson(created) }, 201);
      }

      // --- ADMIN: UPDATE BRAND ---
      const brandMatch = path.match(/^\/api\/brands\/([^/]+)$/);
      if (brandMatch && method === 'PUT') {
        const id = brandMatch[1];
        const b = await request.json<any>();
        await env.DB.prepare(
          `UPDATE brands SET name=?, english_name=?, image_url=?, logo_color=?, active=? WHERE id=?`,
        )
          .bind(b.name, b.englishName || '', b.imageUrl || '', b.logoColor || '', b.active === false ? 0 : 1, id)
          .run();
        const updated = await env.DB.prepare('SELECT * FROM brands WHERE id = ?').bind(id).first();
        return json({ brand: brandToJson(updated) });
      }

      // --- ADMIN: DELETE BRAND (soft delete) ---
      if (brandMatch && method === 'DELETE') {
        const id = brandMatch[1];
        await env.DB.prepare('UPDATE brands SET active = 0 WHERE id = ?').bind(id).run();
        return json({ ok: true });
      }

      // --- ADMIN: LIST ALL MARKETERS (for approval) ---
      if (path === '/api/admin/marketers' && method === 'GET') {
        const rows = await env.DB.prepare('SELECT * FROM marketers ORDER BY id DESC').all();
        return json({ marketers: (rows.results as any[]).map(marketerToJson) });
      }

      // --- ADMIN: ACTIVATE/DEACTIVATE A MARKETER ---
      const adminMarketerMatch = path.match(/^\/api\/admin\/marketers\/(\d+)$/);
      if (adminMarketerMatch && method === 'PATCH') {
        const id = adminMarketerMatch[1];
        const body = await request.json<any>();
        const before = await env.DB.prepare('SELECT active FROM marketers WHERE id = ?').bind(id).first<any>();

        const fields: string[] = [];
        const values: any[] = [];
        if (body.active !== undefined) {
          fields.push('active = ?');
          values.push(body.active ? 1 : 0);
        }
        if (body.region !== undefined) {
          fields.push('region = ?');
          values.push(body.region);
        }
        if (body.monthly_target !== undefined) {
          fields.push('monthly_target = ?');
          values.push(body.monthly_target);
        }
        if (body.personnel_code !== undefined) {
          fields.push('personnel_code = ?');
          values.push(body.personnel_code);
        }
        if (fields.length > 0) {
          values.push(id);
          await env.DB.prepare(`UPDATE marketers SET ${fields.join(', ')} WHERE id = ?`)
            .bind(...values)
            .run();
        }
        const updated = await env.DB.prepare('SELECT * FROM marketers WHERE id = ?').bind(id).first();

        // Notify the marketer only on the transition from inactive -> active,
        // so re-saving an already-active marketer doesn't spam a notification.
        if (body.active && before && !before.active) {
          await env.DB.prepare(
            `INSERT INTO notifications (recipient_type, recipient_id, type, title, message)
             VALUES ('marketer', ?, 'account_approved', ?, ?)`,
          )
            .bind(
              id,
              'دسترسی شما تایید شد',
              'دسترسی شما به اپ بازاریابی سیلانه سبز تایید شد. هم‌اکنون می‌توانید از تمامی خدمات این اپ استفاده کنید.',
            )
            .run();
        }

        return json({ marketer: marketerToJson(updated) });
      }

      // --- ADMIN: LIST ALL WEEKLY OFFERS (active + inactive, for the manager app) ---
      if (path === '/api/admin/weekly-offers' && method === 'GET') {
        const offers = await env.DB.prepare('SELECT * FROM weekly_offers ORDER BY created_at DESC').all();
        const offerRows = offers.results as any[];
        if (offerRows.length === 0) return json({ offers: [] });
        const offerIds = offerRows.map((o) => o.id);
        const placeholders = offerIds.map(() => '?').join(',');
        const itemsResult = await env.DB.prepare(
          `SELECT offer_id, product_id, quantity FROM weekly_offer_items WHERE offer_id IN (${placeholders})`,
        )
          .bind(...offerIds)
          .all();
        const itemsByOffer: Record<string, any[]> = {};
        for (const it of itemsResult.results as any[]) {
          if (!itemsByOffer[it.offer_id]) itemsByOffer[it.offer_id] = [];
          itemsByOffer[it.offer_id].push({ productId: it.product_id, quantity: it.quantity });
        }
        return json({
          offers: offerRows.map((o) => ({
            id: o.id,
            title: o.title,
            imageUrl: o.image_url,
            discountPercentage: o.discount_percentage,
            price: o.price,
            consumerPrice: o.consumer_price,
            expiresAt: o.expires_at,
            active: !!o.active,
            items: itemsByOffer[o.id] || [],
          })),
        });
      }

      // --- ADMIN: CREATE WEEKLY OFFER (with items) ---
      if (path === '/api/weekly-offers' && method === 'POST') {
        const b = await request.json<any>();
        const id = b.id || genId('wo');
        await env.DB.prepare(
          `INSERT INTO weekly_offers (id, title, image_url, discount_percentage, price, consumer_price, expires_at, active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        )
          .bind(
            id,
            b.title,
            b.imageUrl || '',
            b.discountPercentage || 0,
            b.price || 0,
            b.consumerPrice || 0,
            b.expiresAt || null,
            b.active === false ? 0 : 1,
          )
          .run();
        for (const item of b.items || []) {
          await env.DB.prepare(
            'INSERT INTO weekly_offer_items (id, offer_id, product_id, quantity) VALUES (?, ?, ?, ?)',
          )
            .bind(genId('woi'), id, item.productId, item.quantity || 1)
            .run();
        }
        return json({ ok: true, id }, 201);
      }

      // --- ADMIN: UPDATE WEEKLY OFFER ---
      const offerMatch = path.match(/^\/api\/weekly-offers\/([^/]+)$/);
      if (offerMatch && method === 'PUT') {
        const id = offerMatch[1];
        const b = await request.json<any>();
        await env.DB.prepare(
          `UPDATE weekly_offers SET title=?, image_url=?, discount_percentage=?, price=?, consumer_price=?, expires_at=?, active=?
           WHERE id=?`,
        )
          .bind(
            b.title,
            b.imageUrl || '',
            b.discountPercentage || 0,
            b.price || 0,
            b.consumerPrice || 0,
            b.expiresAt || null,
            b.active === false ? 0 : 1,
            id,
          )
          .run();
        if (b.items) {
          await env.DB.prepare('DELETE FROM weekly_offer_items WHERE offer_id = ?').bind(id).run();
          for (const item of b.items) {
            await env.DB.prepare(
              'INSERT INTO weekly_offer_items (id, offer_id, product_id, quantity) VALUES (?, ?, ?, ?)',
            )
              .bind(genId('woi'), id, item.productId, item.quantity || 1)
              .run();
          }
        }
        return json({ ok: true });
      }

      // --- ADMIN: DELETE WEEKLY OFFER (soft delete) ---
      if (offerMatch && method === 'DELETE') {
        const id = offerMatch[1];
        await env.DB.prepare('UPDATE weekly_offers SET active = 0 WHERE id = ?').bind(id).run();
        return json({ ok: true });
      }

      // --- ADMIN: UPDATE APP SETTINGS ---
      if (path === '/api/settings' && method === 'PUT') {
        const b = await request.json<any>();
        const entries = Object.entries(b || {});
        for (const [key, value] of entries) {
          await env.DB.prepare(
            'INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
          )
            .bind(key, String(value ?? ''))
            .run();
        }
        const rows = await env.DB.prepare('SELECT key, value FROM app_settings').all();
        const settings: Record<string, string> = {};
        for (const row of rows.results as any[]) settings[row.key] = row.value;
        return json({ settings });
      }

      return json({ error: 'مسیر یافت نشد.' }, 404);
    } catch (err: any) {
      return json({ error: 'خطای سرور', detail: String(err?.message || err) }, 500);
    }
  },
};
