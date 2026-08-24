import type { ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { requireStaff } from '@/lib/auth';

export const metadata = { title: 'Dashboard', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Redirects to /login when the visitor has no staff profile.
  const session = await requireStaff();

  return (
    <div className="flex min-h-screen flex-col bg-cream-100 lg:flex-row">
      <AdminSidebar email={session.email} />
      <main className="flex-1 overflow-x-hidden px-5 py-8 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}
