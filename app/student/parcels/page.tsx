'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Parcel } from '@/types/parcel';
import {
  PackageCheck,
  RefreshCw,
  Clock,
  CheckCircle2,
  KeyRound,
  Truck,
  ShieldCheck,
  Building,
} from 'lucide-react';

export default function StudentParcelsPage() {
  const { user } = useAuth();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState('');

  const fetchParcels = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/parcels');
      if (res.ok) {
        const data = await res.json();
        if (data.parcels) {
          setParcels(data.parcels);
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
    fetchParcels(true);

    const interval = setInterval(() => {
      fetchParcels(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchParcels]);

  const awaitingCollection = parcels.filter((p) => p.status === 'ARRIVED');
  const collectedParcels = parcels.filter((p) => p.status === 'COLLECTED');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-sky-950/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-sky-500/30 text-sky-200 border border-sky-400/30">
                Secure Delivery Desk
              </span>
              <span className="text-xs text-sky-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync ({lastSync})
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Parcel Inward & Pickup Tracking
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Track courier deliveries received at the Warden Office. Present your 4-digit security OTP to collect your packages safely.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={() => fetchParcels(true)}
              className="border-slate-700 text-white hover:bg-white/10"
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh Desk
            </Button>
          </div>
        </div>
      </div>

      {/* 📦 Awaiting Collection Spotlight with OTP Card */}
      {awaitingCollection.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            Ready for Pickup ({awaitingCollection.length} Package{awaitingCollection.length > 1 ? 's' : ''})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {awaitingCollection.map((p) => (
              <div
                key={p.id}
                className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-lg space-y-4 border border-indigo-700/40 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white/10">
                      <Truck className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <span className="text-xs text-sky-300 font-semibold uppercase">{p.courierCompany}</span>
                      <h4 className="text-sm font-bold font-mono tracking-wider">{p.trackingNumber}</h4>
                    </div>
                  </div>
                  <Badge variant="warning" size="sm" withDot>
                    At Warden Desk
                  </Badge>
                </div>

                {p.notes && (
                  <p className="text-xs text-slate-300 italic bg-white/5 p-2.5 rounded-xl border border-white/10">
                    &quot;{p.notes}&quot;
                  </p>
                )}

                {/* Secure OTP Pill Box */}
                <div className="p-4 rounded-2xl bg-white text-slate-900 flex items-center justify-between shadow-md">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                      Pickup Verification OTP
                    </span>
                    <p className="text-2xl font-extrabold tracking-widest font-mono text-indigo-600">
                      {p.otpCode || '4921'}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    <span>Show to warden on desk</span>
                    <p className="font-semibold text-emerald-600 flex items-center gap-1 justify-end">
                      <ShieldCheck className="w-3.5 h-3.5" /> Ready for pickup
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Arrived: {formatDate(p.arrivalDate)}</span>
                  <span>Holding at: Admin Block Desk 1</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collection History */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-sky-500" />
            Parcel Delivery History
          </CardTitle>
          <Badge variant="neutral" size="sm">
            {parcels.length} Total
          </Badge>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
          {loading && parcels.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-sky-500 mb-2" />
              Loading parcel records...
            </div>
          ) : parcels.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">
              No packages recorded yet.
            </div>
          ) : (
            parcels.map((parcel) => (
              <div
                key={parcel.id}
                className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {parcel.courierCompany}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      #{parcel.trackingNumber}
                    </span>
                    <Badge
                      variant={parcel.status === 'COLLECTED' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {parcel.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    Delivered for: {parcel.studentName} (Room {parcel.roomNumber})
                  </p>
                </div>

                <div className="text-right text-xs text-slate-400">
                  <p>Arrived {formatDate(parcel.arrivalDate)}</p>
                  {parcel.collectionDate && (
                    <p className="text-emerald-600 font-medium">Collected {formatDate(parcel.collectionDate)}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
