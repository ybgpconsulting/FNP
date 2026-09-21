/**
 * Core TypeScript definitions for FNP Florist & Bakery (Sector 76 Noida)
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  images: string[];
  featured: boolean;
  bestseller: boolean;
  available: boolean;
  displayOrder: number;
  // Product options/attributes for future-readiness
  weightOptions?: string[]; // e.g. ['500g', '1kg', '2kg']
  selectedWeight?: string;
  flavorOptions?: string[]; // e.g. ['Eggless', 'With Egg', 'Extra Truffle']
  selectedFlavor?: string;
  allowCustomMessage?: boolean;
  customMessagePlaceholder?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  active: boolean;
  displayOrder: number;
}

export interface StoreSettings {
  businessName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  mapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  openingHours: string;
  whatsappMessage: string;
  websiteTitle: string;
  metaDescription: string;
  logo: string;
  bannerAnnouncement: string;
}

export interface HomepageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCtaText: string;
  heroCtaLink: string;
  promoBannerActive: boolean;
  promoBannerText: string;
  whyUsPoints: {
    title: string;
    description: string;
    icon: string;
  }[];
  footerNote: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight?: string;
  selectedFlavor?: string;
  customMessage?: string;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  isAdmin: boolean;
}

export interface RecordedOrder {
  id: string;
  customerPhone?: string;
  customerName?: string;
  items: {
    productName: string;
    quantity: number;
    price: number;
    options?: string;
  }[];
  totalAmount: number;
  status: 'whatsapp_sent' | 'confirmed' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
}
