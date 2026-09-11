import { DayOfWeek, MealType, MessMenuItem } from '@/types/mess';
export type { DayOfWeek, MealType, MessMenuItem };

export interface SaveethaMealSchedule {
  mealType: MealType;
  label: string;
  timing: string; // e.g. '07:00 AM - 08:30 AM'
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export const MEAL_TIMINGS: Record<MealType, SaveethaMealSchedule> = {
  BREAKFAST: {
    mealType: 'BREAKFAST',
    label: 'Breakfast',
    timing: '07:00 AM - 08:30 AM',
    startHour: 7,
    startMinute: 0,
    endHour: 8,
    endMinute: 30,
  },
  LUNCH: {
    mealType: 'LUNCH',
    label: 'Lunch',
    timing: '11:00 AM - 01:30 PM',
    startHour: 11,
    startMinute: 0,
    endHour: 13,
    endMinute: 30,
  },
  SNACKS: {
    mealType: 'SNACKS',
    label: 'Evening Snacks',
    timing: '04:30 PM - 05:30 PM',
    startHour: 16,
    startMinute: 30,
    endHour: 17,
    endMinute: 30,
  },
  DINNER: {
    mealType: 'DINNER',
    label: 'Dinner',
    timing: '07:00 PM - 08:30 PM',
    startHour: 19,
    startMinute: 0,
    endHour: 20,
    endMinute: 30,
  },
};

// Complete SSB Saveetha Engineering New Academic Hostel Menu (August 2026)
export const SAVEETHA_WEEKLY_MENU: Record<DayOfWeek, Record<MealType, string[]>> = {
  MONDAY: {
    BREAKFAST: [
      'Karam Idly',
      'Sweet Attukulu Upma',
      'Small Onion Sambar',
      'Onion Tomato Pachadi',
      'Fruit Kesari',
      'Bread / Jam',
      'Scrambled Egg',
      'Hot Milk',
      'Coffee',
    ],
    LUNCH: [
      'Steamed Rice',
      'Andhra Tomato Pappu',
      'Pudina Rice',
      'Cabbage Thoran',
      'Coconut Thoviyal',
      'Pepper Rasam',
      'Curd Rice',
      'Buttermilk',
      'Curd Chilly',
      'Potato Chips (Veg)',
      'Egg Chettinad Curry',
    ],
    SNACKS: [
      'Keerai Bonda',
      'Milk',
      'Coffee',
      'Tea',
    ],
    DINNER: [
      'Palak Chappathi (4 nos)',
      'Rayalaseema Style Chicken Gravy',
      'Mushroom Masala (Veg)',
      'Idly',
      'Coconut Chutney',
      'Steamed Rice',
      'Raw Banana Varuval',
      'Dal Rasam',
      'Hot Milk',
      'Banana',
    ],
  },
  TUESDAY: {
    BREAKFAST: [
      'Noodles Idly',
      'Adai Dosa',
      'Andhra Tiffin Sambar',
      'Allam Chutney',
      'Bread Omelette',
      'Plain Bread',
      'Jam',
      'Hot Milk',
      'Coffee',
    ],
    LUNCH: [
      'Steamed Rice',
      'Bandakaya Vatha Kulambu',
      'Majiga Pulusu',
      'Lemon Rice',
      'Fryums',
      'Yam Vepudu',
      'Snake Gourd Kootu',
      'Garlic Rasam',
      'Buttermilk',
      'Parupu Podi & Ghee',
      'Fruit Kesari',
    ],
    SNACKS: [
      'Peanut Chat',
      'Milk',
      'Coffee',
      'Tea',
    ],
    DINNER: [
      'Mushroom, Soya, Veg Dum Biriyani',
      'Nellore Chicken Pulusu',
      'Rajma Masala (For Veg)',
      'Idly',
      'Coconut Chutney',
      'Steamed Rice',
      'Rasam',
      'Mango Pickle',
      'Hot Milk',
      'Banana',
    ],
  },
  WEDNESDAY: {
    BREAKFAST: [
      'Idly',
      'Ven Pongal',
      'Brinjal Kosthu',
      'Coconut Chutney',
      'Medhu Vadai',
      'Karam',
      'Gingely Oil',
      'Hot Milk',
      'Coffee',
    ],
    LUNCH: [
      'Steamed Rice',
      'Gutti Vankaya Koora',
      'Coconut Rice',
      'Potato Chips',
      'Thoviyal',
      'Cabbage Kootu',
      'Pepper Rasam',
      'Curd Rice',
      'Semiya Kheer',
      'Pickle',
      'Chicken Semi Gravy',
      'Veg Roll (Veg)',
    ],
    SNACKS: [
      'Black Channa Sundal',
      'Milk',
      'Coffee',
      'Tea',
    ],
    DINNER: [
      'Methi Chappathi',
      'Veg Chettinad Curry',
      'Idly',
      'Bisebellabath',
      'Coconut Chutney',
      'Steamed Rice',
      'Rasam',
      'Curd Rice',
      'Hot Milk',
      'Papaya Cut',
      'Lime Pickle',
    ],
  },
  THURSDAY: {
    BREAKFAST: [
      'Rava Idly',
      'Podi Dosai / Plain Dosai',
      'Pumpkin Sambar',
      'Kara Chutney',
      'Bread',
      'Jam',
      'Boiled Egg',
      'Hot Milk',
      'Coffee',
    ],
    LUNCH: [
      'Steamed Rice',
      'Gongura Tomato Pappu',
      'Tamarind Rice',
      'Raw Banana Fry',
      'Greens Kootu',
      'Ulava Rasam',
      'Curd Rice',
      'Buttermilk',
      'Pappad',
      'Pickle',
      'Andhra Chepala Pulisu (Fish)',
      'Aloo Gobi Paneer Adarki Dry (Veg)',
    ],
    SNACKS: [
      'South Style Pasta',
      'Milk',
      'Coffee',
      'Tea',
    ],
    DINNER: [
      'Parotta (3 nos)',
      'Veg Paya',
      'Idly',
      'Chennai Sambar',
      'Peanut Chutney',
      'Steamed Rice',
      'Rasam',
      'Hot Milk',
      'Morris Banana',
      'Mango Pickle',
      'Curd Rice',
    ],
  },
  FRIDAY: {
    BREAKFAST: [
      'Rice Uppindi',
      'Moong Dal Sambar',
      'White Chutney',
      'Poori',
      'Black Channa Kadala Curry',
      'Bread',
      'Jam',
      'Hot Milk',
      'Coffee',
    ],
    LUNCH: [
      'Steamed Rice',
      'Beans Sambar',
      'Tomato Pappu',
      'Ambur Spl Egg Biriyani',
      'Onion Raitha',
      'Gongura Potato Fry',
      'Potlakaya Vepudu',
      'Tomato Rasam',
      'Curd Rice',
      'Buttermilk',
      'Appalam',
      'Bread Halwa',
    ],
    SNACKS: [
      'Keerai Bonda',
      'Milk',
      'Coffee',
      'Ginger Tea',
    ],
    DINNER: [
      'Idly',
      'Kal Dosai',
      'Chicken Chettinad Masala',
      'Aloo Palak (Veg)',
      'Red Chutney',
      'Steamed Rice',
      'Mixed Veg Poriyal',
      'Rasam',
      'Hot Milk',
      'Water Melon',
      'Lime Pickle',
      'Curd Rice',
    ],
  },
  SATURDAY: {
    BREAKFAST: [
      'Idly',
      'Poha Mixer',
      'Garelu (Medu Vada)',
      'Andhra Tiffin Sambar',
      'Tomato Chutney',
      'Bread',
      'Jam',
      'Hot Milk',
      'Coffee',
    ],
    LUNCH: [
      'Steamed Rice',
      'Greens Sambar',
      'Bindi Karakukambu',
      'Curryleaf Rice',
      'Ridge Gourd Kootu',
      'Mix Veg Poriyal',
      'Garlic Rasam',
      'Curd Rice',
      'Potato Chips (Veg)',
      'Buttermilk',
      'Pappad / Pickle',
      'Mutton Masala (Village Style)',
      'Aloo 65 (Veg)',
    ],
    SNACKS: [
      'Mysore Bonda',
      'Milk',
      'Coffee',
      'Tea',
    ],
    DINNER: [
      'Schezwan Egg Fried Rice',
      'Schezwan Veg Fried Rice',
      'Tomato Ketchup',
      'Idly',
      'Rava Uppindi',
      'Coconut Chutney',
      'Steamed Rice',
      'Rasam',
      'Hot Milk',
      'Lime Pickle',
      'Banana',
    ],
  },
  SUNDAY: {
    BREAKFAST: [
      'Kothimeera Milagu Pongal',
      'Medhu Vadai',
      'Dal Kosthu',
      'Ragi Kozhi',
      'Peanut Chutney',
      'Hot Milk',
      'Coffee',
      'Bread',
      'Jam',
    ],
    LUNCH: [
      'Steamed Rice',
      'Kalyana Sambar',
      'Manathakali Vatha Kulambu',
      'Beetroot Channa Poriyal',
      'Tomato Rasam',
      'Curd Rice',
      'Buttermilk',
      'Potato Chips (Veg)',
      'Ice Cream',
      'Chicken Biriyani (Seeraga Samba)',
      'Brinjal Masala',
      'Mushroom Biriyani (Veg)',
    ],
    SNACKS: [
      'Ragi Puttu',
      'Milk',
      'Coffee',
      'Tea',
    ],
    DINNER: [
      'Idly',
      'Masala Uthappam',
      'Sambar',
      'Coconut Chutney',
      'Steamed Rice',
      'Yam Fry',
      'Rasam',
      'Hot Milk',
      'Morris Banana',
      'Idly Podi',
      'Gingely Oil',
    ],
  },
};

export const DAYS_ORDER: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

/**
 * Get the current day of the week as DayOfWeek
 */
export function getCurrentDayOfWeek(date: Date = new Date()): DayOfWeek {
  const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, ...
  const map: Record<number, DayOfWeek> = {
    0: 'SUNDAY',
    1: 'MONDAY',
    2: 'TUESDAY',
    3: 'WEDNESDAY',
    4: 'THURSDAY',
    5: 'FRIDAY',
    6: 'SATURDAY',
  };
  return map[dayIndex];
}

/**
 * Get next day of week
 */
export function getNextDayOfWeek(day: DayOfWeek): DayOfWeek {
  const idx = DAYS_ORDER.indexOf(day);
  return DAYS_ORDER[(idx + 1) % DAYS_ORDER.length];
}

export interface NextMealResult {
  day: DayOfWeek;
  mealType: MealType;
  label: string;
  timing: string;
  isCurrentlyServing: boolean;
  items: string[];
  explanation: string;
}

/**
 * Calculate the next scheduled meal based on exact hostel timings:
 * - BREAKFAST: 07:00 AM - 08:30 AM
 * - LUNCH: 11:00 AM - 01:30 PM
 * - SNACKS: 04:30 PM - 05:30 PM
 * - DINNER: 07:00 PM - 08:30 PM
 */
export function getNextScheduledMeal(date: Date = new Date()): NextMealResult {
  const currentDay = getCurrentDayOfWeek(date);
  const minutesSinceMidnight = date.getHours() * 60 + date.getMinutes();

  // 07:00 -> 420 mins, 08:30 -> 510 mins
  // 11:00 -> 660 mins, 13:30 -> 810 mins
  // 16:30 -> 990 mins, 17:30 -> 1050 mins
  // 19:00 -> 1140 mins, 20:30 -> 1230 mins

  let targetDay: DayOfWeek = currentDay;
  let targetMeal: MealType = 'BREAKFAST';
  let isCurrentlyServing = false;

  if (minutesSinceMidnight <= 510) {
    // Before or during breakfast (up to 8:30 AM)
    targetMeal = 'BREAKFAST';
    isCurrentlyServing = minutesSinceMidnight >= 420 && minutesSinceMidnight <= 510;
  } else if (minutesSinceMidnight <= 810) {
    // Up to 1:30 PM
    targetMeal = 'LUNCH';
    isCurrentlyServing = minutesSinceMidnight >= 660 && minutesSinceMidnight <= 810;
  } else if (minutesSinceMidnight <= 1050) {
    // Up to 5:30 PM
    targetMeal = 'SNACKS';
    isCurrentlyServing = minutesSinceMidnight >= 990 && minutesSinceMidnight <= 1050;
  } else if (minutesSinceMidnight <= 1230) {
    // Up to 8:30 PM
    targetMeal = 'DINNER';
    isCurrentlyServing = minutesSinceMidnight >= 1140 && minutesSinceMidnight <= 1230;
  } else {
    // After 8:30 PM, next meal is Tomorrow's Breakfast!
    targetDay = getNextDayOfWeek(currentDay);
    targetMeal = 'BREAKFAST';
    isCurrentlyServing = false;
  }

  const items = SAVEETHA_WEEKLY_MENU[targetDay][targetMeal];
  const schedule = MEAL_TIMINGS[targetMeal];

  const statusText = isCurrentlyServing
    ? `Currently being served now until ${schedule.timing.split('-')[1].trim()}`
    : targetDay === currentDay
    ? `Next meal today at ${schedule.timing}`
    : `Next meal tomorrow (${targetDay}) at ${schedule.timing}`;

  return {
    day: targetDay,
    mealType: targetMeal,
    label: schedule.label,
    timing: schedule.timing,
    isCurrentlyServing,
    items,
    explanation: statusText,
  };
}

/**
 * Helper to get all 4 meals for a day as MessMenuItem objects
 */
export function getMenuForDay(day: DayOfWeek): MessMenuItem[] {
  return [
    {
      id: `${day}-breakfast`,
      dayOfWeek: day,
      mealType: 'BREAKFAST',
      timing: MEAL_TIMINGS.BREAKFAST.timing,
      items: SAVEETHA_WEEKLY_MENU[day].BREAKFAST,
    },
    {
      id: `${day}-lunch`,
      dayOfWeek: day,
      mealType: 'LUNCH',
      timing: MEAL_TIMINGS.LUNCH.timing,
      items: SAVEETHA_WEEKLY_MENU[day].LUNCH,
    },
    {
      id: `${day}-snacks`,
      dayOfWeek: day,
      mealType: 'SNACKS',
      timing: MEAL_TIMINGS.SNACKS.timing,
      items: SAVEETHA_WEEKLY_MENU[day].SNACKS,
    },
    {
      id: `${day}-dinner`,
      dayOfWeek: day,
      mealType: 'DINNER',
      timing: MEAL_TIMINGS.DINNER.timing,
      items: SAVEETHA_WEEKLY_MENU[day].DINNER,
      isSpecial: day === 'WEDNESDAY' || day === 'SUNDAY' || day === 'FRIDAY',
    },
  ];
}
