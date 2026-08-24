import type { OrderStatus, PaymentMethod, ProductTier } from './types';

/** Flat delivery fee for private (non-hotel) orders, in ILS. */
export const DELIVERY_FEE_ILS = 39;

/** Free delivery above this cart subtotal, in ILS. */
export const FREE_DELIVERY_THRESHOLD_ILS = 500;

export const ORDER_STATUSES: OrderStatus[] = [
  'received',
  'packing',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

/** Statuses a member of staff can move an order through, in order. */
export const FULFILMENT_FLOW: OrderStatus[] = [
  'received',
  'packing',
  'out_for_delivery',
  'delivered',
];

export const STATUS_STYLES: Record<OrderStatus, string> = {
  received: 'bg-cream-200 text-bottle-800 ring-bottle-800/15',
  packing: 'bg-gold-100 text-gold-600 ring-gold-500/25',
  out_for_delivery: 'bg-bottle-50 text-bottle-700 ring-bottle-500/25',
  delivered: 'bg-bottle-800 text-cream-50 ring-bottle-900/20',
  cancelled: 'bg-red-50 text-red-700 ring-red-600/20',
};

export const TIER_STYLES: Record<ProductTier, { ring: string; label: string }> = {
  standard: { ring: 'ring-bottle-800/10', label: 'bg-cream-200 text-bottle-800' },
  premium: { ring: 'ring-gold-500/30', label: 'bg-gold-100 text-gold-600' },
  vip: { ring: 'ring-bottle-800/30', label: 'bg-bottle-800 text-gold-200' },
};

export const PAYMENT_METHODS: PaymentMethod[] = ['bit', 'cash_on_delivery'];

export const LOCALE_COOKIE = 'am_locale';
export const CART_STORAGE_KEY = 'am_cart_v1';
