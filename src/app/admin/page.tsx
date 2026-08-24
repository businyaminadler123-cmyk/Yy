import Link from 'next/link';
import { KpiCard } from '@/components/admin/KpiCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { createClient } from '@/lib/supabase/server';
import { formatDateTime, formatIls } from '@/lib/format';
import { getLocale, getTranslator } from '@/lib/i18n/server';
import type { AdminKpis, Order } from '@/lib/types';

export const dynamic = 'force-dynamic';

const EMPTY_KPIS: AdminKpis = {
  orders_count: 0,
  revenue_ils: 0,
  hotel_orders: 0,
  private_orders: 0,
  hotel_revenue: 0,
  private_revenue: 0,
  pending_count: 0,
};

export default async function AdminDashboardPage() {
  const locale = getLocale();
  const t = getTranslator(locale);
  const supabase = createClient();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [{ data: kpiRows }, { data: recent }] = await Promise.all([
    supabase.rpc('admin_kpis', { p_since: startOfToday.toISOString() }),
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  const kpis: AdminKpis = (Array.isArray(kpiRows) ? kpiRows[0] : kpiRows) ?? EMPTY_KPIS;
  const orders = (recent ?? []) as Order[];

  const hotelShare =
    kpis.orders_count > 0 ? Math.round((kpis.hotel_orders / kpis.orders_count) * 100) : 0;

  return (
    <div className="space-y-8">
      <header>
        <span className="eyebrow">{t('admin.today')}</span>
        <h1 className="mt-2 font-display text-3xl text-bottle-900">{t('admin.title')}</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard labelKey="admin.ordersToday" value={String(kpis.orders_count)} accent="green" />
        <KpiCard
          labelKey="admin.revenueToday"
          value={formatIls(Number(kpis.revenue_ils), locale)}
          accent="gold"
        />
        <KpiCard
          labelKey="admin.hotelOrders"
          value={String(kpis.hotel_orders)}
          hint={`${formatIls(Number(kpis.hotel_revenue), locale)} · ${hotelShare}%`}
        />
        <KpiCard
          labelKey="admin.privateOrders"
          value={String(kpis.private_orders)}
          hint={formatIls(Number(kpis.private_revenue), locale)}
        />
      </div>

      {/* Hotel vs private split */}
      <section className="card-luxe p-6">
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.18em] text-bottle-800/55">
            {t('admin.hotelOrders')} / {t('admin.privateOrders')}
          </p>
          <p className="text-xs text-ink/45">
            {t('admin.pending')}: <strong className="text-bottle-900">{kpis.pending_count}</strong>
          </p>
        </div>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-cream-200">
          <div className="bg-bottle-800 transition-all" style={{ width: `${hotelShare}%` }} />
          <div className="flex-1 bg-gold-500" />
        </div>
        <div className="mt-3 flex justify-between text-xs text-ink/50">
          <span>
            <span className="me-2 inline-block h-2 w-2 rounded-full bg-bottle-800" />
            {t('channel.hotel')} · {kpis.hotel_orders}
          </span>
          <span>
            <span className="me-2 inline-block h-2 w-2 rounded-full bg-gold-500" />
            {t('channel.private')} · {kpis.private_orders}
          </span>
        </div>
      </section>

      {/* Recent orders */}
      <section className="card-luxe overflow-hidden">
        <div className="flex items-center justify-between border-b border-bottle-800/10 px-6 py-4">
          <h2 className="font-display text-lg text-bottle-900">{t('admin.recentOrders')}</h2>
          <Link href="/admin/orders" className="text-xs text-gold-600 hover:underline">
            {t('admin.orders')} →
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink/45">{t('admin.noOrders')}</p>
        ) : (
          <ul className="divide-y divide-bottle-800/8">
            {orders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center gap-3 px-6 py-4">
                <span className="font-mono text-xs text-ink/45" dir="ltr">
                  {order.order_number}
                </span>
                <span className="text-sm text-bottle-900">{order.customer_name}</span>
                <span className="text-xs text-ink/45">
                  {order.channel === 'hotel'
                    ? `${order.hotel_name ?? ''} · ${t('checkout.roomNumber')} ${order.room_number ?? ''}`
                    : `${order.city ?? ''}`}
                </span>
                <span className="ms-auto flex items-center gap-4">
                  <span className="text-sm text-bottle-900">
                    {formatIls(Number(order.total_ils), locale)}
                  </span>
                  <StatusBadge status={order.status} />
                  <span className="hidden text-xs text-ink/40 sm:block">
                    {formatDateTime(order.created_at, locale)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
