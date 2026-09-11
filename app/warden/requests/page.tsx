'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { LostFoundItem } from '@/types/request';
import {
  FileText,
  RefreshCw,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Tag,
} from 'lucide-react';

export default function WardenRequestsPage() {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'LOST' | 'FOUND'>('ALL');

  const fetchItems = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/requests?type=lost_found');
      if (res.ok) {
        const data = await res.json();
        if (data.requests) setItems(data.requests);
      }
    } catch {
      // Fallback
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(true);
    const interval = setInterval(() => fetchItems(false), 3000);
    return () => clearInterval(interval);
  }, [fetchItems]);

  const handleResolve = async (id: string) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          requestCategory: 'lost_found',
          status: 'RESOLVED',
        }),
      });

      if (res.ok) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: 'RESOLVED' } : item
          )
        );
      }
    } catch {
      // Fallback
    }
  };

  const filtered = items.filter((i) => {
    if (filterType === 'ALL') return true;
    return i.type === filterType;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Warden Valuables Oversight
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Hostel Lost & Found Registry
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Log recoveries deposited by housekeeping and security. Verify student identity and ownership before handing over claimed property.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={() => fetchItems(true)}
              className="border-slate-700 text-white hover:bg-white/10"
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
          {(['ALL', 'LOST', 'FOUND'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t === 'ALL' ? 'All Items' : t === 'LOST' ? 'Lost Items' : 'Recovered Belongings'}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {filtered.length} registry entries
        </span>
      </div>

      {/* Registry List */}
      <div className="space-y-3.5">
        {filtered.map((item) => {
          const isLost = item.type === 'LOST';
          const isResolved = item.status === 'RESOLVED' || item.status === 'CLOSED';

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Badge variant={isLost ? 'error' : 'success'} size="sm" withDot>
                    {item.type}
                  </Badge>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </span>
                  <Badge variant={isResolved ? 'neutral' : 'warning'} size="sm">
                    {item.status}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {item.contactInfo}
                  </span>
                  <span className="text-slate-400">
                    Logged {formatDate(item.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!isResolved ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleResolve(item.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Confirm Handed Over
                  </Button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Returned & Closed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
