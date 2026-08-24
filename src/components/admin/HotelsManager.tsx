'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteHotel, saveHotel, type HotelInput } from '@/app/admin/actions';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { slugify } from '@/lib/format';
import type { Hotel } from '@/lib/types';

const BLANK: HotelInput = {
  name: '',
  name_he: '',
  slug: '',
  city: '',
  address: '',
  contact_name: '',
  contact_phone: '',
  contact_email: '',
  delivery_note: '',
  commission_rate: 10,
  is_active: true,
};

export function HotelsManager({ hotels, siteUrl }: { hotels: Hotel[]; siteUrl: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [draft, setDraft] = useState<HotelInput | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function set<K extends keyof HotelInput>(key: K, value: HotelInput[K]) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function linkFor(slug: string) {
    return `${siteUrl.replace(/\/$/, '')}/hotel/${slug}`;
  }

  /** Free, no-dependency QR: the hotel prints this straight from the browser. */
  function qrFor(slug: string) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
      linkFor(slug),
    )}`;
  }

  async function copy(slug: string) {
    try {
      await navigator.clipboard.writeText(linkFor(slug));
      setCopied(slug);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setError('Clipboard unavailable — copy the link manually.');
    }
  }

  async function submit() {
    if (!draft) return;
    setBusy(true);
    setError(null);
    const result = await saveHotel(draft);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDraft(null);
    startTransition(() => router.refresh());
  }

  async function remove(hotel: Hotel) {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    const result = await deleteHotel(hotel.id);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-ink/50">{t('cart.itemCount', { count: hotels.length })}</p>
        <button type="button" className="btn-primary" onClick={() => setDraft({ ...BLANK })}>
          + {t('admin.add')}
        </button>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {draft ? (
        <div className="card-luxe p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="field-label">Hotel name (EN)</span>
              <input
                className="field"
                value={draft.name}
                onChange={(e) => set('name', e.target.value)}
              />
            </label>
            <label>
              <span className="field-label">Hotel name (HE)</span>
              <input
                className="field"
                dir="rtl"
                value={draft.name_he ?? ''}
                onChange={(e) => set('name_he', e.target.value)}
              />
            </label>
            <label className="sm:col-span-2">
              <span className="field-label">Link / slug</span>
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap text-xs text-ink/40" dir="ltr">
                  /hotel/
                </span>
                <input
                  className="field"
                  dir="ltr"
                  placeholder={slugify(draft.name) || 'the-king-david'}
                  value={draft.slug ?? ''}
                  onChange={(e) => set('slug', e.target.value)}
                />
              </div>
              <span className="mt-1 block text-[11px] text-ink/40">
                Leave empty to generate it from the hotel name.
              </span>
            </label>
            <label>
              <span className="field-label">City</span>
              <input
                className="field"
                value={draft.city ?? ''}
                onChange={(e) => set('city', e.target.value)}
              />
            </label>
            <label>
              <span className="field-label">Address</span>
              <input
                className="field"
                value={draft.address ?? ''}
                onChange={(e) => set('address', e.target.value)}
              />
            </label>
            <label>
              <span className="field-label">Contact name</span>
              <input
                className="field"
                value={draft.contact_name ?? ''}
                onChange={(e) => set('contact_name', e.target.value)}
              />
            </label>
            <label>
              <span className="field-label">Contact phone</span>
              <input
                className="field"
                dir="ltr"
                value={draft.contact_phone ?? ''}
                onChange={(e) => set('contact_phone', e.target.value)}
              />
            </label>
            <label>
              <span className="field-label">Contact email</span>
              <input
                className="field"
                dir="ltr"
                value={draft.contact_email ?? ''}
                onChange={(e) => set('contact_email', e.target.value)}
              />
            </label>
            <label>
              <span className="field-label">Commission %</span>
              <input
                className="field"
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={draft.commission_rate ?? 10}
                onChange={(e) => set('commission_rate', Number(e.target.value))}
              />
            </label>
            <label className="sm:col-span-2">
              <span className="field-label">Delivery note shown to guests</span>
              <textarea
                className="field min-h-20"
                value={draft.delivery_note ?? ''}
                onChange={(e) => set('delivery_note', e.target.value)}
              />
            </label>
            <label className="flex items-center gap-3 sm:col-span-2">
              <input
                type="checkbox"
                className="accent-bottle-800"
                checked={draft.is_active ?? true}
                onChange={(e) => set('is_active', e.target.checked)}
              />
              <span className="text-sm text-ink/70">{t('admin.active')}</span>
            </label>
          </div>

          <div className="mt-6 flex gap-3">
            <button type="button" className="btn-primary" disabled={busy} onClick={submit}>
              {busy ? '…' : t('admin.save')}
            </button>
            <button type="button" className="btn-outline" onClick={() => setDraft(null)}>
              {t('admin.cancel')}
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="card-luxe flex gap-5 p-5">
            <div className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrFor(hotel.slug)}
                alt={`QR for ${hotel.name}`}
                className="h-24 w-24 rounded-lg border border-bottle-800/10 bg-white p-1"
                loading="lazy"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-lg text-bottle-900">{hotel.name}</p>
                  <p className="truncate text-xs text-ink/45">
                    {hotel.city} · {Number(hotel.commission_rate)}%
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wide ${
                    hotel.is_active ? 'bg-bottle-50 text-bottle-700' : 'bg-cream-200 text-ink/45'
                  }`}
                >
                  {hotel.is_active ? t('admin.active') : t('admin.inactive')}
                </span>
              </div>

              <p
                className="mt-3 truncate rounded-lg bg-cream-100 px-3 py-2 font-mono text-[11px] text-bottle-800"
                dir="ltr"
              >
                {linkFor(hotel.slug)}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-full border border-bottle-800/15 px-3 py-1 text-xs text-bottle-800 hover:border-bottle-800/40"
                  onClick={() => copy(hotel.slug)}
                >
                  {copied === hotel.slug ? t('admin.copied') : t('admin.copyLink')}
                </button>
                <a
                  href={qrFor(hotel.slug)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-bottle-800/15 px-3 py-1 text-xs text-bottle-800 hover:border-bottle-800/40"
                >
                  QR
                </a>
                <button
                  type="button"
                  className="rounded-full border border-bottle-800/15 px-3 py-1 text-xs text-bottle-800 hover:border-bottle-800/40"
                  onClick={() =>
                    setDraft({
                      id: hotel.id,
                      name: hotel.name,
                      name_he: hotel.name_he ?? '',
                      slug: hotel.slug,
                      city: hotel.city ?? '',
                      address: hotel.address ?? '',
                      contact_name: hotel.contact_name ?? '',
                      contact_phone: hotel.contact_phone ?? '',
                      contact_email: hotel.contact_email ?? '',
                      delivery_note: hotel.delivery_note ?? '',
                      commission_rate: Number(hotel.commission_rate),
                      is_active: hotel.is_active,
                    })
                  }
                >
                  {t('admin.edit')}
                </button>
                <button
                  type="button"
                  className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                  onClick={() => remove(hotel)}
                >
                  {t('admin.delete')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
