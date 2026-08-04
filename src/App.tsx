import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LoginView } from './views/LoginView';
import { HomeView } from './views/HomeView';
import { ProductsView } from './views/ProductsView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderSuccessView } from './views/OrderSuccessView';
import { MyOrdersView } from './views/MyOrdersView';
import { VisitorView } from './views/VisitorView';
import { AccountView } from './views/AccountView';
import { AdminView } from './views/AdminView';

const MainContent: React.FC = () => {
  const { viewScreen, isAdmin } = useApp();

  if (viewScreen === 'login') {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans flex flex-col justify-between selection:bg-emerald-200">
      <Header />

      <main className="flex-1 w-full max-w-md mx-auto">
        {isAdmin && viewScreen === 'admin' ? (
          <AdminView />
        ) : (
          <>
            {viewScreen === 'home' && <HomeView />}
            {viewScreen === 'products' && <ProductsView />}
            {viewScreen === 'product-detail' && <ProductDetailView />}
            {viewScreen === 'cart' && <CartView />}
            {viewScreen === 'checkout' && <CheckoutView />}
            {viewScreen === 'order-success' && <OrderSuccessView />}
            {viewScreen === 'my-orders' && <MyOrdersView />}
            {viewScreen === 'visitor' && <VisitorView />}
            {viewScreen === 'account' && <AccountView />}
            {viewScreen === 'admin' && <AdminView />}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
