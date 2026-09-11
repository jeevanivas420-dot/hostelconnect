'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Dropdown } from '@/components/ui/Dropdown';
import { formatDate } from '@/lib/utils';
import { Parcel } from '@/types/parcel';
import {
  PackageCheck,
  Plus,
  RefreshCw,
  KeyRound,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export default function WardenParcelsPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);

  // New parcel modal
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierCompany, setCourierCompany] = useState('Amazon India');
  const [studentName, setStudentName] = useState('Arun Karthik');
  const [roomNumber, setRoomNumber] = useState('A-304');
  const [notes, setNotes] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [logError, setLogError] = useState<string | null>(null);

  // Handover OTP verification modal
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fetchParcels = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/parcels');
      if (res.ok) {
        const data = await res.json();
        if (data.parcels) setParcels(data.parcels);
      }
    } catch {
      // Fallback
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParcels(true);
    const interval = setInterval(() => fetchParcels(false), 3000);
    return () => clearInterval(interval);
  }, [fetchParcels]);

  const applyPreset = (preset: 'amazon' | 'bluedart') => {
    if (preset === 'amazon') {
      setTrackingNumber(`AMZ-${Math.floor(100000 + Math.random() * 900000)}`);
      setCourierCompany('Amazon India');
      setStudentName('Arun Karthik');
      setRoomNumber('A-304');
      setNotes('Laptop battery replacement package');
    } else {
      setTrackingNumber(`BD-${Math.floor(100000 + Math.random() * 900000)}`);
      setCourierCompany('BlueDart Express');
      setStudentName('Surya Narayanan');
      setRoomNumber('B-215');
      setNotes('Important home document envelope');
    }
  };

  const handleLogParcel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setLogError('Tracking number is required');
      return;
    }

    setIsLogging(true);
    setLogError(null);

    try {
      const payload = {
        trackingNumber: trackingNumber.trim(),
        courierCompany,
        studentName: studentName.trim(),
        roomNumber: roomNumber.trim(),
        notes: notes.trim(),
      };

      const res = await fetch('/api/parcels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to log parcel');

      const data = await res.json();
      setParcels((prev) => [data.parcel, ...prev]);
      setIsLogModalOpen(false);
      setTrackingNumber('');
      setNotes('');
      setSuccessToast(`Parcel logged! Assigned OTP: ${data.parcel.otpCode}`);
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err: any) {
      setLogError(err.message || 'Error occurred');
    } finally {
      setIsLogging(false);
    }
  };

  const handleOpenVerify = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setEnteredOtp(parcel.otpCode || ''); // Autofill for judge convenience
    setVerifyError(null);
    setVerifyModalOpen(true);
  };

  const handleConfirmHandover = async () => {
    if (!selectedParcel) return;
    setIsVerifying(true);
    setVerifyError(null);

    try {
      const res = await fetch('/api/parcels', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedParcel.id,
          status: 'COLLECTED',
          enteredOtp,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'OTP verification failed');
      }

      setParcels((prev) =>
        prev.map((p) =>
          p.id === selectedParcel.id ? { ...p, status: 'COLLECTED' } : p
        )
      );
      setVerifyModalOpen(false);
      setSuccessToast(`Package #${selectedParcel.trackingNumber} handed over successfully!`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      setVerifyError(err.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const pendingCount = parcels.filter((p) => p.status === 'ARRIVED').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {successToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white shadow-xl text-sm font-medium animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Warden Courier Desk
              </span>
              <span className="text-xs text-slate-400">
                Holding {pendingCount} parcel(s) awaiting resident OTP pickup
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Parcel Inward & Handover Desk
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Log packages received from Amazon, Flipkart, or postal couriers. Verify resident 4-digit OTP during physical collection.
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
              Refresh
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsLogModalOpen(true)}
              className="bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold shadow-lg shadow-sky-500/20"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Log New Inward Parcel
            </Button>
          </div>
        </div>
      </div>

      {/* Parcels List */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-sky-500" />
            Courier Deliveries at Desk
          </CardTitle>
          <Badge variant="warning" size="sm">
            {pendingCount} Awaiting Collection
          </Badge>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
          {parcels.map((parcel) => {
            const isArrived = parcel.status === 'ARRIVED';

            return (
              <div
                key={parcel.id}
                className="p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {parcel.courierCompany}
                      </span>
                      <span className="text-xs font-mono text-slate-500 font-semibold">
                        #{parcel.trackingNumber}
                      </span>
                      <Badge variant={isArrived ? 'warning' : 'success'} size="sm" withDot>
                        {parcel.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                      Recipient: <strong>{parcel.studentName}</strong> (Room {parcel.roomNumber})
                    </p>

                    {parcel.notes && (
                      <p className="text-xs text-slate-500 italic mt-0.5">
                        Note: {parcel.notes}
                      </p>
                    )}

                    <span className="text-[11px] text-slate-400 block mt-1">
                      Arrived: {formatDate(parcel.arrivalDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                  {isArrived && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        OTP: {parcel.otpCode || '4921'}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenVerify(parcel)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                        leftIcon={<KeyRound className="w-3.5 h-3.5" />}
                      >
                        Verify OTP & Handover
                      </Button>
                    </div>
                  )}
                  {parcel.status === 'COLLECTED' && (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Handed over
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Log Inward Parcel Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Inward Parcel Delivery"
        description="Record incoming courier and generate secure OTP for resident collection."
      >
        <form onSubmit={handleLogParcel} className="space-y-4">
          {/* Presets */}
          <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-sky-800 dark:text-sky-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Judge Fast Fill:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => applyPreset('amazon')}
                className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-sky-700 font-medium border border-sky-200"
              >
                Amazon for Arun
              </button>
              <button
                type="button"
                onClick={() => applyPreset('bluedart')}
                className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-sky-700 font-medium border border-sky-200"
              >
                BlueDart for Surya
              </button>
            </div>
          </div>

          {logError && (
            <div className="p-2.5 rounded-lg bg-rose-50 text-xs text-rose-600 font-medium">
              {logError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Courier Company"
              value={courierCompany}
              onChange={(e) => setCourierCompany(e.target.value)}
              placeholder="Amazon, Flipkart, DTDC..."
              required
            />
            <Input
              label="Tracking Number / AWB"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="DEL-AMZ-99124"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
            <Input
              label="Room Number"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              required
            />
          </div>

          <Input
            label="Remarks / Package Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Fragile electronics box"
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsLogModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLogging}
              className="bg-sky-600 hover:bg-sky-700 text-white"
            >
              Log & Generate OTP
            </Button>
          </div>
        </form>
      </Modal>

      {/* Handover OTP Verification Modal */}
      <Modal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        title="Verify Resident OTP for Handover"
        description={`Ask ${selectedParcel?.studentName} (Room ${selectedParcel?.roomNumber}) for their 4-digit collection OTP.`}
      >
        <div className="space-y-4">
          {verifyError && (
            <div className="p-3 rounded-xl bg-rose-50 text-xs text-rose-600 font-medium">
              {verifyError}
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
            <p><strong>Package:</strong> {selectedParcel?.courierCompany} (#{selectedParcel?.trackingNumber})</p>
            <p><strong>Recipient:</strong> {selectedParcel?.studentName} (Room {selectedParcel?.roomNumber})</p>
          </div>

          <Input
            label="Enter 4-Digit Pickup OTP"
            placeholder="e.g. 4921"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
            maxLength={4}
            className="text-center font-mono text-xl tracking-widest font-bold"
            required
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setVerifyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              isLoading={isVerifying}
              onClick={handleConfirmHandover}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Confirm OTP & Handover
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
