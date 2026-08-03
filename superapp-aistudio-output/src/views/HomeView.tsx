// src/views/HomeView.tsx
import React, { useEffect, useState } from 'react';
import MainHeader from '../components/MainHeader';
import WalletBalanceCard from '../components/WalletBalanceCard';
import QuickAccessGrid from '../components/QuickAccessGrid';
import PurchaseGoalBanner from '../components/PurchaseGoalBanner';
import PopularProductsSection from '../components/PopularProductsSection';
import MonthlyDiscountsBanner from '../components/MonthlyDiscountsBanner';
import MonthlyMissionsSection from '../components/MonthlyMissionsSection';
import MonthlyEventsSection from '../components/MonthlyEventsSection';
import BottomNavigation from '../components/BottomNavigation';

import {
  WalletInfo,
  PurchaseGoal,
  ProductItem,
  DiscountBanner,
  MissionItem,
  EventItem,
  NavTabId,
} from '../types';

import {
  fetchWalletInfo,
  fetchPurchaseGoal,
  fetchPopularProducts,
  fetchMonthlyDiscounts,
  fetchMonthlyMissions,
  fetchMonthlyEvents,
} from '../api';

export const HomeView: React.FC = () => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [purchaseGoal, setPurchaseGoal] = useState<PurchaseGoal | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [discounts, setDiscounts] = useState<DiscountBanner[]>([]);
  const [missions, setMissions] = useState<MissionItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeNavTab, setActiveNavTab] = useState<NavTabId>('shop');

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const [walletRes, goalRes, prodRes, discRes, missRes, eventRes] = await Promise.all([
        fetchWalletInfo(),
        fetchPurchaseGoal(),
        fetchPopularProducts(),
        fetchMonthlyDiscounts(),
        fetchMonthlyMissions(),
        fetchMonthlyEvents(),
      ]);

      if (isMounted) {
        setWallet(walletRes);
        setPurchaseGoal(goalRes);
        setProducts(prodRes);
        setDiscounts(discRes);
        setMissions(missRes);
        setEvents(eventRes);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f6fafe] text-gray-800 pb-24 max-w-md mx-auto shadow-md relative overflow-x-hidden font-sans">
      {/* 1. Main Header */}
      <MainHeader
        appName="سیلانه سبز"
        unreadNotifications={true}
        onNotificationClick={() => {
          // TODO: wire navigation to notifications page
        }}
        onProfileClick={() => {
          // TODO: wire navigation to profile page
        }}
      />

      {/* Main Scrollable Content */}
      <main className="space-y-6">
        {/* 2. Wallet Balance Card */}
        <WalletBalanceCard
          wallet={wallet || undefined}
          onTabChange={(tab) => {
            // TODO: handle wallet tab switch
          }}
        />

        {/* 3. Quick Access Grid */}
        <QuickAccessGrid
          onItemClick={(itemType) => {
            // TODO: wire quick action item clicks
          }}
        />

        {/* 4. Purchase Goal Banner */}
        <PurchaseGoalBanner goal={purchaseGoal || undefined} />

        {/* 5. Popular Products Section */}
        <PopularProductsSection
          products={products}
          onViewAll={() => {
            // TODO: wire navigation to products catalog
          }}
          onOrderProduct={(productId) => {
            // TODO: wire quick order product logic
          }}
        />

        {/* 6. Monthly Discounts Banner */}
        <MonthlyDiscountsBanner
          banners={discounts}
          onViewAll={() => {
            // TODO: wire navigation to discounts list
          }}
          onBannerClick={(bannerId) => {
            // TODO: wire discount banner click
          }}
        />

        {/* 7. Monthly Missions Section */}
        <MonthlyMissionsSection
          missions={missions}
          onViewAll={() => {
            // TODO: wire navigation to missions screen
          }}
          onClaimReward={(missionId) => {
            // TODO: wire claim reward logic
          }}
        />

        {/* 8. Monthly Events Section */}
        <MonthlyEventsSection
          events={events}
          onViewAll={() => {
            // TODO: wire navigation to events calendar
          }}
          onEventClick={(eventId) => {
            // TODO: wire event details view
          }}
        />
      </main>

      {/* 9. Bottom Navigation Bar */}
      <BottomNavigation
        activeTab={activeNavTab}
        onTabSelect={(tabId) => {
          setActiveNavTab(tabId);
          // TODO: wire navigation
        }}
      />
    </div>
  );
};

export default HomeView;
