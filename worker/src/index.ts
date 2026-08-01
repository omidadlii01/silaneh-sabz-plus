export interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
}

function cors(resp: Response): Response {
  resp.headers.set('Access-Control-Allow-Origin', '*');
  resp.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  resp.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');
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

        if (!firstName || !lastName || !phone || !storeName || !address) {
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

      // --- CREATE ORDER ---
      if (path === '/api/orders' && method === 'POST') {
        const body = await request.json<any>();
        const { customerId, items, initialAmount, discount, finalAmount, customerNote } = body;

        if (!customerId || !items || !items.length) {
          return json({ error: 'اطلاعات سفارش ناقص است.' }, 400);
        }

        const orderResult = await env.DB.prepare(
          `INSERT INTO orders (customer_id, initial_amount, discount, final_amount, status, customer_note)
           VALUES (?, ?, ?, ?, ?, ?)`,
        )
          .bind(customerId, initialAmount, discount || 0, finalAmount, 'ثبت‌شده', customerNote || '')
          .run();

        const orderId = orderResult.meta.last_row_id;

        for (const item of items) {
          await env.DB.prepare(
            `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
             VALUES (?, ?, ?, ?, ?, ?)`,
          )
            .bind(orderId, item.productId, item.productName, item.quantity, item.unitPrice, item.totalPrice)
            .run();
        }

        return json({ orderId, orderNumber: genOrderNumber() }, 201);
      }

      // ===================== ADMIN ONLY (requires X-Admin-Token header) =====================

      const requiresAdmin =
        path.startsWith('/api/admin') ||
        (path === '/api/products' && method !== 'GET') ||
        path.startsWith('/api/products/') ||
        (path === '/api/brands' && method !== 'GET') ||
        path.startsWith('/api/brands/') ||
        /^\/api\/orders\/\d+\/status$/.test(path);

      if (requiresAdmin && path !== '/api/admin/login' && !isAuthorized(request, env)) {
        return json({ error: 'دسترسی غیرمجاز. توکن ادمین نامعتبر است.' }, 401);
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
        const rows = await env.DB.prepare('SELECT * FROM customers ORDER BY id DESC').all();
        return json({ customers: (rows.results as any[]).map(customerToJson) });
      }

      // --- ADMIN: LIST ALL ORDERS (with customer info + items) ---
      if (path === '/api/admin/orders' && method === 'GET') {
        const rows = await env.DB.prepare(
          `SELECT o.*, c.store_name as customer_store_name, c.phone as customer_phone
           FROM orders o JOIN customers c ON o.customer_id = c.id
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
          orders: orderRows.map((o) => ({ ...o, items: itemsByOrder[o.id] || [] })),
        });
      }

      // --- ADMIN: UPDATE ORDER STATUS ---
      const statusMatch = path.match(/^\/api\/orders\/(\d+)\/status$/);
      if (statusMatch && method === 'PATCH') {
        const orderId = statusMatch[1];
        const body = await request.json<any>();
        await env.DB.prepare('UPDATE orders SET status = ? WHERE id = ?')
          .bind(body.status, orderId)
          .run();
        return json({ ok: true });
      }

      // --- ADMIN: CREATE PRODUCT ---
      if (path === '/api/products' && method === 'POST') {
        const b = await request.json<any>();
        const id = b.id || genId('p');
        await env.DB.prepare(
          `INSERT INTO products (id, code, name, brand, category, image_url, carton_quantity, price, unit_price, in_stock, stock_count, special_offer, discount_percentage, is_new, description, active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
          .bind(
            id,
            b.code || '',
            b.name,
            b.brand,
            b.category || '',
            b.imageUrl || '',
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
          `UPDATE products SET code=?, name=?, brand=?, category=?, image_url=?, carton_quantity=?, price=?, unit_price=?, in_stock=?, stock_count=?, special_offer=?, discount_percentage=?, is_new=?, description=?, active=?
           WHERE id=?`,
        )
          .bind(
            b.code || '',
            b.name,
            b.brand,
            b.category || '',
            b.imageUrl || '',
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

      return json({ error: 'مسیر یافت نشد.' }, 404);
    } catch (err: any) {
      return json({ error: 'خطای سرور', detail: String(err?.message || err) }, 500);
    }
  },
};
