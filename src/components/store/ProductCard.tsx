'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { pick } from '@/lib/i18n/dictionaries';
import { formatIls, formatUsd } from '@/lib/format';
import { TIER_STYLES } from '@/lib/constants';
import type { Product } from '@/lib/types';

export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const { t, locale } = useLanguage();
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const name = pick(product, 'name', locale);
  const subtitle = pick(product, 'subtitle', locale);
  const description = pick(product, 'description', locale);
  const highlights = (locale === 'he' ? product.highlights_he : product.highlights_en) ?? [];
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && (product.is_limited || product.stock <= product.low_stock_at);
  const tier = TIER_STYLES[product.tier];

  function handleAdd() {
    add(product, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 transition duration-300 hover:-translate-y-1 hover:shadow-luxe ${tier.ring} ${
        featured ? 'lg:scale-[1.03]' : ''
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : null}
        <span
          className={`absolute start-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${tier.label}`}
        >
          {product.tier}
        </span>
        {product.is_limited ? (
          <span className="absolute end-4 top-4 rounded-full bg-bottle-900/90 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold-200">
            {t('product.limited')}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow">{subtitle}</p>
        <h3 className="mt-2 text-2xl text-bottle-900">{name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/60">{description}</p>

        {highlights.length > 0 ? (
          <ul className="mt-5 space-y-2 border-t border-bottle-800/8 pt-5">
            {highlights.map((line) => (
              <li key={line} className="flex gap-2.5 text-[13px] leading-relaxed text-ink/70">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                {line}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 flex items-end justify-between gap-4 pt-2">
          <div>
            <p className="font-display text-2xl text-bottle-900">
              {formatIls(Number(product.price_ils), locale)}
            </p>
            <p className="text-xs text-ink/45" dir="ltr">
              ≈ {formatUsd(Number(product.price_usd))}
            </p>
          </div>
          {lowStock ? (
            <span className="text-[11px] uppercase tracking-[0.14em] text-gold-600">
              {t('product.onlyLeft', { count: product.stock })}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          className={`mt-5 w-full ${product.tier === 'vip' ? 'btn-gold' : 'btn-primary'}`}
        >
          {soldOut ? t('product.soldOut') : justAdded ? t('product.added') : t('product.add')}
        </button>
      </div>
    </article>
  );
}
