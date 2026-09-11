'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UserProfile, UserRole } from '@/types/auth';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        // Fallback for demo mock session if stored in localStorage for quick hackathon presentation
        const demoRole = typeof window !== 'undefined' ? localStorage.getItem('demo_role') as UserRole : null;
        if (demoRole) {
          setRole(demoRole);
          setUser({
            id: 'demo-user-123',
            email: demoRole === 'WARDEN' ? 'warden.kumar@hostel.edu' : 'student.arun@hostel.edu',
            fullName: demoRole === 'WARDEN' ? 'Dr. R. Kumar' : 'Arun Karthik',
            role: demoRole,
            phone: '+91 98765 43210',
            createdAt: new Date().toISOString(),
          });
        } else {
          setUser(null);
          setRole(null);
        }
        setLoading(false);
        return;
      }

      // Fetch user profile from public.users table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (!error && data) {
        setUser({
          id: data.id,
          email: data.email,
          fullName: data.full_name,
          role: data.role as UserRole,
          phone: data.phone,
          avatarUrl: data.avatar_url,
          createdAt: data.created_at,
        });
        setRole(data.role as UserRole);
      } else {
        // Default role based on email or user metadata
        const userRole: UserRole = (authUser.user_metadata?.role as UserRole) || 'STUDENT';
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          fullName: authUser.user_metadata?.full_name || 'Hostel Resident',
          role: userRole,
          createdAt: authUser.created_at,
        });
        setRole(userRole);
      }
    } catch {
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();

    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserProfile();
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchUserProfile]);

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_role');
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const setDemoRole = (newRole: UserRole) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_role', newRole);
    }
    setRole(newRole);
    setUser({
      id: newRole === 'WARDEN' ? 'demo-warden-id' : 'demo-student-id',
      email: newRole === 'WARDEN' ? 'warden.kumar@hostel.edu' : 'student.arun@hostel.edu',
      fullName: newRole === 'WARDEN' ? 'Dr. R. Kumar (Chief Warden)' : 'Arun Karthik (Room A-304)',
      role: newRole,
      createdAt: new Date().toISOString(),
    });
  };

  return {
    user,
    role,
    loading,
    signOut,
    setDemoRole,
    isAuthenticated: !!user,
  };
}
