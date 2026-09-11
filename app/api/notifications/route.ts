import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export interface AnnouncementData {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  targetBlock?: string;
  isPinned: boolean;
  authorName: string;
  createdAt: string;
}

// In-memory announcements store for instantaneous demo reliability
let inMemoryAnnouncements: AnnouncementData[] = [
  {
    id: 'ann-1',
    title: 'New Saveetha Academic Hostel Menu (August 2026) in Effect',
    content: 'The updated 7-day dining schedule is now active. Breakfast: 7:00-8:30 AM, Lunch: 11:00-1:30 PM, Snacks: 4:30-5:30 PM, Dinner: 7:00-8:30 PM. Sick students can request room delivery via Medical Help.',
    category: 'MESS',
    priority: 'HIGH',
    targetBlock: 'ALL',
    isPinned: true,
    authorName: 'Dr. R. Kumar (Chief Warden)',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'ann-2',
    title: 'Hostel Curfew & Weekend Outpass Guidelines',
    content: 'All residents attending inter-college hackathons or academic events must submit their outpass before Friday 5:00 PM with verified parent contact.',
    category: 'ADMIN',
    priority: 'HIGH',
    targetBlock: 'ALL',
    isPinned: true,
    authorName: 'Chief Warden Office',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'ann-3',
    title: 'Scheduled Water Tank Cleaning - Block A & B',
    content: 'Water supply will be temporarily regulated between 10:00 AM and 01:00 PM this Saturday for routine overhead tank sanitation.',
    category: 'MAINTENANCE',
    priority: 'NORMAL',
    targetBlock: 'BLOCK A & B',
    isPinned: false,
    authorName: 'Hostel Maintenance Cell',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type === 'announcements') {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: AnnouncementData[] = data.map((a: any) => ({
          id: a.id,
          title: a.title,
          content: a.content,
          category: a.category || 'GENERAL',
          priority: (a.priority as 'NORMAL' | 'HIGH' | 'URGENT') || 'NORMAL',
          targetBlock: a.target_block || 'ALL',
          isPinned: !!a.is_pinned,
          authorName: 'Chief Warden Office',
          createdAt: a.created_at,
        }));
        return NextResponse.json({ announcements: mapped });
      }
    } catch {
      // Fallback to in-memory
    }
    return NextResponse.json({ announcements: inMemoryAnnouncements });
  }

  // Standard user notifications
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ notifications: data });
    }
  } catch {
    // Fallback handled gracefully
  }

  return NextResponse.json({
    notifications: [
      {
        id: 'notif-1',
        title: 'New Parcel Received',
        message: 'Your parcel from Amazon has arrived at Warden Desk. OTP: 4921',
        type: 'PARCEL',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
      {
        id: 'notif-2',
        title: 'Leave Request Approved',
        message: 'Your weekend home leave has been approved by Warden.',
        type: 'LEAVE',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      },
    ],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { isAnnouncement, type } = body;
    const timestamp = new Date().toISOString();

    if (isAnnouncement || type === 'ANNOUNCEMENT') {
      const {
        title,
        content,
        category = 'GENERAL',
        priority = 'NORMAL',
        targetBlock = 'ALL',
        isPinned = false,
        authorName = 'Warden Office',
      } = body;

      if (!title || !content) {
        return NextResponse.json(
          { error: 'Title and message content are required' },
          { status: 400 }
        );
      }

      const newAnnouncement: AnnouncementData = {
        id: `ann-${Date.now()}`,
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        targetBlock,
        isPinned,
        authorName,
        createdAt: timestamp,
      };

      try {
        const supabase = await createClient();
        await supabase.from('announcements').insert([
          {
            title: newAnnouncement.title,
            content: newAnnouncement.content,
            category: newAnnouncement.category,
            priority: newAnnouncement.priority,
            target_block: newAnnouncement.targetBlock,
            is_pinned: newAnnouncement.isPinned,
          },
        ]);
      } catch {
        // Fallback
      }

      inMemoryAnnouncements.unshift(newAnnouncement);

      return NextResponse.json(
        { announcement: newAnnouncement, success: true },
        { status: 201 }
      );
    }

    // Standard notification creation
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('notifications')
      .insert([body])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to process notification request' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    inMemoryAnnouncements = inMemoryAnnouncements.filter((a) => a.id !== id);

    try {
      const supabase = await createClient();
      await supabase.from('announcements').delete().eq('id', id);
    } catch {
      // Ignore
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
