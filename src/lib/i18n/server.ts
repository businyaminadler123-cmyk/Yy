import { cookies } from 'next/headers';
import { LOCALE_COOKIE } from '@/lib/constants';
import { DEFAULT_LOCALE, isLocale, translate, type Locale, type TranslateKey } from './dictionaries';

/** Reads the locale cookie inside a server component. Defaults to English. */
export function getLocale(): Locale {
  const value = cookies().get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Server-side translator, mirrors the `t` from useLanguage(). */
export function getTranslator(locale: Locale = getLocale()) {
  return (key: TranslateKey, vars?: Record<string, string | number>) =>
    translate(locale, key, vars);
}
