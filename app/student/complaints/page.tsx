'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ComplaintForm } from '@/components/complaints/ComplaintForm';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Complaint, ComplaintStatus } from '@/types/complaint';
import {
  AlertTriangle,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle2,
  Wrench,
  EyeOff,
  Filter,
} from 'lucide-react';

export default function StudentComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [lastSync, setLastSync] = useState('');

  const fetchComplaints = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/complaints');
      if (res.ok) {
        const data = await res.json();
        if (data.complaints) {
          setComplaints(data.complaints);
        }
      }
      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch {
      // Fallback
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints(true);

    // Auto-polling every 3 seconds for live warden technician assignments
    const interval = setInterval(() => {
      fetchComplaints(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchComplaints]);

  const handleCreated = (newComplaint: Complaint) => {
    setIsModalOpen(false);
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const filtered = complaints.filter((c) => {
    if (filterStatus === 'ALL') return true;
    return c.status === filterStatus;
  });

  const openCount = complaints.filter((c) => c.status === 'OPEN').length;
  const inProgressCount = complaints.filter((c) => c.status === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-amber-950/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/30 text-amber-200 border border-amber-400/30">
                Maintenance Helpdesk
              </span>
              <span className="text-xs text-amber-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync ({lastSync})
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Hostel Maintenance Complaints
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Report electrical faults, plumbing leaks, Wi-Fi errors, or mess hygiene issues. Anonymous submission supported for sensitive matters.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={() => fetchComplaints(true)}
              className="border-slate-700 text-white hover:bg-white/10"
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Sync
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              File a Complaint
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Open Tickets</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{openCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">In Progress</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{inProgressCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resolved</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{resolvedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
          {(['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {status === 'ALL' ? 'All Tickets' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filtered.length} tickets
        </span>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {loading && complaints.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
            Loading maintenance complaints...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500 space-y-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <AlertTriangle className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p>No complaints match the selected filter.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              File a Maintenance Ticket
            </Button>
          </div>
        ) : (
          filtered.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} isWarden={false} />
          ))
        )}
      </div>

      {/* Complaint Filing Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="File Maintenance Complaint"
        description="Describe the issue. Electrical and plumbing issues are attended to within 24 hours."
        maxWidth="lg"
      >
        <ComplaintForm
          onSuccess={handleCreated}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
