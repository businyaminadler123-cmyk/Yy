import Link from 'next/link';
import { StoreShell } from '@/components/StoreShell';
import { ProductGrid } from '@/components/store/ProductGrid';
import { Section, SectionHeading } from '@/components/ui/Section';
import { getProducts } from '@/lib/data';
import { getLocale, getTranslator } from '@/lib/i18n/server';

export const revalidate = 60;

export default async function HomePage() {
  const locale = getLocale();
  const t = getTranslator(locale);
  const products = await getProducts();

  return (
    <StoreShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bottle-900 text-cream-100">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=2000&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bottle-900/70 via-bottle-900/85 to-bottle-900" aria-hidden="true" />

        <div className="container-luxe relative py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl animate-fade-up">
            <span className="eyebrow text-gold-400">{t('home.eyebrow')}</span>
            <h1 className="mt-5 font-display text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
              {t('home.title')}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-200/75 sm:text-lg">
              {t('home.subtitle')}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="#collection" className="btn-gold">
                {t('home.ctaPrimary')}
              </Link>
              <Link
                href="#delivery"
                className="btn border border-cream-200/25 text-cream-100 hover:border-cream-200/60"
              >
                {t('home.ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="relative border-t border-white/10">
          <div className="container-luxe grid gap-4 py-6 text-center text-[13px] text-cream-200/60 sm:grid-cols-3">
            <p>{t('home.trust1')}</p>
            <p className="sm:border-x sm:border-white/10">{t('home.trust2')}</p>
            <p>{t('home.trust3')}</p>
          </div>
        </div>
      </section>

      {/* Collection */}
      <Section id="collection" className="bg-cream-100">
        <div className="flex flex-col items-center">
          <SectionHeading
            eyebrow={t('home.collectionEyebrow')}
            title={t('home.collectionTitle')}
            subtitle={t('home.collectionSubtitle')}
          />
        </div>
        <ProductGrid products={products} />
      </Section>

      {/* Story */}
      <Section id="story" className="bg-cream-200/60">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl shadow-luxe">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=80"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <SectionHeading
              align="start"
              eyebrow={t('home.storyEyebrow')}
              title={t('home.storyTitle')}
              subtitle={t('home.storyBody')}
            />
          </div>
        </div>
      </Section>

      {/* Delivery */}
      <Section id="delivery" className="bg-cream-100">
        <div className="flex flex-col items-center">
          <SectionHeading eyebrow={t('home.deliveryEyebrow')} title={t('home.deliveryTitle')} />
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="card-luxe p-8">
            <span className="eyebrow">{t('channel.hotel')}</span>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/70">{t('home.deliveryHotel')}</p>
          </div>
          <div className="card-luxe p-8">
            <span className="eyebrow">{t('channel.private')}</span>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/70">
              {t('home.deliveryPrivate')}
            </p>
          </div>
        </div>
      </Section>
    </StoreShell>
  );
}
