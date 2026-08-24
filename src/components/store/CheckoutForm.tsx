'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { formatIls, formatUsd } from '@/lib/format';
import { placeOrder } from '@/app/actions/orders';
import type { Hotel, PaymentMethod } from '@/lib/types';
import type { TranslateKey } from '@/lib/i18n/dictionaries';

type Props = {
  /** 'hotel' hides address + payment and charges the room instead. */
  mode: 'hotel' | 'private';
  hotel?: Pick<Hotel, 'id' | 'name' | 'name_he' | 'slug' | 'delivery_note'> | null;
};

const EMPTY = {
  fullName: '',
  email: '',
  phone: '',
  roomNumber: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postalCode: '',
  deliveryNotes: '',
};

export function CheckoutForm({ mode, hotel = null }: Props) {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const { lines, subtotalIls, subtotalUsd, deliveryFeeIls, totalIls, clear } = useCart();

  const [form, setForm] = useState(EMPTY);
  const [payment, setPayment] = useState<PaymentMethod>('bit');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isHotel = mode === 'hotel';
  const displayTotal = isHotel ? subtotalIls : totalIls;

  function update(field: keyof typeof EMPTY, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (lines.length === 0) {
      setError(t('errors.emptyCart'));
      return;
    }

    setSubmitting(true);
    const result = await placeOrder({
      channel: isHotel ? 'hotel' : 'private',
      paymentMethod: isHotel ? 'room_charge' : payment,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      locale,
      items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
      hotelId: isHotel ? hotel?.id : undefined,
      roomNumber: isHotel ? form.roomNumber : undefined,
      addressLine1: isHotel ? undefined : form.addressLine1,
      addressLine2: isHotel ? undefined : form.addressLine2,
      city: isHotel ? undefined : form.city,
      postalCode: isHotel ? undefined : form.postalCode,
      deliveryNotes: form.deliveryNotes,
    });

    if (!result.ok) {
      setError(t(result.error as TranslateKey));
      setSubmitting(false);
      return;
    }

    clear();
    router.push(`/order/${result.data!.orderId}`);
  }

  if (lines.length === 0) {
    return (
      <div className="card-luxe mx-auto max-w-md p-10 text-center">
        <p className="text-ink/60">{t('cart.empty')}</p>
        <Link href={isHotel && hotel ? `/hotel/${hotel.slug}` : '/'} className="btn-outline mt-6">
          {t('cart.emptyCta')}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
      <div className="space-y-8">
        <fieldset className="card-luxe p-6 sm:p-8">
          <legend className="eyebrow px-2">{t('checkout.contactHeading')}</legend>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="field-label">{t('checkout.fullName')}</span>
              <input
                className="field"
                required
                autoComplete="name"
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
              />
            </label>

            {isHotel ? (
              <label>
                <span className="field-label">{t('checkout.roomNumber')}</span>
                <input
                  className="field"
                  required
                  inputMode="numeric"
                  value={form.roomNumber}
                  onChange={(e) => update('roomNumber', e.target.value)}
                />
              </label>
            ) : null}

            <label className={isHotel ? '' : 'sm:col-span-1'}>
              <span className="field-label">{t('checkout.phone')}</span>
              <input
                className="field"
                required
                type="tel"
                dir="ltr"
                autoComplete="tel"
                placeholder="+972 50 000 0000"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
              />
            </label>

            <label className={isHotel ? 'sm:col-span-2' : 'sm:col-span-1'}>
              <span className="field-label">{t('checkout.email')}</span>
              <input
                className="field"
                required
                type="email"
                dir="ltr"
                autoComplete="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
              />
            </label>
          </div>
        </fieldset>

        {!isHotel ? (
          <fieldset className="card-luxe p-6 sm:p-8">
            <legend className="eyebrow px-2">{t('checkout.deliveryHeading')}</legend>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="field-label">{t('checkout.addressLine1')}</span>
                <input
                  className="field"
                  required
                  autoComplete="address-line1"
                  value={form.addressLine1}
                  onChange={(e) => update('addressLine1', e.target.value)}
                />
              </label>
              <label className="sm:col-span-2">
                <span className="field-label">{t('checkout.addressLine2')}</span>
                <input
                  className="field"
                  autoComplete="address-line2"
                  value={form.addressLine2}
                  onChange={(e) => update('addressLine2', e.target.value)}
                />
              </label>
              <label>
                <span className="field-label">{t('checkout.city')}</span>
                <input
                  className="field"
                  required
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                />
              </label>
              <label>
                <span className="field-label">{t('checkout.postalCode')}</span>
                <input
                  className="field"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={form.postalCode}
                  onChange={(e) => update('postalCode', e.target.value)}
                />
              </label>
              <label className="sm:col-span-2">
                <span className="field-label">{t('checkout.notes')}</span>
                <textarea
                  className="field min-h-24 resize-y"
                  rows={3}
                  value={form.deliveryNotes}
                  onChange={(e) => update('deliveryNotes', e.target.value)}
                />
              </label>
            </div>
          </fieldset>
        ) : null}

        <fieldset className="card-luxe p-6 sm:p-8">
          <legend className="eyebrow px-2">{t('checkout.paymentHeading')}</legend>

          {isHotel ? (
            <div className="mt-4 rounded-xl border border-gold-500/30 bg-gold-100/50 p-5">
              <p className="font-display text-lg text-bottle-900">{t('checkout.roomCharge')}</p>
              <p className="mt-2 text-sm text-ink/60">{t('checkout.roomChargeHint')}</p>
              {hotel?.delivery_note ? (
                <p className="mt-3 border-t border-gold-500/20 pt-3 text-sm text-bottle-700">
                  {hotel.delivery_note}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(
                [
                  { value: 'bit', label: 'checkout.payBit', hint: 'checkout.payBitHint' },
                  { value: 'cash_on_delivery', label: 'checkout.payCash', hint: 'checkout.payCashHint' },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-xl border p-5 transition ${
                    payment === option.value
                      ? 'border-gold-500 bg-gold-100/40 ring-1 ring-gold-500/30'
                      : 'border-bottle-800/15 hover:border-bottle-800/35'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      className="accent-bottle-800"
                      checked={payment === option.value}
                      onChange={() => setPayment(option.value)}
                    />
                    <span className="font-medium text-bottle-900">{t(option.label)}</span>
                  </span>
                  <span className="mt-2 block text-xs leading-relaxed text-ink/55">
                    {t(option.hint)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card-luxe p-6 sm:p-8">
          <h2 className="font-display text-xl text-bottle-900">{t('checkout.orderSummary')}</h2>
          <span className="mt-3 block h-px w-12 bg-gold-500/70" />

          <ul className="mt-5 space-y-4">
            {lines.map((line) => (
              <li key={line.productId} className="flex justify-between gap-4 text-sm">
                <span className="text-ink/70">
                  {locale === 'he' ? line.nameHe : line.nameEn}
                  <span className="text-ink/40"> × {line.quantity}</span>
                </span>
                <span className="whitespace-nowrap text-bottle-900">
                  {formatIls(line.priceIls * line.quantity, locale)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2 border-t border-bottle-800/10 pt-5 text-sm">
            <div className="flex justify-between text-ink/60">
              <span>{t('cart.subtotal')}</span>
              <span>{formatIls(subtotalIls, locale)}</span>
            </div>
            {!isHotel ? (
              <div className="flex justify-between text-ink/60">
                <span>{t('cart.delivery')}</span>
                <span>{deliveryFeeIls === 0 ? t('cart.free') : formatIls(deliveryFeeIls, locale)}</span>
              </div>
            ) : null}
            <div className="flex items-end justify-between pt-3 font-display text-xl text-bottle-900">
              <span>{t('cart.total')}</span>
              <span>{formatIls(displayTotal, locale)}</span>
            </div>
            <p className="text-end text-xs text-ink/40" dir="ltr">
              ≈ {formatUsd(subtotalUsd)}
            </p>
          </div>

          {error ? (
            <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full">
            {submitting ? t('checkout.placing') : t('checkout.placeOrder')}
          </button>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-ink/40">
            {t('checkout.agree')}
          </p>
        </div>
      </aside>
    </form>
  );
}
