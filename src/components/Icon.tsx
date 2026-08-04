import React from 'react';
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ShoppingCart,
  Receipt,
  UserCircle,
  Search,
  X,
  ChevronLeft,
  Plus,
  Package,
  Award,
  Gift,
  Tag,
  AlertTriangle,
  History,
  Clock,
  Flame,
  Baby,
  Sparkles,
  Heart,
  Smile,
  Scissors,
  Droplet,
  Home,
  LucideIcon,
  HelpCircle,
} from 'lucide-react';

// Maps the old Material-Symbols icon-name strings (used throughout the app's
// data/markup) to real SVG icon components. This replaces the old
// font-ligature based "material-symbols-outlined" approach, which broke
// whenever the self-hosted font's ligature feature tag didn't match the
// CSS (`liga` vs `rlig`/`rclt`), causing raw icon names to render as text.
const ICON_MAP: Record<string, LucideIcon> = {
  arrow_forward: ArrowRight,
  arrow_back: ArrowLeft,
  verified_user: ShieldCheck,
  shopping_cart: ShoppingCart,
  receipt_long: Receipt,
  account_circle: UserCircle,
  search: Search,
  close: X,
  chevron_left: ChevronLeft,
  add: Plus,
  inventory_2: Package,
  military_tech: Award,
  card_giftcard: Gift,
  redeem: Gift,
  local_offer: Tag,
  sell: Tag,
  warning: AlertTriangle,
  history: History,
  schedule: Clock,
  local_fire_department: Flame,
  child_care: Baby,
  auto_awesome: Sparkles,
  favorite: Heart,
  sentiment_satisfied: Smile,
  content_cut: Scissors,
  water_drop: Droplet,
  home: Home,
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className = '', style }) => {
  const LucideComp = ICON_MAP[name] || HelpCircle;
  return <LucideComp size={size} className={className} style={style} strokeWidth={2} />;
};
