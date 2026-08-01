import React, { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';

const API_BASE_URL = 'https://silaneh-sabz-api.omidadli78.workers.dev';

export const AppBanner: React.FC = () => {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then((r) => r.json())
      .then((data) => {
        const settings = data?.settings || {};
        if (settings.banner_active === '1' && settings.banner_text) {
          setText(settings.banner_text);
        }
      })
      .catch(() => {});
  }, []);

  if (!text) return null;

  return (
    <div className="flex items-center gap-2 bg-emerald-700 text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl mb-3">
      <Megaphone size={16} className="flex-none" />
      <span>{text}</span>
    </div>
  );
};
