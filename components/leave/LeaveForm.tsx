'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dropdown, DropdownOption } from '@/components/ui/Dropdown';
import { LeaveType, LeaveRequest } from '@/types/leave';
import {
  PlaneTakeoff,
  Calendar,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  Home,
  Clock,
  ShieldCheck,
  Sparkles,
  Phone,
} from 'lucide-react';

interface LeaveFormProps {
  onSuccess?: (newLeave: LeaveRequest) => void;
  onCancel?: () => void;
}

export function LeaveForm({ onSuccess, onCancel }: LeaveFormProps) {
  const { user } = useAuth();
  const { student } = useUser();

  // Form states
  const [leaveType, setLeaveType] = useState<LeaveType>('HOME');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [parentConsent, setParentConsent] = useState(true);
  const [parentPhone, setParentPhone] = useState(student?.parentPhone || '+91 98401 23456');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const leaveOptions: DropdownOption[] = [
    {
      label: 'Home Visit (Weekend / Vacation)',
      value: 'HOME',
      icon: <Home className="w-4 h-4 text-indigo-500" />,
      description: 'Travel to hometown with parent confirmation',
    },
    {
      label: 'Day Outing (City / Shopping)',
      value: 'OUTING',
      icon: <Clock className="w-4 h-4 text-emerald-500" />,
      description: 'Return to hostel before 09:30 PM curfew',
    },
    {
      label: 'Academic / Tech Hackathon',
      value: 'ACADEMIC',
      icon: <FileText className="w-4 h-4 text-purple-500" />,
      description: 'Participation in symposiums or coding events',
    },
    {
      label: 'Medical / Urgent Emergency',
      value: 'EMERGENCY',
      icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
      description: 'Hospital visits or urgent family emergencies',
    },
    {
      label: 'Semester Vacation',
      value: 'VACATION',
      icon: <PlaneTakeoff className="w-4 h-4 text-sky-500" />,
      description: 'End of term vacation break',
    },
  ];

  // Quick 1-click test presets for judges
  const applyPreset = (preset: 'home' | 'hackathon') => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];

    const returnDate = new Date();
    returnDate.setDate(today.getDate() + (preset === 'home' ? 3 : 2));
    const formattedReturn = returnDate.toISOString().split('T')[0];

    if (preset === 'home') {
      setLeaveType('HOME');
      setStartDate(`${formattedToday}T09:00`);
      setEndDate(`${formattedReturn}T20:00`);
      setReason('Traveling to native residence in Coimbatore for family festival. Parent verbal approval given.');
      setDestinationAddress('42, Gandhi Street, RS Puram, Coimbatore - 641002');
      setParentConsent(true);
    } else {
      setLeaveType('ACADEMIC');
      setStartDate(`${formattedToday}T08:00`);
      setEndDate(`${formattedReturn}T22:00`);
      setReason('Representing university at Inter-College Hackathon 2026. Faculty permission letter submitted.');
      setDestinationAddress('IIT Madras Research Park, Kanagam Road, Taramani, Chennai');
      setParentConsent(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!startDate || !endDate) {
      setErrorMessage('Please select both departure and return dates.');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setErrorMessage('Return date must be after the departure date.');
      return;
    }

    if (!reason.trim()) {
      setErrorMessage('Please provide a specific reason for your leave.');
      return;
    }

    if (!destinationAddress.trim()) {
      setErrorMessage('Destination address is mandatory.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        studentId: student?.id || user?.id || 'stud-demo-1',
        studentName: student?.fullName || user?.fullName || 'Arun Karthik',
        roomNumber: student?.roomNumber || 'A-304',
        block: student?.block || 'Block A (Aryabhata)',
        leaveType,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        reason: reason.trim(),
        destinationAddress: destinationAddress.trim(),
        parentConsent,
      };

      const res = await fetch('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit leave request');
      }

      const data = await res.json();
      if (onSuccess) {
        onSuccess(data.leave);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting your leave request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1-Click Fast Presets for Hackathon Judges */}
      <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>Judges Fast Fill:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset('home')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            🏠 Weekend Home Leave
          </button>
          <button
            type="button"
            onClick={() => applyPreset('hackathon')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 hover:bg-purple-100 transition-colors cursor-pointer"
          >
            ⚡ Hackathon Outpass
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Leave Type Dropdown */}
      <div>
        <Dropdown
          label="Leave Permission Category"
          options={leaveOptions}
          value={leaveType}
          onChange={(val) => setLeaveType(val as LeaveType)}
        />
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Departure Date & Time"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          leftIcon={<Calendar className="w-4 h-4" />}
          required
        />
        <Input
          label="Expected Return Date & Time"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          leftIcon={<Calendar className="w-4 h-4" />}
          required
        />
      </div>

      {/* Destination Address */}
      <Input
        label="Destination Address / Travel Location"
        placeholder="e.g. 42, Green Park Avenue, Coimbatore - 641002"
        value={destinationAddress}
        onChange={(e) => setDestinationAddress(e.target.value)}
        leftIcon={<MapPin className="w-4 h-4" />}
        required
      />

      {/* Reason for Leave */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Reason for Leave
        </label>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Specify clear reason (e.g. attending sister's wedding, doctor consultation, college tech fest)..."
          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-150"
          required
        />
      </div>

      {/* Parent Verification Section */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Parent Consent Verification
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Verified with Warden Office</span>
        </div>

        <Input
          label="Registered Parent Mobile Number"
          type="tel"
          value={parentPhone}
          onChange={(e) => setParentPhone(e.target.value)}
          placeholder="+91 98765 43210"
          leftIcon={<Phone className="w-4 h-4" />}
        />

        <label className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={parentConsent}
            onChange={(e) => setParentConsent(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
          />
          <span>I confirm my parent / guardian is aware of and approves this journey.</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" size="md" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          leftIcon={<CheckCircle2 className="w-4 h-4" />}
        >
          Submit Leave Request
        </Button>
      </div>
    </form>
  );
}
