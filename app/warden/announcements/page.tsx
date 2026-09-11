'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Dropdown } from '@/components/ui/Dropdown';
import { formatDate, formatDateTime } from '@/lib/utils';
import {
  Megaphone,
  Send,
  Sparkles,
  Pin,
  Clock,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Radio,
  Bell,
  RefreshCw,
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

export default function WardenAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Composer Typing Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('MESS');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');
  const [targetBlock, setTargetBlock] = useState('ALL');
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/notifications?type=announcements');
      if (res.ok) {
        const data = await res.json();
        if (data.announcements) {
          setAnnouncements(data.announcements);
        }
      }
    } catch {
      // Fallback handled
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements(true);
    const timer = setInterval(() => fetchAnnouncements(false), 3000);
    return () => clearInterval(timer);
  }, [fetchAnnouncements]);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMessage('Please provide both an announcement title and message content.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        isAnnouncement: true,
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        targetBlock,
        isPinned,
        authorName: 'Chief Warden Office',
      };

      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to broadcast announcement');
      }

      const data = await res.json();
      if (data.announcement) {
        setAnnouncements((prev) => [data.announcement, ...prev]);
      }

      // Reset form
      setTitle('');
      setContent('');
      setIsPinned(false);
      setToastMessage('📢 Announcement broadcasted to all students successfully!');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error broadcasting announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyPreset = (preset: 'menu' | 'curfew' | 'water') => {
    if (preset === 'menu') {
      setTitle('SSB Saveetha Academic Hostel August 2026 Menu Active');
      setContent('The new 7-day mess schedule is now live. Breakfast 7:00-8:30, Lunch 11:00-1:30, Snacks 4:30-5:30, Dinner 7:00-8:30. Sick students can request room food delivery via Medical Help.');
      setCategory('MESS');
      setPriority('HIGH');
      setIsPinned(true);
    } else if (preset === 'curfew') {
      setTitle('Heavy Rain Advisory: Main Gate Curfew Extended to 10:00 PM');
      setContent('Due to continuous rainfall across Chennai and highway traffic, the campus gate curfew tonight is relaxed to 10:00 PM. Please travel safely.');
      setCategory('ADMIN');
      setPriority('URGENT');
      setIsPinned(true);
    } else {
      setTitle('Overhead Water Tank Maintenance - Block A & B');
      setContent('Routine tank sanitation will take place tomorrow from 10:00 AM to 01:00 PM. Please store required drinking water in advance.');
      setCategory('MAINTENANCE');
      setPriority('NORMAL');
      setIsPinned(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' });
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 text-white shadow-2xl text-sm font-semibold animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                Live Broadcast Transmitter
              </span>
              <span className="text-xs text-slate-400">
                Direct student notification channel
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Megaphone className="w-7 h-7 text-purple-400" />
              Warden Announcements & Broadcasts
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Compose notifications and urgent advisories. All broadcasts show up instantaneously on the student dashboard and alerts center.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={() => fetchAnnouncements(true)}
              className="border-slate-700 text-white hover:bg-white/10"
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh Feed
            </Button>
          </div>
        </div>
      </div>

      {/* COMPOSER TYPING BAR CARD */}
      <Card className="border-indigo-200 dark:border-indigo-900/60 shadow-lg bg-gradient-to-br from-white via-indigo-50/20 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2 text-indigo-950 dark:text-indigo-200">
                <Send className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Broadcast Composer
              </CardTitle>
              <CardDescription>
                Type and transmit an announcement message to hostel residents
              </CardDescription>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Presets:
              </span>
              <button
                type="button"
                onClick={() => applyPreset('menu')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-700 font-medium hover:bg-indigo-50 cursor-pointer"
              >
                Mess Menu
              </button>
              <button
                type="button"
                onClick={() => applyPreset('curfew')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 border border-slate-200 dark:border-slate-700 font-medium hover:bg-rose-50 cursor-pointer"
              >
                Rain Curfew
              </button>
              <button
                type="button"
                onClick={() => applyPreset('water')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-100 cursor-pointer"
              >
                Water Tank
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleBroadcast} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 text-xs text-rose-600 font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Title Typing Bar */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Announcement Headline / Title
              </label>
              <Input
                placeholder="e.g. Saveetha Academic Hostel New August 2026 Menu Active"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-sm font-semibold"
              />
            </div>

            {/* Content Message Typing Bar */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Announcement Message (Type full message details to students)
              </label>
              <textarea
                rows={4}
                placeholder="Type your official announcement message here for all hostel students to read..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 resize-y"
              />
            </div>

            {/* Controls Bar: Category, Priority, Target, Pin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 font-medium"
                >
                  <option value="MESS">Mess & Food</option>
                  <option value="ADMIN">Administration & Gate</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="EMERGENCY">Emergency / Medical</option>
                  <option value="EVENT">Event / Hackathon</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 font-medium"
                >
                  <option value="NORMAL">Normal Priority</option>
                  <option value="HIGH">High Priority</option>
                  <option value="URGENT">Urgent Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Target Audience</label>
                <select
                  value={targetBlock}
                  onChange={(e) => setTargetBlock(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 font-medium"
                >
                  <option value="ALL">All Blocks (A, B, C)</option>
                  <option value="BLOCK A">Block A Only</option>
                  <option value="BLOCK B">Block B Only</option>
                  <option value="BLOCK C">Block C Only</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span>Pin to top of feed</span>
                </label>
              </div>
            </div>

            {/* Broadcast Action Button */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">
                Transmitted via WebSocket & Dashboard live poll
              </span>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/30"
                leftIcon={<Send className="w-4 h-4" />}
              >
                Broadcast Announcement to Students
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Broadcasted Announcements Feed */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            Live Student Noticeboard Feed
          </CardTitle>
          <Badge variant="neutral" size="sm">
            {announcements.length} Published Notices
          </Badge>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {ann.isPinned && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {ann.category}
                  </span>
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
                  {ann.targetBlock && ann.targetBlock !== 'ALL' && (
                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                      {ann.targetBlock}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {ann.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {ann.content}
                </p>

                <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                  <span>Author: {ann.authorName}</span>
                  <span>•</span>
                  <span>{formatDateTime(ann.createdAt)}</span>
                </div>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => handleDelete(ann.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                  title="Remove announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
