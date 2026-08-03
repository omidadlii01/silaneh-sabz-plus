// src/components/MainHeader.tsx
import React from 'react';
import { Bell, User } from 'lucide-react';

export interface MainHeaderProps {
  appName?: string;
  unreadNotifications?: boolean;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  appName = 'سیلانه سبز',
  unreadNotifications = true,
  onNotificationClick,
  onProfileClick,
}) => {
  return (
    <header className="glass-header sticky top-0 z-50 px-4 py-3 flex items-center justify-between text-white shadow-xs">
      {/* Brand Logo / Title */}
      <div className="flex flex-col">
        <span className="text-xl font-black tracking-tight">{appName}</span>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onNotificationClick || (() => {/* TODO: wire navigation */})}
          aria-label="اعلان‌ها"
          className="relative p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95"
        >
          <Bell className="h-6 w-6" />
          {unreadNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-emerald-800" />
          )}
        </button>

        <button
          type="button"
          onClick={onProfileClick || (() => {/* TODO: wire navigation */})}
          aria-label="پروفایل کاربر"
          className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95"
        >
          <User className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default MainHeader;
