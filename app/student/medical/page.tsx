'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Dropdown } from '@/components/ui/Dropdown';
import { formatDate, formatDateTime } from '@/lib/utils';
import { MedicalRequest, MedicalUrgency } from '@/types/medical';
import {
  HeartPulse,
  Plus,
  Phone,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldAlert,
  Ambulance,
  RefreshCw,
  Stethoscope,
  UtensilsCrossed,
} from 'lucide-react';

export default function StudentMedicalPage() {
  const { user } = useAuth();
  const { student } = useUser();

  const [medicalRequests, setMedicalRequests] = useState<MedicalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastSync, setLastSync] = useState('');

  // Form states
  const [symptoms, setSymptoms] = useState('');
  const [urgency, setUrgency] = useState<MedicalUrgency>('URGENT');
  const [temperature, setTemperature] = useState('');
  const [requiresAmbulance, setRequiresAmbulance] = useState(false);
  const [roomFoodDelivery, setRoomFoodDelivery] = useState(false);
  const [dietNotes, setDietNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMedical = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/requests?type=medical');
      if (res.ok) {
        const data = await res.json();
        if (data.requests) {
          setMedicalRequests(data.requests);
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
    fetchMedical(true);

    const interval = setInterval(() => {
      fetchMedical(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchMedical]);

  const applyPreset = (preset: 'fever' | 'sprain' | 'asthma') => {
    if (preset === 'fever') {
      setSymptoms('High temperature 102.5 F with violent body chills and severe headache since evening.');
      setUrgency('CRITICAL');
      setTemperature('102.5 F');
      setRequiresAmbulance(false);
    } else if (preset === 'sprain') {
      setSymptoms('Twisted right ankle during basketball match. Severe swelling and inability to bear weight.');
      setUrgency('MODERATE');
      setTemperature('98.4 F');
      setRequiresAmbulance(false);
    } else {
      setSymptoms('Severe asthma wheezing attack. Inhaler exhausted, needs oxygen support and medical escort.');
      setUrgency('CRITICAL');
      setTemperature('98.6 F');
      setRequiresAmbulance(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setErrorMsg('Please describe your symptoms clearly.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        requestCategory: 'medical',
        studentId: student?.id || user?.id || 'stud-demo-1',
        studentName: student?.fullName || user?.fullName || 'Arun Karthik',
        roomNumber: student?.roomNumber || 'A-304',
        symptoms: symptoms.trim(),
        urgency,
        temperature: temperature.trim() || undefined,
        requiresAmbulance,
        roomFoodDelivery,
        dietNotes: roomFoodDelivery ? (dietNotes.trim() || 'Mild curd rice & warm drinking water') : undefined,
      };

      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to submit medical request');
      }

      const data = await res.json();
      setMedicalRequests((prev) => [data.request, ...prev]);
      setIsModalOpen(false);
      setSymptoms('');
      setTemperature('');
      setRequiresAmbulance(false);
      setRoomFoodDelivery(false);
      setDietNotes('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit medical assistance request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Urgent Hotline Callout */}
      <div className="p-4 rounded-2xl bg-rose-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-rose-600/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/20">
            <Ambulance className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold">24/7 Campus Health Center & Emergency Ambulance</h3>
            <p className="text-xs text-rose-100">Doctor on Campus: Room 102, Admin Health Annex</p>
          </div>
        </div>
        <a
          href="tel:+919840199999"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white text-rose-700 font-bold text-xs hover:bg-rose-50 transition-colors shrink-0"
        >
          <Phone className="w-4 h-4" />
          Emergency Hotline: +91 98401 99999
        </a>
      </div>

      {/* Main Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-rose-500/30 text-rose-200 border border-rose-400/30">
                Hostel Health Desk
              </span>
              <span className="text-xs text-rose-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync ({lastSync})
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Medical & Emergency Assistance
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Report acute illness, high fever, or trauma. Notifies warden office instantly for immediate room visit, first aid, or ambulance escort.
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
              Sync
            </Button>
            <Button
              variant="destructive"
              size="md"
              onClick={() => setIsModalOpen(true)}
              className="font-bold shadow-lg shadow-rose-600/30"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Request Medical Help
            </Button>
          </div>
        </div>
      </div>

      {/* Medical Requests Log */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            My Medical History & Open Requests
          </CardTitle>
          <Badge variant="neutral" size="sm">
            {medicalRequests.length} Cases
          </Badge>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
          {loading && medicalRequests.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-rose-500 mb-2" />
              Loading medical cases...
            </div>
          ) : medicalRequests.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500 space-y-3">
              <Stethoscope className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <p>No medical emergency requests on record.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                Request Assistance If Unwell
              </Button>
            </div>
          ) : (
            medicalRequests.map((med) => {
              const isAttended = med.status === 'ATTENDED' || med.status === 'RESOLVED';

              return (
                <div key={med.id} className="p-5 space-y-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={med.urgency === 'CRITICAL' ? 'error' : med.urgency === 'URGENT' ? 'warning' : 'neutral'}
                        size="sm"
                        withDot
                      >
                        {med.urgency} URGENCY
                      </Badge>
                      {med.requiresAmbulance && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center gap-1">
                          <Ambulance className="w-3 h-3" /> Ambulance Dispatched
                        </span>
                      )}
                    </div>
                    <Badge variant={isAttended ? 'success' : 'warning'} size="sm">
                      {med.status}
                    </Badge>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {med.symptoms}
                  </p>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Room {med.roomNumber}</span>
                      {med.temperature && <span>Reported Temp: <strong className="text-slate-700 dark:text-slate-200">{med.temperature}</strong></span>}
                    </div>
                    {med.firstAidGiven && (
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                        First Aid: {med.firstAidGiven}
                      </p>
                    )}
                    {med.doctorNotes && (
                      <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                        Doctor Note: {med.doctorNotes}
                      </p>
                    )}
                  </div>

                  {(med.assignedMaid || med.roomFoodDelivery) && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="text-slate-800 dark:text-slate-200">
                          {med.assignedMaid ? (
                            <>
                              Assigned Hostel Maid: <strong className="text-amber-900 dark:text-amber-300 font-bold">{med.assignedMaid}</strong>
                            </>
                          ) : (
                            <span className="text-amber-700 dark:text-amber-400 font-semibold">
                              Hostel Maid Care & Room Food Delivery Requested
                            </span>
                          )}
                        </span>
                      </div>
                      {med.dietNotes && (
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                          Diet: {med.dietNotes}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Reported {formatDate(med.createdAt)}</span>
                    <span>{isAttended ? '✓ Warden / Medic attended' : '⏳ Warden dispatched to room'}</span>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Request Medical Assistance"
        description="Notify the block warden and campus health post immediately."
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Judges Fast Presets */}
          <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-900 dark:text-rose-200">
              <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Judges Fast Fill:</span>
            </div>
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('fever')}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                🌡️ High Fever 102.5°F
              </button>
              <button
                type="button"
                onClick={() => applyPreset('sprain')}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
              >
                🩹 Ankle Sprain
              </button>
              <button
                type="button"
                onClick={() => applyPreset('asthma')}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                🚑 Asthma SOS
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950 text-xs text-rose-600 font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Dropdown
              label="Urgency Condition"
              options={[
                { label: 'Critical (High fever / Breathing / Severe pain)', value: 'CRITICAL' },
                { label: 'Urgent (Trauma / Vomiting / Cuts)', value: 'URGENT' },
                { label: 'Moderate (Sprain / Allergy / Cold)', value: 'MODERATE' },
                { label: 'Routine (Doctor appointment / Pills)', value: 'ROUTINE' },
              ]}
              value={urgency}
              onChange={(v) => setUrgency(v as MedicalUrgency)}
            />
            <Input
              label="Body Temperature (Optional)"
              placeholder="e.g. 102.4 F"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Symptoms / Health Issue
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe pain, dizziness, allergies, or any medications already taken..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              required
            />
          </div>

          {/* Sick Room Food Delivery by Hostel Maid Option */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/80 space-y-2.5">
            <label className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={roomFoodDelivery}
                onChange={(e) => setRoomFoodDelivery(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4 text-amber-600" />
                Request Hostel Maid to Bring Sick Diet & Hot Water to Room
              </span>
            </label>
            {roomFoodDelivery && (
              <div className="pl-6 space-y-1">
                <Input
                  label="Diet Preference / Notes for Caretaker Maid"
                  placeholder="e.g. Mild curd rice, warm rasam soup, boiled drinking water..."
                  value={dietNotes}
                  onChange={(e) => setDietNotes(e.target.value)}
                  className="text-xs"
                />
                <p className="text-[11px] text-amber-700 dark:text-amber-400">
                  Warden will assign a hostel maid to deliver your meals and check in on you.
                </p>
              </div>
            )}
          </div>

          <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900">
            <input
              type="checkbox"
              checked={requiresAmbulance}
              onChange={(e) => setRequiresAmbulance(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
            />
            <span className="font-bold text-rose-700 dark:text-rose-400">
              Requires Ambulance / Hospital Transport immediately
            </span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="md"
              isLoading={isSubmitting}
            >
              Dispatch Medical Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
