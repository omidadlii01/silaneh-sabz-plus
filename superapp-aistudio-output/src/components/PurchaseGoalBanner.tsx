// src/components/PurchaseGoalBanner.tsx
import React from 'react';
import { PurchaseGoal } from '../types';

export interface PurchaseGoalBannerProps {
  goal?: PurchaseGoal;
}

const defaultGoal: PurchaseGoal = {
  title: 'هدف گذاری خرید',
  subtitle: 'تا ۵۰ میلیون تخفیف ویژه',
  seasonBadge: 'فصل پاییز',
  purchasedAmountText: '۱۸۰ میلیون خرید شده',
  remainingAmountText: '۳۲۰ میلیون باقی‌مانده',
  progressPercentage: 35,
  membershipLevelNote: 'با تکمیل این مرحله، سطح عضویت شما به «طلایی» ارتقا می‌یابد.',
};

export const PurchaseGoalBanner: React.FC<PurchaseGoalBannerProps> = ({
  goal = defaultGoal,
}) => {
  return (
    <section className="px-4">
      <div className="bg-white border-2 border-emerald-800/10 rounded-2xl p-5 relative overflow-hidden shadow-xs">
        {/* Header Row */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-emerald-800">{goal.title}</h3>
            <p className="text-sm text-gray-500 font-medium">{goal.subtitle}</p>
          </div>
          <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold">
            {goal.seasonBadge}
          </span>
        </div>

        {/* Stats Row */}
        <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
          <span>{goal.purchasedAmountText}</span>
          <span>{goal.remainingAmountText}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-3 p-0.5">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, goal.progressPercentage))}%` }}
          />
        </div>

        {/* Footnote */}
        <p className="text-[10px] text-gray-400 text-center font-medium">
          {goal.membershipLevelNote}
        </p>
      </div>
    </section>
  );
};

export default PurchaseGoalBanner;
