export interface Product {
  id: string;
  name: string;
  brand: string;
  brandEn: string;
  category: string;
  categoryId: string;
  subCategory?: string;
  image: string;
  cartonCount: number; // e.g. 12 عدد در کارتن
  price: number; // Product wholesale price in Tomans
  consumerPrice: number; // Price for consumers
  discountPercent: number;
  inStock: boolean;
  stockCount: number;
  description?: string;
  specs?: { label: string; value: string }[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  iconName?: string;
}

export interface Brand {
  id: string;
  nameFa: string;
  nameEn: string;
  logo: string;
  banner?: string;
  description?: string;
  gradient?: string;
}

export interface PackageBundle {
  id: string;
  title: string;
  itemTypesCount: number;
  image: string;
  discountPercent: number;
  price: number;
  consumerPrice: number;
  expiresInDays: number;
  items: { productName: string; qty: number; unitPrice: number; productId?: string }[];
}

export interface CartItem {
  product: Product;
  quantity: number; // Number of units or cartons
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  time?: string;
  storeName?: string;
  storeLogo?: string;
  itemsCount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered';
  statusText: string;
  items: { productName: string; quantity: number; unitPrice: number; productId?: string }[];
  deliveryAddress: string;
  paymentMethod: string;
  rating?: number;
  ratingComment?: string;
}

export interface VisitorInfo {
  name: string;
  code: string;
  phone: string;
  region: string;
  avatar: string;
  rating: number;
  status: 'online' | 'busy' | 'offline';
}

export interface UserProfileData {
  storeName: string;
  customerCode: string;
  ownerName: string;
  phone: string;
  address: string;
  city: string;
  creditLimit: number; // Total credit limit in Tomans
  creditUsed: number; // Used credit in Tomans
  licenseNumber: string;
}

export type TabType = 'home' | 'products' | 'orders' | 'visitor' | 'profile';
