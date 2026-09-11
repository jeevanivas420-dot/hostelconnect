'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatWindow } from '@/components/ai/ChatWindow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  ShieldCheck,
  BookOpen,
  Clock,
  UtensilsCrossed,
  PlaneTakeoff,
  PackageCheck,
  Lock,
} from 'lucide-react';

function HostelAIContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get('q') || '';

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-950 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-indigo-950/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                AI Knowledge Assistant
              </span>
              <span className="text-xs text-indigo-200 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                Isolated ai_knowledge Module
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              HostelSync AI Resident Companion
            </h1>
            <p className="text-sm text-indigo-100/80 leading-relaxed">
              Trained exclusively on official university hostel policies, dining hours, gate curfew rules, and facility guidelines.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <span className="text-xs text-indigo-200 block uppercase font-bold tracking-wider">Response Time</span>
              <span className="text-xl font-extrabold text-white">Instant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface Window */}
      <ChatWindow initialQuery={initialQ} />

      {/* Knowledge Scope Disclosure */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>Gate & Curfew</span>
          </div>
          <p className="text-slate-500">9:30 PM weekdays, 10:00 PM weekends, late slip protocols</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
            <UtensilsCrossed className="w-4 h-4 text-emerald-500" />
            <span>Mess Timings</span>
          </div>
          <p className="text-slate-500">4 daily meal slots, special Wednesday and Sunday feasts</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
            <PlaneTakeoff className="w-4 h-4 text-amber-500" />
            <span>Outpass Guidance</span>
          </div>
          <p className="text-slate-500">Parent consent requirement, approval turnaround</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
            <PackageCheck className="w-4 h-4 text-sky-500" />
            <span>Parcels & Mail</span>
          </div>
          <p className="text-slate-500">Held at warden desk, 4-digit OTP handover process</p>
        </div>
      </div>
    </div>
  );
}

export default function StudentAIPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading Hostel AI...</div>}>
      <HostelAIContent />
    </Suspense>
  );
}
