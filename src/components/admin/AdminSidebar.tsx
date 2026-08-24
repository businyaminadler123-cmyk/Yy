'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Logo } from '@/components/ui/Logo';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { signOut } from '@/app/admin/actions';
import type { TranslateKey } from '@/lib/i18n/dictionaries';

const LINKS: { href: string; key: TranslateKey; icon: string }[] = [
  { href: '/admin', key: 'admin.title', icon: '◆' },
  { href: '/admin/orders', key: 'admin.orders', icon: '❑' },
  { href: '/admin/hotels', key: 'admin.hotels', icon: '⌂' },
  { href: '/admin/products', key: 'admin.products', icon: '❖' },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="flex shrink-0 flex-col bg-bottle-900 text-cream-100 lg:h-screen lg:w-64 lg:sticky lg:top-0">
      <div className="flex items-center gap-3 px-6 py-6">
        <Logo className="h-8 w-8" tone="light" />
        <div className="leading-none">
          <p className="font-display text-base text-cream-50">Arba Minim</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gold-400">
            {t('admin.title')}
          </p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0">
        {LINKS.map((link) => {
          const active =
            link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`admin-nav-link whitespace-nowrap ${active ? 'admin-nav-link-active' : ''}`}
            >
              <span aria-hidden="true" className="text-gold-400">
                {link.icon}
              </span>
              {t(link.key)}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 border-t border-white/10 p-6">
        <LanguageToggle tone="light" />
        <p className="truncate text-xs text-cream-200/45" dir="ltr">
          {email}
        </p>
        <form action={signOut}>
          <button
            type="submit"
            className="text-xs uppercase tracking-[0.16em] text-cream-200/60 transition hover:text-cream-50"
          >
            {t('admin.signOut')}
          </button>
        </form>
      </div>
    </aside>
  );
}
