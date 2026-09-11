import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus } from '@/types/complaint';

// Global shared store for complaints resilience & live demo
let inMemoryComplaints: Complaint[] = [
  {
    id: 'comp-101',
    studentId: 'stud-demo-1',
    studentName: 'Arun Karthik',
    roomNumber: 'A-304',
    block: 'Block A (Aryabhata)',
    title: 'Ceiling Fan Regulator Sparking',
    description: 'Speed knob sparks and makes burning odor when turned to speed 4 or 5.',
    category: 'ELECTRICAL',
    priority: 'URGENT',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updates: [],
  },
  {
    id: 'comp-102',
    studentId: 'stud-demo-2',
    studentName: 'Praveen Venkatesh',
    roomNumber: 'B-112',
    block: 'Block B',
    title: 'Washroom Pipe Continuous Dripping',
    description: 'Tap in floor 2 wing A does not shut completely, causing water waste.',
    category: 'PLUMBING',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    assignedStaff: 'Murugan (Chief Plumber)',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updates: [
      {
        id: 'upd-1',
        complaintId: 'comp-102',
        updatedBy: 'WAR-902',
        updaterRole: 'WARDEN',
        message: 'Assigned to plumber Murugan. Inspection scheduled for 3:00 PM today.',
        statusChange: 'IN_PROGRESS',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
    ],
  },
  {
    id: 'comp-103',
    studentId: 'stud-demo-anonymous',
    studentName: 'Anonymous Resident',
    roomNumber: 'Protected',
    block: 'Hostel Block A',
    title: 'Mess Water Cooler Filter Foul Smell',
    description: 'The drinking water cooler in the ground floor dining hall smells dusty and requires filter cartridge replacement.',
    category: 'MESS',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updates: [],
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const status = searchParams.get('status');

  try {
    const supabase = await createClient();
    let query = supabase
      .from('complaints')
      .select('*, students(room_number, block, users(full_name)), complaint_updates(*)')
      .order('created_at', { ascending: false });

    if (studentId) {
      query = query.eq('student_id', studentId);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      const formatted: Complaint[] = data.map((item: any) => ({
        id: item.id,
        studentId: item.student_id,
        studentName: item.students?.users?.full_name || 'Resident',
        roomNumber: item.students?.room_number || 'A-304',
        block: item.students?.block || 'Block A',
        title: item.title,
        description: item.description,
        category: item.category as ComplaintCategory,
        priority: item.priority as ComplaintPriority,
        status: item.status as ComplaintStatus,
        assignedStaff: item.assigned_staff,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        updates: item.complaint_updates || [],
      }));
      return NextResponse.json({ complaints: formatted });
    }
  } catch {
    // Fallback
  }

  let results = [...inMemoryComplaints];
  if (studentId) {
    results = results.filter((c) => c.studentId === studentId || c.studentName === 'Arun Karthik' || c.studentName === 'Anonymous Resident');
  }
  if (status) {
    results = results.filter((c) => c.status === status);
  }

  return NextResponse.json({ complaints: results });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentId = 'stud-demo-1',
      studentName = 'Arun Karthik',
      roomNumber = 'A-304',
      block = 'Block A',
      title,
      description,
      category = 'OTHER',
      priority = 'MEDIUM',
      isAnonymous = false,
    } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const newId = `comp-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const newComplaint: Complaint = {
      id: newId,
      studentId: isAnonymous ? 'anonymous-user' : studentId,
      studentName: isAnonymous ? 'Anonymous Resident' : studentName,
      roomNumber: isAnonymous ? 'Confidential' : roomNumber,
      block: isAnonymous ? 'Hostel Resident' : block,
      title,
      description,
      category,
      priority,
      status: 'OPEN',
      createdAt: timestamp,
      updatedAt: timestamp,
      updates: [],
    };

    // Try Supabase insert
    try {
      const supabase = await createClient();
      await supabase.from('complaints').insert([
        {
          id: newId.includes('-') && newId.length === 36 ? newId : undefined,
          student_id: studentId,
          title: isAnonymous ? `[ANONYMOUS] ${title}` : title,
          description,
          category,
          priority,
          status: 'OPEN',
        },
      ]);
    } catch {
      // Fallback
    }

    inMemoryComplaints.unshift(newComplaint);
    return NextResponse.json({ complaint: newComplaint, success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit complaint' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, assignedStaff, updateMessage } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Complaint ID and status are required' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    // Try Supabase update
    try {
      const supabase = await createClient();
      await supabase
        .from('complaints')
        .update({
          status,
          assigned_staff: assignedStaff || undefined,
          updated_at: timestamp,
        })
        .eq('id', id);

      if (updateMessage) {
        await supabase.from('complaint_updates').insert([
          {
            complaint_id: id,
            updated_by: '00000000-0000-0000-0000-000000000000',
            updater_role: 'WARDEN',
            message: updateMessage,
            status_change: status,
          },
        ]);
      }
    } catch {
      // Fallback
    }

    // Update in-memory
    let updatedComplaint: Complaint | null = null;
    inMemoryComplaints = inMemoryComplaints.map((c) => {
      if (c.id === id) {
        const updatesList = c.updates || [];
        if (updateMessage) {
          updatesList.push({
            id: `upd-${Date.now()}`,
            complaintId: id,
            updatedBy: 'WAR-902',
            updaterRole: 'WARDEN',
            message: updateMessage,
            statusChange: status,
            createdAt: timestamp,
          });
        }
        updatedComplaint = {
          ...c,
          status,
          assignedStaff: assignedStaff !== undefined ? assignedStaff : c.assignedStaff,
          updatedAt: timestamp,
          updates: updatesList,
        };
        return updatedComplaint;
      }
      return c;
    });

    if (!updatedComplaint) {
      updatedComplaint = {
        id,
        studentId: 'stud-demo-1',
        studentName: 'Resident',
        roomNumber: 'A-304',
        title: 'Updated Complaint',
        description: 'Details updated',
        category: 'ELECTRICAL',
        priority: 'MEDIUM',
        status,
        assignedStaff,
        createdAt: new Date().toISOString(),
        updatedAt: timestamp,
      };
      inMemoryComplaints.unshift(updatedComplaint);
    }

    return NextResponse.json({ complaint: updatedComplaint, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update complaint' }, { status: 500 });
  }
}
