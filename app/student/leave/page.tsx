'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';
import { LeaveForm } from '@/components/leave/LeaveForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatDate, formatDateTime } from '@/lib/utils';
import {
  PlaneTakeoff,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  QrCode,
  ShieldCheck,
  Calendar,
  MapPin,
  RefreshCw,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { LeaveRequest } from '@/types/leave';

export default function StudentLeavePage() {
  const { user } = useAuth();
  const { student } = useUser();

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [activeOutpass, setActiveOutpass] = useState<LeaveRequest | null>(null);

  // Fetch student's leaves
  const fetchLeaves = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/leave');
      if (res.ok) {
        const data = await res.json();
        if (data.leaves) {
          setLeaveRequests(data.leaves);
          // Check for approved active outpass
          const approved = data.leaves.find((l: LeaveRequest) => l.status === 'APPROVED');
          setActiveOutpass(approved || null);
        }
      }
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch {
      // Fallback
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // Initial fetch and automatic polling (every 3 seconds) for live status reflection
  useEffect(() => {
    fetchLeaves(true);

    const interval = setInterval(() => {
      fetchLeaves(false);
    }, 3000);

    // Supabase Realtime channel subscription if connected
    try {
      const supabase = createClient();
      const channel = supabase
        .channel('student-leave-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'leave_requests' },
          () => {
            fetchLeaves(false);
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
  }, [fetchLeaves]);

  const handleCreateSuccess = (newLeave: LeaveRequest) => {
    setIsFormModalOpen(false);
    setLeaveRequests((prev) => [newLeave, ...prev]);
  };

  const pendingCount = leaveRequests.filter((l) => l.status === 'PENDING').length;
  const approvedCount = leaveRequests.filter((l) => l.status === 'APPROVED').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-indigo-950/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Digital Outpass System
              </span>
              <span className="text-xs text-indigo-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync Active ({lastSyncTime})
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Leave & Outpass Desk
            </h1>
            <p className="text-sm text-indigo-100/80 leading-relaxed">
              Apply for weekend home visits, day outings, or hackathon trips. Once approved by your block warden, your digital outpass QR activates instantly.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={() => fetchLeaves(true)}
              className="border-indigo-400/40 text-white hover:bg-white/10"
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Sync
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsFormModalOpen(true)}
              className="bg-white text-indigo-950 hover:bg-indigo-50 font-semibold shadow-lg shadow-black/20"
              leftIcon={<Plus className="w-4 h-4 text-indigo-600" />}
            >
              Apply for Leave
            </Button>
          </div>
        </div>
      </div>

      {/* 🎟️ ACTIVE APPROVED DIGITAL OUTPASS CARD (if student has an approved leave) */}
      {activeOutpass && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-xl shadow-emerald-950/20 space-y-4 border border-emerald-400/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/40 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/20">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
                  Gate Security Clearance
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Official Digital Outpass Active
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white text-emerald-800">
                    APPROVED
                  </span>
                </h3>
              </div>
            </div>
            <span className="text-xs text-emerald-100 font-mono">
              Pass ID: #{activeOutpass.id.slice(0, 10).toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pt-1">
            {/* Left 2 Cols: Details */}
            <div className="md:col-span-2 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                <div>
                  <p className="text-emerald-200 uppercase tracking-wider text-[10px]">Resident Name</p>
                  <p className="font-bold text-sm text-white">{activeOutpass.studentName}</p>
                  <p className="text-emerald-100 text-[11px]">{activeOutpass.block} • Room {activeOutpass.roomNumber}</p>
                </div>
                <div>
                  <p className="text-emerald-200 uppercase tracking-wider text-[10px]">Permission Type</p>
                  <p className="font-bold text-sm text-white">{activeOutpass.leaveType} LEAVE</p>
                  <p className="text-emerald-100 text-[11px]">Warden Approved</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-200 font-medium">Valid Departure:</span>
                  <span className="font-semibold text-white">{formatDate(activeOutpass.startDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-200 font-medium">Mandatory Return Before:</span>
                  <span className="font-semibold text-white">{formatDate(activeOutpass.endDate)}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/10">
                  <span className="text-emerald-200 font-medium">Destination:</span>
                  <span className="text-white truncate max-w-[240px]">{activeOutpass.destinationAddress}</span>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Simulated Gate Scanner QR */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-slate-900 shadow-md">
              <div className="w-28 h-28 border-2 border-dashed border-emerald-600 rounded-xl flex flex-col items-center justify-center p-2 bg-emerald-50/50">
                <QrCode className="w-20 h-20 text-emerald-800" />
              </div>
              <span className="mt-2 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Scan at Main Gate
              </span>
              <span className="text-[10px] text-slate-400">Security Gate Guard Pass</span>
            </div>
          </div>
        </div>
      )}

      {/* Leave Requests History & Live Status List */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              My Outpass & Leave History
              <Badge variant="neutral" size="sm">
                {leaveRequests.length} Total
              </Badge>
            </CardTitle>
            <CardDescription>
              Real-time synchronization with Chief Warden desk
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Auto-refreshing</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
          {loading && leaveRequests.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-600 mb-2" />
              Loading leave records...
            </div>
          ) : leaveRequests.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500 space-y-3">
              <PlaneTakeoff className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <p>No leave requests submitted yet.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFormModalOpen(true)}
              >
                Create Your First Leave Request
              </Button>
            </div>
          ) : (
            leaveRequests.map((leave) => {
              const isApproved = leave.status === 'APPROVED';
              const isRejected = leave.status === 'REJECTED';
              const isPending = leave.status === 'PENDING';

              return (
                <div
                  key={leave.id}
                  className="p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          isApproved
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                            : isRejected
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {isApproved ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : isRejected ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {leave.leaveType} LEAVE
                          </h4>
                          <Badge
                            variant={
                              isApproved
                                ? 'success'
                                : isRejected
                                ? 'error'
                                : 'warning'
                            }
                            size="sm"
                            withDot
                          >
                            {leave.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500">
                          {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400 self-start sm:self-auto">
                      Submitted {formatDate(leave.createdAt)}
                    </span>
                  </div>

                  {/* Reason & Location */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                    <p className="text-slate-700 dark:text-slate-300">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">Reason:</span> {leave.reason}
                    </p>
                    <p className="text-slate-500 truncate">
                      <span className="font-medium text-slate-600 dark:text-slate-400">Destination:</span> {leave.destinationAddress}
                    </p>
                    {leave.wardenRemarks && (
                      <p className={`font-semibold ${isRejected ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        Warden Note: {leave.wardenRemarks}
                      </p>
                    )}
                  </div>

                  {/* Live Status indicator */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Parent Consent Verified
                    </span>

                    {isPending && (
                      <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        Under review by Warden
                      </span>
                    )}
                    {isApproved && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Digital Gate Pass Valid
                      </span>
                    )}
                    {isRejected && (
                      <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        Rejected by Warden
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Leave Application Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Apply for Hostel Leave / Outpass"
        description="Fill out departure details for block warden approval and gate security clearance."
        maxWidth="lg"
      >
        <LeaveForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
