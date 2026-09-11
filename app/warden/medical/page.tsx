'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';
import { MedicalRequest } from '@/types/medical';
import {
  HeartPulse,
  Ambulance,
  RefreshCw,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Stethoscope,
  Phone,
  UtensilsCrossed,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export default function WardenMedicalPage() {
  const [requests, setRequests] = useState<MedicalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Attend / Caretaker Maid Assignment Modal State
  const [attendModalOpen, setAttendModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [firstAid, setFirstAid] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [assignedMaid, setAssignedMaid] = useState('Lakshmi (Caretaker - Block A)');
  const [roomFoodDelivery, setRoomFoodDelivery] = useState(true);
  const [dietNotes, setDietNotes] = useState('Mild curd rice, warm rasam soup & boiled drinking water delivered to room');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchMedical = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/requests?type=medical');
      if (res.ok) {
        const data = await res.json();
        if (data.requests) setRequests(data.requests);
      }
    } catch {
      // Fallback
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedical(true);
    const interval = setInterval(() => fetchMedical(false), 3000);
    return () => clearInterval(interval);
  }, [fetchMedical]);

  const handleOpenAttendModal = (req: MedicalRequest) => {
    setSelectedId(req.id);
    setSelectedStudentName(req.studentName || 'Resident');
    setSelectedRoomNumber(req.roomNumber || 'A-304');
    setFirstAid(req.firstAidGiven || 'Administered oral rehydration salt (ORS) and cold damp cloth. Resident resting in room.');
    setDoctorNotes(req.doctorNotes || 'Campus Dr. sent for room inspection.');
    setAssignedMaid(req.assignedMaid || 'Lakshmi (Caretaker - Block A)');
    setRoomFoodDelivery(req.roomFoodDelivery !== undefined ? req.roomFoodDelivery : true);
    setDietNotes(req.dietNotes || 'Mild curd rice, warm rasam & boiled drinking water delivered to room');
    setAttendModalOpen(true);
  };

  const handleConfirmAttend = async () => {
    if (!selectedId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedId,
          requestCategory: 'medical',
          status: 'ATTENDED',
          firstAidGiven: firstAid,
          doctorNotes,
          assignedMaid,
          roomFoodDelivery,
          dietNotes,
        }),
      });

      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === selectedId
              ? {
                  ...r,
                  status: 'ATTENDED',
                  firstAidGiven: firstAid,
                  doctorNotes,
                  assignedMaid,
                  roomFoodDelivery,
                  dietNotes,
                }
              : r
          )
        );
        setToastMessage(`Assigned Maid ${assignedMaid} to Room ${selectedRoomNumber}!`);
        setTimeout(() => setToastMessage(null), 4000);
      }
      setAttendModalOpen(false);
    } catch {
      // Fallback
    } finally {
      setIsSubmitting(false);
      setSelectedId(null);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          requestCategory: 'medical',
          status: 'RESOLVED',
          doctorNotes: 'Student fully recovered and verified healthy by campus doctor.',
        }),
      });

      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, status: 'RESOLVED' } : r
          )
        );
        setToastMessage('Case marked resolved.');
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch {
      // Fallback
    }
  };

  const criticalCount = requests.filter(
    (r) => (r.urgency === 'CRITICAL' || r.urgency === 'URGENT') && r.status === 'SUBMITTED'
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white shadow-2xl text-sm font-semibold animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Warden Emergency & Health Desk
              </span>
              {criticalCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                  {criticalCount} UNATTENDED CRITICAL CASES
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <HeartPulse className="w-7 h-7 text-rose-400" />
              Medical Emergencies & Maid Care Assignment
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Real-time feed of resident health alarms. Record first aid interventions, doctor reports, and assign hostel maids to deliver sick diets directly to resident rooms.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={() => fetchMedical(true)}
              className="border-slate-700 text-white hover:bg-white/10"
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {requests.map((med) => {
          const isSubmitted = med.status === 'SUBMITTED';
          const isAttended = med.status === 'ATTENDED';
          const isResolved = med.status === 'RESOLVED';

          return (
            <div
              key={med.id}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3.5 hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 shrink-0">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Room {med.roomNumber} ({med.studentName})
                      </span>
                      <Badge
                        variant={med.urgency === 'CRITICAL' ? 'error' : med.urgency === 'URGENT' ? 'warning' : 'neutral'}
                        size="sm"
                        withDot
                      >
                        {med.urgency}
                      </Badge>
                      {med.requiresAmbulance && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded flex items-center gap-1">
                          <Ambulance className="w-3 h-3" /> AMBULANCE
                        </span>
                      )}
                      {med.roomFoodDelivery && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 rounded border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                          <UtensilsCrossed className="w-3 h-3" /> SICK DIET REQUESTED
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                      {med.symptoms}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Badge variant={isResolved ? 'success' : isAttended ? 'info' : 'warning'} size="sm">
                    {med.status}
                  </Badge>
                  <span className="text-[11px] text-slate-400">
                    {formatDate(med.createdAt)}
                  </span>
                </div>
              </div>

              {/* Assigned Hostel Maid Care Highlight Box */}
              {(med.assignedMaid || med.roomFoodDelivery) && (
                <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      Assigned Hostel Maid:{' '}
                      <strong className="text-amber-950 dark:text-amber-200 font-bold">
                        {med.assignedMaid || 'Pending Assignment'}
                      </strong>
                    </span>
                  </div>
                  {med.dietNotes && (
                    <span className="text-[11px] text-amber-800 dark:text-amber-300 italic">
                      Food Delivery: {med.dietNotes}
                    </span>
                  )}
                </div>
              )}

              {/* Temperature & Notes */}
              {(med.temperature || med.firstAidGiven || med.doctorNotes) && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  {med.temperature && (
                    <p className="text-slate-600 dark:text-slate-400">
                      Recorded Temperature: <strong className="text-slate-900 dark:text-slate-100">{med.temperature}</strong>
                    </p>
                  )}
                  {med.firstAidGiven && (
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                      First Aid: {med.firstAidGiven}
                    </p>
                  )}
                  {med.doctorNotes && (
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                      Doctor Report: {med.doctorNotes}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">
                  {isResolved
                    ? '✓ Case resolved and resident recovered'
                    : isAttended
                    ? '✓ Maid assigned & first aid administered'
                    : '🚨 Immediate warden room visit needed'}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenAttendModal(med)}
                    className="text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-50 text-xs font-semibold"
                    leftIcon={<UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" />}
                  >
                    {med.assignedMaid ? 'Update Maid / Care' : 'Assign Hostel Maid & Care'}
                  </Button>

                  {isSubmitted && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenAttendModal(med)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      Attend Case
                    </Button>
                  )}

                  {!isResolved && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolve(med.id)}
                      className="text-xs"
                    >
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attend & Assign Hostel Maid Modal */}
      <Modal
        isOpen={attendModalOpen}
        onClose={() => setAttendModalOpen(false)}
        title={`Attend Medical Case: Room ${selectedRoomNumber} (${selectedStudentName})`}
        description="Assign a hostel maid for room care & record treatment provided."
        maxWidth="lg"
      >
        <div className="space-y-4">
          {/* Hostel Maid Assignment Section */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-amber-600" />
              Assign Hostel Maid (Room Care & Diet Delivery)
            </h4>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Select Caretaker Maid
              </label>
              <select
                value={assignedMaid}
                onChange={(e) => setAssignedMaid(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 font-medium"
              >
                <option value="Lakshmi (Caretaker - Block A)">Lakshmi (Caretaker - Block A)</option>
                <option value="Shanthi (Caretaker - Block B)">Shanthi (Caretaker - Block B)</option>
                <option value="Kamala (Hostel Attendant - Floor 3)">Kamala (Hostel Attendant - Floor 3)</option>
                <option value="Meena (Mess & Room Service Staff)">Meena (Mess & Room Service Staff)</option>
                <option value="Selvi (Resident Caretaker)">Selvi (Resident Caretaker)</option>
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
                label="Diet & Delivery Instructions for Maid"
                value={dietNotes}
                onChange={(e) => setDietNotes(e.target.value)}
                placeholder="e.g. Deliver mild curd rice & warm drinking water for lunch and dinner"
                className="text-xs"
              />
            )}
          </div>

          <Input
            label="First Aid / Medication Administered"
            value={firstAid}
            onChange={(e) => setFirstAid(e.target.value)}
            placeholder="e.g. Paracetamol 650mg given, ORS, cold damp compress applied"
            required
          />

          <Input
            label="Campus Doctor Consultation Notes"
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            placeholder="e.g. Dr. inspected room at 2:30 PM, advised 2 days bed rest"
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setAttendModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              onClick={handleConfirmAttend}
              className="bg-emerald-600 text-white hover:bg-emerald-700 font-bold"
            >
              Assign Maid & Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
