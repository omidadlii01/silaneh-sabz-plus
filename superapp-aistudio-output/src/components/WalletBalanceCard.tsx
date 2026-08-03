// src/components/WalletBalanceCard.tsx
import React from 'react';
import { WalletInfo, WalletTab } from '../types';

export interface WalletBalanceCardProps {
  wallet?: WalletInfo;
  onTabChange?: (tab: WalletTab) => void;
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  wallet = {
    balanceFormatted: '۵۰۰,۰۰۰,۰۰۰',
    currency: 'ریال',
    activeTab: 'wallet',
  },
  onTabChange,
}) => {
  const [currentTab, setCurrentTab] = React.useState<WalletTab>(wallet.activeTab);

  const handleTabClick = (tab: WalletTab) => {
    setCurrentTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <section className="wallet-gradient px-6 pt-8 pb-12 rounded-b-[40px] shadow-lg text-center text-white relative">
      <p className="text-emerald-100 text-sm mb-2 font-medium">موجودی کیف پول</p>
      
      {/* Balance Display */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <span className="text-4xl font-bold tracking-wider select-all">
          {wallet.balanceFormatted}
        </span>
        <span className="text-lg opacity-90 font-semibold">{wallet.currency}</span>
      </div>

      {/* Tab Switcher */}
      <div className="bg-black/10 p-1 rounded-2xl flex max-w-sm mx-auto backdrop-blur-xs">
        <button
          type="button"
          onClick={() => handleTabClick('wallet')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
            currentTab === 'wallet'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-emerald-50 opacity-80 hover:opacity-100'
          }`}
        >
          کیف پول
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('credit')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
            currentTab === 'credit'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-emerald-50 opacity-80 hover:opacity-100'
          }`}
        >
          اعتبار
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('investment')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
            currentTab === 'investment'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-emerald-50 opacity-80 hover:opacity-100'
          }`}
        >
          سرمایه
        </button>
      </div>
    </section>
  );
};

export default WalletBalanceCard;
