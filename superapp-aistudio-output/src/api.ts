// src/api.ts
import {
  WalletInfo,
  PurchaseGoal,
  ProductItem,
  DiscountBanner,
  MissionItem,
  EventItem,
} from './types';

import {
  mockWalletData,
  mockPurchaseGoal,
  mockProducts,
  mockDiscounts,
  mockMissions,
  mockEvents,
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Fetch wallet balance and current active state.
 */
export async function fetchWalletInfo(): Promise<WalletInfo> {
  try {
    const res = await fetch(`${API_BASE_URL}/wallet`);
    if (!res.ok) throw new Error('Failed to fetch wallet info');
    return await res.json();
  } catch {
    // Fallback to mock data when backend API is not present
    return mockWalletData;
  }
}

/**
 * Fetch user's purchase goal progress.
 */
export async function fetchPurchaseGoal(): Promise<PurchaseGoal> {
  try {
    const res = await fetch(`${API_BASE_URL}/purchase-goal`);
    if (!res.ok) throw new Error('Failed to fetch purchase goal');
    return await res.json();
  } catch {
    return mockPurchaseGoal;
  }
}

/**
 * Fetch popular products list.
 */
export async function fetchPopularProducts(): Promise<ProductItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/popular`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch {
    return mockProducts;
  }
}

/**
 * Fetch monthly discount banners.
 */
export async function fetchMonthlyDiscounts(): Promise<DiscountBanner[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/discounts/monthly`);
    if (!res.ok) throw new Error('Failed to fetch discounts');
    return await res.json();
  } catch {
    return mockDiscounts;
  }
}

/**
 * Fetch monthly missions.
 */
export async function fetchMonthlyMissions(): Promise<MissionItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/missions/monthly`);
    if (!res.ok) throw new Error('Failed to fetch missions');
    return await res.json();
  } catch {
    return mockMissions;
  }
}

/**
 * Fetch monthly events.
 */
export async function fetchMonthlyEvents(): Promise<EventItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/events/monthly`);
    if (!res.ok) throw new Error('Failed to fetch events');
    return await res.json();
  } catch {
    return mockEvents;
  }
}
