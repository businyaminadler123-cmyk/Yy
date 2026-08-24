'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import type { Locale } from '@/lib/i18n/dictionaries';

const OPTIONS: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'he', label: 'עב' },
];

export function LanguageToggle({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const { locale, setLocale } = useLanguage();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const base = tone === 'light' ? 'text-cream-200/60' : 'text-bottle-800/50';
  const active = tone === 'light' ? 'bg-white/10 text-cream-50' : 'bg-bottle-800 text-cream-50';

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full p-0.5 ${
        tone === 'light' ? 'bg-white/5' : 'bg-bottle-800/5'
      }`}
      role="group"
      aria-label="Language"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => {
            setLocale(option.code);
            // Re-render server components so their strings switch language too.
            startTransition(() => router.refresh());
          }}
          aria-pressed={locale === option.code}
          className={`rounded-full px-3 py-1 text-xs font-medium tracking-wide transition ${
            locale === option.code ? active : `${base} hover:opacity-80`
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
