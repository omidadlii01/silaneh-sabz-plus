import React from 'react';
import {
  Store,
  User,
  Phone,
  MapPin,
  Building2,
  ShieldCheck,
  LogOut,
  UserCheck,
  Hash,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AccountView: React.FC = () => {
  const { currentCustomer, setIsAdmin, logout, navigateTo } = useApp();

  const handleSwitchToAdmin = () => {
    setIsAdmin(true);
    navigateTo('admin');
  };

  return (
    <div className="pb-20 pt-3 px-3 sm:px-4 max-w-md mx-auto space-y-4">
      {/* User Header Profile Card */}
      <div className="bg-gradient-to-l from-emerald-900 to-emerald-800 text-white p-5 rounded-3xl shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-700/80 border border-emerald-500/30 flex items-center justify-center text-emerald-100 font-bold text-xl shadow-xs">
            <Store className="w-7 h-7 text-emerald-300" />
          </div>

          <div>
            <span className="text-[10px] bg-emerald-700/60 text-emerald-200 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-600/40">
              {currentCustomer.businessType}
            </span>
            <h2 className="text-base font-extrabold mt-1">{currentCustomer.storeName}</h2>
            <p className="text-xs text-emerald-200">{currentCustomer.ownerName}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-emerald-700/60 flex items-center justify-between text-xs text-emerald-100">
          <span className="flex items-center gap-1 font-mono">
            <Hash className="w-3.5 h-3.5 text-emerald-400" />
            کد مشتری: {currentCustomer.code}
          </span>
          <span className="bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded-md font-bold">
            حساب فعال
          </span>
        </div>
      </div>

      {/* Profile Details List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <User className="w-4 h-4 text-emerald-700" />
          مشخصات ثبت‌شده مرکز و مدیر
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              نام:
            </span>
            <span className="font-bold text-slate-800">
              {currentCustomer.firstName || currentCustomer.ownerName.split(' ')[0] || '---'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              نام خانوادگی:
            </span>
            <span className="font-bold text-slate-800">
              {currentCustomer.lastName || currentCustomer.ownerName.split(' ').slice(1).join(' ') || '---'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              نام فروشگاه / مغازه:
            </span>
            <span className="font-bold text-slate-800">{currentCustomer.storeName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              نوع فعالیت:
            </span>
            <span className="font-bold text-slate-800">{currentCustomer.businessType}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              شماره همراه مدیر:
            </span>
            <span className="font-bold text-slate-800 dir-ltr">{currentCustomer.phone}</span>
          </div>

          {currentCustomer.password && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                رمز عبور:
              </span>
              <span className="font-bold text-slate-800 font-mono">••••••••</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100">
            <span className="text-slate-500 block mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              آدرس تحویل کالا (فروشگاه / مغازه):
            </span>
            <p className="text-slate-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
              {currentCustomer.address}
            </p>
          </div>
        </div>
      </div>

      {/* Marketer Details Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-700 block font-medium">ویزیتور اختصاصی شما</span>
            <span className="font-extrabold text-emerald-950">{currentCustomer.marketerName}</span>
          </div>
        </div>

        <a
          href={`tel:${currentCustomer.marketerPhone}`}
          className="bg-white text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1 text-[11px]"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>تماس</span>
        </a>
      </div>

      {/* Admin Switcher Card */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>بخش مدیریت و کارشناسان فروش</span>
        </div>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          جهت مشاهده آمار کلی، تغییر وضعیت سفارشات، ویرایش قیمت‌ها و موجودی انبار وارد پنل مدیریت شوید.
        </p>
        <button
          onClick={handleSwitchToAdmin}
          className="w-full mt-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>ورود به پنل مدیریت سیلانه سبز</span>
        </button>
      </div>

      {/* Logout Button (Red) */}
      <button
        onClick={logout}
        className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-2xl border border-rose-200 active:scale-98 transition-all flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span>خروج از حساب کاربری</span>
      </button>
    </div>
  );
};
