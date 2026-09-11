'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDate, formatDateTime } from '@/lib/utils';
import {
  Bell,
  Megaphone,
  CheckCircle2,
  PackageCheck,
  PlaneTakeoff,
  AlertTriangle,
  UtensilsCrossed,
  Pin,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  targetBlock?: string;
  isPinned: boolean;
  authorName: string;
  createdAt: string;
}

export default function StudentNotificationsPage() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetch('/api/notifications?type=announcements')
      .then((r) => r.json())
      .then((d) => {
        if (d.announcements) setAnnouncements(d.announcements);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Notifications & Announcements
              {unreadCount > 0 && (
                <Badge variant="error" size="sm">
                  {unreadCount} New
                </Badge>
              )}
            </h1>
            <p className="text-sm text-slate-500">
              Live broadcast feed from Warden Office and individual resident alerts
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={markAllAsRead}
          className="text-xs self-start sm:self-auto"
          leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
        >
          Mark All Read
        </Button>
      </div>

      {/* Pinned Warden Broadcasts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-purple-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Official Warden Broadcasts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((ann) => (
            <Card
              key={ann.id}
              className={`border transition-all ${
                ann.isPinned
                  ? 'border-indigo-300 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/40 via-white to-white dark:from-indigo-950/30 dark:to-slate-900 shadow-sm'
                  : 'border-slate-200/80 dark:border-slate-800 shadow-sm'
              }`}
            >
              <CardContent className="p-5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {ann.isPinned && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {ann.category}
                    </span>
                  </div>
                  <Badge
                    variant={
                      ann.priority === 'URGENT'
                        ? 'error'
                        : ann.priority === 'HIGH'
                        ? 'warning'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {ann.priority}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {ann.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {ann.content}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  <span>{ann.authorName}</span>
                  <span>{formatDate(ann.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Individual System Alerts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Personal Activity Notifications
          </h2>
        </div>

        <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  !notif.isRead ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 mt-0.5">
                    {notif.type === 'PARCEL' ? (
                      <PackageCheck className="w-4 h-4" />
                    ) : notif.type === 'LEAVE' ? (
                      <PlaneTakeoff className="w-4 h-4" />
                    ) : notif.type === 'MESS' ? (
                      <UtensilsCrossed className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {notif.title}
                      {!notif.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                      )}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {formatDateTime(notif.createdAt)}
                    </span>
                  </div>
                </div>

                {notif.linkUrl && (
                  <Link href={notif.linkUrl}>
                    <Button variant="ghost" size="sm" className="text-xs text-indigo-600">
                      View <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
