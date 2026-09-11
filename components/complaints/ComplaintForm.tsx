'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dropdown, DropdownOption } from '@/components/ui/Dropdown';
import { Complaint, ComplaintCategory, ComplaintPriority } from '@/types/complaint';
import {
  AlertTriangle,
  Zap,
  Droplet,
  Hammer,
  Sparkles,
  Wifi,
  Utensils,
  HelpCircle,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface ComplaintFormProps {
  onSuccess?: (newComplaint: Complaint) => void;
  onCancel?: () => void;
}

export function ComplaintForm({ onSuccess, onCancel }: ComplaintFormProps) {
  const { user } = useAuth();
  const { student } = useUser();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('ELECTRICAL');
  const [priority, setPriority] = useState<ComplaintPriority>('MEDIUM');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [location, setLocation] = useState(student?.roomNumber ? `Room ${student.roomNumber}` : 'Room A-304');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categoryOptions: DropdownOption[] = [
    {
      label: 'Electrical (Fan, Light, Switch, Socket)',
      value: 'ELECTRICAL',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      description: 'Power outages, sparked sockets, burned fans',
    },
    {
      label: 'Plumbing (Tap, Flush, Leakage, Drainage)',
      value: 'PLUMBING',
      icon: <Droplet className="w-4 h-4 text-sky-500" />,
      description: 'Washroom water issues, geyser, pipe leaks',
    },
    {
      label: 'Wi-Fi & Network Connectivity',
      value: 'WIFI',
      icon: <Wifi className="w-4 h-4 text-indigo-500" />,
      description: 'Slow speeds, access point drops, router errors',
    },
    {
      label: 'Carpentry (Door, Bed, Study Desk, Cupboard)',
      value: 'CARPENTRY',
      icon: <Hammer className="w-4 h-4 text-orange-500" />,
      description: 'Broken locks, loose desk hinges, cupboard latch',
    },
    {
      label: 'Mess & Food Hygiene',
      value: 'MESS',
      icon: <Utensils className="w-4 h-4 text-emerald-500" />,
      description: 'Dining hall cleanliness, food quality, water cooler',
    },
    {
      label: 'Cleanliness & Housekeeping',
      value: 'CLEANLINESS',
      icon: <Sparkles className="w-4 h-4 text-teal-500" />,
      description: 'Corridor sanitation, dustbins, washroom cleaning',
    },
    {
      label: 'General / Other Hostel Issue',
      value: 'OTHER',
      icon: <HelpCircle className="w-4 h-4 text-slate-500" />,
      description: 'Noise complaints, facility maintenance, pets',
    },
  ];

  const priorityOptions: DropdownOption[] = [
    { label: 'Urgent (Safety / Electrical hazard)', value: 'URGENT' },
    { label: 'High (Affecting daily routine)', value: 'HIGH' },
    { label: 'Medium (Standard repair within 24h)', value: 'MEDIUM' },
    { label: 'Low (Minor cosmetic repair)', value: 'LOW' },
  ];

  // Quick 1-click test presets for Hackathon Judges
  const applyPreset = (preset: 'electrical' | 'anonymous-mess' | 'wifi') => {
    if (preset === 'electrical') {
      setTitle('Study Lamp & Main Socket Burning Smell');
      setDescription('Main switchboard on bed 1 sparks when plug is inserted. Burning plastic smell detected.');
      setCategory('ELECTRICAL');
      setPriority('URGENT');
      setIsAnonymous(false);
    } else if (preset === 'anonymous-mess') {
      setTitle('Mess Dining Hall Drinking Water Filter Needs Servicing');
      setDescription('Ground floor mess water cooler has persistent chlorine odor and residue in glass.');
      setCategory('MESS');
      setPriority('HIGH');
      setIsAnonymous(true);
    } else {
      setTitle('Block A 3rd Floor Wi-Fi Access Point Dropping');
      setDescription('Wi-Fi disconnects every 15 minutes with DNS probe error. Cannot submit online assignment.');
      setCategory('WIFI');
      setPriority('MEDIUM');
      setIsAnonymous(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || !description.trim()) {
      setErrorMessage('Please provide both title and description for your ticket.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        studentId: isAnonymous ? 'anonymous-resident' : student?.id || user?.id || 'stud-demo-1',
        studentName: isAnonymous ? 'Anonymous Resident' : student?.fullName || user?.fullName || 'Arun Karthik',
        roomNumber: isAnonymous ? 'Confidential' : location,
        block: isAnonymous ? 'Hostel Resident' : student?.block || 'Block A (Aryabhata)',
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        isAnonymous,
      };

      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to file complaint');
      }

      const data = await res.json();
      if (onSuccess) {
        onSuccess(data.complaint);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while filing complaint.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1-Click Fast Presets */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-200">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Judges Fast Fill:</span>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset('electrical')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            ⚡ Sparking Socket
          </button>
          <button
            type="button"
            onClick={() => applyPreset('anonymous-mess')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
          >
            🕵️ Anonymous Mess Issue
          </button>
          <button
            type="button"
            onClick={() => applyPreset('wifi')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
          >
            📶 Wi-Fi Glitch
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Category and Priority Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Dropdown
            label="Maintenance Category"
            options={categoryOptions}
            value={category}
            onChange={(val) => setCategory(val as ComplaintCategory)}
          />
        </div>
        <div>
          <Dropdown
            label="Urgency Level"
            options={priorityOptions}
            value={priority}
            onChange={(val) => setPriority(val as ComplaintPriority)}
          />
        </div>
      </div>

      {/* Title */}
      <Input
        label="Issue Summary / Title"
        placeholder="e.g. Washroom tap not closing, sparking plug point..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Location */}
      {!isAnonymous && (
        <Input
          label="Specific Location / Room Number"
          placeholder="e.g. Room A-304, 3rd Floor Common Washroom"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      )}

      {/* Description */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Detailed Description of the Problem
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please explain the issue clearly so maintenance technicians can bring the right tools..."
          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all duration-150"
          required
        />
      </div>

      {/* 🕵️ ANONYMOUS COMPLAINT TOGGLE */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Submit as Anonymous Complaint
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          When enabled, your name and room number are masked from the public logs and maintenance staff. Ideal for sensitive mess, warden office, or peer concerns.
        </p>
      </div>

      {/* Form Buttons */}
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
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          {isAnonymous ? 'Submit Anonymously' : 'File Maintenance Ticket'}
        </Button>
      </div>
    </form>
  );
}
