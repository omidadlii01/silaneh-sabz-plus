import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/Toast';
import { DashboardView } from './components/dashboard/DashboardView';
import { OrdersView } from './components/orders/OrdersView';
import { CustomersView } from './components/customers/CustomersView';
import { CatalogView } from './components/catalog/CatalogView';
import { ProfileView } from './components/profile/ProfileView';
import { OrderDetailsSheet } from './components/orders/OrderDetailsSheet';
import { AddCustomerModal } from './components/customers/AddCustomerModal';
import { NewOrderFlow } from './components/catalog/NewOrderFlow';
import { CartSheet } from './components/catalog/CartSheet';
import { NotificationSheet } from './components/notifications/NotificationSheet';
import { CustomerSimulatorModal } from './components/common/CustomerSimulatorModal';
import { ApiConfigModal } from './components/profile/ApiConfigModal';
import { LoginView } from './components/auth/LoginView';
import { SignupView } from './components/auth/SignupView';
import { PendingApprovalModal } from './components/auth/PendingApprovalModal';
import { PendingLockScreen } from './components/common/PendingLockScreen';

const MainApp: React.FC = () => {
  const { marketer, isAuthenticated, isLoading, justSignedUp, clearJustSignedUp } = useAuth();
  const { activeTab } = useApp();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center font-black text-2xl animate-pulse">
          س+
        </div>
        <p className="text-xs text-slate-300 font-medium">در حال بارگذاری سامانه بازاریاب...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authMode === 'signup' ? (
      <SignupView onSwitchToLogin={() => setAuthMode('login')} />
    ) : (
      <LoginView onSwitchToSignup={() => setAuthMode('signup')} />
    );
  }

  // Account still pending admin approval: right after signup, show the
  // one-time "thank you, please wait" modal; afterwards (and on any future
  // login while still pending) show the persistent locked screen — every
  // feature stays inaccessible until an admin approves the account.
  if (marketer && marketer.active !== true && marketer.active !== 1) {
    if (justSignedUp) {
      return (
        <>
          <PendingApprovalModal onDismiss={clearJustSignedUp} />
          <ToastContainer />
        </>
      );
    }
    return (
      <>
        <PendingLockScreen />
        <ToastContainer />
      </>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'orders':
        return <OrdersView />;
      case 'catalog':
        return <CatalogView />;
      case 'customers':
        return <CustomersView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div id="marketer-app-root" className="min-h-screen bg-slate-100 flex justify-center">
      {/* Mobile viewport frame container */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen shadow-2xl relative flex flex-col">
        {/* Top Header */}
        <Header />

        {/* Dynamic Page View */}
        <main className="flex-1 px-3.5 py-2 overflow-x-hidden">
          {renderActiveView()}
        </main>

        {/* Bottom Navigation */}
        <BottomNav />

        {/* Global Modals, Sheets and Dialogs */}
        <OrderDetailsSheet />
        <AddCustomerModal />
        <NewOrderFlow />
        <CartSheet />
        <NotificationSheet />
        {import.meta.env.DEV && (
          <>
            <CustomerSimulatorModal />
            <ApiConfigModal />
          </>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </AuthProvider>
  );
}
