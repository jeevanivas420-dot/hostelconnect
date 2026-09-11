'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatMessageData } from './ChatMessage';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  Send,
  Bot,
  ShieldCheck,
  RotateCcw,
  Search,
  Lock,
} from 'lucide-react';

interface ChatWindowProps {
  initialQuery?: string;
  className?: string;
}

export function ChatWindow({ initialQuery = '', className }: ChatWindowProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Hello! I am your 24/7 HostelSync AI assistant. I have read-only access to our official hostel knowledge base. Ask me about gate curfew timings, mess dining hours, leave permissions, or parcel pickup rules!',
      category: 'WELCOME',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customQuery?: string) => {
    const textToSend = (customQuery || query).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessageData = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customQuery) setQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await res.json();

      const aiMessage: ChatMessageData = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer,
        category: data.sourceCategory,
        suggestedActions: data.suggestedActions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'I could not connect to the knowledge base at the moment. Please verify your query or consult the block warden.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'init-1',
        sender: 'ai',
        text: 'Chat cleared. How else may I assist you with hostel information?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const quickPrompts = [
    'What food is being served next?',
    'What are the mess meal timings?',
    'Can a maid bring food to my room if I am sick?',
    'What time does the hostel gate close?',
    'How do I apply for weekend leave?',
    'Where do I collect courier parcels?',
    'Who filed complaints in Room 304?', // Tests the privacy guardrail!
  ];

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col h-[620px]">
      {/* Header bar */}
      <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              HostelSync AI
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Knowledge Base Connected
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Isolated ai_knowledge engine • Privacy guarded
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Privacy Guarantee Pill */}
      <div className="px-6 py-2 bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/40 flex items-center gap-2 text-[11px] text-indigo-700 dark:text-indigo-300">
        <Lock className="w-3 h-3 text-indigo-500 shrink-0" />
        <span>
          <strong>Data Boundary:</strong> AI reads only public hostel policy FAQs. Private complaints, medical data, and personal records are strictly protected.
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex gap-3.5 items-start justify-start animate-in fade-in">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-bl-none bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              Searching ai_knowledge guidelines...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="p-3 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">Suggested:</span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 shrink-0 transition-colors cursor-pointer truncate max-w-[220px]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3"
      >
        <Input
          placeholder="Ask a question about hostel policies, mess hours, outpass rules..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!query.trim() || isLoading}
          leftIcon={<Send className="w-4 h-4" />}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
