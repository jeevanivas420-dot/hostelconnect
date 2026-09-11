import { getNextScheduledMeal, getCurrentDayOfWeek, SAVEETHA_WEEKLY_MENU, MEAL_TIMINGS } from './lib/messData.js';
import { askHostelAI } from './lib/ai.js';

console.log('Testing Saveetha Mess Menu & AI Remembrance...');

// 1. Test getNextScheduledMeal with different hours
const morningDate = new Date('2026-09-11T07:30:00+05:30'); // Friday 7:30 AM
const lunchDate = new Date('2026-09-11T12:00:00+05:30'); // Friday 12:00 PM
const eveningDate = new Date('2026-09-11T17:00:00+05:30'); // Friday 5:00 PM
const nightDate = new Date('2026-09-11T20:00:00+05:30'); // Friday 8:00 PM
const lateNightDate = new Date('2026-09-11T22:00:00+05:30'); // Friday 10:00 PM

console.log('\n--- 1. Testing Timings & Next Meal Scheduling ---');
const mResult = getNextScheduledMeal(morningDate);
console.log('Morning 7:30 AM -> Meal:', mResult.label, 'Timing:', mResult.timing, 'Serving:', mResult.isCurrentlyServing);
if (mResult.label !== 'Breakfast' || mResult.timing !== '07:00 AM - 08:30 AM') throw new Error('Breakfast timing failed');

const lResult = getNextScheduledMeal(lunchDate);
console.log('Noon 12:00 PM -> Meal:', lResult.label, 'Timing:', lResult.timing, 'Serving:', lResult.isCurrentlyServing);
if (lResult.label !== 'Lunch' || lResult.timing !== '11:00 AM - 01:30 PM') throw new Error('Lunch timing failed');

const sResult = getNextScheduledMeal(eveningDate);
console.log('Evening 5:00 PM -> Meal:', sResult.label, 'Timing:', sResult.timing, 'Serving:', sResult.isCurrentlyServing);
if (sResult.label !== 'Evening Snacks' || sResult.timing !== '04:30 PM - 05:30 PM') throw new Error('Snacks timing failed');

const dResult = getNextScheduledMeal(nightDate);
console.log('Night 8:00 PM -> Meal:', dResult.label, 'Timing:', dResult.timing, 'Serving:', dResult.isCurrentlyServing);
if (dResult.label !== 'Dinner' || dResult.timing !== '07:00 PM - 08:30 PM') throw new Error('Dinner timing failed');

const lateResult = getNextScheduledMeal(lateNightDate);
console.log('Late Night 10:00 PM -> Next Meal:', lateResult.label, 'Day:', lateResult.day);
if (lateResult.label !== 'Breakfast' || lateResult.day !== 'SATURDAY') throw new Error('Late night rollover failed');

console.log('Timings & Scheduling tests passed!');
