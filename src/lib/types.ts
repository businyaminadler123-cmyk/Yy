export type ProductTier = 'standard' | 'premium' | 'vip';
export type OrderChannel = 'hotel' | 'private';
export type OrderStatus = 'received' | 'packing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'room_charge' | 'bit' | 'cash_on_delivery';
export type StaffRole = 'admin' | 'staff';

export type Product = {
  id: string;
  slug: string;
  tier: ProductTier;
  name_en: string;
  name_he: string;
  subtitle_en: string | null;
  subtitle_he: string | null;
  description_en: string | null;
  description_he: string | null;
  highlights_en: string[];
  highlights_he: string[];
  price_ils: number;
  price_usd: number;
  compare_at_ils: number | null;
  stock: number;
  low_stock_at: number;
  is_limited: boolean;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Hotel = {
  id: string;
  slug: string;
  name: string;
  name_he: string | null;
  city: string | null;
  address: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  logo_url: string | null;
  accent_color: string | null;
  commission_rate: number;
  delivery_note: string | null;
  is_active: boolean;
  created_at?: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  tier: ProductTier | null;
  unit_price_ils: number;
  unit_price_usd: number;
  quantity: number;
  line_total_ils: number;
};

export type Order = {
  id: string;
  order_number: string;
  channel: OrderChannel;
  status: OrderStatus;
  payment_method: PaymentMethod;
  hotel_id: string | null;
  hotel_name: string | null;
  room_number: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postal_code: string | null;
  delivery_notes: string | null;
  subtotal_ils: number;
  delivery_fee_ils: number;
  total_ils: number;
  total_usd: number;
  locale: string;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
};

export type AdminKpis = {
  orders_count: number;
  revenue_ils: number;
  hotel_orders: number;
  private_orders: number;
  hotel_revenue: number;
  private_revenue: number;
  pending_count: number;
};

export type CartLine = {
  productId: string;
  slug: string;
  nameEn: string;
  nameHe: string;
  tier: ProductTier;
  priceIls: number;
  priceUsd: number;
  imageUrl: string | null;
  quantity: number;
};

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };
