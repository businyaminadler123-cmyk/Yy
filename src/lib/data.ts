import { createClient } from '@/lib/supabase/server';
import type { Hotel, Product } from '@/lib/types';

/** Storefront product list — active tiers only, cheapest first. */
export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[getProducts]', error.message);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('[getHotelBySlug]', error.message);
    return null;
  }
  return (data as Hotel) ?? null;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * QR links are issued as /hotel/<slug>, but a raw uuid is accepted too so that
 * an older printed card keeps working after a hotel is renamed.
 */
export async function getHotelByIdentifier(identifier: string): Promise<Hotel | null> {
  const supabase = createClient();
  const column = UUID_RE.test(identifier) ? 'id' : 'slug';
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq(column, identifier)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('[getHotelByIdentifier]', error.message);
    return null;
  }
  return (data as Hotel) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient();
  const { data } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
  return (data as Product) ?? null;
}
