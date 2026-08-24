import { ProductsManager } from '@/components/admin/ProductsManager';
import { createClient } from '@/lib/supabase/server';
import { getTranslator } from '@/lib/i18n/server';
import type { Product } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const t = getTranslator();
  const supabase = createClient();
  const { data } = await supabase.from('products').select('*').order('sort_order');

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">{t('admin.title')}</span>
        <h1 className="mt-2 font-display text-3xl text-bottle-900">{t('admin.products')}</h1>
      </header>

      <ProductsManager products={(data ?? []) as Product[]} />
    </div>
  );
}
