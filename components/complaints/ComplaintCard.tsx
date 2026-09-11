import React from 'react';
import { Complaint, ComplaintStatus } from '@/types/complaint';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import {
  Zap,
  Droplet,
  Wifi,
  Hammer,
  Utensils,
  Sparkles,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  EyeOff,
  UserCheck,
} from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  onAssignStaff?: (complaintId: string) => void;
  onResolve?: (complaintId: string) => void;
  isWarden?: boolean;
}

export function ComplaintCard({
  complaint,
  onAssignStaff,
  onResolve,
  isWarden = false,
}: ComplaintCardProps) {
  const isAnonymous = complaint.studentName?.toLowerCase().includes('anonymous') || complaint.studentId === 'anonymous-user';
  const isOpen = complaint.status === 'OPEN';
  const isInProgress = complaint.status === 'IN_PROGRESS';
  const isResolved = complaint.status === 'RESOLVED';

  const categoryIcons: Record<string, React.ReactNode> = {
    ELECTRICAL: <Zap className="w-4 h-4 text-amber-500" />,
    PLUMBING: <Droplet className="w-4 h-4 text-sky-500" />,
    WIFI: <Wifi className="w-4 h-4 text-indigo-500" />,
    CARPENTRY: <Hammer className="w-4 h-4 text-orange-500" />,
    MESS: <Utensils className="w-4 h-4 text-emerald-500" />,
    CLEANLINESS: <Sparkles className="w-4 h-4 text-teal-500" />,
    OTHER: <HelpCircle className="w-4 h-4 text-slate-500" />,
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3.5 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
            {categoryIcons[complaint.category] || <AlertTriangle className="w-4 h-4 text-amber-500" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {complaint.category}
              </span>
              <Badge
                variant={
                  complaint.priority === 'URGENT'
                    ? 'error'
                    : complaint.priority === 'HIGH'
                    ? 'warning'
                    : 'neutral'
                }
                size="sm"
              >
                {complaint.priority}
              </Badge>
              {isAnonymous && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  <EyeOff className="w-3 h-3" /> Anonymous
                </span>
              )}
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
              {complaint.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge
            variant={
              isResolved
                ? 'success'
                : isInProgress
                ? 'warning'
                : 'error'
            }
            size="sm"
            withDot
          >
            {complaint.status}
          </Badge>
          <span className="text-[11px] text-slate-400">
            {formatDate(complaint.createdAt)}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {complaint.description}
      </p>

      {/* Location / Resident info & assigned staff */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="text-slate-500">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Location: </span>
          {complaint.roomNumber} ({complaint.block || 'Hostel'})
          {!isAnonymous && (
            <span className="ml-1 text-slate-400">• By {complaint.studentName}</span>
          )}
        </div>

        {complaint.assignedStaff && (
          <div className="flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Assigned: {complaint.assignedStaff}</span>
          </div>
        )}
      </div>

      {/* Progress status timeline */}
      <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-amber-500 animate-ping' : 'bg-slate-300'}`} />
          <span>{isOpen ? 'Waiting for staff assignment' : isInProgress ? 'Work in progress' : 'Resolved by maintenance'}</span>
        </div>

        {isWarden && !isResolved && (
          <div className="flex items-center gap-2">
            {isOpen && onAssignStaff && (
              <button
                type="button"
                onClick={() => onAssignStaff(complaint.id)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 cursor-pointer"
              >
                Assign Staff
              </button>
            )}
            {onResolve && (
              <button
                type="button"
                onClick={() => onResolve(complaint.id)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
              >
                Mark Resolved
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
