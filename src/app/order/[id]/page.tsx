import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StoreShell } from '@/components/StoreShell';
import { Section } from '@/components/ui/Section';
import { getOrderForConfirmation } from '@/app/actions/orders';
import { formatIls } from '@/lib/format';
import { getLocale, getTranslator } from '@/lib/i18n/server';
import type { Order } from '@/lib/types';

export const metadata = { title: 'Order confirmed', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const locale = getLocale();
  const t = getTranslator(locale);
  const order = (await getOrderForConfirmation(params.id)) as Order | null;
  if (!order) notFound();

  const address = [order.address_line1, order.address_line2, order.city].filter(Boolean).join(', ');

  return (
    <StoreShell showNav={false}>
      <Section className="bg-cream-100">
        <div className="card-luxe mx-auto max-w-2xl overflow-hidden">
          <div className="bg-bottle-900 px-8 py-10 text-center text-cream-100">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/50 text-2xl text-gold-400">
              ✓
            </span>
            <h1 className="mt-6 font-display text-2xl sm:text-3xl">{t('confirmation.title')}</h1>
            <p className="mt-2 text-sm tracking-[0.16em] text-gold-400" dir="ltr">
              {order.order_number}
            </p>
          </div>

          <div className="space-y-6 p-8">
            <p className="text-[15px] leading-relaxed text-ink/70">
              {order.channel === 'hotel'
                ? t('confirmation.hotelBody', {
                    room: order.room_number ?? '',
                    hotel: order.hotel_name ?? '',
                  })
                : t('confirmation.privateBody', { address })}
            </p>

            <div className="rounded-xl bg-cream-100 p-5">
              <ul className="space-y-3">
                {(order.order_items ?? []).map((item) => (
                  <li key={item.id} className="flex justify-between gap-4 text-sm">
                    <span className="text-ink/70">
                      {item.product_name}
                      <span className="text-ink/40"> × {item.quantity}</span>
                    </span>
                    <span className="text-bottle-900">
                      {formatIls(Number(item.line_total_ils), locale)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-bottle-800/10 pt-4">
                {Number(order.delivery_fee_ils) > 0 ? (
                  <div className="flex justify-between text-sm text-ink/60">
                    <span>{t('cart.delivery')}</span>
                    <span>{formatIls(Number(order.delivery_fee_ils), locale)}</span>
                  </div>
                ) : null}
                <div className="mt-2 flex justify-between font-display text-lg text-bottle-900">
                  <span>{t('cart.total')}</span>
                  <span>{formatIls(Number(order.total_ils), locale)}</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-ink/50">
                {t(`payment.${order.payment_method}` as 'payment.bit')}
              </p>
            </div>

            <p className="text-sm text-ink/50">
              {t('confirmation.emailed', { email: order.customer_email })}
            </p>

            <Link href="/" className="btn-outline w-full">
              {t('confirmation.backHome')}
            </Link>
          </div>
        </div>
      </Section>
    </StoreShell>
  );
}
