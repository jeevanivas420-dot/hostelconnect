import { createClient } from '@/lib/supabase/server';
import {
  getNextScheduledMeal,
  getCurrentDayOfWeek,
  SAVEETHA_WEEKLY_MENU,
  MEAL_TIMINGS,
  DayOfWeek,
  MealType,
  DAYS_ORDER,
} from '@/lib/messData';

export interface AIKnowledgeRecord {
  id?: string;
  category: string;
  question: string;
  answer: string;
  keywords?: string[];
}

export interface AIResponse {
  answer: string;
  sourceCategory?: string;
  suggestedActions?: {
    label: string;
    href: string;
  }[];
  confidence?: 'HIGH' | 'MEDIUM' | 'GENERAL';
}

// 1. Strict System Prompt with Privacy Guardrails & Up-to-Date Hostel Remembrance
export const HOSTEL_AI_SYSTEM_PROMPT = `
You are HostelSync AI, the resident smart assistant for the SSB Saveetha Engineering New Academic Hostel.
STRICT PRIVACY GUARDRAILS & DATA BOUNDARIES:
- You ONLY have access to general hostel information stored in the ai_knowledge table and verified hostel schedules (rules, mess menus, facilities, gate timings, contacts).
- You DO NOT have access to private student tables (complaints, medical_requests, student personal records, leave histories of others).
- If a user inquires about private records or other residents' personal details, politely inform them that you are restricted to general hostel knowledge and cannot access confidential student data.

HOSTEL SCHEDULE & REMEMBRANCE:
- Dining Schedule (Saveetha New Academic Hostel Menu):
  • BREAKFAST: 07:00 AM - 08:30 AM
  • LUNCH: 11:00 AM - 01:30 PM
  • SNACKS: 04:30 PM - 05:30 PM
  • DINNER: 07:00 PM - 08:30 PM
- You dynamically identify the current day and timings to answer questions about the NEXT MEAL to be served, giving exact food items from the Saveetha menu.
- SICK STUDENT CARE:
  • Residents who are sick can request a hostel maid to deliver meals (mild curd rice, porridge, hot rasam, warm water) directly to their room through the Medical Help desk on their portal.
`;

