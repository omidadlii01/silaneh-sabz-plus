import React from 'react';

interface SeylanehLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'header';
  lightText?: boolean;
}

// Renders the official Seylaneh Sabz brand logo image.
export const SeylanehLogo: React.FC<SeylanehLogoProps> = ({ className = 'h-8' }) => {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo-full.png`}
      alt="سیلانه سبز"
      className={`${className} w-auto object-contain`}
      draggable={false}
    />
  );
};
