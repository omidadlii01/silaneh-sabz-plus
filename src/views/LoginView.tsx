import React, { useState } from 'react';
import { Phone, ArrowLeft, Store, UserPlus, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BusinessType } from '../types';
import { SeylanehLogo } from '../components/SeylanehLogo';

export const LoginView: React.FC = () => {
  const { login, signup } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [hasInteracted, setHasInteracted] = useState(false);

  const selectMode = (m: 'login' | 'signup') => {
    setMode(m);
    setHasInteracted(true);
  };

  // Login form state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    ownerName: '',
    phone: '',
    storeName: '',
    businessType: 'داروخانه' as BusinessType,
    referralCode: '',
    agreed: false,
  });
  const [signupError, setSignupError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setLoginError('لطفاً شماره تلفن همراه خود را وارد کنید.');
      return;
    }
    setLoginError('');
    setIsSubmitting(true);
    try {
      await login(phoneNumber.trim());
    } catch (err: any) {
      setLoginError(err?.message || 'خطا در ورود. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSignupComplete =
    signupForm.ownerName.trim() &&
    signupForm.phone.trim() &&
    signupForm.storeName.trim() &&
    signupForm.agreed;

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignupComplete) {
      setSignupError('لطفاً تمامی فیلدهای الزامی را تکمیل و قوانین را تأیید نمایید.');
      return;
    }

    // Split the single "owner full name" field into first/last name for the API.
    const trimmedName = signupForm.ownerName.trim();
    const spaceIdx = trimmedName.indexOf(' ');
    const firstName = spaceIdx === -1 ? trimmedName : trimmedName.slice(0, spaceIdx);
    const lastName = spaceIdx === -1 ? '' : trimmedName.slice(spaceIdx + 1).trim();

    setSignupError('');
    setIsSubmitting(true);
    try {
      await signup({
        firstName,
        lastName: lastName || firstName,
        phone: signupForm.phone.trim(),
        storeName: signupForm.storeName.trim(),
        address: '',
        businessType: signupForm.businessType,
      });
    } catch (err: any) {
      setSignupError(err?.message || 'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white flex flex-col justify-center p-4 sm:p-6">
      {/* Top Branding Header — logo & wordmark rendered white, "etched" onto the background, no white box */}
      {!hasInteracted && (
        <div className="pt-6 pb-4 text-center flex flex-col items-center">
          <SeylanehLogo className="h-14 mb-3 brightness-0 invert opacity-90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]" />
          <h1 className="text-xl font-black text-white tracking-tight">سامانه سفارش‌دهی سیلانه سبز</h1>
          <p className="text-emerald-300/90 text-xs mt-1 font-medium max-w-xs">
            سفارش عمده تمامی محصولات هلدینگ سیلانه سبز
          </p>
        </div>
      )}

      {/* Main Form Container Card */}
      <div className="w-full max-w-sm mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 text-slate-800 shadow-2xl border border-emerald-800/30">
        {/* Toggle Mode Buttons: "ورود" and "ثبت‌نام" */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => selectMode('login')}
            className={`py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>ورود</span>
          </button>

          <button
            type="button"
            onClick={() => selectMode('signup')}
            className={`py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>ثبت‌نام</span>
          </button>
        </div>

        {mode === 'login' ? (
          <div>
            <div className="mb-4">
              <h2 className="text-base font-extrabold text-slate-900">ورود به حساب کاربری</h2>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  شماره تلفن همراه (مدیر فروشگاه / داروخانه)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="۰۹۱۲ ‑ ‑ ‑ ‑ ‑ ‑ ‑ (نمونه)"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3.5 py-3 pr-10 text-slate-900 text-sm font-semibold tracking-wider placeholder:text-slate-300 placeholder:font-normal outline-none transition-all"
                    dir="ltr"
                  />
                  <Phone className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
                </div>
                {loginError && <p className="text-xs text-rose-600 mt-1 font-medium">{loginError}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white font-bold py-3.5 px-4 rounded-xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 text-sm mt-2"
              >
                <span>ورود به حساب کاربری</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h2 className="text-base font-extrabold text-slate-900">ثبت‌نام همکار جدید</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                لطفا اطلاعات زیر را جهت ایجاد حساب کاربری و دریافت شرایط همکاری عمده کامل کنید
              </p>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-3">
              {/* Owner full name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  نام و نام خانوادگی مالک فروشگاه <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={signupForm.ownerName}
                  onChange={(e) => setSignupForm({ ...signupForm, ownerName: e.target.value })}
                  placeholder="علی رضایی"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  شماره تماس <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2.5 pr-9 text-xs font-semibold text-slate-900 outline-none"
                    dir="ltr"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-2.5 top-3" />
                </div>
              </div>

              {/* Shop Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  نام فروشگاه <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={signupForm.storeName}
                    onChange={(e) => setSignupForm({ ...signupForm, storeName: e.target.value })}
                    placeholder="داروخانه دکتر رضایی"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2.5 pr-9 text-xs font-semibold text-slate-900 outline-none"
                  />
                  <Store className="w-4 h-4 text-slate-400 absolute right-2.5 top-3" />
                </div>
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  نوع فروشگاه <span className="text-rose-500">*</span>
                </label>
                <select
                  value={signupForm.businessType}
                  onChange={(e) => setSignupForm({ ...signupForm, businessType: e.target.value as BusinessType })}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none"
                >
                  <option value="داروخانه">داروخانه</option>
                  <option value="فروشگاه آرایشی و بهداشتی">فروشگاه آرایشی و بهداشتی</option>
                  <option value="سوپرمارکت">سوپرمارکت</option>
                  <option value="هایپرمارکت">هایپرمارکت</option>
                  <option value="گالری زیبایی">گالری زیبایی</option>
                </select>
              </div>

              {/* Referral Code (optional) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">کد معرف (اختیاری)</label>
                <input
                  type="text"
                  value={signupForm.referralCode}
                  onChange={(e) => setSignupForm({ ...signupForm, referralCode: e.target.value })}
                  placeholder="کد معرف خود را وارد کنید"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none"
                />
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={signupForm.agreed}
                  onChange={(e) => setSignupForm({ ...signupForm, agreed: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                />
                <span className="text-[11px] font-semibold text-slate-600">
                  با قوانین و مقررات سیلانه سبز موافقم
                </span>
              </label>

              {signupError && <p className="text-xs text-rose-600 font-medium pt-1">{signupError}</p>}

              <button
                type="submit"
                disabled={!isSignupComplete || isSubmitting}
                className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 text-xs mt-3"
              >
                <span>ثبت‌نام و ورود به سامانه</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer copyright */}
      <div className="text-center pt-4 text-[11px] text-emerald-400/80 font-medium">
        © تمامی حقوق متعلق به گروه کارخانجات سیلانه سبز می‌باشد.
      </div>
    </div>
  );
};
