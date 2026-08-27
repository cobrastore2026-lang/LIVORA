export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  isCover: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  optionValue: string;
  sku?: string | null;
  priceAdjustment: number;
  stock: number;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  description: string;
  shortDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  discount?: number | null;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  displayStockCount?: number | null;
  showStockBadge: boolean;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    image: string;
  };
  variantId?: string | null;
  variantName?: string | null;
  variantOption?: string | null;
  priceAdjustment?: number;
  unitPrice: number;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  categoryName?: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface Review {
  id: string;
  authorName: string;
  avatarUrl?: string | null;
  rating: number;
  content: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl: string;
  buttonText?: string | null;
  buttonLink?: string | null;
  badgeText?: string | null;
  position: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName?: string | null;
  customerPhone?: string | null;
  customerCity?: string | null;
  customerAddress?: string | null;
  totalAmount: number;
  subtotal: number;
  discountAmount: number;
  notes?: string | null;
  status: 'NEW' | 'CONFIRMED' | 'PROCESSING' | 'READY_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: string;
  isWhatsappOrder: boolean;
  items: {
    id: string;
    productId: string;
    productName: string;
    variantInfo?: string | null;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }[];
  createdAt: string;
}

export interface StoreSettings {
  store_name?: string;
  whatsapp_number?: string;
  whatsapp_message_prefix?: string;
  instagram_url?: string;
  tiktok_url?: string;
  currency_symbol?: string;
  store_description?: string;
  about_title?: string;
  about_text?: string;
  about_image?: string;
  shipping_notice?: string;
}
