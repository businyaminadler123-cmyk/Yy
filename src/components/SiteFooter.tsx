'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export function SiteFooter() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-bottle-900 text-cream-200">
      <div className="container-luxe grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8" tone="light" />
            <span className="font-display text-lg text-cream-50">{t('brand.name')}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-200/60">
            {t('brand.tagline')} — {t('home.trust1')}
          </p>
        </div>

        <div className="space-y-2 text-sm text-cream-200/70">
          <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-gold-400">
            {t('nav.contact')}
          </p>
          <p dir="ltr">+972 2 555 0140</p>
          <p dir="ltr">concierge@arbaminim.co.il</p>
          <p>{t('footer.hours')}</p>
        </div>

        <div className="space-y-2 text-sm text-cream-200/70">
          <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-gold-400">
            {t('nav.delivery')}
          </p>
          <p>{t('home.trust2')}</p>
          <p>{t('home.trust3')}</p>
        </div>

        <div className="space-y-2 text-sm text-cream-200/70">
          <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-gold-400">
            {t('footer.partner')}
          </p>
          <Link href="/admin" className="block transition hover:text-cream-50">
            {t('nav.admin')}
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-luxe py-5 text-xs text-cream-200/40">
          © {year} {t('brand.name')}. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}
