import { OrdersTable } from '@/components/admin/OrdersTable';
import { createClient } from '@/lib/supabase/server';
import { getTranslator } from '@/lib/i18n/server';
import type { Hotel, Order } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const t = getTranslator();
  const supabase = createClient();

  const [{ data: orders }, { data: hotels }] = await Promise.all([
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .limit(500),
    supabase.from('hotels').select('id, name').order('name'),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">{t('admin.title')}</span>
        <h1 className="mt-2 font-display text-3xl text-bottle-900">{t('admin.orders')}</h1>
      </header>

      <OrdersTable
        orders={(orders ?? []) as Order[]}
        hotels={(hotels ?? []) as Pick<Hotel, 'id' | 'name'>[]}
      />
    </div>
  );
}
