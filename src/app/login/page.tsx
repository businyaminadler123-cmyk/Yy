import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/LoginForm';
import { Logo } from '@/components/ui/Logo';
import { getStaffSession } from '@/lib/auth';

export const metadata = { title: 'Sign in', robots: { index: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const session = await getStaffSession();
  if (session) redirect(searchParams.next ?? '/admin');

  return (
    <main className="flex min-h-screen items-center justify-center bg-bottle-900 px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo className="h-10 w-10" tone="light" />
          <h1 className="font-display text-2xl text-cream-50">Arba Minim</h1>
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold-400">Staff dashboard</p>
        </div>
        <LoginForm nextPath={searchParams.next ?? '/admin'} />
      </div>
    </main>
  );
}
