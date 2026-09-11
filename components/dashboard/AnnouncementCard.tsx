import React from 'react';
import { cn, formatDate } from '@/lib/utils';
import { Pin, Megaphone } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category?: string;
  priority?: 'NORMAL' | 'HIGH' | 'URGENT';
  isPinned?: boolean;
  authorName?: string;
  createdAt: string;
}

export interface AnnouncementCardProps {
  announcement: AnnouncementItem;
  className?: string;
}

export function AnnouncementCard({
  announcement,
  className,
}: AnnouncementCardProps) {
  const isUrgent = announcement.priority === 'URGENT' || announcement.priority === 'HIGH';

  return (
    <div
      className={cn(
        'p-4 rounded-2xl border transition-all duration-150',
        announcement.isPinned
          ? 'border-indigo-200 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-950/20'
          : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {announcement.isPinned && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-md">
              <Pin className="w-3 h-3 rotate-45" />
              Pinned
            </span>
          )}
          <Badge
            variant={isUrgent ? 'error' : 'neutral'}
            size="sm"
            className="uppercase tracking-wider font-semibold text-[10px]"
          >
            {announcement.category || 'NOTICE'}
          </Badge>
        </div>
        <span className="text-[11px] text-slate-400 shrink-0">
          {formatDate(announcement.createdAt)}
        </span>
      </div>

      <h4 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
        {announcement.title}
      </h4>

      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
        {announcement.content}
      </p>

      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Megaphone className="w-3 h-3 text-slate-400" />
          {announcement.authorName || 'Chief Warden Office'}
        </span>
      </div>
    </div>
  );
}
