import type React from 'react';

// A neutral inline placeholder (no network request) shown when a real
// product/brand/category image URL is missing or fails to load.
export const IMAGE_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='12' fill='%23f1f5f9'/%3E%3Cpath d='M30 65 L45 45 L58 58 L70 40 L82 65 Z' fill='%23cbd5e1'/%3E%3Ccircle cx='40' cy='35' r='7' fill='%23cbd5e1'/%3E%3C/svg%3E";

export function handleImgError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const img = e.currentTarget;
  if (img.src !== IMAGE_FALLBACK) {
    img.onerror = null;
    img.src = IMAGE_FALLBACK;
  }
}
