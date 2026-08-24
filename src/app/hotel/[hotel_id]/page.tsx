import type { Metadata } from 'next';
import Link from 'next/link';
import { StoreShell } from '@/components/StoreShell';
import { HotelHeader } from '@/components/store/HotelHeader';
import { ProductGrid } from '@/components/store/ProductGrid';
import { Section, SectionHeading } from '@/components/ui/Section';
import { getHotelByIdentifier, getProducts } from '@/lib/data';
import { getLocale, getTranslator } from '@/lib/i18n/server';

type Props = { params: { hotel_id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hotel = await getHotelByIdentifier(params.hotel_id);
  return {
    title: hotel ? `${hotel.name} — The Four Species` : 'Hotel',
    robots: { index: false }, // QR landing pages are for guests, not search engines
  };
}

export default async function HotelLandingPage({ params }: Props) {
  const locale = getLocale();
  const t = getTranslator(locale);
  const [hotel, products] = await Promise.all([
    getHotelByIdentifier(params.hotel_id),
    getProducts(),
  ]);

  if (!hotel) {
    return (
      <StoreShell showNav={false}>
        <Section className="bg-cream-100">
          <div className="card-luxe mx-auto max-w-lg p-10 text-center">
            <h1 className="font-display text-2xl text-bottle-900">{t('hotel.notFound')}</h1>
            <p className="mt-3 text-sm text-ink/60">{t('hotel.notFoundBody')}</p>
            <Link href="/" className="btn-primary mt-8">
              {t('cart.emptyCta')}
            </Link>
          </div>
        </Section>
      </StoreShell>
    );
  }

  const hotelName = (locale === 'he' ? hotel.name_he : hotel.name) || hotel.name;

  return (
    <StoreShell
      checkoutHref={`/hotel/${hotel.slug}/checkout`}
      header={<HotelHeader hotel={hotel} />}
    >
      {/* Co-branded welcome */}
      <section className="relative overflow-hidden bg-bottle-900 text-cream-100">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-bottle-900/80" aria-hidden="true" />

        <div className="container-luxe relative py-20 text-center sm:py-28">
          <span className="eyebrow text-gold-400">{t('home.eyebrow')}</span>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-3xl leading-tight sm:text-5xl">
            {t('hotel.welcome', { hotel: hotelName })}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-cream-200/75">{t('hotel.subtitle')}</p>

          <p className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-5 py-2.5 text-sm text-gold-200">
            {t('hotel.charge')}
          </p>

          {hotel.delivery_note ? (
            <p className="mx-auto mt-6 max-w-lg text-sm text-cream-200/55">{hotel.delivery_note}</p>
          ) : null}
        </div>
      </section>

      <Section id="collection" className="bg-cream-100">
        <div className="flex flex-col items-center">
          <SectionHeading
            eyebrow={t('home.collectionEyebrow')}
            title={t('home.collectionTitle')}
            subtitle={t('home.collectionSubtitle')}
          />
        </div>
        <ProductGrid products={products} />

        <div className="mt-14 rounded-2xl border border-bottle-800/10 bg-white p-8 text-center shadow-card">
          <p className="text-sm text-ink/60">{t('hotel.concierge', { hotel: hotelName })}</p>
          <Link href={`/hotel/${hotel.slug}/checkout`} className="btn-primary mt-5">
            {t('hotel.orderNow')}
          </Link>
        </div>
      </Section>
    </StoreShell>
  );
}
