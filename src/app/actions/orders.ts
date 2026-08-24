'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { DELIVERY_FEE_ILS, FREE_DELIVERY_THRESHOLD_ILS } from '@/lib/constants';
import type { ActionResult, OrderChannel, PaymentMethod } from '@/lib/types';

export type CheckoutInput = {
  channel: OrderChannel;
  paymentMethod: PaymentMethod;
  fullName: string;
  email: string;
  phone: string;
  items: { productId: string; quantity: number }[];
  locale?: string;
  // Hotel flow
  hotelId?: string;
  roomNumber?: string;
  // Private flow
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
  deliveryNotes?: string;
};

export type PlacedOrder = {
  orderId: string;
  orderNumber: string;
  totalIls: number;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s-]{7,20}$/;

function fail(error: string): ActionResult<PlacedOrder> {
  return { ok: false, error };
}

/**
 * Single checkout entry point for both flows. Prices are re-read from the
 * database inside place_order() — nothing the browser sends is trusted for money.
 */
export async function placeOrder(input: CheckoutInput): Promise<ActionResult<PlacedOrder>> {
  const items = (input.items ?? []).filter((i) => i.productId && i.quantity > 0);
  if (items.length === 0) return fail('errors.emptyCart');

  if (!input.fullName?.trim()) return fail('checkout.required');
  if (!EMAIL_RE.test(input.email ?? '')) return fail('checkout.invalidEmail');
  if (!PHONE_RE.test(input.phone ?? '')) return fail('checkout.invalidPhone');

  if (input.channel === 'hotel') {
    if (!input.hotelId || !input.roomNumber?.trim()) return fail('checkout.required');
  } else {
    if (!input.addressLine1?.trim() || !input.city?.trim()) return fail('checkout.required');
    if (input.paymentMethod !== 'bit' && input.paymentMethod !== 'cash_on_delivery') {
      return fail('errors.generic');
    }
  }

  const supabase = createAdminClient();

  // Delivery fee is decided server-side from the true subtotal.
  let deliveryFee = 0;
  if (input.channel === 'private') {
    const { data: priced } = await supabase
      .from('products')
      .select('id, price_ils')
      .in('id', items.map((i) => i.productId));

    const subtotal = (priced ?? []).reduce((sum, row) => {
      const line = items.find((i) => i.productId === row.id);
      return sum + Number(row.price_ils) * (line?.quantity ?? 0);
    }, 0);

    deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD_ILS ? 0 : DELIVERY_FEE_ILS;
  }

  const { data, error } = await supabase.rpc('place_order', {
    p_channel: input.channel,
    p_payment_method: input.channel === 'hotel' ? 'room_charge' : input.paymentMethod,
    p_customer_name: input.fullName.trim(),
    p_customer_email: input.email.trim().toLowerCase(),
    p_customer_phone: input.phone.trim(),
    p_items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
    p_hotel_id: input.channel === 'hotel' ? input.hotelId : null,
    p_room_number: input.channel === 'hotel' ? input.roomNumber?.trim() : null,
    p_address_line1: input.channel === 'private' ? input.addressLine1?.trim() : null,
    p_address_line2: input.channel === 'private' ? input.addressLine2?.trim() || null : null,
    p_city: input.channel === 'private' ? input.city?.trim() : null,
    p_postal_code: input.channel === 'private' ? input.postalCode?.trim() || null : null,
    p_delivery_notes: input.deliveryNotes?.trim() || null,
    p_delivery_fee: deliveryFee,
    p_locale: input.locale ?? 'en',
  });

  if (error) {
    if (error.message.includes('OUT_OF_STOCK')) return fail('errors.outOfStock');
    console.error('[placeOrder]', error.message);
    return fail('errors.generic');
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return fail('errors.generic');

  return {
    ok: true,
    data: {
      orderId: row.order_id,
      orderNumber: row.order_number,
      totalIls: Number(row.total_ils),
    },
  };
}

/** Confirmation page lookup — service role, but only ever by opaque order id. */
export async function getOrderForConfirmation(orderId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .maybeSingle();
  return data;
}
