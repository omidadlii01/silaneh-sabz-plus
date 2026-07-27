import React, { useState } from 'react';
import { Phone, ArrowLeft, User, Lock, Store, MapPin, UserPlus, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BusinessType } from '../types';
import { SeylanehLogo } from '../components/SeylanehLogo';

export const LoginView: React.FC = () => {
  const { login, signup } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Login form state
  const [phoneNumber, setPhoneNumber] = useState('۰۹۱۲۳۴۵۶۷۸۹');
  const [loginError, setLoginError] = useState('');

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    storeName: '',
    businessType: 'داروخانه' as BusinessType,
    address: '',
  });
  const [signupError, setSignupError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setLoginError('لطفاً شماره تلفن همراه خود را وارد کنید.');
      return;
    }
    setLoginError('');
    login(phoneNumber);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, phone, storeName, address } = signupForm;

    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !storeName.trim() || !address.trim()) {
      setSignupError('لطفاً تمامی فیلدهای الزامی را تکمیل نمایید.');
      return;
    }

    setSignupError('');
    signup({
      firstName: signupForm.firstName.trim(),
      lastName: signupForm.lastName.trim(),
      phone: signupForm.phone.trim(),
      password: signupForm.password.trim(),
      storeName: signupForm.storeName.trim(),
      address: signupForm.address.trim(),
      businessType: signupForm.businessType,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white flex flex-col justify-between p-4 sm:p-6">
      {/* Top Branding Header */}
      <div className="pt-6 text-center flex flex-col items-center">
        <div className="bg-white p-3.5 rounded-3xl shadow-xl mb-3">
          <SeylanehLogo className="h-12" />
        </div>
        <h1 className="text-xl font-black text-white tracking-tight">سامانه سفارش‌دهی عمده هلدینگ سیلانه سبز</h1>
        <p className="text-emerald-300/90 text-xs mt-1 font-medium max-w-xs">
          تأمین مستقیم محصولات آرایشی، بهداشتی و دارویی
        </p>
      </div>

      {/* Main Form Container Card */}
      <div className="w-full max-w-sm mx-auto my-auto bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 text-slate-800 shadow-2xl border border-emerald-800/30">
        {/* Toggle Mode Buttons: "ورود" and "ثبت‌نام" */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => setMode('login')}
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
            onClick={() => setMode('signup')}
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
              <h2 className="text-base font-extrabold text-slate-900">ورود به حساب همکاری</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                جهت ثبت و مشاهده سفارش‌های عمده داروخانه‌ها و فروشگاه‌ها
              </p>
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
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3.5 py-3 pr-10 text-slate-900 text-sm font-semibold tracking-wider placeholder:text-slate-400 outline-none transition-all"
                    dir="ltr"
                  />
                  <Phone className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
                </div>
                {loginError && <p className="text-xs text-rose-600 mt-1 font-medium">{loginError}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3.5 px-4 rounded-xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 text-sm mt-2"
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
                تکمیل اطلاعات جهت ایجاد حساب کاربری و دریافت شرایط همکاری عمده
              </p>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-3">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    نام <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={signupForm.firstName}
                    onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                    placeholder="علی"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    نام خانوادگی <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={signupForm.lastName}
                    onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                    placeholder="رضایی"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-900 outline-none"
                  />
                </div>
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
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 pr-9 text-xs font-semibold text-slate-900 outline-none"
                    dir="ltr"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  رمز عبور
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 pr-9 text-xs font-semibold text-slate-900 outline-none"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
                </div>
              </div>

              {/* Shop Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  نام فروشگاه / مغازه / داروخانه <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={signupForm.storeName}
                    onChange={(e) => setSignupForm({ ...signupForm, storeName: e.target.value })}
                    placeholder="داروخانه دکتر رضایی"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 pr-9 text-xs font-semibold text-slate-900 outline-none"
                  />
                  <Store className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
                </div>
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">نوع فعالیت</label>
                <select
                  value={signupForm.businessType}
                  onChange={(e) => setSignupForm({ ...signupForm, businessType: e.target.value as BusinessType })}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none"
                >
                  <option value="داروخانه">داروخانه</option>
                  <option value="فروشگاه آرایشی و بهداشتی">فروشگاه آرایشی و بهداشتی</option>
                  <option value="سوپرمارکت">سوپرمارکت</option>
                  <option value="هایپرمارکت">هایپرمارکت</option>
                  <option value="گالری زیبایی">گالری زیبایی</option>
                </select>
              </div>

              {/* Shop Address */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  آدرس فروشگاه / مغازه <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={signupForm.address}
                    onChange={(e) => setSignupForm({ ...signupForm, address: e.target.value })}
                    placeholder="تهران، خیابان ولیعصر، بالاتر از میدان ونک..."
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none resize-none"
                  />
                </div>
              </div>

              {signupError && <p className="text-xs text-rose-600 font-medium pt-1">{signupError}</p>}

              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 text-xs mt-3"
              >
                <span>ثبت‌نام و ورود به سامانه</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer copyright */}
      <div className="text-center pb-4 text-[11px] text-emerald-400/80 font-medium">
        © تمامی حقوق متعلق به گروه کارخانجات سیلانه سبز می‌باشد.
      </div>
    </div>
  );
};

