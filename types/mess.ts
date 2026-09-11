export type MealType = 'BREAKFAST' | 'LUNCH' | 'SNACKS' | 'DINNER';
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface MessMenuItem {
  id: string;
  dayOfWeek: DayOfWeek;
  mealType: MealType;
  items: string[];
  timing: string;
  isSpecial?: boolean;
  caloriesEstimate?: number;
}

export interface MessFeedback {
  id: string;
  studentId: string;
  studentName?: string;
  mealType: MealType;
  rating: number; // 1-5
  comment: string;
  date: string;
  createdAt: string;
}
