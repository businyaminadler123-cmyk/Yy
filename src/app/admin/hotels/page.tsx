import { HotelsManager } from '@/components/admin/HotelsManager';
import { createClient } from '@/lib/supabase/server';
import { getTranslator } from '@/lib/i18n/server';
import type { Hotel } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminHotelsPage() {
  const t = getTranslator();
  const supabase = createClient();
  const { data } = await supabase.from('hotels').select('*').order('name');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">{t('admin.title')}</span>
        <h1 className="mt-2 font-display text-3xl text-bottle-900">{t('admin.hotels')}</h1>
      </header>

      <HotelsManager hotels={(data ?? []) as Hotel[]} siteUrl={siteUrl} />
    </div>
  );
}
