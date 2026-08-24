'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteProduct, saveProduct, setProductStock, type ProductInput } from '@/app/admin/actions';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { formatIls, formatUsd } from '@/lib/format';
import type { Product, ProductTier } from '@/lib/types';

const TIERS: ProductTier[] = ['standard', 'premium', 'vip'];

const BLANK: ProductInput = {
  tier: 'standard',
  name_en: '',
  name_he: '',
  subtitle_en: '',
  subtitle_he: '',
  description_en: '',
  description_he: '',
  price_ils: 0,
  price_usd: 0,
  stock: 0,
  is_limited: false,
  is_active: true,
  image_url: '',
  sort_order: 0,
};

export function ProductsManager({ products }: { products: Product[] }) {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [draft, setDraft] = useState<ProductInput | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stockEdits, setStockEdits] = useState<Record<string, string>>({});

  function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function submit() {
    if (!draft) return;
    setBusy(true);
    setError(null);
    const result = await saveProduct(draft);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDraft(null);
    startTransition(() => router.refresh());
  }

  async function saveStock(product: Product) {
    const raw = stockEdits[product.id];
    if (raw === undefined) return;
    const next = Number(raw);
    if (!Number.isFinite(next) || next < 0) {
      setError('Stock must be zero or more');
      return;
    }
    const result = await setProductStock(product.id, next);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setStockEdits((prev) => {
      const copy = { ...prev };
      delete copy[product.id];
      return copy;
    });
    startTransition(() => router.refresh());
  }

  async function remove(product: Product) {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    const result = await deleteProduct(product.id);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-ink/50">{t('cart.itemCount', { count: products.length })}</p>
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
              <span className="field-label">Tier</span>
              <select
                className="field"
                value={draft.tier}
                onChange={(e) => set('tier', e.target.value as ProductTier)}
              >
                {TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="field-label">{t('admin.stock')}</span>
              <input
                className="field"
                type="number"
                min={0}
                value={draft.stock}
                onChange={(e) => set('stock', Number(e.target.value))}
              />
            </label>
            <label>
              <span className="field-label">Name (EN)</span>
              <input
                className="field"
                value={draft.name_en}
                onChange={(e) => set('name_en', e.target.value)}
              />
            </label>
            <label>
              <span className="field-label">Name (HE)</span>
              <input
                className="field"
                dir="rtl"
                value={draft.name_he}
                onChange={(e) => set('name_he', e.target.value)}
              />
            </label>
            <label>
              <span className="field-label">Subtitle (EN)</span>
              <input
                className="field"
                value={draft.subtitle_en ?? ''}
                onChange={(e) => set('subtitle_en', e.target.value)}
              />
            </label>
            <label>
              <span className="field-label">Subtitle (HE)</span>
              <input
                className="field"
                dir="rtl"
                value={draft.subtitle_he ?? ''}
                onChange={(e) => set('subtitle_he', e.target.value)}
              />
            </label>
            <label>
              <span className="field-label">{t('admin.price')} (₪)</span>
              <input
                className="field"
                type="number"
                min={0}
                step={1}
                value={draft.price_ils}
                onChange={(e) => set('price_ils', Number(e.target.value))}
              />
            </label>
            <label>
              <span className="field-label">{t('admin.price')} ($)</span>
              <input
                className="field"
                type="number"
                min={0}
                step={1}
                value={draft.price_usd}
                onChange={(e) => set('price_usd', Number(e.target.value))}
              />
            </label>
            <label className="sm:col-span-2">
              <span className="field-label">Description (EN)</span>
              <textarea
                className="field min-h-20"
                value={draft.description_en ?? ''}
                onChange={(e) => set('description_en', e.target.value)}
              />
            </label>
            <label className="sm:col-span-2">
              <span className="field-label">Description (HE)</span>
              <textarea
                className="field min-h-20"
                dir="rtl"
                value={draft.description_he ?? ''}
                onChange={(e) => set('description_he', e.target.value)}
              />
            </label>
            <label className="sm:col-span-2">
              <span className="field-label">Image URL</span>
              <input
                className="field"
                dir="ltr"
                value={draft.image_url ?? ''}
                onChange={(e) => set('image_url', e.target.value)}
              />
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="accent-bottle-800"
                checked={draft.is_limited ?? false}
                onChange={(e) => set('is_limited', e.target.checked)}
              />
              <span className="text-sm text-ink/70">{t('product.limited')}</span>
            </label>
            <label className="flex items-center gap-3">
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

      <div className="card-luxe overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-bottle-800/10 bg-cream-100/60 text-[11px] uppercase tracking-[0.14em] text-bottle-800/55">
                <th className="px-5 py-3 text-start font-medium">{t('admin.products')}</th>
                <th className="px-5 py-3 text-end font-medium">{t('admin.price')}</th>
                <th className="px-5 py-3 text-start font-medium">{t('admin.stock')}</th>
                <th className="px-5 py-3 text-start font-medium">{t('admin.status')}</th>
                <th className="px-5 py-3 text-end font-medium">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bottle-800/8">
              {products.map((product) => {
                const stockValue = stockEdits[product.id] ?? String(product.stock);
                const dirty = stockEdits[product.id] !== undefined;
                return (
                  <tr key={product.id} className="hover:bg-cream-100/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-cream-200">
                          {product.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image_url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="text-bottle-900">
                            {locale === 'he' ? product.name_he : product.name_en}
                          </p>
                          <p className="text-xs uppercase tracking-wide text-ink/40">
                            {product.tier}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-end">
                      <p className="text-bottle-900">
                        {formatIls(Number(product.price_ils), locale)}
                      </p>
                      <p className="text-xs text-ink/40" dir="ltr">
                        {formatUsd(Number(product.price_usd))}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          className="w-20 rounded-lg border border-bottle-800/15 px-2 py-1.5 text-sm outline-none focus:border-gold-500"
                          type="number"
                          min={0}
                          value={stockValue}
                          onChange={(e) =>
                            setStockEdits((prev) => ({ ...prev, [product.id]: e.target.value }))
                          }
                        />
                        {dirty ? (
                          <button
                            type="button"
                            className="rounded-full bg-bottle-800 px-3 py-1 text-xs text-cream-50"
                            onClick={() => saveStock(product)}
                          >
                            {t('admin.save')}
                          </button>
                        ) : null}
                      </div>
                      {product.stock <= product.low_stock_at ? (
                        <p className="mt-1 text-[11px] text-gold-600">
                          {t('product.onlyLeft', { count: product.stock })}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] ${
                          product.is_active
                            ? 'bg-bottle-50 text-bottle-700'
                            : 'bg-cream-200 text-ink/45'
                        }`}
                      >
                        {product.is_active ? t('admin.active') : t('admin.inactive')}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-end">
                      <button
                        type="button"
                        className="rounded-full border border-bottle-800/15 px-3 py-1 text-xs text-bottle-800 hover:border-bottle-800/40"
                        onClick={() =>
                          setDraft({
                            id: product.id,
                            slug: product.slug,
                            tier: product.tier,
                            name_en: product.name_en,
                            name_he: product.name_he,
                            subtitle_en: product.subtitle_en ?? '',
                            subtitle_he: product.subtitle_he ?? '',
                            description_en: product.description_en ?? '',
                            description_he: product.description_he ?? '',
                            price_ils: Number(product.price_ils),
                            price_usd: Number(product.price_usd),
                            stock: product.stock,
                            is_limited: product.is_limited,
                            is_active: product.is_active,
                            image_url: product.image_url ?? '',
                            sort_order: product.sort_order,
                          })
                        }
                      >
                        {t('admin.edit')}
                      </button>
                      <button
                        type="button"
                        className="ms-2 rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                        onClick={() => remove(product)}
                      >
                        {t('admin.delete')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
