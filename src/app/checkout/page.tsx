import { StoreShell } from '@/components/StoreShell';
import { CheckoutForm } from '@/components/store/CheckoutForm';
import { Section } from '@/components/ui/Section';
import { getLocale, getTranslator } from '@/lib/i18n/server';

export const metadata = { title: 'Checkout' };

export default function CheckoutPage() {
  const t = getTranslator(getLocale());

  return (
    <StoreShell showNav={false}>
      <Section className="bg-cream-100">
        <div className="mb-10">
          <span className="eyebrow">{t('brand.name')}</span>
          <h1 className="mt-3 font-display text-3xl text-bottle-900 sm:text-4xl">
            {t('checkout.title')}
          </h1>
          <span className="mt-4 block h-px w-16 bg-gold-500/70" />
        </div>
        <CheckoutForm mode="private" />
      </Section>
    </StoreShell>
  );
}
