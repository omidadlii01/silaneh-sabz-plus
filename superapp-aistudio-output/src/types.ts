// src/types.ts

export type WalletTab = 'wallet' | 'credit' | 'investment';

export interface WalletInfo {
  balanceFormatted: string;
  currency: string;
  activeTab: WalletTab;
}

export type QuickAccessType = 'shop' | 'awards' | 'events' | 'discounts';

export interface QuickAccessItem {
  id: QuickAccessType;
  title: string;
  iconType: QuickAccessType;
}

export interface PurchaseGoal {
  title: string;
  subtitle: string;
  seasonBadge: string;
  purchasedAmountText: string;
  remainingAmountText: string;
  progressPercentage: number;
  membershipLevelNote: string;
}

export interface ProductItem {
  id: string;
  title: string;
  priceFormatted: string;
  currency: string;
  imageUrl: string;
  isNew?: boolean;
}

export interface DiscountBanner {
  id: string;
  tag: string;
  title: string;
  description?: string;
  bgClass: string;
}

export interface MissionItem {
  id: string;
  type: 'detailed' | 'incentive';
  title?: string;
  rewardText?: string;
  progressPercentage: number;
  progressText?: string;
  daysLeftText?: string;
  counterText?: string;
  buttonText?: string;
}

export interface EventItem {
  id: string;
  title: string;
  badge: string;
  badgeBgClass: string;
  imageUrl: string;
  infoText: string;
  infoType: 'date' | 'location';
}

export type NavTabId = 'shop' | 'orders' | 'missions' | 'visitor' | 'wallet';

export interface NavItem {
  id: NavTabId;
  label: string;
  icon: string;
  isActive?: boolean;
}
