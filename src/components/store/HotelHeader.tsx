'use client';

import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Logo } from '@/components/ui/Logo';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import type { Hotel } from '@/lib/types';

/** Co-branded header: our mark, a gold divider, then the hotel's name. */
export function HotelHeader({ hotel }: { hotel: Pick<Hotel, 'name' | 'name_he' | 'logo_url'> }) {
  const { t, locale } = useLanguage();
  const { count, open } = useCart();
  const hotelName = (locale === 'he' ? hotel.name_he : hotel.name) || hotel.name;

  return (
    <header className="sticky top-0 z-40 border-b border-bottle-800/10 bg-cream-50/90 backdrop-blur-md">
      <div className="container-luxe flex h-[72px] items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo className="h-8 w-8" />
            <span className="hidden font-display text-base tracking-wide text-bottle-900 sm:block">
              {t('brand.name')}
            </span>
          </Link>
          <span className="h-8 w-px bg-gold-500/50" aria-hidden="true" />
          <div className="flex items-center gap-3">
            {hotel.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hotel.logo_url} alt={hotelName} className="h-7 w-auto object-contain" />
            ) : null}
            <span className="text-sm font-medium text-bottle-800">{hotelName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            type="button"
            onClick={open}
            className="relative rounded-full border border-bottle-800/15 px-4 py-2 text-sm text-bottle-800 transition hover:border-bottle-800/40"
          >
            {t('nav.cart')}
            {count > 0 ? (
              <span className="absolute -end-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] font-semibold text-bottle-900">
                {count}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
