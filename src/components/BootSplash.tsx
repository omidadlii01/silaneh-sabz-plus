import React, { useEffect, useState } from 'react';

// Shown for a short moment while the app boots, matching the native splash
// (same logo, dark green background) but with a light-green ring animated
// rotating around the logo, as requested.
export const BootSplash: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1100);
    const doneTimer = setTimeout(onDone, 1500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f5338] transition-opacity duration-400 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            animationDuration: '1.4s',
            background:
              'conic-gradient(from 0deg, transparent 0deg, transparent 260deg, #34d399 320deg, #34d399 360deg)',
            WebkitMaskImage:
              'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))',
            maskImage:
              'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))',
          }}
        />
        <img
          src="/logo-splash.png"
          alt="سیلانه سبز"
          className="w-32 h-32 object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
};
