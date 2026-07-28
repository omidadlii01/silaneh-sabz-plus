export interface Env {
  DB: D1Database;
}

function cors(resp: Response): Response {
  resp.headers.set('Access-Control-Allow-Origin', '*');
  resp.headers.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  resp.headers.set('Access-Control-Allow-Headers', 'Content-Type');
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

async function customerToJson(c: any) {
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

        return json({ customer: await customerToJson(newCustomer) }, 201);
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

        return json({ customer: await customerToJson(customer) });
      }

      // --- GET CUSTOMER ORDERS ---
      const ordersMatch = path.match(/^\/api\/customers\/(\d+)\/orders$/);
      if (ordersMatch && method === 'GET') {
        const customerId = ordersMatch[1];
        const orders = await env.DB.prepare(
          'SELECT * FROM orders WHERE customer_id = ? ORDER BY id DESC',
        )
          .bind(customerId)
          .all();

        return json({ orders: orders.results });
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

      // --- UPDATE ORDER STATUS (admin) ---
      const statusMatch = path.match(/^\/api\/orders\/(\d+)\/status$/);
      if (statusMatch && method === 'PATCH') {
        const orderId = statusMatch[1];
        const body = await request.json<any>();
        await env.DB.prepare('UPDATE orders SET status = ? WHERE id = ?')
          .bind(body.status, orderId)
          .run();
        return json({ ok: true });
      }

      return json({ error: 'مسیر یافت نشد.' }, 404);
    } catch (err: any) {
      return json({ error: 'خطای سرور', detail: String(err?.message || err) }, 500);
    }
  },
};
