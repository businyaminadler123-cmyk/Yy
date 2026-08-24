'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCart } from '@/components/CartProvider';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { formatIls } from '@/lib/format';

/**
 * Slide-over cart. `checkoutHref` differs per flow: the hotel landing page keeps
 * guests inside their hotel checkout, the storefront goes to /checkout.
 */
export function CartDrawer({ checkoutHref = '/checkout' }: { checkoutHref?: string }) {
  const { t, locale } = useLanguage();
  const { lines, isOpen, close, setQuantity, remove, subtotalIls, deliveryFeeIls, totalIls, count } =
    useCart();
  const router = useRouter();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') close();
    }
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  if (!isOpen) return null;

  const isHotelFlow = checkoutHref !== '/checkout';

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label={t('cart.title')}>
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-bottle-900/40 backdrop-blur-sm"
      />

      <aside className="relative ms-auto flex h-full w-full max-w-md animate-slide-in flex-col bg-cream-50 shadow-luxe">
        <header className="flex items-center justify-between border-b border-bottle-800/10 px-6 py-5">
          <h2 className="font-display text-xl text-bottle-900">{t('cart.title')}</h2>
          <button type="button" onClick={close} className="btn-ghost text-xl leading-none">
            ×
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="text-ink/50">{t('cart.empty')}</p>
            <button type="button" className="btn-outline" onClick={close}>
              {t('cart.emptyCta')}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {lines.map((line) => (
                <div key={line.productId} className="flex gap-4 rounded-xl bg-white p-3 shadow-card">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cream-200">
                    {line.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={line.imageUrl}
                        alt={locale === 'he' ? line.nameHe : line.nameEn}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-bottle-900">
                        {locale === 'he' ? line.nameHe : line.nameEn}
                      </p>
                      <button
                        type="button"
                        onClick={() => remove(line.productId)}
                        className="text-xs text-ink/40 underline-offset-2 hover:text-red-600 hover:underline"
                      >
                        {t('cart.remove')}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-bottle-800/15">
                        <button
                          type="button"
                          className="px-3 py-1 text-bottle-800"
                          onClick={() => setQuantity(line.productId, line.quantity - 1)}
                          aria-label="-"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm">{line.quantity}</span>
                        <button
                          type="button"
                          className="px-3 py-1 text-bottle-800"
                          onClick={() => setQuantity(line.productId, line.quantity + 1)}
                          aria-label="+"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm text-bottle-900">
                        {formatIls(line.priceIls * line.quantity, locale)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="space-y-3 border-t border-bottle-800/10 bg-white px-6 py-5">
              <div className="flex justify-between text-sm text-ink/60">
                <span>
                  {t('cart.subtotal')} · {t('cart.itemCount', { count })}
                </span>
                <span>{formatIls(subtotalIls, locale)}</span>
              </div>
              {!isHotelFlow ? (
                <div className="flex justify-between text-sm text-ink/60">
                  <span>{t('cart.delivery')}</span>
                  <span>
                    {deliveryFeeIls === 0 ? t('cart.free') : formatIls(deliveryFeeIls, locale)}
                  </span>
                </div>
              ) : null}
              <div className="rule-gold" />
              <div className="flex justify-between font-display text-lg text-bottle-900">
                <span>{t('cart.total')}</span>
                <span>{formatIls(isHotelFlow ? subtotalIls : totalIls, locale)}</span>
              </div>
              {isHotelFlow ? (
                <p className="rounded-lg bg-bottle-50 px-3 py-2 text-xs text-bottle-700">
                  {t('checkout.roomCharge')}
                </p>
              ) : null}
              <button
                type="button"
                className="btn-primary w-full"
                onClick={() => {
                  close();
                  router.push(checkoutHref);
                }}
              >
                {t('cart.checkout')}
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
