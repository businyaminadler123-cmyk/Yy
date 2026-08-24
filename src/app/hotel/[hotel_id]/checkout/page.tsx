import { notFound } from 'next/navigation';
import { StoreShell } from '@/components/StoreShell';
import { HotelHeader } from '@/components/store/HotelHeader';
import { CheckoutForm } from '@/components/store/CheckoutForm';
import { Section } from '@/components/ui/Section';
import { getHotelByIdentifier } from '@/lib/data';
import { getLocale, getTranslator } from '@/lib/i18n/server';

export const metadata = { title: 'Checkout', robots: { index: false } };

export default async function HotelCheckoutPage({ params }: { params: { hotel_id: string } }) {
  const locale = getLocale();
  const t = getTranslator(locale);
  const hotel = await getHotelByIdentifier(params.hotel_id);
  if (!hotel) notFound();

  const hotelName = (locale === 'he' ? hotel.name_he : hotel.name) || hotel.name;

  return (
    <StoreShell
      checkoutHref={`/hotel/${hotel.slug}/checkout`}
      header={<HotelHeader hotel={hotel} />}
    >
      <Section className="bg-cream-100">
        <div className="mb-10">
          <span className="eyebrow">{t('hotel.welcome', { hotel: hotelName })}</span>
          <h1 className="mt-3 font-display text-3xl text-bottle-900 sm:text-4xl">
            {t('checkout.title')}
          </h1>
          <span className="mt-4 block h-px w-16 bg-gold-500/70" />
        </div>
        <CheckoutForm mode="hotel" hotel={hotel} />
      </Section>
    </StoreShell>
  );
}
