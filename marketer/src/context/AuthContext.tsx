import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Marketer, MarketerSignupData } from '../types';
import { apiService } from '../services/api';

export interface LoginResult {
  success: boolean;
  error?: string;
  code?: string;
}

export interface SignupResult {
  success: boolean;
  message?: string;
  error?: string;
}

interface AuthContextType {
  marketer: Marketer | null;
  token: string | null;
  isAuthenticated: boolean;
  /** True only while the app is restoring a saved session on first load. */
  isLoading: boolean;
  /** True only while a login/signup submission is in flight. */
  isAuthLoading: boolean;
  apiBaseUrl: string;
  justSignedUp: boolean;
  clearJustSignedUp: () => void;
  login: (phone: string, password?: string) => Promise<LoginResult>;
  signup: (data: MarketerSignupData) => Promise<SignupResult>;
  logout: () => void;
  updateProfile: (data: Partial<Marketer>) => void;
  setApiBaseUrl: (url: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'silaneh_auth_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [marketer, setMarketer] = useState<Marketer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [apiBaseUrl, setApiBaseUrlState] = useState<string>(apiService.getBaseUrl());
  const [justSignedUp, setJustSignedUp] = useState(false);

  useEffect(() => {
    // Restore session if available
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed.marketer && parsed.token) {
          // Pending-approval marketers (active === false/0) keep their
          // session too — the app shows them a locked screen instead of
          // logging them out on every reload.
          const { password: _p, ...safeMarketer } = parsed.marketer;
          setMarketer(safeMarketer as Marketer);
          setToken(parsed.token);
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error('Failed restoring auth session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (phone: string, password?: string): Promise<LoginResult> => {
    setIsAuthLoading(true);
    try {
      const res = await apiService.loginMarketer(phone, password);
      const { password: _p, ...safeMarketer } = res.marketer as unknown as { password?: unknown; [key: string]: unknown };
      const cleanMarketer = safeMarketer as unknown as Marketer;
      setMarketer(cleanMarketer);
      setToken(res.token);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ marketer: cleanMarketer, token: res.token }));
      return { success: true };
    } catch (err: unknown) {
      console.error('Login failed', err);
      const errObj = err as { message?: string; code?: string };
      return {
        success: false,
        error: errObj?.message || 'ورود با خطا مواجه شد. لطفاً مجدداً بررسی نمایید.',
        code: errObj?.code || 'LOGIN_FAILED',
      };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signup = async (data: MarketerSignupData): Promise<SignupResult> => {
    setIsAuthLoading(true);
    try {
      const res = await apiService.signupMarketer(data);
      // Auto-login immediately after a successful signup so the marketer
      // enters the app right away instead of having to log in separately.
      // The account is still inactive/pending at this point — the app will
      // show a locked screen (see PendingLockScreen) until an admin approves it.
      // NOTE: login() never throws — it always resolves with {success, error?}
      // — so its outcome must be checked explicitly here rather than relying
      // on try/catch (a try/catch around it would never catch anything).
      const loginResult = await login(data.phone, data.password);
      if (loginResult.success) {
        setJustSignedUp(true);
      } else {
        // Signup itself succeeded even if the immediate auto-login failed —
        // the user can still log in manually with the phone/password they set.
        console.warn('Auto-login after signup failed', loginResult.error);
      }
      return { success: true, message: res.message };
    } catch (err: unknown) {
      console.error('Signup failed', err);
      const errObj = err as { message?: string };
      return {
        success: false,
        error: errObj?.message || 'ثبت‌نام با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.',
      };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const clearJustSignedUp = () => setJustSignedUp(false);

  const logout = () => {
    setMarketer(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateProfile = (data: Partial<Marketer>) => {
    if (!marketer) return;
    const updated = { ...marketer, ...data };
    const { password: _p, ...safeMarketer } = updated as unknown as { password?: unknown; [key: string]: unknown };
    const cleanMarketer = safeMarketer as unknown as Marketer;
    setMarketer(cleanMarketer);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ marketer: cleanMarketer, token }));
  };

  const setApiBaseUrl = (url: string) => {
    apiService.setBaseUrl(url);
    setApiBaseUrlState(url);
  };

  return (
    <AuthContext.Provider
      value={{
        marketer,
        token,
        isAuthenticated: !!marketer,
        isLoading,
        isAuthLoading,
        apiBaseUrl,
        justSignedUp,
        clearJustSignedUp,
        login,
        signup,
        logout,
        updateProfile,
        setApiBaseUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
