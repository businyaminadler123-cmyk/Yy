'use client';

import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { CartDrawer } from '@/components/store/CartDrawer';

/**
 * Storefront chrome shared by the homepage, the hotel pages and checkout.
 * `checkoutHref` keeps hotel guests inside their own hotel flow.
 */
export function StoreShell({
  children,
  checkoutHref = '/checkout',
  showNav = true,
  header,
}: {
  children: ReactNode;
  checkoutHref?: string;
  showNav?: boolean;
  header?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {header ?? <SiteHeader showNav={showNav} />}
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CartDrawer checkoutHref={checkoutHref} />
    </div>
  );
}
