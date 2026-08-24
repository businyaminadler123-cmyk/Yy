import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Frank_Ruhl_Libre } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';
import { dirOf } from '@/lib/i18n/dictionaries';
import { getLocale } from '@/lib/i18n/server';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-hebrew',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Arba Minim — The Four Species, delivered in Israel',
    template: '%s · Arba Minim',
  },
  description:
    'Hand-selected lulav, etrog, hadassim and aravot. Delivered to your hotel room or your door anywhere in Israel, in time for Sukkot.',
  openGraph: {
    type: 'website',
    title: 'Arba Minim — The Four Species, delivered in Israel',
    description: 'Hand-selected sets, rabbinically certified, delivered to your room or your door.',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B2C23',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Locale is a cookie, so `/`, `/hotel/[id]` and `/admin` keep their URLs
  // while still rendering server-side in the visitor's language.
  const locale = getLocale();

  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      className={`${playfair.variable} ${inter.variable} ${frankRuhl.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <LanguageProvider initialLocale={locale}>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
