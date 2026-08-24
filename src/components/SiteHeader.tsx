'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Logo } from '@/components/ui/Logo';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

type NavItem = { href: string; key: 'nav.collection' | 'nav.story' | 'nav.delivery' | 'nav.contact' };

const NAV: NavItem[] = [
  { href: '/#collection', key: 'nav.collection' },
  { href: '/#story', key: 'nav.story' },
  { href: '/#delivery', key: 'nav.delivery' },
  { href: '/#contact', key: 'nav.contact' },
];

export function SiteHeader({ showNav = true }: { showNav?: boolean }) {
  const { t } = useLanguage();
  const { count, open } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-bottle-800/8 bg-cream-100/85 backdrop-blur-md">
      <div className="container-luxe flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg tracking-wide text-bottle-900">{t('brand.name')}</span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.24em] text-gold-600">
              {t('brand.tagline')}
            </span>
          </span>
        </Link>

        {showNav ? (
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-bottle-800/70 transition hover:text-bottle-900"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            type="button"
            onClick={open}
            className="relative rounded-full border border-bottle-800/15 px-4 py-2 text-sm text-bottle-800 transition hover:border-bottle-800/40"
            aria-label={t('nav.cart')}
          >
            {t('nav.cart')}
            {count > 0 ? (
              <span className="absolute -end-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] font-semibold text-bottle-900">
                {count}
              </span>
            ) : null}
          </button>
          {showNav ? (
            <button
              type="button"
              className="md:hidden rounded-full border border-bottle-800/15 p-2 text-bottle-800"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label="Menu"
            >
              <span className="block h-px w-4 bg-current" />
              <span className="mt-1 block h-px w-4 bg-current" />
              <span className="mt-1 block h-px w-4 bg-current" />
            </button>
          ) : null}
        </div>
      </div>

      {showNav && mobileOpen ? (
        <nav className="border-t border-bottle-800/8 bg-cream-100 md:hidden">
          <div className="container-luxe flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm text-bottle-800/80"
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
