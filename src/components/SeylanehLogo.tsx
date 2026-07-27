import React from 'react';

interface SeylanehLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'header';
  lightText?: boolean;
}

export const SeylanehLogo: React.FC<SeylanehLogoProps> = ({
  className = 'h-8',
  variant = 'full',
  lightText = false,
}) => {
  const textColor = lightText ? '#ffffff' : '#0d9488';
  const subTextColor = lightText ? '#a7f3d0' : '#10b981';

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 250 160"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="seylanehLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <path
          d="M 10 95 C 45 45, 105 50, 125 70 C 135 60, 142 50, 150 45 C 160 38, 200 40, 235 48 C 175 75, 150 115, 140 135 C 115 110, 65 115, 10 95 Z"
          fill="url(#seylanehLeafGrad)"
        />
        <path
          d="M 128 40 C 128 40, 116 65, 116 75 C 116 83, 121 88, 128 88 C 135 88, 140 83, 140 75 C 140 65, 128 40, 128 40 Z"
          fill="#ffffff"
          stroke="#10b981"
          strokeWidth="3"
        />
        <path
          d="M 124 68 C 122 72, 122 76, 124 79"
          fill="none"
          stroke="#059669"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon Graphic */}
      <svg
        viewBox="0 0 250 160"
        className="h-full w-auto flex-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="seylanehLeafGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <path
          d="M 10 95 C 45 45, 105 50, 125 70 C 135 60, 142 50, 150 45 C 160 38, 200 40, 235 48 C 175 75, 150 115, 140 135 C 115 110, 65 115, 10 95 Z"
          fill="url(#seylanehLeafGradFull)"
        />
        <path
          d="M 128 40 C 128 40, 116 65, 116 75 C 116 83, 121 88, 128 88 C 135 88, 140 83, 140 75 C 140 65, 128 40, 128 40 Z"
          fill="#ffffff"
          stroke="#10b981"
          strokeWidth="3"
        />
        <path
          d="M 124 68 C 122 72, 122 76, 124 79"
          fill="none"
          stroke="#059669"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-1">
          <span
            className="font-black tracking-wider text-sm sm:text-base font-sans uppercase"
            style={{ color: textColor }}
          >
            SEYLANEH
          </span>
          <span
            className="font-black tracking-wider text-sm sm:text-base font-sans uppercase"
            style={{ color: subTextColor }}
          >
            SABZ
          </span>
        </div>
        <span
          className="text-[9px] sm:text-[10px] font-bold tracking-tight uppercase mt-0.5"
          style={{ color: subTextColor, opacity: 0.9 }}
        >
          PRODUCER &amp; TRADE CO
        </span>
      </div>
    </div>
  );
};
