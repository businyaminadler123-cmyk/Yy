'use client';

import { STATUS_STYLES } from '@/lib/constants';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import type { OrderStatus } from '@/lib/types';

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useLanguage();
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium ring-1 ${STATUS_STYLES[status]}`}
    >
      {t(`status.${status}` as 'status.received')}
    </span>
  );
}
