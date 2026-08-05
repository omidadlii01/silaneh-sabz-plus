import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdminUser, AdminRole } from '../types';
import { authApi, clearAuth, getSession, getToken } from '../api';

interface AuthContextType {
  currentUser: AdminUser | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  loginWithToken: (token: string) => Promise<boolean>;
  signup: (firstName: string, lastName: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (path: string) => boolean;
  authError: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const restore = async () => {
      if (getSession() || getToken()) {
        try {
          const res = await authApi.me();
          setCurrentUser(res.adminUser);
        } catch {
          clearAuth();
        }
      }
      setLoading(false);
    };
    restore();
  }, []);

  const login = async (phone: string, password: string): Promise<boolean> => {
    setAuthError('');
    try {
      const user = await authApi.userLogin(phone, password);
      setCurrentUser(user);
      return true;
    } catch (e: any) {
      setAuthError(e.message || 'خطا در ورود');
      return false;
    }
  };

  const loginWithToken = async (token: string): Promise<boolean> => {
    setAuthError('');
    try {
      const user = await authApi.tokenLogin(token);
      setCurrentUser(user as AdminUser);
      return true;
    } catch (e: any) {
      setAuthError(e.message || 'توکن نامعتبر است');
      return false;
    }
  };

  const signup = async (firstName: string, lastName: string, phone: string, password: string): Promise<boolean> => {
    setAuthError('');
    try {
      await authApi.userSignup(firstName, lastName, phone, password);
      // Signup succeeded; log the new (pending) user in right away.
      return await login(phone, password);
    } catch (e: any) {
      setAuthError(e.message || 'خطا در ثبت‌نام');
      return false;
    }
  };

  const logout = () => {
    clearAuth();
    setCurrentUser(null);
  };

  const hasPermission = (path: string): boolean => {
    if (!currentUser) return false;

    if (currentUser.status === 'pending' || !currentUser.role) {
      return path === '/reports' || path === '/dashboard';
    }

    const role: AdminRole = currentUser.role;
    if (role === 'مدیرکل') return true;

    switch (path) {
      case '/':
      case '/dashboard':
      case '/reports':
        return true;
      case '/orders':
      case '/customers':
        return role === 'مدیر فروش';
      case '/products':
      case '/brands':
      case '/offers':
      case '/settings':
        return role === 'مدیر محتوا';
      case '/marketers':
        return role === 'مدیر بازاریابی';
      default:
        if (path.startsWith('/marketers/')) return role === 'مدیر بازاریابی';
        return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, login, loginWithToken, signup, logout, hasPermission, authError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
