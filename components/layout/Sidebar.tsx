'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  UtensilsCrossed,
  FileText,
  AlertTriangle,
  PlaneTakeoff,
  PackageCheck,
  HeartPulse,
  Bell,
  Sparkles,
  Megaphone,
  Users,
  LogOut,
  Building2,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

interface SidebarProps {
  role: 'STUDENT' | 'WARDEN';
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const studentLinks: NavItem[] = [
    { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Mess & Food', href: '/student/mess', icon: UtensilsCrossed },
    { name: 'Leave & Outpass', href: '/student/leave', icon: PlaneTakeoff },
    { name: 'Complaints', href: '/student/complaints', icon: AlertTriangle },
    { name: 'Parcels', href: '/student/parcels', icon: PackageCheck },
    { name: 'Requests & Lost', href: '/student/requests', icon: FileText },
    { name: 'Medical', href: '/student/medical', icon: HeartPulse },
    { name: 'Notifications', href: '/student/notifications', icon: Bell },
    { name: 'Hostel AI', href: '/student/ai', icon: Sparkles, highlight: true },
  ];

  const wardenLinks: NavItem[] = [
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
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <Link href={role === 'WARDEN' ? '/warden/dashboard' : '/student/dashboard'} className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              HostelSync
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                PRO
              </span>
            </span>
            <p className="text-[11px] text-slate-500 font-medium">Smart Resident Portal</p>
          </div>
        </Link>
      </div>

      {/* Role Pill Banner */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          {role === 'WARDEN' ? (
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          ) : (
            <GraduationCap className="w-4 h-4 text-indigo-500" />
          )}
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {role === 'WARDEN' ? 'Warden Portal' : 'Student Portal'}
          </span>
        </div>
      </div>

      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/student/dashboard' && link.href !== '/warden/dashboard');

          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                'group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
                link.highlight && !isActive && 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-4 h-4 transition-transform group-hover:scale-110',
                    isActive
                      ? 'text-white'
                      : link.highlight
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  )}
                />
                <span>{link.name}</span>
              </div>
              {link.highlight && (
                <span className={cn(
                  'text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full',
                  isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                )}>
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs shrink-0">
              {user?.fullName?.charAt(0) || (role === 'WARDEN' ? 'W' : 'S')}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {user?.fullName || (role === 'WARDEN' ? 'Warden Office' : 'Arun Karthik')}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {role === 'WARDEN' ? 'Employee ID: WAR-902' : 'Room A-304'}
              </p>
            </div>
          </div>
          <button
            onClick={signOut}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
