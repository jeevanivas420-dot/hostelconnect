'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { StudentProfile, WardenProfile } from '@/types/auth';
import { createClient } from '@/lib/supabase/client';

export function useUser() {
  const { user, role, loading: authLoading } = useAuth();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [warden, setWarden] = useState<WardenProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setStudent(null);
      setWarden(null);
      setLoading(false);
      return;
    }

    async function loadDetailedProfile() {
      try {
        const supabase = createClient();

        if (role === 'STUDENT') {
          const { data } = await supabase
            .from('students')
            .select('*')
            .eq('id', user!.id)
            .single();

          if (data) {
            setStudent({
              ...user!,
              role: 'STUDENT',
              registerNumber: data.register_number,
              roomNumber: data.room_number,
              block: data.block,
              year: data.year,
              department: data.department,
              parentPhone: data.parent_phone,
              isHostelResident: data.is_hostel_resident,
            });
          } else {
            // Fallback profile for demo
            setStudent({
              ...user!,
              role: 'STUDENT',
              registerNumber: '2023CS1084',
              roomNumber: 'A-304',
              block: 'Block A (Aryabhata)',
              year: 3,
              department: 'Computer Science & Engineering',
              parentPhone: '+91 98401 23456',
              isHostelResident: true,
            });
          }
        } else if (role === 'WARDEN') {
          const { data } = await supabase
            .from('wardens')
            .select('*')
            .eq('id', user!.id)
            .single();

          if (data) {
            setWarden({
              ...user!,
              role: 'WARDEN',
              employeeId: data.employee_id,
              assignedBlock: data.assigned_block,
              officeLocation: data.office_location,
            });
          } else {
            // Fallback profile for demo
            setWarden({
              ...user!,
              role: 'WARDEN',
              employeeId: 'WAR-902',
              assignedBlock: 'All Blocks (A, B, C)',
              officeLocation: 'Ground Floor, Admin Block 101',
            });
          }
        }
      } catch {
        // Fallback demo setup
      } finally {
        setLoading(false);
      }
    }

    loadDetailedProfile();
  }, [user, role, authLoading]);

  return {
    user,
    role,
    student,
    warden,
    loading: authLoading || loading,
  };
}
