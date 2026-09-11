'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Complaint, ComplaintStatus } from '@/types/complaint';
import {
  AlertTriangle,
  RefreshCw,
  Clock,
  Wrench,
  CheckCircle2,
  UserCheck,
  Zap,
  Filter,
} from 'lucide-react';

export default function WardenComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Assign staff modal state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [staffName, setStaffName] = useState('');
  const [assignNote, setAssignNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } catch {
      // Fallback
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints(true);

    const interval = setInterval(() => {
      fetchComplaints(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchComplaints]);

  const handleOpenAssignModal = (complaintId: string) => {
    setSelectedComplaintId(complaintId);
    setStaffName('Ravi (Maintenance Electrician)');
    setAssignNote('Assigned for immediate inspection and repair.');
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = async () => {
    if (!selectedComplaintId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/complaints', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedComplaintId,
          status: 'IN_PROGRESS',
          assignedStaff: staffName,
          updateMessage: assignNote,
        }),
      });

      if (res.ok) {
        setComplaints((prev) =>
          prev.map((c) =>
            c.id === selectedComplaintId
              ? { ...c, status: 'IN_PROGRESS', assignedStaff: staffName }
              : c
          )
        );
      }
      setAssignModalOpen(false);
    } catch {
      // Fallback
    } finally {
      setIsSubmitting(false);
      setSelectedComplaintId(null);
    }
  };

  const handleResolve = async (complaintId: string) => {
    try {
      const res = await fetch('/api/complaints', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: complaintId,
          status: 'RESOLVED',
          updateMessage: 'Issue inspected, repaired, and signed off by maintenance cell.',
        }),
      });

      if (res.ok) {
        setComplaints((prev) =>
          prev.map((c) =>
            c.id === complaintId ? { ...c, status: 'RESOLVED' } : c
          )
        );
      }
    } catch {
      // Fallback
    }
  };

  const filtered = complaints.filter((c) => {
    if (filterCategory === 'ALL') return true;
    return c.category === filterCategory;
  });

  const openCount = complaints.filter((c) => c.status === 'OPEN').length;
  const inProgressCount = complaints.filter((c) => c.status === 'IN_PROGRESS').length;
  const urgentCount = complaints.filter((c) => c.priority === 'URGENT' && c.status !== 'RESOLVED').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Warden Maintenance Desk
              </span>
              {urgentCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                  {urgentCount} URGENT HAZARDS
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Complaints & Engineering Queue
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Supervise electrical, plumbing, Wi-Fi, and mess hygiene tickets. Assign maintenance staff and mark jobs resolved.
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
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Unassigned Tickets</p>
            <p className="text-2xl font-bold text-amber-600">{openCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Under Repair</p>
            <p className="text-2xl font-bold text-indigo-600">{inProgressCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">High Priority / Urgent</p>
            <p className="text-2xl font-bold text-rose-600">{urgentCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'ELECTRICAL', 'PLUMBING', 'WIFI', 'MESS', 'CARPENTRY'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filtered.map((complaint) => (
          <ComplaintCard
            key={complaint.id}
            complaint={complaint}
            isWarden={true}
            onAssignStaff={handleOpenAssignModal}
            onResolve={handleResolve}
          />
        ))}
      </div>

      {/* Assign Staff Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Maintenance Technician"
        description="Dispatch an on-duty technician to repair this reported issue."
      >
        <div className="space-y-4">
          <Input
            label="Assigned Staff / Technician Name"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            placeholder="e.g. Murugan (Plumber), Ravi (Electrician)"
            required
          />
          <Input
            label="Internal Notes / Instructions"
            value={assignNote}
            onChange={(e) => setAssignNote(e.target.value)}
            placeholder="e.g. Check floor 3 main pipe valve"
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setAssignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              onClick={handleConfirmAssign}
            >
              Assign & Move to In Progress
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
