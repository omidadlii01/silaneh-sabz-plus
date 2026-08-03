// src/components/MonthlyMissionsSection.tsx
import React from 'react';
import { Award, Star } from 'lucide-react';
import { MissionItem } from '../types';

export interface MonthlyMissionsSectionProps {
  missions?: MissionItem[];
  onViewAll?: () => void;
  onClaimReward?: (missionId: string) => void;
}

const defaultMissions: MissionItem[] = [
  {
    id: 'mission-1',
    type: 'detailed',
    title: '۵۰۰ میلیون خرید در ماه',
    rewardText: 'پاداش: ۵۰ میلیون ریال تخفیف',
    progressPercentage: 75,
    progressText: '۷۵٪ انجام شده',
    daysLeftText: '۱۲ روز باقی‌مانده',
    buttonText: 'دریافت پاداش',
  },
  {
    id: 'mission-2',
    type: 'incentive',
    progressPercentage: 40,
    counterText: '۴ از ۱۰',
  },
];

export const MonthlyMissionsSection: React.FC<MonthlyMissionsSectionProps> = ({
  missions = defaultMissions,
  onViewAll,
  onClaimReward,
}) => {
  return (
    <section className="px-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">ماموریت‌های ماهانه</h2>
        <button
          type="button"
          onClick={onViewAll || (() => {/* TODO: wire navigation */})}
          className="text-emerald-700 text-sm font-bold hover:text-emerald-900 transition-colors"
        >
          مشاهده همه
        </button>
      </div>

      {/* Missions Carousel */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
        {missions.map((mission) => {
          if (mission.type === 'detailed') {
            return (
              <div
                key={mission.id}
                className="min-w-[280px] w-[280px] bg-white rounded-xl shadow-xs border-r-4 border-emerald-600 flex overflow-hidden snap-start shrink-0 border border-gray-100"
              >
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-800 text-sm">{mission.title}</h3>
                    <div className="w-8 h-8 bg-gray-50 rounded-full border-2 border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>

                  {mission.rewardText && (
                    <p className="text-xs text-gray-500 mb-4 font-medium">
                      {mission.rewardText}
                    </p>
                  )}

                  <div className="flex justify-between text-[10px] font-bold text-emerald-800 mb-1">
                    <span>{mission.progressText}</span>
                    <span>{mission.daysLeftText}</span>
                  </div>

                  <div className="w-full bg-gray-100 h-2 rounded-full mb-4 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, mission.progressPercentage))}%` }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => onClaimReward ? onClaimReward(mission.id) : {/* TODO: wire navigation */}}
                    className="w-full bg-emerald-800 text-white py-2 rounded-lg text-sm font-bold hover:bg-emerald-900 active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
                  >
                    {mission.buttonText || 'دریافت پاداش'}
                  </button>
                </div>
              </div>
            );
          }

          // Incentive Counter Style Card
          return (
            <div
              key={mission.id}
              className="min-w-[120px] bg-white rounded-xl shadow-xs border-r-4 border-orange-500 flex flex-col items-center justify-center p-4 snap-start shrink-0 border border-gray-100"
            >
              <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-2">
                <Star className="h-6 w-6 fill-orange-500" />
              </div>
              <span className="text-xs font-bold text-gray-600">
                {mission.counterText}
              </span>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, mission.progressPercentage))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MonthlyMissionsSection;
