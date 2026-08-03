// src/mockData.ts
import {
  WalletInfo,
  QuickAccessItem,
  PurchaseGoal,
  ProductItem,
  DiscountBanner,
  MissionItem,
  EventItem,
} from './types';

export const mockWalletData: WalletInfo = {
  balanceFormatted: '۵۰۰,۰۰۰,۰۰۰',
  currency: 'ریال',
  activeTab: 'wallet',
};

export const mockQuickAccessItems: QuickAccessItem[] = [
  { id: 'shop', title: 'فروشگاه', iconType: 'shop' },
  { id: 'awards', title: 'جوایز', iconType: 'awards' },
  { id: 'events', title: 'ایونت‌ها', iconType: 'events' },
  { id: 'discounts', title: 'تخفیفات', iconType: 'discounts' },
];

export const mockPurchaseGoal: PurchaseGoal = {
  title: 'هدف گذاری خرید',
  subtitle: 'تا ۵۰ میلیون تخفیف ویژه',
  seasonBadge: 'فصل پاییز',
  purchasedAmountText: '۱۸۰ میلیون خرید شده',
  remainingAmountText: '۳۲۰ میلیون باقی‌مانده',
  progressPercentage: 35,
  membershipLevelNote: 'با تکمیل این مرحله، سطح عضویت شما به «طلایی» ارتقا می‌یابد.',
};

export const mockProducts: ProductItem[] = [
  {
    id: 'prod-1',
    title: 'کرم آبرسان سیلانه',
    priceFormatted: '۱,۲۰۰,۰۰۰',
    currency: 'ریال',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    isNew: true,
  },
  {
    id: 'prod-2',
    title: 'کرم آبرسان سیلانه',
    priceFormatted: '۱,۲۰۰,۰۰۰',
    currency: 'ریال',
    imageUrl: 'https://images.unsplash.com/photo-1608248597263-0057e57b4524?auto=format&fit=crop&w=400&q=80',
    isNew: true,
  },
  {
    id: 'prod-3',
    title: 'سرم روشن‌کننده پوستی',
    priceFormatted: '۲,۴۵۰,۰۰۰',
    currency: 'ریال',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
    isNew: false,
  },
];

export const mockDiscounts: DiscountBanner[] = [
  {
    id: 'disc-1',
    tag: 'ویژه جشنواره مهر',
    title: '۴۰٪ تخفیف محصولات بهداشتی',
    description: 'برای خریدهای بالای ۱۰ میلیون تومان',
    bgClass: 'bg-gradient-to-r from-orange-400 to-orange-600',
  },
  {
    id: 'disc-2',
    tag: 'باشگاه مشتریان',
    title: 'جایزه نقدی',
    description: 'قرعه‌کشی ماهیانه خریداران عمده',
    bgClass: 'bg-emerald-800',
  },
];

export const mockMissions: MissionItem[] = [
  {
    id: 'mission-1',
    type: 'detailed',
    title: '۵۰۰ میلیون خرید در ماه',
    rewardText: 'پاداش: ۵۰ میلیون ریال تخفیف',
    progressPercentage: 75,
    progressText: '۷۵٪ انجام شده',
    daysLeftText: '۱۲ روز باقی‌مانده',
    buttonText: 'دریافت پاداش',
  },
  {
    id: 'mission-2',
    type: 'incentive',
    progressPercentage: 40,
    counterText: '۴ از ۱۰',
  },
];

export const mockEvents: EventItem[] = [
  {
    id: 'event-1',
    title: 'مدیریت نوین زنجیره تامین',
    badge: 'وبینار آموزشی',
    badgeBgClass: 'bg-emerald-800',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80',
    infoText: '۱۵ مهر ماه - ساعت ۱۶:۰۰',
    infoType: 'date',
  },
  {
    id: 'event-2',
    title: 'گردهمایی سیلانه',
    badge: 'جشنواره فروش',
    badgeBgClass: 'bg-orange-600',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    infoText: 'هتل اسپیناس',
    infoType: 'location',
  },
];
