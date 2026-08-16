import React, { useState } from 'react';
import { toPersianDigits } from '../utils/persian';
import { apiLogin, apiSignup, Customer, BusinessType } from '../api';

interface AuthViewProps {
  onLoginSuccess: (customer: Customer) => void;
  onClose?: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLoginSuccess,
  onClose,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [step, setStep] = useState<'form' | 'otp'>('form');

  // Login form state - initial empty state for faint gray placeholder
  const [loginPhone, setLoginPhone] = useState('');

  // Register form state - initial empty states for faint gray placeholders
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regStoreName, setRegStoreName] = useState('');
  const [regStoreType, setRegStoreType] = useState('داروخانه');
  const [regReferral, setRegReferral] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // OTP state
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Holds the customer record once signup has actually succeeded against the
  // server (register flow calls the real API on form submit, not on OTP
  // confirm — see handleRegisterSubmit). This prevents the previous bug
  // where a customer could fill the form, see the app move on to the OTP
  // screen, then abandon/close before "confirming" — silently losing their
  // registration because the real API call hadn't happened yet.
  const [pendingCustomer, setPendingCustomer] = useState<Customer | null>(null);

  // Start OTP Countdown timer when entering OTP step
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = loginPhone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('لطفاً شماره تلفن همراه معتبر (۱۱ رقم) وارد نمایید.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setOtpTimer(60);
    }, 800);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regName.trim()) {
      setErrorMessage('لطفاً نام و نام خانوادگی مالک فروشگاه را وارد نمایید.');
      return;
    }
    if (!regPhone.trim() || regPhone.length < 10) {
      setErrorMessage('لطفاً شماره تماس معتبر وارد نمایید.');
      return;
    }
    if (!regStoreName.trim()) {
      setErrorMessage('لطفاً نام فروشگاه یا داروخانه را وارد نمایید.');
      return;
    }
    if (!agreedTerms) {
      setErrorMessage('لطفاً موافقت خود با قوانین و مقررات را تأیید نمایید.');
      return;
    }

    setIsLoading(true);

    // Register the customer with the server right away, on form submit —
    // NOT after the (non-functional) OTP step. This is the real network
    // call; if it fails (duplicate phone, network error, etc.) the person
    // sees the actual error immediately and stays on the form instead of
    // being moved forward to an OTP screen that would otherwise falsely
    // suggest the account had already been created.
    (async () => {
      try {
        const [firstName, ...rest] = regName.trim().split(/\s+/);
        const lastName = rest.join(' ') || firstName;
        const customer = await apiSignup({
          firstName,
          lastName,
          phone: regPhone.trim(),
          storeName: regStoreName.trim(),
          businessType: regStoreType as BusinessType,
          address: '',
        });
        setPendingCustomer(customer);
        setIsLoading(false);
        setStep('otp');
        setOtpTimer(60);
      } catch (err) {
        setIsLoading(false);
        setErrorMessage(err instanceof Error ? err.message : 'خطا در ارتباط با سرور. دوباره تلاش کنید.');
      }
    })();
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    (async () => {
      try {
        // Register flow: the account was already created server-side in
        // handleRegisterSubmit, so this step just finalizes local login —
        // no second network call, no risk of duplicate/lost signups.
        if (mode === 'register' && pendingCustomer) {
          setIsLoading(false);
          onLoginSuccess(pendingCustomer);
          return;
        }

        const customer = await apiLogin(loginPhone.trim());
        setIsLoading(false);
        onLoginSuccess(customer);
      } catch (err) {
        setIsLoading(false);
        setStep('form');
        setErrorMessage(err instanceof Error ? err.message : 'خطا در ارتباط با سرور. دوباره تلاش کنید.');
      }
    })();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#002e21] flex flex-col items-center justify-between px-4 overflow-y-auto selection:bg-[#34d399] selection:text-[#002e21] text-right font-['Vazirmatn']"
      style={{
        paddingTop: 'calc(1rem + env(safe-area-inset-top))',
        paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
      }}
    >
      {/* Background Decorative Gradient Light Spheres */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-[radial-gradient(circle_at_center,rgba(5,150,105,0.25)_0,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.15)_0,transparent_70%)] pointer-events-none" />

      {/* Center Container: Logo & App Title */}
      <div className="w-full max-w-[420px] my-auto flex flex-col items-center z-10 py-6">
        {/* Seylaneh Sabz Official Brand Logo matching the user's uploaded image */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex items-center justify-center gap-3.5 mb-2 py-1 px-3 drop-shadow-md" dir="ltr">
            {/* Left Wing / Leaf / Drop Logo Symbol */}
            <svg viewBox="0 0 160 85" className="w-16 h-12 fill-white shrink-0">
              <path d="M70 14 C50 0 22 8 6 34 C25 32 40 44 54 58 C58 62 62 66 62 66 C62 66 66 62 70 58 C84 44 98 32 118 34 C102 8 74 0 70 14 Z" />
              <path d="M62 66 C52 52 30 46 16 66 C32 66 44 76 56 84 C60 87 60 87 60 87 C60 87 60 87 64 84 C76 76 88 66 104 66 C90 46 68 52 62 66 Z" />
              <path d="M62 18 C58 28 52 36 52 42 C52 48 56 52 62 52 C68 52 72 48 72 42 C72 36 66 28 62 18 Z" />
            </svg>

            {/* Right Side English Text Stack */}
            <div className="text-left flex flex-col justify-center leading-none text-white tracking-widest font-sans border-l-2 border-white/30 pl-3.5">
              <span className="text-[8.5px] font-bold tracking-[0.24em] text-white/90 uppercase block mb-1">
                PRODUCTION &amp; TRADE
              </span>
              <span className="text-[20px] font-black tracking-widest block leading-none">
                SEYLANEH
              </span>
              <span className="text-[20px] font-black tracking-widest block leading-tight mt-0.5">
                SABZ
              </span>
            </div>
          </div>

          <h1 className="text-[21px] font-black text-white tracking-tight drop-shadow-sm mt-1">
            سامانه سفارش‌دهی سیلانه سبز
          </h1>
          <p className="text-[12.5px] font-bold text-[#6ee7b7] mt-1">
            سفارش عمده تمامی محصولات هلدینگ سیلانه سبز
          </p>
        </div>

        {/* Auth Card Container */}
        <div className="w-full bg-[#f4f7f5] rounded-[30px] p-5 sm:p-6 shadow-2xl border border-white/40 backdrop-blur-xl relative overflow-hidden">
          {/* Step 1: Login / Register Form */}
          {step === 'form' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Tab Switcher */}
              <div className="bg-[#e2e8e4] p-1.5 rounded-2xl flex items-center justify-between gap-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-black text-[13px] transition-all duration-200 flex items-center justify-center gap-2 ${
                    mode === 'login'
                      ? 'bg-[#004532] text-white shadow-md'
                      : 'text-[#526058] hover:text-[#002e21]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>ورود</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-black text-[13px] transition-all duration-200 flex items-center justify-center gap-2 ${
                    mode === 'register'
                      ? 'bg-[#004532] text-white shadow-md'
                      : 'text-[#526058] hover:text-[#002e21]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span>ثبت‌نام</span>
                </button>
              </div>

              {/* Form Title & Description */}
              <div className="pt-1">
                <h2 className="text-[17.5px] font-black text-[#0f172a]">
                  {mode === 'login' ? 'ورود به حساب کاربری' : 'ثبت‌نام همکار جدید'}
                </h2>
                <p className="text-[11.5px] font-extrabold text-[#64748b] mt-0.5 leading-relaxed">
                  {mode === 'login'
                    ? 'جهت ورود به پنل سفارش‌دهی عمده، شماره همراه خود را وارد کنید.'
                    : 'لطفا اطلاعات زیر را جهت ایجاد حساب کاربری و دریافت شرایط همکاری عمده کامل کنید'}
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] p-3 rounded-2xl text-[12px] font-black flex items-center gap-2 animate-in slide-in-from-top duration-200">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* MODE 1: LOGIN FORM */}
              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-black text-[#334155] block">
                      شماره تلفن همراه (مدیر فروشگاه / داروخانه)
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="tel"
                        dir="ltr"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        placeholder="0992*******"
                        className="w-full bg-white border border-[#cbd5e1] rounded-2xl py-3.5 pl-4 pr-11 text-[14px] font-black text-[#0f172a] placeholder-[#94a3b8] focus:outline-hidden focus:border-[#059669] focus:ring-3 focus:ring-[#059669]/15 shadow-2xs transition-all"
                      />
                      <span className="material-symbols-outlined absolute right-3.5 text-[#64748b] text-[20px] pointer-events-none">
                        call
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-[#004532] hover:bg-[#022c22] text-white font-black text-[14px] rounded-2xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-[#059669]/20"
                  >
                    {isLoading ? (
                      <span className="material-symbols-outlined text-[20px] animate-spin">
                        progress_activity
                      </span>
                    ) : (
                      <>
                        <span>ورود به حساب کاربری</span>
                        <span className="material-symbols-outlined text-[20px] rotate-180">
                          arrow_back
                        </span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* MODE 2: REGISTER FORM */
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5 pt-1">
                  {/* Field 1: Full Name */}
                  <div className="space-y-1">
                    <label className="text-[12px] font-black text-[#334155] flex items-center gap-1">
                      <span>نام و نام خانوادگی مالک فروشگاه</span>
                      <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="علی رضایی"
                      className="w-full bg-white border border-[#cbd5e1] rounded-2xl p-3 text-[13px] font-extrabold text-[#0f172a] placeholder-[#94a3b8] focus:outline-hidden focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/15 shadow-2xs transition-all"
                    />
                  </div>

                  {/* Field 2: Phone */}
                  <div className="space-y-1">
                    <label className="text-[12px] font-black text-[#334155] flex items-center gap-1">
                      <span>شماره تماس</span>
                      <span className="text-[#dc2626]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="tel"
                        dir="ltr"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="09123456789"
                        className="w-full bg-white border border-[#cbd5e1] rounded-2xl p-3 pr-10 text-[13px] font-black text-[#0f172a] placeholder-[#94a3b8] focus:outline-hidden focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/15 shadow-2xs transition-all"
                      />
                      <span className="material-symbols-outlined absolute right-3 text-[#64748b] text-[18px]">
                        call
                      </span>
                    </div>
                  </div>

                  {/* Field 3: Store Name */}
                  <div className="space-y-1">
                    <label className="text-[12px] font-black text-[#334155] flex items-center gap-1">
                      <span>نام فروشگاه</span>
                      <span className="text-[#dc2626]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={regStoreName}
                        onChange={(e) => setRegStoreName(e.target.value)}
                        placeholder="داروخانه دکتر رضایی"
                        className="w-full bg-white border border-[#cbd5e1] rounded-2xl p-3 pr-10 text-[13px] font-extrabold text-[#0f172a] placeholder-[#94a3b8] focus:outline-hidden focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/15 shadow-2xs transition-all"
                      />
                      <span className="material-symbols-outlined absolute right-3 text-[#64748b] text-[18px]">
                        storefront
                      </span>
                    </div>
                  </div>

                  {/* Field 4: Store Type Select */}
                  <div className="space-y-1">
                    <label className="text-[12px] font-black text-[#334155] flex items-center gap-1">
                      <span>نوع فروشگاه</span>
                      <span className="text-[#dc2626]">*</span>
                    </label>
                    <select
                      value={regStoreType}
                      onChange={(e) => setRegStoreType(e.target.value)}
                      className="w-full bg-white border border-[#cbd5e1] rounded-2xl p-3 text-[13px] font-black text-[#0f172a] focus:outline-hidden focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/15 shadow-2xs transition-all cursor-pointer"
                    >
                      <option value="داروخانه">داروخانه</option>
                      <option value="گالری آرایشی و بهداشتی">گالری آرایشی و بهداشتی</option>
                      <option value="فروشگاه زنجیره‌ای">فروشگاه زنجیره‌ای</option>
                      <option value="عمده‌فروشی / بنکداری">عمده‌فروشی / بنکداری</option>
                      <option value="سایر">سایر موارد</option>
                    </select>
                  </div>

                  {/* Field 5: Referral Code */}
                  <div className="space-y-1">
                    <label className="text-[12px] font-black text-[#334155]">
                      کد معرف (اختیاری)
                    </label>
                    <input
                      type="text"
                      value={regReferral}
                      onChange={(e) => setRegReferral(e.target.value)}
                      placeholder="کد معرف خود را وارد کنید"
                      className="w-full bg-white border border-[#cbd5e1] rounded-2xl p-3 text-[12.5px] font-medium text-[#0f172a] placeholder-[#94a3b8] focus:outline-hidden focus:border-[#059669] shadow-2xs transition-all"
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="w-4 h-4 text-[#004532] rounded-md border-[#cbd5e1] focus:ring-[#059669]"
                    />
                    <span className="text-[11.5px] font-extrabold text-[#334155]">
                      با <span className="text-[#059669] underline">قوانین و مقررات سیلانه سبز</span> موافقم
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !agreedTerms}
                    className={`w-full py-3.5 font-black text-[13.5px] rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 ${
                      agreedTerms && !isLoading
                        ? 'bg-[#004532] hover:bg-[#022c22] text-white active:scale-[0.98]'
                        : 'bg-[#cbd5e1] text-[#64748b] cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <span className="material-symbols-outlined text-[20px] animate-spin">
                        progress_activity
                      </span>
                    ) : (
                      <>
                        <span>ثبت‌نام و ورود به سامانه</span>
                        <span className="material-symbols-outlined text-[20px] rotate-180">
                          arrow_back
                        </span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Step 2: Interactive OTP Verification Code */}
          {step === 'otp' && (
            <div className="space-y-4 animate-in fade-in duration-300 text-center py-2">
              <div className="w-14 h-14 bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] rounded-2xl mx-auto flex items-center justify-center text-[28px] shadow-xs">
                <span className="material-symbols-outlined">mark_email_read</span>
              </div>

              <div>
                <h3 className="text-[17px] font-black text-[#0f172a]">
                  تأیید شماره تلفن همراه
                </h3>
                <p className="text-[12px] font-extrabold text-[#64748b] mt-1">
                  کد ۴ رقمی ارسال شده به شماره{' '}
                  <span className="text-[#004532] dir-ltr inline-block font-black">
                    {toPersianDigits(mode === 'login' ? loginPhone : regPhone)}
                  </span>{' '}
                  را وارد کنید.
                </p>
              </div>

              {/* 4 Digit OTP Inputs */}
              <div className="flex justify-center gap-3 dir-ltr my-4">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={otpCode[idx]}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-12 h-14 text-center text-[20px] font-black bg-white border-2 border-[#cbd5e1] rounded-2xl text-[#0f172a] focus:border-[#059669] focus:ring-4 focus:ring-[#059669]/15 shadow-2xs outline-hidden"
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                onClick={() => handleVerifyOtp()}
                disabled={isLoading}
                className="w-full py-3.5 bg-[#004532] hover:bg-[#022c22] text-white font-black text-[14px] rounded-2xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined text-[20px] animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <>
                    <span>تأیید و ورود به پنل</span>
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  </>
                )}
              </button>

              {/* Resend Timer & Back Button */}
              <div className="flex items-center justify-between pt-2 text-[11.5px] font-black text-[#64748b]">
                <button
                  onClick={() => setStep('form')}
                  className="text-[#334155] hover:text-[#004532] flex items-center gap-0.5 hover:underline"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                  <span>ویرایش شماره</span>
                </button>

                {otpTimer > 0 ? (
                  <span>ارسال مجدد کد ({toPersianDigits(otpTimer)} ثانیه)</span>
                ) : (
                  <button
                    onClick={() => setOtpTimer(60)}
                    className="text-[#059669] hover:underline"
                  >
                    ارسال مجدد کد SMS
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer copyright */}
      <p className="text-[11.5px] font-bold text-[#6ee7b7]/80 text-center pb-2 z-10">
        © تمامی حقوق متعلق به گروه کارخانجات سیلانه سبز می‌باشد.
      </p>
    </div>
  );
};
