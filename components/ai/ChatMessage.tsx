import React from 'react';
import Link from 'next/link';
import { Bot, User, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export interface ChatMessageData {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  category?: string;
  suggestedActions?: {
    label: string;
    href: string;
  }[];
  timestamp: string;
}

export interface ChatMessageProps {
  message: ChatMessageData;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.sender === 'ai';
  const isPrivacyBlock = message.category === 'PRIVACY_PROTECTED';

  return (
    <div
      className={`flex gap-3.5 items-start ${
        isAI ? 'justify-start' : 'justify-end'
      } animate-in fade-in duration-200`}
    >
      {isAI && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-md md:max-w-xl rounded-2xl p-4 text-sm space-y-2 ${
          !isAI
            ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
            : isPrivacyBlock
            ? 'bg-rose-50 dark:bg-rose-950/40 text-slate-800 dark:text-slate-100 rounded-bl-none border border-rose-200 dark:border-rose-900'
            : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between gap-4 text-[11px] opacity-75">
          <span className="font-bold flex items-center gap-1">
            {isAI ? (
              <>
                HostelSync AI
                {isPrivacyBlock ? (
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> Private Guardrail
                  </span>
                ) : message.category ? (
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-semibold">
                    • {message.category}
                  </span>
                ) : null}
              </>
            ) : (
              'You'
            )}
          </span>
          <span className="text-[10px]">{message.timestamp}</span>
        </div>

        <p className="leading-relaxed whitespace-pre-line text-xs sm:text-sm">
          {message.text}
        </p>

        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-2">
            {message.suggestedActions.map((action, idx) => (
              <Link
                key={idx}
                href={action.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
              >
                <span>{action.label}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {!isAI && (
        <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0 mt-0.5 font-bold text-xs">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
