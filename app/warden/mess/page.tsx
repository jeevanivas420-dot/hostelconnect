'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  UtensilsCrossed,
  Clock,
  HeartPulse,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChefHat,
  Coffee,
  Sun,
  Cookie,
  Moon,
  Star,
  ChevronRight,
} from 'lucide-react';
import {
  SAVEETHA_WEEKLY_MENU,
  MEAL_TIMINGS,
  DAYS_ORDER,
  getCurrentDayOfWeek,
  getNextScheduledMeal,
  DayOfWeek,
  MealType,
} from '@/lib/messData';

export default function WardenMessPage() {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getCurrentDayOfWeek());
  const todayDay = getCurrentDayOfWeek();
  const nextMealInfo = getNextScheduledMeal();

  const getMealIcon = (meal: MealType) => {
    switch (meal) {
      case 'BREAKFAST':
        return <Coffee className="w-5 h-5 text-amber-500" />;
      case 'LUNCH':
        return <Sun className="w-5 h-5 text-amber-600" />;
      case 'SNACKS':
        return <Cookie className="w-5 h-5 text-orange-500" />;
      case 'DINNER':
        return <Moon className="w-5 h-5 text-indigo-500" />;
    }
  };

  const selectedDayMenu = SAVEETHA_WEEKLY_MENU[selectedDay];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Warden Catering Desk
              </span>
              <span className="text-xs text-slate-400">
                SSB Saveetha Academic Hostel (Aug 2026 Schedule)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <UtensilsCrossed className="w-7 h-7 text-amber-400" />
              Mess & Food Administration
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Supervise dining operations, schedule kitchen rations, and oversee dietary meal dispatches for sick residents.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/warden/medical">
              <Button
                variant="primary"
                size="md"
                className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20"
                leftIcon={<HeartPulse className="w-4 h-4" />}
              >
                Sick Resident Room Deliveries
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Live Status</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
            {nextMealInfo.isCurrentlyServing ? 'Serving Now' : 'Upcoming'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {nextMealInfo.label} ({nextMealInfo.timing})
          </p>
        </Card>

        <Card className="p-4 border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500">Hostel Resident Headcount</span>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">482 Students</p>
          <p className="text-xs text-emerald-600 font-medium mt-0.5">468 Expected Today</p>
        </Card>

        <Card className="p-4 border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500">Sick Diet Room Deliveries</span>
          <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">2 Active</p>
          <p className="text-xs text-slate-500 mt-0.5">Assigned to Maid Lakshmi & Kamala</p>
        </Card>

        <Card className="p-4 border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500">Mess Hygiene Rating</span>
          <p className="text-lg font-bold text-amber-500 flex items-center gap-1 mt-1">
            4.8 <Star className="w-4 h-4 fill-amber-500" />
          </p>
          <p className="text-xs text-slate-500 mt-0.5">FSSAI Certified Campus Kitchen</p>
        </Card>
      </div>

      {/* Timings Quick Reference */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <Clock className="w-4 h-4 text-indigo-500" />
          Official Mess Timings (Strict Catering Hours):
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>Breakfast: <strong className="text-slate-900 dark:text-white">07:00 - 08:30</strong></span>
          <span>•</span>
          <span>Lunch: <strong className="text-slate-900 dark:text-white">11:00 - 01:30</strong></span>
          <span>•</span>
          <span>Snacks: <strong className="text-slate-900 dark:text-white">04:30 - 05:30</strong></span>
          <span>•</span>
          <span>Dinner: <strong className="text-slate-900 dark:text-white">07:00 - 08:30</strong></span>
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DAYS_ORDER.map((day) => {
          const isToday = day === todayDay;
          const isSelected = day === selectedDay;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{day}</span>
              {isToday && (
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4 Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'] as MealType[]).map((mealType) => {
          const schedule = MEAL_TIMINGS[mealType];
          const dishes = selectedDayMenu[mealType];

          return (
            <Card key={mealType} className="border-slate-200/80 dark:border-slate-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                    {getMealIcon(mealType)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{schedule.label}</CardTitle>
                    <CardDescription className="font-mono text-xs text-slate-500 font-medium">
                      {schedule.timing}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-2">
                  {dishes.map((dish: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium border bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60"
                    >
                      {dish}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
