import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { StaffRole } from '@/lib/types';

export type StaffSession = {
  userId: string;
  email: string;
  fullName: string | null;
  role: StaffRole;
};

/**
 * Resolves the signed-in staff member, or null. A user with no `profiles`
 * row is authenticated but not staff, and gets no dashboard access.
 */
export async function getStaffSession(): Promise<StaffSession | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) return null;

  return {
    userId: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    role: profile.role as StaffRole,
  };
}

/** Guard for admin pages and admin server actions. */
export async function requireStaff(): Promise<StaffSession> {
  const session = await getStaffSession();
  if (!session) redirect('/login?next=/admin');
  return session;
}