// 2. Comprehensive Seed Knowledge Base (fallback & bootstrap for ai_knowledge)
export const DEFAULT_AI_KNOWLEDGE: AIKnowledgeRecord[] = [
  {
    category: 'CURFEW',
    question: 'What are the hostel gate timings and curfew rules?',
    answer: 'The hostel main gates close at 09:30 PM on weekdays (Monday to Friday) and at 10:00 PM on weekends. Any entry after curfew without an approved digital outpass incurs an attendance remark and requires warden desk sign-in.',
    keywords: ['gate', 'curfew', 'time', 'timing', 'entry', 'late', 'hours', 'night', 'close'],
  },
  {
    category: 'MESS',
    question: 'What are the daily mess meal timings?',
    answer: 'Official Saveetha Academic Hostel Dining Timings:\n• Breakfast: 07:00 AM to 08:30 AM\n• Lunch: 11:00 AM to 01:30 PM\n• Snacks: 04:30 PM to 05:30 PM\n• Dinner: 07:00 PM to 08:30 PM\nSpecial feasts are served on Wednesdays and Sundays.',
    keywords: ['mess', 'food', 'breakfast', 'lunch', 'dinner', 'snacks', 'timing', 'eat', 'schedule', 'hours'],
  },
  {
    category: 'MESS',
    question: 'What food is served for sick students?',
    answer: 'Sick residents can request sick room diet delivery via the "Medical Help" desk. When requested, the hostel warden assigns a hostel maid (caretaker) to bring mild food (curd rice, warm porridge, hot rasam, and boiled drinking water) directly to the student room.',
    keywords: ['sick', 'room delivery', 'maid', 'diet', 'fever food', 'porridge', 'curd rice', 'food to room'],
  },
  {
    category: 'LEAVE',
    question: 'How do I apply for leave or an outing pass?',
    answer: 'Navigate to the "Leave & Outpass" desk on your portal. Submit your departure/return dates, destination, and ensure parent consent is checked. Once your block warden reviews and approves it, your digital QR outpass is instantly generated for security verification.',
    keywords: ['leave', 'outpass', 'outing', 'home', 'permission', 'night out', 'apply', 'pass'],
  },
  {
    category: 'PARCEL',
    question: 'How do I receive or collect courier packages?',
    answer: 'All deliveries from Amazon, Flipkart, or couriers are received and logged by the Warden at the Dispatch Desk. When your parcel arrives, you receive an arrival alert with a 4-digit OTP. Show this OTP at the warden desk to collect your parcel.',
    keywords: ['parcel', 'courier', 'delivery', 'amazon', 'flipkart', 'package', 'otp', 'collect', 'order'],
  },
  {
    category: 'MAINTENANCE',
    question: 'How do I report electrical or plumbing complaints, and how long does it take?',
    answer: 'You can submit maintenance tickets via the "Complaints" desk. Electrical and plumbing issues are attended to within 24 hours by campus engineers. Wi-Fi and carpentry repairs are typically addressed within 48 hours. Anonymous complaints are available for sensitive concerns.',
    keywords: ['complaint', 'repair', 'electric', 'plumb', 'fan', 'light', 'tap', 'wifi', 'leak', 'fix'],
  },
  {
    category: 'MEDICAL',
    question: 'What should I do in case of a medical emergency?',
    answer: 'In case of medical emergency, use the "Medical Help" desk on your portal or contact the 24/7 Campus Health Annex directly at +91 98401 99999. Campus doctor is on call 24/7 in Admin Annex Room 102, and emergency ambulance transport is available on request. You can also request a hostel maid for room care and sick meal delivery.',
    keywords: ['medical', 'emergency', 'doctor', 'hospital', 'ambulance', 'sick', 'fever', 'health', 'medicine'],
  },
  {
    category: 'FACILITIES',
    question: 'What are the gymnasium and laundry facility timings?',
    answer: 'The resident gymnasium is open daily from 06:00 AM to 09:00 AM and 05:00 PM to 08:30 PM in Block B basement. Automatic laundry washing machines are located on the 2nd floor of every residential block and operate from 06:00 AM to 10:00 PM.',
    keywords: ['gym', 'laundry', 'wash', 'study', 'reading room', 'facilities', 'amenities', 'clothes'],
  },
  {
    category: 'VISITORS',
    question: 'What is the visitor and parent policy?',
    answer: 'Parents and immediate guardians may visit residents in the ground floor visitor lounge between 04:00 PM and 07:00 PM on weekdays, and 10:00 AM to 06:00 PM on weekends. Visitors are not permitted inside residential rooms without prior written permission from the Chief Warden.',
    keywords: ['visitor', 'parent', 'guest', 'friend', 'lounge', 'visit'],
  },
];

// 3. Retrieval Engine: strictly limited to ai_knowledge table
export async function getKnowledgeContext(query: string): Promise<AIKnowledgeRecord[]> {
  const normalizedQuery = query.toLowerCase();

  try {
    const supabase = await createClient();
    const { data: dbRecords, error } = await supabase
      .from('ai_knowledge')
      .select('category, question, answer, keywords');

    if (!error && dbRecords && dbRecords.length > 0) {
      return rankKnowledge(dbRecords, normalizedQuery);
    }
  } catch {
    // Fallback to seeded default records
  }

  return rankKnowledge(DEFAULT_AI_KNOWLEDGE, normalizedQuery);
}

