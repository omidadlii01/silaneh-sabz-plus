import React from 'react';
import { OrderStatus } from '../types';
import { getStatusBadgeInfo } from '../utils';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { label, bgColor, textColor, borderColor } = getStatusBadgeInfo(status);

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs font-medium'
      : size === 'lg'
      ? 'px-3.5 py-1 text-sm font-semibold'
      : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border ${bgColor} ${textColor} ${borderColor} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current ml-1.5 animate-pulse" />
      {label}
    </span>
  );
};
