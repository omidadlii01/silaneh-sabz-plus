# یادداشت این برنچ

این برنچ (`super-app-silaneh-sabz`) محل قرارگیری خروجی خام مراحل طراحی/کدنویسی
سوپراپلیکیشن سیلانه سبز است — مشابه الگوی برنچ `stitch-designs` برای پروژه اصلی.

## وضعیت فعلی (2026-08-03)
پوشه‌ی `superapp-aistudio-output/` حاوی خروجی خام Google AI Studio است که از روی
طرح Stitch صفحه‌ی «هوم/داشبورد» سوپراپ ساخته شده. این یک اسکفولد React+Vite
کاملاً مستقل است (package.json/vite.config.ts/tsconfig.json جدا از پروژه اصلی)
و هنوز با ساختار اصلی ریپو (src/ در روت، AppContext، src/api.ts واقعی متصل به
Worker) ادغام نشده است.

## نکات مهم برای ادغام آینده
- فقط اسکوپ «صفحه Home» رعایت شده — بدون login/routing واقعی، طبق پرامپت داده‌شده.
- src/api.ts این پوشه یک fetch client جدا با fallback به mockData.ts خودشه؛
  باید با src/api.ts واقعی پروژه (که به Worker API متصله) یکی بشه، نه اینکه
  دو منبع API جدا در پروژه باقی بمونه.
- کامپوننت‌ها (WalletBalanceCard, MonthlyMissionsSection, PurchaseGoalBanner,
  QuickAccessGrid, PopularProductsSection, MonthlyDiscountsBanner,
  MonthlyEventsSection, BottomNavigation, MainHeader) باید به src/components/
  اصلی پروژه منتقل و به Tailwind/Design tokens موجود پروژه (نه یک تنظیمات
  Tailwind جدا) وصل بشن.
- package.json این پوشه چند وابستگی اضافه داره (@google/genai, express, motion,
  dotenv) که احتمالاً برای این پروژه لازم نیستن — قبل از ادغام باید بررسی و حذف
  بشن تا وابستگی اضافه به bundle اصلی اضافه نشه.

نقشه راه کامل فازهای سوپراپ (کیف‌پول، ماموریت، جوایز، باشگاه مشتریان، ایونت،
ویزیتور) در گفتگوی کاربر با AI ثبت شده — برای جزئیات به کاربر مراجعه شود.
