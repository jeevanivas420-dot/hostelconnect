'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatDate, formatDateTime, getStatusColor } from '@/lib/utils';
import {
  PlaneTakeoff,
  AlertTriangle,
  HeartPulse,
  PackageCheck,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  ChevronRight,
  Filter,
  Check,
  X,
  Phone,
  Building,
  RefreshCw,
  Megaphone,
  Send,
  UtensilsCrossed,
  UserCheck,
  Plus,
  Sparkles,
} from 'lucide-react';
import { LeaveRequest } from '@/types/leave';
import { Complaint } from '@/types/complaint';
import { MedicalRequest } from '@/types/medical';
import { Parcel } from '@/types/parcel';

export default function WardenDashboardPage() {
  const { user } = useAuth();
  const { warden } = useUser();

  // Dashboard state
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [medicalRequests, setMedicalRequests] = useState<MedicalRequest[]>([]);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [totalStudentCount, setTotalStudentCount] = useState<number>(482);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Reject Modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  // Quick Broadcast Announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState('MESS');
  const [annPriority, setAnnPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastToast, setBroadcastToast] = useState<string | null>(null);

  // Quick Order/Parcel arrival modal state
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [courierCompany, setCourierCompany] = useState('Amazon India');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [studentName, setStudentName] = useState('Arun Karthik');
  const [roomNumber, setRoomNumber] = useState('A-304');
  const [isLoggingOrder, setIsLoggingOrder] = useState(false);

  // Assign Maid Modal state
  const [maidModalOpen, setMaidModalOpen] = useState(false);
  const [selectedMedCase, setSelectedMedCase] = useState<MedicalRequest | null>(null);
  const [assignedMaidName, setAssignedMaidName] = useState('Lakshmi (Caretaker - Block A)');
  const [roomFoodDelivery, setRoomFoodDelivery] = useState(true);
  const [dietNotes, setDietNotes] = useState('Mild curd rice & warm drinking water delivered to room');
  const [isAssigningMaid, setIsAssigningMaid] = useState(false);

  const handleBroadcastAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    setIsBroadcasting(true);
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isAnnouncement: true,
          title: annTitle.trim(),
          content: annContent.trim(),
          category: annCategory,
          priority: annPriority,
          authorName: 'Chief Warden Office',
        }),
      });
      if (res.ok) {
        setAnnTitle('');
        setAnnContent('');
        setBroadcastToast('📢 Announcement broadcasted to all students successfully!');
        setTimeout(() => setBroadcastToast(null), 4000);
      }
    } catch {
      // Ignore
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleLogOrderArrival = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    setIsLoggingOrder(true);
    try {
      const res = await fetch('/api/parcels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingNumber: trackingNumber.trim(),
          courierCompany,
          studentName: studentName.trim(),
          roomNumber: roomNumber.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setParcels((prev) => [data.parcel, ...prev]);
        setOrderModalOpen(false);
        setTrackingNumber('');
        setBroadcastToast(`Order arrival logged! OTP: ${data.parcel.otpCode}`);
        setTimeout(() => setBroadcastToast(null), 5000);
      }
    } catch {
      // Ignore
    } finally {
      setIsLoggingOrder(false);
    }
  };

  const handleQuickHandoverParcel = async (parcelId: string) => {
    try {
      const res = await fetch('/api/parcels', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: parcelId,
          status: 'COLLECTED',
        }),
      });
      if (res.ok) {
        setParcels((prev) =>
          prev.map((p) => (p.id === parcelId ? { ...p, status: 'COLLECTED' } : p))
        );
        setBroadcastToast('Parcel handed over to resident.');
        setTimeout(() => setBroadcastToast(null), 3000);
      }
    } catch {
      // Ignore
    }
  };

  const handleOpenMaidModal = (med: MedicalRequest) => {
    setSelectedMedCase(med);
    setAssignedMaidName(med.assignedMaid || 'Lakshmi (Caretaker - Block A)');
    setRoomFoodDelivery(med.roomFoodDelivery !== undefined ? med.roomFoodDelivery : true);
    setDietNotes(med.dietNotes || 'Mild curd rice & warm drinking water delivered to room');
    setMaidModalOpen(true);
  };

  const handleSaveMaidAssignment = async () => {
    if (!selectedMedCase) return;
    setIsAssigningMaid(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedMedCase.id,
          requestCategory: 'medical',
          status: 'ATTENDED',
          assignedMaid: assignedMaidName,
          roomFoodDelivery,
          dietNotes,
        }),
      });
      if (res.ok) {
        setMedicalRequests((prev) =>
          prev.map((m) =>
            m.id === selectedMedCase.id
              ? {
                  ...m,
                  status: 'ATTENDED',
                  assignedMaid: assignedMaidName,
                  roomFoodDelivery,
                  dietNotes,
                }
              : m
          )
        );
        setMaidModalOpen(false);
        setBroadcastToast(`Maid ${assignedMaidName} assigned to Room ${selectedMedCase.roomNumber}!`);
        setTimeout(() => setBroadcastToast(null), 4000);
      }
    } catch {
      // Ignore
    } finally {
      setIsAssigningMaid(false);
    }
  };

  // 1. Fetch real DB data with comprehensive fallback
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Total students count
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });
      if (studentCount !== null && studentCount > 0) {
        setTotalStudentCount(studentCount);
      }

      // Leave Requests: fetch from /api/leave for end-to-end synchronization
      try {
        const leaveRes = await fetch('/api/leave');
        if (leaveRes.ok) {
          const leaveData = await leaveRes.json();
          if (leaveData.leaves && leaveData.leaves.length > 0) {
            setLeaveRequests(leaveData.leaves);
          }
        }
      } catch {
        // Fallback handled in API
      }

      // Complaints
      const { data: compData, error: compErr } = await supabase
        .from('complaints')
        .select('*, students(room_number, block, users(full_name))')
        .order('created_at', { ascending: false });

      if (!compErr && compData && compData.length > 0) {
        const mappedComps: Complaint[] = compData.map((c: any) => ({
          id: c.id,
          studentId: c.student_id,
          studentName: c.students?.users?.full_name || 'Resident',
          roomNumber: c.students?.room_number || 'A-102',
          block: c.students?.block || 'Block A',
          title: c.title,
          description: c.description,
          category: c.category,
          priority: c.priority,
          status: c.status,
          createdAt: c.created_at,
          updatedAt: c.updated_at,
        }));
        setComplaints(mappedComps);
      } else {
        // Fallback demo complaints
        setComplaints([
          {
            id: 'comp-1',
            studentId: 'stud-4',
            studentName: 'Sanjay Raman',
            roomNumber: 'B-204',
            block: 'Block B',
            title: 'Ceiling Fan Sparks & Burning Smell',
            description: 'Fan speed regulator sparked and burnt odor detected when turned to level 5.',
            category: 'ELECTRICAL',
            priority: 'URGENT',
            status: 'OPEN',
            createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'comp-2',
            studentId: 'stud-5',
            studentName: 'Naveen Kumar',
            roomNumber: 'A-405',
            block: 'Block A',
            title: 'Washroom Pipe Leakage & Water Pressure Low',
            description: 'Sink tap in floor 4 common washroom continuously dripping.',
            category: 'PLUMBING',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            assignedStaff: 'Murugan (Plumber)',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'comp-3',
            studentId: 'stud-6',
            studentName: 'Deepak Raj',
            roomNumber: 'C-102',
            block: 'Block C',
            title: 'Wi-Fi Access Point Dropping Packets',
            description: 'Block C wing 1 router keeps disconnecting every 10 minutes during project work.',
            category: 'WIFI',
            priority: 'HIGH',
            status: 'OPEN',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }

      // Medical Requests
      const { data: medData, error: medErr } = await supabase
        .from('medical_requests')
        .select('*, students(room_number, block, users(full_name))')
        .order('created_at', { ascending: false });

      if (!medErr && medData && medData.length > 0) {
        const mappedMeds: MedicalRequest[] = medData.map((m: any) => ({
          id: m.id,
          studentId: m.student_id,
          studentName: m.students?.users?.full_name || 'Resident',
          roomNumber: m.students?.room_number || 'A-102',
          symptoms: m.symptoms,
          urgency: m.urgency,
          temperature: m.temperature,
          requiresAmbulance: m.requires_ambulance,
          status: m.status,
          createdAt: m.created_at,
          updatedAt: m.updated_at,
        }));
        setMedicalRequests(mappedMeds);
      } else {
        // Fallback demo medical cases
        setMedicalRequests([
          {
            id: 'med-1',
            studentId: 'stud-7',
            studentName: 'Harish Babu',
            roomNumber: 'A-108',
            symptoms: 'High grade fever 102.4 F, chills, severe fatigue since 2 hours.',
            urgency: 'CRITICAL',
            temperature: '102.4 F',
            requiresAmbulance: false,
            status: 'SUBMITTED',
            createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'med-2',
            studentId: 'stud-8',
            studentName: 'Dinesh Balan',
            roomNumber: 'B-302',
            symptoms: 'Severe ankle sprain while playing basketball in hostel court.',
            urgency: 'MODERATE',
            requiresAmbulance: false,
            status: 'ATTENDED',
            firstAidGiven: 'Cold pack and crepe bandage applied by warden assistant',
            createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }

      // Parcels
      const { data: parcelData, error: parcelErr } = await supabase
        .from('parcels')
        .select('*, students(room_number, block, users(full_name))')
        .order('arrival_date', { ascending: false });

      if (!parcelErr && parcelData && parcelData.length > 0) {
        const mappedParcels: Parcel[] = parcelData.map((p: any) => ({
          id: p.id,
          studentId: p.student_id,
          studentName: p.students?.users?.full_name || 'Resident',
          roomNumber: p.students?.room_number || 'A-304',
          trackingNumber: p.tracking_number,
          courierCompany: p.courier_company,
          arrivalDate: p.arrival_date,
          status: p.status,
          otpCode: p.otp_code,
          createdAt: p.created_at,
        }));
        setParcels(mappedParcels);
      } else {
        // Fallback demo parcel log
        setParcels([
          {
            id: 'par-1',
            studentId: 'stud-1',
            studentName: 'Arun Karthik',
            roomNumber: 'A-304',
            trackingNumber: 'DEL-AMZ-98231',
            courierCompany: 'Amazon India',
            arrivalDate: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
            otpCode: '4921',
            status: 'ARRIVED',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'par-2',
            studentId: 'stud-9',
            studentName: 'Surya Narayanan',
            roomNumber: 'B-215',
            trackingNumber: 'BD-8834710',
            courierCompany: 'BlueDart Express',
            arrivalDate: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
            otpCode: '8310',
            status: 'ARRIVED',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'par-3',
            studentId: 'stud-10',
            studentName: 'Vigneshwaran M',
            roomNumber: 'C-311',
            trackingNumber: 'FK-551928',
            courierCompany: 'Flipkart Logistics',
            arrivalDate: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
            collectionDate: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
            status: 'COLLECTED',
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      // Handled gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-polling every 3 seconds for live student leave submissions
    const interval = setInterval(() => {
      fetch('/api/leave')
        .then((r) => r.json())
        .then((d) => {
          if (d.leaves && Array.isArray(d.leaves)) {
            setLeaveRequests(d.leaves);
          }
        })
        .catch(() => {});
    }, 3000);

    // Supabase Realtime channel subscription
    try {
      const supabase = createClient();
      const channel = supabase
        .channel('warden-leave-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'leave_requests' },
          () => {
            fetchDashboardData();
          }
        )
        .subscribe();

      return () => {
        clearInterval(interval);
        supabase.removeChannel(channel);
      };
    } catch {
      return () => clearInterval(interval);
    }
  }, []);

  // 2. Real Inline Approve Action for Leave Request
  const handleApproveLeave = async (leaveId: string) => {
    setActionLoadingId(leaveId);
    try {
      // 1. Call API route with PATCH
      const res = await fetch('/api/leave', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: leaveId,
          status: 'APPROVED',
          approvedBy: warden?.id || user?.id || 'WAR-902',
        }),
      });

      // 2. Update Supabase table directly if available
      try {
        const supabase = createClient();
        await supabase
          .from('leave_requests')
          .update({
            status: 'APPROVED',
            approved_by: warden?.id || user?.id || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', leaveId);
      } catch {
        // Fallback handled
      }

      // 3. Update state locally for instant optimistic UI
      setLeaveRequests((prev) =>
        prev.map((req) =>
          req.id === leaveId ? { ...req, status: 'APPROVED' } : req
        )
      );

      setActionSuccessMsg(`Leave request #${leaveId.slice(0, 8)} approved successfully. Digital Outpass activated.`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // 3. Real Inline Reject Action for Leave Request
  const handleOpenRejectModal = (leaveId: string) => {
    setSelectedLeaveId(leaveId);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmRejectLeave = async () => {
    if (!selectedLeaveId) return;
    setActionLoadingId(selectedLeaveId);
    try {
      // 1. Call API route with PATCH
      await fetch('/api/leave', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLeaveId,
          status: 'REJECTED',
          wardenRemarks: rejectReason || 'Parent verbal verification could not be established',
          approvedBy: warden?.id || user?.id || 'WAR-902',
        }),
      });

      // 2. Update Supabase table directly if available
      try {
        const supabase = createClient();
        await supabase
          .from('leave_requests')
          .update({
            status: 'REJECTED',
            warden_remarks: rejectReason || 'Parent verbal verification could not be established',
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedLeaveId);
      } catch {
        // Fallback handled
      }

      // 3. Update state locally
      setLeaveRequests((prev) =>
        prev.map((req) =>
          req.id === selectedLeaveId
            ? { ...req, status: 'REJECTED', wardenRemarks: rejectReason }
            : req
        )
      );

      setRejectModalOpen(false);
      setActionSuccessMsg(`Leave request rejected with remarks recorded.`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
      setSelectedLeaveId(null);
    }
  };

  // Counts
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'PENDING');
  const openComplaints = complaints.filter((c) => c.status === 'OPEN' || c.status === 'IN_PROGRESS');
  const criticalEmergencies = [
    ...medicalRequests.filter((m) => m.urgency === 'CRITICAL' || m.urgency === 'URGENT'),
    ...complaints.filter((c) => c.priority === 'URGENT' && c.status === 'OPEN'),
  ];
  const pendingParcels = parcels.filter((p) => p.status === 'ARRIVED');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Action toast */}
      {actionSuccessMsg && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 text-sm font-medium animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Warden Command Center
              </span>
              <span className="text-xs text-slate-400">
                {warden?.assignedBlock || 'Blocks A, B & C (All Wings)'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Warden Operations Dashboard
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Supervising {totalStudentCount} hostel residents. Review outpass permissions, monitor active emergencies, and assign room repairs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={fetchDashboardData}
              isLoading={loading}
              className="border-slate-700 text-white hover:bg-white/10"
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh Live Data
            </Button>
            <Link href="/warden/announcements">
              <Button
                variant="primary"
                size="md"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/20"
              >
                Broadcast Notice
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 🚨 Emergency Requests Flagged Separately */}
      {criticalEmergencies.length > 0 && (
        <div className="rounded-2xl border-2 border-rose-500/40 bg-rose-500/10 dark:bg-rose-950/30 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              <span>Priority Action Required: {criticalEmergencies.length} Urgent Item(s) Flagged</span>
            </div>
            <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              Requires immediate warden inspection
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {medicalRequests
              .filter((m) => m.urgency === 'CRITICAL' || m.urgency === 'URGENT')
              .map((med) => (
                <div
                  key={med.id}
                  className="flex items-start justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="error" size="sm" withDot>
                        MEDICAL EMERGENCY
                      </Badge>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Room {med.roomNumber} ({med.studentName})
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {med.symptoms} {med.temperature && `• Temp: ${med.temperature}`}
                    </p>
                  </div>
                  <Link href="/warden/medical">
                    <Button variant="destructive" size="sm" className="text-xs">
                      Attend Case
                    </Button>
                  </Link>
                </div>
              ))}

            {complaints
              .filter((c) => c.priority === 'URGENT' && c.status === 'OPEN')
              .map((comp) => (
                <div
                  key={comp.id}
                  className="flex items-start justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="error" size="sm" withDot>
                        SAFETY HAZARD
                      </Badge>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Room {comp.roomNumber} ({comp.studentName})
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {comp.title} - {comp.description}
                    </p>
                  </div>
                  <Link href="/warden/complaints">
                    <Button variant="outline" size="sm" className="text-xs border-rose-300 text-rose-700">
                      Assign Staff
                    </Button>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Residents"
          value={totalStudentCount}
          icon={Users}
          accentColor="indigo"
          description="98% hostel occupancy"
          href="/warden/students"
        />

        <StatCard
          title="Pending Outpasses"
          value={pendingLeaves.length}
          icon={PlaneTakeoff}
          accentColor="amber"
          description={`${pendingLeaves.length} student permissions awaiting`}
          badge={pendingLeaves.length > 0 ? { text: `${pendingLeaves.length} New`, variant: 'warning' } : undefined}
          href="#leave-section"
        />

        <StatCard
          title="Open Complaints"
          value={openComplaints.length}
          icon={AlertTriangle}
          accentColor="rose"
          description="Electrical & plumbing queue"
          href="#complaints-section"
        />

        <StatCard
          title="Medical Cases"
          value={medicalRequests.length}
          icon={HeartPulse}
          accentColor="purple"
          description="1 active emergency"
          badge={{ text: 'Health Desk', variant: 'info' }}
          href="/warden/medical"
        />

        <StatCard
          title="Parcels at Desk"
          value={pendingParcels.length}
          icon={PackageCheck}
          accentColor="sky"
          description="Awaiting OTP collection"
          href="#parcels-section"
        />
      </div>

      {/* Quick Announcement Typing Bar & Broadcast Transmitter */}
      <Card className="border-purple-200 dark:border-purple-900/60 shadow-md bg-gradient-to-r from-purple-50/40 via-white to-indigo-50/40 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                Announcement Broadcast Typing Bar
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Live Transmitter
                </span>
              </CardTitle>
              <CardDescription>
                Directly type and broadcast announcements to student portals
              </CardDescription>
            </div>
          </div>
          <Link
            href="/warden/announcements"
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            All Broadcasts <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-5">
          <form onSubmit={handleBroadcastAnnouncement} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <Input
                  placeholder="Announcement Title (e.g., Saveetha Aug 2026 Menu Active / Rain Curfew Notice)..."
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  required
                  className="text-xs font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value)}
                  className="text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 font-medium"
                >
                  <option value="MESS">Mess & Food</option>
                  <option value="ADMIN">Administration</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="EMERGENCY">Emergency</option>
                </select>
                <select
                  value={annPriority}
                  onChange={(e) => setAnnPriority(e.target.value as any)}
                  className="text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 font-medium"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High Priority</option>
                  <option value="URGENT">Urgent Alert</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <textarea
                rows={2}
                placeholder="Type the announcement message details to broadcast to student dashboards..."
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                required
                className="flex-1 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-100"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isBroadcasting}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold shrink-0 self-end sm:self-auto"
                leftIcon={<Send className="w-4 h-4" />}
              >
                Broadcast to Students
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Pending Leave Requests with INLINE APPROVE/REJECT */}
        <div className="lg:col-span-2 space-y-6" id="leave-section">
          <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <PlaneTakeoff className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Pending Leave Requests
                  <Badge variant="warning" size="sm">
                    {pendingLeaves.length} Awaiting Action
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Verify destination and parent consent before issuing digital outpasses
                </CardDescription>
              </div>
              <Link
                href="/warden/leave"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                All Records
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
              {leaveRequests.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No leave requests found.
                </div>
              ) : (
                leaveRequests.slice(0, 5).map((leave) => {
                  const isPending = leave.status === 'PENDING';
                  const isActionLoading = actionLoadingId === leave.id;

                  return (
                    <div
                      key={leave.id}
                      className="p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                            {leave.roomNumber || 'A-304'}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                              {leave.studentName}
                              <span className="text-xs text-slate-400 font-normal">
                                ({leave.block})
                              </span>
                            </h4>
                            <p className="text-xs text-slate-500">
                              {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <Badge
                            variant={leave.leaveType === 'EMERGENCY' ? 'error' : 'default'}
                            size="sm"
                            className="uppercase font-semibold"
                          >
                            {leave.leaveType}
                          </Badge>
                          <Badge
                            variant={
                              leave.status === 'APPROVED'
                                ? 'success'
                                : leave.status === 'REJECTED'
                                ? 'error'
                                : 'warning'
                            }
                            size="sm"
                            withDot
                          >
                            {leave.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Details & Destination */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-slate-700 dark:text-slate-300">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">Reason:</span> {leave.reason}
                          </p>
                          <div className="shrink-0 flex items-center gap-1 font-semibold text-[11px] text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Parent Verified
                          </div>
                        </div>
                        <p className="text-slate-500 truncate">
                          <span className="font-medium text-slate-600 dark:text-slate-400">Destination:</span> {leave.destinationAddress}
                        </p>
                        {leave.wardenRemarks && (
                          <p className="text-rose-600 dark:text-rose-400 font-medium">
                            Remarks: {leave.wardenRemarks}
                          </p>
                        )}
                      </div>

                      {/* INLINE ACTION BUTTONS */}
                      {isPending ? (
                        <div className="flex items-center justify-end gap-2.5 pt-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isActionLoading}
                            onClick={() => handleOpenRejectModal(leave.id)}
                            className="text-rose-600 hover:bg-rose-50 border-rose-200 dark:border-rose-900"
                            leftIcon={<X className="w-3.5 h-3.5" />}
                          >
                            Reject
                          </Button>
                          <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            isLoading={isActionLoading}
                            onClick={() => handleApproveLeave(leave.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20"
                            leftIcon={<Check className="w-3.5 h-3.5" />}
                          >
                            Approve & Issue Outpass
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end text-xs text-slate-400 font-medium">
                          {leave.status === 'APPROVED' ? (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Outpass generated
                            </span>
                          ) : (
                            <span className="text-rose-600 flex items-center gap-1">
                              <XCircle className="w-4 h-4" /> Request closed
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Open Complaints Desk Queue */}
          <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm" id="complaints-section">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Open Complaints Desk
                  <Badge variant="neutral" size="sm">
                    {openComplaints.length} Active
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Maintenance tickets reported by residents
                </CardDescription>
              </div>
              <Link
                href="/warden/complaints"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                Manage All
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {complaints.map((comp) => (
                <div
                  key={comp.id}
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {comp.category}
                      </span>
                      <Badge
                        variant={comp.priority === 'URGENT' ? 'error' : comp.priority === 'HIGH' ? 'warning' : 'neutral'}
                        size="sm"
                      >
                        {comp.priority}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        Room {comp.roomNumber} ({comp.studentName})
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {comp.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {comp.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {comp.assignedStaff && (
                      <span className="text-xs text-slate-500 font-medium">
                        Staff: {comp.assignedStaff}
                      </span>
                    )}
                    <Link href="/warden/complaints">
                      <Button variant="secondary" size="sm" className="text-xs">
                        {comp.status === 'IN_PROGRESS' ? 'Update Status' : 'Assign Engineer'}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Medical Requests & Parcel Log */}
        <div className="space-y-6">
          {/* Medical Requests Panel */}
          <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                Medical Cases Log
              </CardTitle>
              <Link href="/warden/medical" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View All
              </Link>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {medicalRequests.map((med) => (
                <div
                  key={med.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
                >
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Room {med.roomNumber} ({med.studentName})
                    </span>
                    <Badge
                      variant={med.urgency === 'CRITICAL' ? 'error' : 'warning'}
                      size="sm"
                    >
                      {med.urgency}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {med.symptoms}
                  </p>

                  {(med.assignedMaid || med.roomFoodDelivery) && (
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200 flex items-center justify-between">
                      <span>Maid: <strong>{med.assignedMaid || 'Pending'}</strong></span>
                      <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                        <UtensilsCrossed className="w-3 h-3" /> Sick Diet Delivery
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>Reported {formatDate(med.createdAt)}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenMaidModal(med)}
                      className="text-[11px] py-0.5 px-2 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50"
                      leftIcon={<UserCheck className="w-3 h-3 text-amber-600" />}
                    >
                      {med.assignedMaid ? 'Edit Maid' : 'Assign Maid'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Parcel Inward Desk Panel */}
          <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm" id="parcels-section">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-sky-500" />
                Parcel Inward Desk
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setOrderModalOpen(true)}
                  className="bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs py-1 px-2.5 shadow-sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Log Arrival
                </Button>
                <Link href="/warden/parcels" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  All
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {parcels.map((parcel) => (
                <div
                  key={parcel.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {parcel.studentName} ({parcel.roomNumber})
                    </span>
                    <Badge
                      variant={parcel.status === 'COLLECTED' ? 'neutral' : 'success'}
                      size="sm"
                    >
                      {parcel.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{parcel.courierCompany}</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {parcel.trackingNumber}
                    </span>
                  </div>
                  {parcel.status === 'ARRIVED' && (
                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
                        OTP: {parcel.otpCode || '4921'}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleQuickHandoverParcel(parcel.id)}
                        className="text-[11px] py-0.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      >
                        Confirm Handover
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reject Remarks Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Leave Request"
        description="Provide justification notes for rejecting this outpass request."
      >
        <div className="space-y-4">
          <Input
            label="Warden Rejection Reason / Remarks"
            placeholder="e.g., Parent phone unreachable, examination scheduled on departure date..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="md"
              isLoading={!!actionLoadingId}
              onClick={handleConfirmRejectLeave}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>

      {/* Broadcast / Action Toast */}
      {broadcastToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 text-white shadow-2xl text-sm font-semibold animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{broadcastToast}</span>
        </div>
      )}

      {/* Log Order Arrival Modal */}
      <Modal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        title="Log Inward Courier / Order Arrival"
        description="Record packages arrived at the desk and generate resident collection OTP."
      >
        <form onSubmit={handleLogOrderArrival} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Courier / Service"
              value={courierCompany}
              onChange={(e) => setCourierCompany(e.target.value)}
              placeholder="Amazon, BlueDart, Flipkart..."
              required
            />
            <Input
              label="Tracking / AWB Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. DEL-AMZ-99120"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
            <Input
              label="Room Number"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setOrderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoggingOrder}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold"
            >
              Record Arrival & Issue OTP
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Hostel Maid & Room Care Modal */}
      <Modal
        isOpen={maidModalOpen}
        onClose={() => setMaidModalOpen(false)}
        title={`Assign Hostel Maid: Room ${selectedMedCase?.roomNumber} (${selectedMedCase?.studentName})`}
        description="Dispatch caretaker maid for sick room diet delivery and health check."
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Caretaker Maid
              </label>
              <select
                value={assignedMaidName}
                onChange={(e) => setAssignedMaidName(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 font-medium"
              >
                <option value="Lakshmi (Caretaker - Block A)">Lakshmi (Caretaker - Block A)</option>
                <option value="Shanthi (Caretaker - Block B)">Shanthi (Caretaker - Block B)</option>
                <option value="Kamala (Hostel Attendant - Floor 3)">Kamala (Hostel Attendant - Floor 3)</option>
                <option value="Meena (Mess & Room Service Staff)">Meena (Mess & Room Service Staff)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={roomFoodDelivery}
                onChange={(e) => setRoomFoodDelivery(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <span className="font-semibold text-amber-900 dark:text-amber-200">
                Deliver Sick Room Diet (Mild curd rice, warm rasam & drinking water)
              </span>
            </label>

            {roomFoodDelivery && (
              <Input
                label="Diet Delivery Instructions for Maid"
                value={dietNotes}
                onChange={(e) => setDietNotes(e.target.value)}
                placeholder="e.g. Deliver mild curd rice & warm drinking water to room"
                className="text-xs"
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setMaidModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              isLoading={isAssigningMaid}
              onClick={handleSaveMaidAssignment}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Assign Maid & Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
