import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: TabType; label: string; icon: string; iconUrl: string }[] = [
    {
      id: 'home',
      label: 'خانه',
      icon: 'home',
      iconUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBEZqGEhzoN0CJOzNsCyBEVxaJZmcJFa3FiapTKLg9wfomqJwXJzqKrgctKbFz3mwHzvOYwW18138m96CHQY3_lGvbcMV_H4PRi-Bn0gJF0fXL0BiN-c5vG8XTA3EyEipFuLKoMkwUg7V2v1Vv67uMYWMp6DFxWGZdbkehwr0rtUXvwJZ_rupCVtbBXS_pTDccv1OqoBMrs6KHFLV-iuQxCfpEtj7Ih8SgVnHFjUt3YrnaZNljHA5f9',
    },
    {
      id: 'products',
      label: 'محصولات',
      icon: 'grid_view',
      iconUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCblbBkasFxpvNmX6W7VTGFFHI8wRd_CBwDzc2ELdLlKcq2adqoUZsXaKZVEmKtDo-Jm1FsrBdauzeGNLk8ePEZRrr-L9VjmsZshFjJzlJMUszvogXp3HQarn_vj6YN9mVQl5LcBokDZ5lDpciEdKHpZlMyhg4pYRNJhRyVcXMZioW66ktkizxjyW5eyawW5tH36388bASfHfLtb_E_vt_DDdLKg3Xs-soZpyG0hNQ15ZZ_OyK3DLxH',
    },
    {
      id: 'orders',
      label: 'سفارشات',
      icon: 'receipt_long',
      iconUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCxMXOUE9Kh9WiMJD-GrsNjThzTHNsvcR33e_6QXSmPCFWCpFSKwuNpNstyStp_Vtwo00dk_HaWX-jj0er_z_fsT08HakZEIsciPU3-FHh6dRI_Aduc6fIpnRKeRQjVjDhqGDhAwveDl_xNd-WaPAtlh6oSsbXeT3ZOu4wikp4cw3_9_XxpHpAw3cuz_rYoUKF7sjT68oPPAUzbEzpO06L64nLxmUUIfG0eJlFbytlGa2ejm_sPTMNt',
    },
    {
      id: 'visitor',
      label: 'ارتباط با ویزیتور',
      icon: 'support_agent',
      iconUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDNHDee7fCu9zXgfwuLjWY1R3SFdJ7IjJfxhQedAz_yCTGvk7wazpszTVnm3UObsqAht0dUK6a6E9Zh3mrGdYwYeY9uVj0t_Kf__6shcl8GiMqq4_0baZ213QRRFySEwQ7xyEoxqWzLklU7ct_D_YdxuiU0GHfH-RzYbXtTp49pgsj9B38Q0GTUOyKfDUmW2aUSlWwcdsd_8IjnziSlOzlXVw-ANj4j2dn0_gMFMexN9jhFohnHzBKv',
    },
    {
      id: 'profile',
      label: 'حساب کاربری',
      icon: 'person',
      iconUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBxOW8q77dVZ4vxtERQYyeUPoc-GVufqUM0es7Q7AovvNlmo44VioXGlGYiiREqkkqis-iU6xOUI82Hy54SwWVpUSF8zNjaqusOaybjuDl62-bqRaLKCXTjdIOFBCwU1LvezClbYO_b5J0PFkRfANzskycy5AgtaBEOqSR3NAM7_XStNaNdMVOImjptzufN7zu31OhtOk_HSpZaqI66kyS6zP6kkgLK9Uy9uRYCZjW7Ec46ONe2qs6N',
    },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[424px] z-40 p-[2px] rounded-2xl bg-gradient-to-r from-[#10b981] via-[#34d399] to-[#059669] shadow-[0_0_20px_rgba(16,185,129,0.35),0_10px_25px_-5px_rgba(0,108,74,0.3)]">
      <nav className="w-full bg-[#f4fbf7]/95 backdrop-blur-2xl rounded-[14px] h-18 px-2 flex justify-around items-center flex-row">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full px-2.5 active:scale-95 transition-all relative ${
                isActive
                  ? 'text-[#006c4a] opacity-100 font-extrabold'
                  : 'text-[#525b56] opacity-75 hover:opacity-100 font-bold'
              }`}
            >
              {isActive && (
                <span className="absolute top-1.5 inset-x-3 h-1 bg-[#006c4a] rounded-full shadow-[0_0_8px_rgba(0,108,74,0.6)]" />
              )}
              <div className="relative w-6 h-6 flex items-center justify-center mb-1 mt-1">
                <img
                  src={tab.iconUrl}
                  alt={tab.label}
                  className={`w-6 h-6 object-contain mix-blend-multiply bg-transparent transition-transform ${
                    isActive ? 'scale-110' : 'grayscale-30'
                  }`}
                  onError={(e) => {
                    // Fallback if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="font-['Vazirmatn'] text-[11px] leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
