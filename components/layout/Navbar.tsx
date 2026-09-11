'use client';

import React from 'react';
import Link from 'next/link';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Sparkles, Clock, Shield, Search } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface NavbarProps {
  role: 'STUDENT' | 'WARDEN';
  onMobileMenuToggle?: () => void;
}

export function Navbar({ role, onMobileMenuToggle }: NavbarProps) {
  const { unreadCount } = useNotifications();
  const { user } = useAuth();

  return (
    <header className="h-16 px-4 md:px-8 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
      {/* Left side: Context badge and quick status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Hostel Wi-Fi & Gate Online
          </span>
          <span className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Clock className="w-3 h-3 text-slate-400" />
            Gate Curfew: 09:30 PM
          </span>
        </div>
      </div>

      {/* Right side: AI button, Notifications, User */}
      <div className="flex items-center gap-2.5">
        {/* Hostel AI quick shortcut */}
        <Link
          href="/student/ai"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-all duration-150"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span>Hostel AI</span>
          <span className="text-[10px] px-1 py-0.2 rounded bg-indigo-200/50 dark:bg-indigo-900/50 font-mono">
            Ctrl+K
          </span>
        </Link>

        {/* Notifications Icon with Badge */}
        <Link
          href={role === 'WARDEN' ? '/warden/dashboard' : '/student/notifications'}
          className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User Role Tag */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <Badge
            variant={role === 'WARDEN' ? 'warning' : 'default'}
            size="sm"
            withDot
            className="uppercase tracking-wider font-semibold"
          >
            {role}
          </Badge>
          <div className="hidden md:block text-right">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
              {user?.fullName?.split(' ')[0] || (role === 'WARDEN' ? 'Warden' : 'Student')}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
