import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';

// Layout
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { RoleGuard } from './components/common/RoleGuard';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { CustomersPage } from './pages/CustomersPage';
import { MarketersPage } from './pages/MarketersPage';
import { MarketerDetailPage } from './pages/MarketerDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { BrandsPage } from './pages/BrandsPage';
import { OffersPage } from './pages/OffersPage';
import { ReportsPage } from './pages/ReportsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPage } from './pages/AuthPage';

// Modals
import { OrderDetailModal } from './components/modals/OrderDetailModal';
import { AddOrderModal } from './components/modals/AddOrderModal';
import { CustomerModal } from './components/modals/CustomerModal';
import { MarketerModal } from './components/modals/MarketerModal';
import { ApproveAdminModal } from './components/modals/ApproveAdminModal';
import { ProductModal } from './components/modals/ProductModal';
import { BrandModal } from './components/modals/BrandModal';
import { OfferModal } from './components/modals/OfferModal';

// Types
import { Order, Customer, Marketer, AdminUser, Product } from './types';
import { Menu } from 'lucide-react';

function AppContent() {
  const { currentUser, loading: authLoading } = useAuth();
  const { orders, updateOrderStatus } = useData();

  const [currentPath, setCurrentPath] = useState<string>('/dashboard');
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  // Modal States
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<{ show: boolean; customer?: Customer | null }>({ show: false });
  const [editingMarketer, setEditingMarketer] = useState<{ show: boolean; marketer?: Marketer | null }>({ show: false });
  const [approvingAdminUser, setApprovingAdminUser] = useState<AdminUser | null>(null);
  const [editingProduct, setEditingProduct] = useState<{ show: boolean; product?: Product | null }>({ show: false });
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || null;

  // Render main page according to path
  const renderMainContent = () => {
    if (authLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-[#006c4a] border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (!currentUser) {
      return <AuthPage onNavigate={setCurrentPath} />;
    }

    if (currentPath === '/login' || currentPath === '/signup') {
      return <AuthPage onNavigate={setCurrentPath} />;
    }

    if (currentPath.startsWith('/marketers/')) {
      const idStr = currentPath.split('/')[2];
      const mId = Number(idStr) || 101;
      return (
        <RoleGuard path="/marketers" onNavigate={setCurrentPath}>
          <MarketerDetailPage
            marketerId={mId}
            onNavigate={setCurrentPath}
            onOpenMarketerModal={(m) => setEditingMarketer({ show: true, marketer: m })}
            onSelectOrder={setSelectedOrderId}
          />
        </RoleGuard>
      );
    }

    switch (currentPath) {
      case '/':
      case '/dashboard':
        return (
          <RoleGuard path="/dashboard" onNavigate={setCurrentPath}>
            <DashboardPage
              onNavigate={setCurrentPath}
              onOpenOrderModal={() => setShowAddOrderModal(true)}
              onSelectOrder={setSelectedOrderId}
            />
          </RoleGuard>
        );

      case '/orders':
        return (
          <RoleGuard path="/orders" onNavigate={setCurrentPath}>
            <OrdersPage
              onSelectOrder={setSelectedOrderId}
              onOpenAddModal={() => setShowAddOrderModal(true)}
              onNavigate={setCurrentPath}
            />
          </RoleGuard>
        );

      case '/customers':
        return (
          <RoleGuard path="/customers" onNavigate={setCurrentPath}>
            <CustomersPage
              onOpenCustomerModal={(cust) => setEditingCustomer({ show: true, customer: cust })}
              onNavigate={setCurrentPath}
            />
          </RoleGuard>
        );

      case '/marketers':
        return (
          <RoleGuard path="/marketers" onNavigate={setCurrentPath}>
            <MarketersPage
              onOpenMarketerModal={(m) => setEditingMarketer({ show: true, marketer: m })}
              onNavigate={setCurrentPath}
            />
          </RoleGuard>
        );

      case '/products':
        return (
          <RoleGuard path="/products" onNavigate={setCurrentPath}>
            <ProductsPage
              onOpenProductModal={(p) => setEditingProduct({ show: true, product: p })}
            />
          </RoleGuard>
        );

      case '/brands':
        return (
          <RoleGuard path="/brands" onNavigate={setCurrentPath}>
            <BrandsPage
              onOpenBrandModal={() => setShowBrandModal(true)}
            />
          </RoleGuard>
        );

      case '/offers':
        return (
          <RoleGuard path="/offers" onNavigate={setCurrentPath}>
            <OffersPage
              onOpenOfferModal={() => setShowOfferModal(true)}
            />
          </RoleGuard>
        );

      case '/reports':
        return (
          <RoleGuard path="/reports" onNavigate={setCurrentPath}>
            <ReportsPage />
          </RoleGuard>
        );

      case '/admin-users':
        return (
          <RoleGuard path="/admin-users" onNavigate={setCurrentPath}>
            <AdminUsersPage
              onOpenApproveModal={(user) => setApprovingAdminUser(user)}
            />
          </RoleGuard>
        );

      case '/settings':
        return (
          <RoleGuard path="/settings" onNavigate={setCurrentPath}>
            <SettingsPage />
          </RoleGuard>
        );

      default:
        return (
          <RoleGuard path="/dashboard" onNavigate={setCurrentPath}>
            <DashboardPage
              onNavigate={setCurrentPath}
              onOpenOrderModal={() => setShowAddOrderModal(true)}
              onSelectOrder={setSelectedOrderId}
            />
          </RoleGuard>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f6fafe] text-[#171c1f] font-['Vazirmatn',sans-serif]">
      {/* Top Header */}
      <Header onNavigate={setCurrentPath} />

      {/* Mobile Menu Toggle Button */}
      {currentUser && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between sticky top-16 z-20 shadow-xs">
          <button
            onClick={() => setIsOpenMobileSidebar(!isOpenMobileSidebar)}
            className="flex items-center gap-2 text-xs font-bold text-[#006c4a] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
          >
            <Menu className="w-4 h-4" />
            <span>منوی بخش‌ها</span>
          </button>
          <span className="text-xs font-bold text-slate-700">سیلانه سبز پلاس</span>
        </div>
      )}

      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto flex items-start">
        {currentUser && (
          <Sidebar
            currentPath={currentPath}
            onNavigate={setCurrentPath}
            isOpenMobile={isOpenMobileSidebar}
            setIsOpenMobile={setIsOpenMobileSidebar}
          />
        )}

        <main className="flex-1 p-4 md:p-6 min-w-0 overflow-hidden">
          {renderMainContent()}
        </main>
      </div>

      {/* Global Modals */}
      {selectedOrderId !== null && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
          onUpdateStatus={updateOrderStatus}
        />
      )}

      {showAddOrderModal && (
        <AddOrderModal
          onClose={() => setShowAddOrderModal(false)}
        />
      )}

      {editingCustomer.show && (
        <CustomerModal
          customer={editingCustomer.customer}
          onClose={() => setEditingCustomer({ show: false })}
        />
      )}

      {editingMarketer.show && (
        <MarketerModal
          marketer={editingMarketer.marketer}
          onClose={() => setEditingMarketer({ show: false })}
        />
      )}

      {approvingAdminUser && (
        <ApproveAdminModal
          adminUser={approvingAdminUser}
          onClose={() => setApprovingAdminUser(null)}
        />
      )}

      {editingProduct.show && (
        <ProductModal
          product={editingProduct.product}
          onClose={() => setEditingProduct({ show: false })}
        />
      )}

      {showBrandModal && (
        <BrandModal
          onClose={() => setShowBrandModal(false)}
        />
      )}

      {showOfferModal && (
        <OfferModal
          onClose={() => setShowOfferModal(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
