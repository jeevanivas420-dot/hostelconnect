import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { UserProfile, UserRole } from '@/types/auth';

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const supabase = createBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !data) return null;
  return data.role as UserRole;
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = createBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) return null;
  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    role: data.role,
    phone: data.phone,
    avatarUrl: data.avatar_url,
    createdAt: data.created_at,
  };
}

export async function signOutUser(): Promise<void> {
  const supabase = createBrowserClient();
  await supabase.auth.signOut();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
