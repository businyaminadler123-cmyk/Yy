'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { updateOrderStatus } from '@/app/admin/actions';
import { ORDER_STATUSES } from '@/lib/constants';
import { formatDateTime, formatIls } from '@/lib/format';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import type { Hotel, Order, OrderChannel, OrderStatus } from '@/lib/types';

type Props = { orders: Order[]; hotels: Pick<Hotel, 'id' | 'name'>[] };

export function OrdersTable({ orders, hotels }: Props) {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [hotelId, setHotelId] = useState('all');
  const [channel, setChannel] = useState<OrderChannel | 'all'>('all');
  const [status, setStatus] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (hotelId !== 'all' && order.hotel_id !== hotelId) return false;
      if (channel !== 'all' && order.channel !== channel) return false;
      if (status !== 'all' && order.status !== status) return false;
      if (!needle) return true;
      return [
        order.order_number,
        order.customer_name,
        order.customer_email,
        order.customer_phone,
        order.hotel_name ?? '',
        order.room_number ?? '',
        order.city ?? '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [orders, hotelId, channel, status, search]);

  const revenue = filtered
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total_ils), 0);

  function changeStatus(order: Order, next: OrderStatus) {
    setSavingId(order.id);
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, next);
      setSavingId(null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <input
          className="field py-2.5"
          placeholder={t('admin.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="field py-2.5"
          value={hotelId}
          onChange={(e) => setHotelId(e.target.value)}
          aria-label={t('admin.filterHotel')}
        >
          <option value="all">{t('admin.filterHotel')}</option>
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>
              {hotel.name}
            </option>
          ))}
        </select>
        <select
          className="field py-2.5"
          value={channel}
          onChange={(e) => setChannel(e.target.value as OrderChannel | 'all')}
          aria-label={t('admin.filterChannel')}
        >
          <option value="all">{t('admin.filterChannel')}</option>
          <option value="hotel">{t('channel.hotel')}</option>
          <option value="private">{t('channel.private')}</option>
        </select>
        <select
          className="field py-2.5"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus | 'all')}
          aria-label={t('admin.filterStatus')}
        >
          <option value="all">{t('admin.filterStatus')}</option>
          {ORDER_STATUSES.map((value) => (
            <option key={value} value={value}>
              {t(`status.${value}` as 'status.received')}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between text-xs text-ink/50">
        <span>{t('cart.itemCount', { count: filtered.length })}</span>
        <span>
          {t('cart.total')}: <strong className="text-bottle-900">{formatIls(revenue, locale)}</strong>
        </span>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {/* Table */}
      <div className="card-luxe overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-bottle-800/10 bg-cream-100/60 text-start text-[11px] uppercase tracking-[0.14em] text-bottle-800/55">
                <th className="px-5 py-3 text-start font-medium">{t('admin.order')}</th>
                <th className="px-5 py-3 text-start font-medium">{t('admin.customer')}</th>
                <th className="px-5 py-3 text-start font-medium">{t('admin.channel')}</th>
                <th className="px-5 py-3 text-end font-medium">{t('admin.total')}</th>
                <th className="px-5 py-3 text-start font-medium">{t('admin.status')}</th>
                <th className="px-5 py-3 text-start font-medium">{t('admin.placed')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bottle-800/8">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-ink/45">
                    {t('admin.noOrders')}
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="align-top transition hover:bg-cream-100/50">
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                        className="font-mono text-xs text-bottle-800 underline-offset-4 hover:underline"
                        dir="ltr"
                      >
                        {order.order_number}
                      </button>
                      {expanded === order.id ? (
                        <dl className="mt-3 space-y-1 text-xs text-ink/60">
                          <div dir="ltr">{order.customer_email}</div>
                          <div dir="ltr">{order.customer_phone}</div>
                          {order.channel === 'private' ? (
                            <div>
                              {[order.address_line1, order.address_line2, order.city, order.postal_code]
                                .filter(Boolean)
                                .join(', ')}
                            </div>
                          ) : null}
                          {order.delivery_notes ? <div>“{order.delivery_notes}”</div> : null}
                          <div className="pt-1 text-ink/40">
                            {t(`payment.${order.payment_method}` as 'payment.bit')}
                          </div>
                        </dl>
                      ) : null}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-bottle-900">{order.customer_name}</p>
                      <p className="mt-0.5 text-xs text-ink/45">
                        {order.channel === 'hotel'
                          ? `${t('checkout.roomNumber')} ${order.room_number ?? '—'}`
                          : (order.city ?? '—')}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] ${
                          order.channel === 'hotel'
                            ? 'bg-bottle-800 text-cream-50'
                            : 'bg-cream-200 text-bottle-800'
                        }`}
                      >
                        {t(`channel.${order.channel}` as 'channel.hotel')}
                      </span>
                      {order.hotel_name ? (
                        <p className="mt-1 text-xs text-ink/45">{order.hotel_name}</p>
                      ) : null}
                    </td>

                    <td className="px-5 py-4 text-end text-bottle-900">
                      {formatIls(Number(order.total_ils), locale)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-2">
                        <StatusBadge status={order.status} />
                        <select
                          className="rounded-lg border border-bottle-800/15 bg-white px-2 py-1.5 text-xs outline-none focus:border-gold-500"
                          value={order.status}
                          disabled={pending && savingId === order.id}
                          onChange={(e) => changeStatus(order, e.target.value as OrderStatus)}
                          aria-label={t('admin.status')}
                        >
                          {ORDER_STATUSES.map((value) => (
                            <option key={value} value={value}>
                              {t(`status.${value}` as 'status.received')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-xs text-ink/45">
                      {formatDateTime(order.created_at, locale)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
