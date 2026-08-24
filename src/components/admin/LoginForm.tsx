'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export function LoginForm({ nextPath }: { nextPath: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(t('errors.signInFailed'));
      setBusy(false);
      return;
    }

    // The dashboard itself re-checks for a profiles row before rendering.
    router.replace(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-cream-50 p-8 shadow-luxe">
      <label className="block">
        <span className="field-label">Email</span>
        <input
          className="field"
          type="email"
          dir="ltr"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="mt-5 block">
        <span className="field-label">Password</span>
        <input
          className="field"
          type="password"
          dir="ltr"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {error ? (
        <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={busy} className="btn-primary mt-7 w-full">
        {busy ? '…' : t('admin.signIn')}
      </button>
    </form>
  );
}
