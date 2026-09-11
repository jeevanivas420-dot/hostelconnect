import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LucideIcon, ArrowRight } from 'lucide-react';

export interface QuickActionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'sky';
  className?: string;
}

export function QuickAction({
  title,
  description,
  icon: Icon,
  href,
  onClick,
  colorScheme = 'indigo',
  className,
}: QuickActionProps) {
  const schemes = {
    indigo: {
      bg: 'hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:border-indigo-200 dark:hover:border-indigo-800',
      iconBox: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white',
    },
    emerald: {
      bg: 'hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:border-emerald-200 dark:hover:border-emerald-800',
      iconBox: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white',
    },
    amber: {
      bg: 'hover:bg-amber-50/50 dark:hover:bg-amber-950/20 hover:border-amber-200 dark:hover:border-amber-800',
      iconBox: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white',
    },
    rose: {
      bg: 'hover:bg-rose-50/50 dark:hover:bg-rose-950/20 hover:border-rose-200 dark:hover:border-rose-800',
      iconBox: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:bg-rose-600 group-hover:text-white',
    },
    purple: {
      bg: 'hover:bg-purple-50/50 dark:hover:bg-purple-950/20 hover:border-purple-200 dark:hover:border-purple-800',
      iconBox: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white',
    },
    sky: {
      bg: 'hover:bg-sky-50/50 dark:hover:bg-sky-950/20 hover:border-sky-200 dark:hover:border-sky-800',
      iconBox: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white',
    },
  };

  const currentScheme = schemes[colorScheme];

  const content = (
    <div
      className={cn(
        'group flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-200 hover:shadow-sm cursor-pointer',
        currentScheme.bg,
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0',
            currentScheme.iconBox
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {description}
          </p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }

  return content;
}
