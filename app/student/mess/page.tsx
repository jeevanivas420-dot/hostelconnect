'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import {
  UtensilsCrossed,
  Clock,
  Sparkles,
  HeartPulse,
  ChevronRight,
  Star,
  Coffee,
  Sun,
  Cookie,
  Moon,
  CheckCircle2,
  Calendar,
  AlertCircle,
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

export default function StudentMessPage() {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getCurrentDayOfWeek());
  const [nextMealInfo, setNextMealInfo] = useState(getNextScheduledMeal());
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedMealForFeedback, setSelectedMealForFeedback] = useState<MealType>('LUNCH');
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Auto-refresh next meal every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setNextMealInfo(getNextScheduledMeal());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const todayDay = getCurrentDayOfWeek();

  const handleOpenFeedback = (meal: MealType) => {
    setSelectedMealForFeedback(meal);
    setRating(5);
    setFeedbackText('');
    setFeedbackSubmitted(false);
    setFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackModalOpen(false);
      setFeedbackSubmitted(false);
    }, 1500);
  };

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
      {/* Top Banner with Live Next-Meal Indicator */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                SSB Saveetha Engineering Hostel
              </span>
              <span className="text-xs text-slate-300 font-medium">
                New Academic Hostel Menu (August 2026)
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <UtensilsCrossed className="w-7 h-7 text-amber-400" />
              Mess & Dining Schedule
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Standardized hygienic dining. Pure vegetarian, non-veg gravies, and special dietary care for residents.
            </p>
          </div>

          {/* Live Next Meal Card */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 max-w-md w-full shrink-0 shadow-lg">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {nextMealInfo.isCurrentlyServing ? 'Serving Right Now' : 'Up Next to be Served'}
              </span>
              <Badge variant="warning" size="sm" className="font-mono text-[10px]">
                {nextMealInfo.timing}
              </Badge>
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              {nextMealInfo.label} ({nextMealInfo.day})
            </h3>
            <p className="text-xs text-slate-200 line-clamp-2 mb-3">
              {nextMealInfo.items.slice(0, 5).join(', ')}...
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/10">
              <span>{nextMealInfo.explanation}</span>
              <Link
                href="/student/ai"
                className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1"
              >
                Ask Hostel AI
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sick Student Dietary Room Delivery Alert */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 dark:from-rose-950/40 dark:via-amber-950/30 dark:to-orange-950/30 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0 mt-0.5 sm:mt-0 shadow-md shadow-rose-600/20">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Feeling Unwell or Feverish?
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                Hostel Maid Room Service
              </span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Residents can request a hostel maid to deliver mild recovery meals (curd rice, warm porridge, hot rasam, and boiled drinking water) directly to their room.
            </p>
          </div>
        </div>
        <Link href="/student/medical" className="shrink-0">
          <Button
            variant="primary"
            size="sm"
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm"
            leftIcon={<HeartPulse className="w-3.5 h-3.5" />}
          >
            Request Sick Meal Delivery
          </Button>
        </Link>
      </div>

      {/* Timings Quick Reference Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'] as MealType[]).map((m) => {
          const timing = MEAL_TIMINGS[m];
          const isNext = nextMealInfo.mealType === m && (nextMealInfo.day === todayDay || nextMealInfo.isCurrentlyServing);

          return (
            <div
              key={m}
              className={`p-3.5 rounded-2xl border transition-all ${
                isNext
                  ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-sm ring-1 ring-indigo-500/20'
                  : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  {getMealIcon(m)}
                  {timing.label}
                </span>
                {isNext && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>
              <p className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
                {timing.timing}
              </p>
            </div>
          );
        })}
      </div>

      {/* Day Selector Pills */}
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
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{day}</span>
              {isToday && (
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  }`}
                >
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4 Meal Cards for Selected Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'] as MealType[]).map((mealType) => {
          const schedule = MEAL_TIMINGS[mealType];
          const dishes = selectedDayMenu[mealType];
          const isUpcomingOrCurrent =
            selectedDay === nextMealInfo.day && nextMealInfo.mealType === mealType;

          return (
            <Card
              key={mealType}
              className={`border transition-all duration-200 ${
                isUpcomingOrCurrent
                  ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                  : 'border-slate-200/80 dark:border-slate-800 shadow-sm'
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                    {getMealIcon(mealType)}
                  </div>
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {schedule.label}
                      {isUpcomingOrCurrent && (
                        <Badge variant="warning" size="sm" withDot>
                          {nextMealInfo.isCurrentlyServing ? 'Serving Now' : 'Next Meal'}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="font-mono text-xs text-slate-500 font-medium">
                      {schedule.timing}
                    </CardDescription>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenFeedback(mealType)}
                  className="text-xs text-slate-500 hover:text-indigo-600"
                  leftIcon={<Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                >
                  Rate
                </Button>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-2">
                  {dishes.map((dish: string, idx: number) => {
                    const isVegSpecial = dish.toLowerCase().includes('(veg)');
                    const isChickenOrEgg =
                      dish.toLowerCase().includes('chicken') ||
                      dish.toLowerCase().includes('egg') ||
                      dish.toLowerCase().includes('fish') ||
                      dish.toLowerCase().includes('mutton') ||
                      dish.toLowerCase().includes('omelette');

                    return (
                      <span
                        key={idx}
                        className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium border transition-colors ${
                          isChickenOrEgg
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60 font-semibold'
                            : isVegSpecial
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60'
                        }`}
                      >
                        {dish}
                      </span>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Meal Feedback Modal */}
      <Modal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        title={`Meal Feedback: ${MEAL_TIMINGS[selectedMealForFeedback].label}`}
        description="Help the hostel mess committee improve food quality and service."
      >
        {feedbackSubmitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Feedback Submitted!</h4>
            <p className="text-xs text-slate-500">Thank you for helping maintain high culinary standards.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Food Quality Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-500 ml-2">
                  {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : 'Needs Improvement'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Comments / Dish Suggestions
              </label>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your experience regarding taste, freshness, hygiene, or quantity..."
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setFeedbackModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Submit Feedback
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
