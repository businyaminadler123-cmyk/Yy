'use client';

import { useLanguage } from '@/lib/i18n/LanguageProvider';
import type { TranslateKey } from '@/lib/i18n/dictionaries';

export function KpiCard({
  labelKey,
  value,
  hint,
  accent = 'plain',
}: {
  labelKey: TranslateKey;
  value: string;
  hint?: string;
  accent?: 'plain' | 'gold' | 'green';
}) {
  const { t } = useLanguage();

  const tone =
    accent === 'gold'
      ? 'border-gold-500/30 bg-gold-100/40'
      : accent === 'green'
        ? 'border-bottle-800/20 bg-bottle-50'
        : 'border-bottle-800/10 bg-white';

  return (
    <div className={`rounded-2xl border p-6 shadow-card ${tone}`}>
      <p className="text-[11px] uppercase tracking-[0.18em] text-bottle-800/55">{t(labelKey)}</p>
      <p className="mt-3 font-display text-3xl text-bottle-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink/45">{hint}</p> : null}
    </div>
  );
}
