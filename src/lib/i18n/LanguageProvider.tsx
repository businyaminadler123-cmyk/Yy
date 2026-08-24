'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { LOCALE_COOKIE } from '@/lib/constants';
import {
  DEFAULT_LOCALE,
  dirOf,
  translate,
  type Locale,
  type TranslateKey,
} from './dictionaries';

type LanguageContextValue = {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  isRtl: boolean;
  t: (key: TranslateKey, vars?: Record<string, string | number>) => string;
  setLocale: (next: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? DEFAULT_LOCALE);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    // One year, path-wide, so server components render the same language on reload.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    const dir = dirOf(next);
    document.documentElement.lang = next;
    document.documentElement.dir = dir;
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      dir: dirOf(locale),
      isRtl: locale === 'he',
      t: (key, vars) => translate(locale, key, vars),
      setLocale,
    }),
    [locale, setLocale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
