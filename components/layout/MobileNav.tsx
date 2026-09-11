'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { X, Building2, LayoutDashboard, UtensilsCrossed, FileText, AlertTriangle, PlaneTakeoff, PackageCheck, HeartPulse, Bell, Sparkles, Megaphone, Users, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'STUDENT' | 'WARDEN';
}

export function MobileNav({ isOpen, onClose, role }: MobileNavProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  if (!isOpen) return null;

  const studentLinks = [
    { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Mess & Food', href: '/student/mess', icon: UtensilsCrossed },
    { name: 'Leave & Outpass', href: '/student/leave', icon: PlaneTakeoff },
    { name: 'Complaints', href: '/student/complaints', icon: AlertTriangle },
    { name: 'Parcels', href: '/student/parcels', icon: PackageCheck },
    { name: 'Requests & Lost', href: '/student/requests', icon: FileText },
    { name: 'Medical', href: '/student/medical', icon: HeartPulse },
    { name: 'Notifications', href: '/student/notifications', icon: Bell },
    { name: 'Hostel AI', href: '/student/ai', icon: Sparkles },
  ];

  const wardenLinks = [
    { name: 'Dashboard', href: '/warden/dashboard', icon: LayoutDashboard },
    { name: 'Leave Approvals', href: '/warden/leave', icon: PlaneTakeoff },
    { name: 'Complaints Desk', href: '/warden/complaints', icon: AlertTriangle },
    { name: 'Announcements', href: '/warden/announcements', icon: Megaphone },
    { name: 'Mess Management', href: '/warden/mess', icon: UtensilsCrossed },
    { name: 'Parcel Dispatch', href: '/warden/parcels', icon: PackageCheck },
    { name: 'Medical Cases', href: '/warden/medical', icon: HeartPulse },
    { name: 'Student Directory', href: '/warden/students', icon: Users },
    { name: 'All Requests', href: '/warden/requests', icon: FileText },
  ];

  const links = role === 'WARDEN' ? wardenLinks : studentLinks;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full flex flex-col z-10 border-r border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">HostelSync</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              onClose();
              signOut();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