function rankKnowledge(records: AIKnowledgeRecord[], query: string): AIKnowledgeRecord[] {
  const scored = records.map((record) => {
    let score = 0;
    const keywords = record.keywords || [];

    for (const kw of keywords) {
      if (query.includes(kw.toLowerCase())) {
        score += 3;
      }
    }

    const questionWords = record.question.toLowerCase().split(/\s+/);
    for (const word of questionWords) {
      if (word.length > 3 && query.includes(word)) {
        score += 2;
      }
    }

    if (query.includes(record.category.toLowerCase())) {
      score += 4;
    }

    return { record, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.record);
}

// 4. Privacy Check: block queries probing for private student data
function isProbingPrivateData(query: string): boolean {
  const sensitiveTerms = [
    'student complaint',
    'student record',
    'medical record',
    'medical history',
    'who filed',
    'roommate complaint',
    'leave history of',
    'student phone',
    'parent phone number',
    'database table',
    'select * from',
    'users table',
  ];

  return sensitiveTerms.some((term) => query.toLowerCase().includes(term));
}

// 5. Dynamic Next-Meal & Menu Intelligence
function handleFoodAndMealQuery(query: string, now: Date = new Date()): AIResponse | null {
  const q = query.toLowerCase();

  // Next meal triggers
  const nextMealPhrases = [
    'served next',
    'served upcoming',
    'next meal',
    'food next',
    'next food',
    'food served next',
    'food name that gonna be served next',
    'what gonna be served',
    'what is served next',
    'what will be served next',
    'what are we eating next',
    'what is next',
    'next to be served',
    'upcoming meal',
    'coming next',
    'next dish',
    'next menu',
  ];

  const isAskingNextMeal = nextMealPhrases.some((phrase) => q.includes(phrase));

  if (isAskingNextMeal) {
    const next = getNextScheduledMeal(now);
    const itemList = next.items.map((it) => `• ${it}`).join('\n');
    const headerPrefix = next.isCurrentlyServing ? '🟢 Serving Right Now' : '⏳ Next Scheduled Meal';

    return {
      answer: `${headerPrefix}: **${next.label}** (${next.timing})\n` +
        `**Day:** ${next.day} | **Status:** ${next.explanation}\n\n` +
        `**Dishes being served:**\n${itemList}\n\n` +
        `*Tip: Sick residents can request a hostel maid to deliver meals directly to their room under Medical Help.*`,
      sourceCategory: 'MESS',
      suggestedActions: [
        { label: 'View Full Weekly Menu', href: '/student/mess' },
        { label: 'Request Room Delivery (Medical)', href: '/student/medical' },
      ],
      confidence: 'HIGH',
    };
  }

  // Check if asking about a specific day: e.g. "Monday lunch", "Tuesday menu", "Sunday dinner"
  const matchedDay = DAYS_ORDER.find((d) => q.includes(d.toLowerCase())) as DayOfWeek | undefined;
  const mealTypes: MealType[] = ['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'];
  const matchedMeal = mealTypes.find((m) => {
    if (m === 'BREAKFAST' && q.includes('breakfast')) return true;
    if (m === 'LUNCH' && q.includes('lunch')) return true;
    if (m === 'SNACKS' && (q.includes('snack') || q.includes('tea') || q.includes('evening'))) return true;
    if (m === 'DINNER' && (q.includes('dinner') || q.includes('night'))) return true;
    return false;
  }) as MealType | undefined;

  if (matchedDay && matchedMeal) {
    const items = SAVEETHA_WEEKLY_MENU[matchedDay][matchedMeal];
    const schedule = MEAL_TIMINGS[matchedMeal];
    return {
      answer: `🍽️ **${matchedDay} ${schedule.label} (${schedule.timing})**\n\n` +
        `**Menu Items:**\n` +
        items.map((it: string) => `• ${it}`).join('\n'),
      sourceCategory: 'MESS',
      suggestedActions: [{ label: 'Full Mess Schedule', href: '/student/mess' }],
      confidence: 'HIGH',
    };
  }

  if (matchedDay && (q.includes('menu') || q.includes('food') || q.includes('items'))) {
    const dayMenu = SAVEETHA_WEEKLY_MENU[matchedDay];
    let res = `📋 **Complete Mess Menu for ${matchedDay}:**\n\n`;
    mealTypes.forEach((m: MealType) => {
      const schedule = MEAL_TIMINGS[m];
      res += `**${schedule.label} (${schedule.timing}):**\n`;
      res += dayMenu[m].map((it: string) => `• ${it}`).join(', ') + '\n\n';
    });
    return {
      answer: res.trim(),
      sourceCategory: 'MESS',
      suggestedActions: [{ label: 'View Today in Portal', href: '/student/mess' }],
      confidence: 'HIGH',
    };
  }

  // Today's menu general query
  if (
    (q.includes('today') && (q.includes('menu') || q.includes('food') || q.includes('eat'))) ||
    q === 'mess menu' ||
    q === 'food menu' ||
    q === 'what is the menu' ||
    q === 'what is for food'
  ) {
    const today = getCurrentDayOfWeek(now);
    const dayMenu = SAVEETHA_WEEKLY_MENU[today];
    const next = getNextScheduledMeal(now);

    let res = `📅 **Today's Menu (${today}) - Saveetha Academic Hostel**\n\n`;
    res += `👉 **Next Upcoming Meal:** ${next.label} (${next.timing})\n` +
      next.items.map((it: string) => `  • ${it}`).join('\n') + '\n\n';

    res += `**Full Day Schedule:**\n`;
    mealTypes.forEach((m: MealType) => {
      const schedule = MEAL_TIMINGS[m];
      res += `• **${schedule.label}** (${schedule.timing}): ${dayMenu[m].slice(0, 4).join(', ')}...\n`;
    });

    return {
      answer: res.trim(),
      sourceCategory: 'MESS',
      suggestedActions: [{ label: 'Detailed Mess Page', href: '/student/mess' }],
      confidence: 'HIGH',
    };
  }

  // Maid assignment or sick food question
  if (
    q.includes('maid') ||
    q.includes('sick food') ||
    q.includes('food to room') ||
    q.includes('room delivery') ||
    (q.includes('sick') && (q.includes('food') || q.includes('eat')))
  ) {
    return {
      answer: `👩‍⚕️ **Hostel Maid Assistance for Sick Students:**\n\n` +
        `Residents who are sick can submit a **Medical Request** and toggle the option **"Request Sick Room Food Delivery"**.\n\n` +
        `• **What happens:** The Warden assigns a hostel maid (caretaker) to deliver light, healing meals (such as mild curd rice, steamed idly, porridge, hot rasam, and warm drinking water) directly to your room.\n` +
        `• **Care Follow-up:** The assigned maid will also assist with room checks and escorting you to the campus health annex if temperature or symptoms worsen.`,
      sourceCategory: 'MEDICAL',
      suggestedActions: [
        { label: 'Open Medical Help', href: '/student/medical' },
        { label: 'Contact Campus Doctor', href: '/student/medical' },
      ],
      confidence: 'HIGH',
    };
  }

  return null;
}

// 6. Main Model Execution Function
export async function askHostelAI(query: string): Promise<AIResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      answer: 'Hello! How can I help you today? Feel free to ask about mess timings, next meal, gate curfew, outpasses, or courier deliveries.',
      sourceCategory: 'GENERAL',
      confidence: 'HIGH',
    };
  }

  // Enforce Privacy Guardrail
  if (isProbingPrivateData(trimmed)) {
    return {
      answer: '🔒 Privacy Notice: I am restricted to public hostel policies, mess menus, facilities, and general guidelines. I cannot access or disclose private resident complaints, medical records, or personal student profiles.',
      sourceCategory: 'PRIVACY_PROTECTED',
      confidence: 'HIGH',
    };
  }

  // Check Dynamic Food & Next Meal Intelligence FIRST
  const foodResponse = handleFoodAndMealQuery(trimmed);
  if (foodResponse) {
    return foodResponse;
  }

  // Retrieve relevant ai_knowledge documents
  const matchingDocs = await getKnowledgeContext(trimmed);

  if (matchingDocs.length > 0) {
    const topDoc = matchingDocs[0];

    // Determine smart action links based on category
    let suggestedActions: { label: string; href: string }[] | undefined;

    switch (topDoc.category) {
      case 'MESS':
        suggestedActions = [
          { label: "View Today's Menu", href: '/student/mess' },
          { label: 'Next Meal Info', href: '/student/ai' },
        ];
        break;
      case 'LEAVE':
      case 'CURFEW':
        suggestedActions = [{ label: 'Apply for Outpass', href: '/student/leave' }];
        break;
      case 'MAINTENANCE':
        suggestedActions = [{ label: 'File Complaint', href: '/student/complaints' }];
        break;
      case 'PARCEL':
        suggestedActions = [{ label: 'View My Parcels', href: '/student/parcels' }];
        break;
      case 'MEDICAL':
        suggestedActions = [{ label: 'Request Medical Help', href: '/student/medical' }];
        break;
    }

    return {
      answer: topDoc.answer,
      sourceCategory: topDoc.category,
      suggestedActions,
      confidence: 'HIGH',
    };
  }

  // Fallback if no specific rule document matched
  return {
    answer: "I don't have specific instructions in the hostel knowledge base for that question. For unique requirements, please check directly with your Block Warden desk or the Hostel Administrative Office (Ground Floor, Admin Annex).",
    sourceCategory: 'GENERAL',
    confidence: 'GENERAL',
    suggestedActions: [
      { label: 'Check Mess Menu', href: '/student/mess' },
      { label: 'Request Outpass', href: '/student/leave' },
      { label: 'File Complaint', href: '/student/complaints' },
    ],
  };
}
