'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireStaff } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/format';
import type { ActionResult, OrderStatus } from '@/lib/types';

/** Every action below runs this first — no staff profile, no write. */
async function guard() {
  await requireStaff();
  return createAdminClient();
}

function ok<T>(data?: T): ActionResult<T> {
  return { ok: true, data };
}

function fail(error: string): ActionResult<never> {
  return { ok: false, error };
}

// ---------------------------------------------------------------- orders ----

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<ActionResult> {
  const supabase = await guard();
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
  if (error) return fail(error.message);

  revalidatePath('/admin/orders');
  revalidatePath('/admin');
  return ok();
}

export async function updateOrderNotes(orderId: string, notes: string): Promise<ActionResult> {
  const supabase = await guard();
  const { error } = await supabase
    .from('orders')
    .update({ internal_notes: notes || null })
    .eq('id', orderId);
  if (error) return fail(error.message);

  revalidatePath('/admin/orders');
  return ok();
}

// ---------------------------------------------------------------- hotels ----

export type HotelInput = {
  id?: string;
  name: string;
  name_he?: string;
  slug?: string;
  city?: string;
  address?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  delivery_note?: string;
  commission_rate?: number;
  is_active?: boolean;
};

export async function saveHotel(input: HotelInput): Promise<ActionResult<{ id: string; slug: string }>> {
  const supabase = await guard();

  if (!input.name?.trim()) return fail('Name is required');

  const payload = {
    name: input.name.trim(),
    name_he: input.name_he?.trim() || null,
    // The slug is the QR link. Derive it from the name unless one was given.
    slug: slugify(input.slug?.trim() || input.name),
    city: input.city?.trim() || null,
    address: input.address?.trim() || null,
    contact_name: input.contact_name?.trim() || null,
    contact_phone: input.contact_phone?.trim() || null,
    contact_email: input.contact_email?.trim() || null,
    delivery_note: input.delivery_note?.trim() || null,
    commission_rate: Number.isFinite(input.commission_rate) ? input.commission_rate : 10,
    is_active: input.is_active ?? true,
  };

  if (!payload.slug) return fail('Could not derive a link from that name');

  const query = input.id
    ? supabase.from('hotels').update(payload).eq('id', input.id).select('id, slug').single()
    : supabase.from('hotels').insert(payload).select('id, slug').single();

  const { data, error } = await query;
  if (error) {
    return fail(
      error.code === '23505' ? 'That hotel link is already taken — choose another.' : error.message,
    );
  }

  revalidatePath('/admin/hotels');
  return ok({ id: data.id, slug: data.slug });
}

export async function deleteHotel(id: string): Promise<ActionResult> {
  const supabase = await guard();
  const { error } = await supabase.from('hotels').delete().eq('id', id);
  if (error) return fail(error.message);

  revalidatePath('/admin/hotels');
  return ok();
}

// -------------------------------------------------------------- products ----

export type ProductInput = {
  id?: string;
  slug?: string;
  tier: 'standard' | 'premium' | 'vip';
  name_en: string;
  name_he: string;
  subtitle_en?: string;
  subtitle_he?: string;
  description_en?: string;
  description_he?: string;
  price_ils: number;
  price_usd: number;
  stock: number;
  is_limited?: boolean;
  is_active?: boolean;
  image_url?: string;
  sort_order?: number;
};

export async function saveProduct(input: ProductInput): Promise<ActionResult<{ id: string }>> {
  const supabase = await guard();

  if (!input.name_en?.trim()) return fail('English name is required');
  if (!(input.price_ils >= 0) || !(input.stock >= 0)) return fail('Price and stock must be positive');

  const payload = {
    slug: slugify(input.slug?.trim() || input.name_en),
    tier: input.tier,
    name_en: input.name_en.trim(),
    name_he: input.name_he?.trim() || input.name_en.trim(),
    subtitle_en: input.subtitle_en?.trim() || null,
    subtitle_he: input.subtitle_he?.trim() || null,
    description_en: input.description_en?.trim() || null,
    description_he: input.description_he?.trim() || null,
    price_ils: input.price_ils,
    price_usd: input.price_usd,
    stock: Math.trunc(input.stock),
    is_limited: input.is_limited ?? false,
    is_active: input.is_active ?? true,
    image_url: input.image_url?.trim() || null,
    sort_order: input.sort_order ?? 0,
  };

  const query = input.id
    ? supabase.from('products').update(payload).eq('id', input.id).select('id').single()
    : supabase.from('products').insert(payload).select('id').single();

  const { data, error } = await query;
  if (error) {
    return fail(error.code === '23505' ? 'That product slug already exists.' : error.message);
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
  return ok({ id: data.id });
}

/** Quick inline stock edit from the products table. */
export async function setProductStock(id: string, stock: number): Promise<ActionResult> {
  const supabase = await guard();
  if (!Number.isFinite(stock) || stock < 0) return fail('Stock must be zero or more');

  const { error } = await supabase
    .from('products')
    .update({ stock: Math.trunc(stock) })
    .eq('id', id);
  if (error) return fail(error.message);

  revalidatePath('/admin/products');
  revalidatePath('/');
  return ok();
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const supabase = await guard();
  // Products referenced by past orders are archived rather than removed, so
  // order history keeps its line items.
  const { count } = await supabase
    .from('order_items')
    .select('id', { count: 'exact', head: true })
    .eq('product_id', id);

  const { error } =
    (count ?? 0) > 0
      ? await supabase.from('products').update({ is_active: false }).eq('id', id)
      : await supabase.from('products').delete().eq('id', id);

  if (error) return fail(error.message);

  revalidatePath('/admin/products');
  revalidatePath('/');
  return ok();
}

// ------------------------------------------------------------------ auth ----

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
