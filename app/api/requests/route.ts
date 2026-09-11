import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MedicalRequest, MedicalStatus, MedicalUrgency } from '@/types/medical';
import { LostFoundItem, RequestStatus } from '@/types/request';

// In-memory store for Medical Requests
let inMemoryMedicalRequests: MedicalRequest[] = [
  {
    id: 'med-101',
    studentId: 'stud-demo-1',
    studentName: 'Harish Babu',
    roomNumber: 'A-108',
    symptoms: 'High grade fever 102.4 F, chills, severe fatigue since 2 hours.',
    urgency: 'CRITICAL',
    temperature: '102.4 F',
    requiresAmbulance: false,
    status: 'ATTENDED',
    firstAidGiven: 'Paracetamol 650mg & cold wet sponge compress applied.',
    doctorNotes: 'Dr. inspected room. Advised bed rest and light liquid diet.',
    assignedMaid: 'Lakshmi (Caretaker - Block A)',
    roomFoodDelivery: true,
    dietNotes: 'Mild curd rice, warm rasam & boiled drinking water delivered to room',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'med-102',
    studentId: 'stud-demo-2',
    studentName: 'Dinesh Balan',
    roomNumber: 'B-302',
    symptoms: 'Severe ankle sprain while playing basketball in hostel court.',
    urgency: 'MODERATE',
    temperature: '98.6 F',
    requiresAmbulance: false,
    status: 'ATTENDED',
    firstAidGiven: 'Cold compress and crepe bandage applied by warden health desk.',
    doctorNotes: 'Advised rest and Volini gel. Re-evaluate tomorrow.',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];

// In-memory store for Lost & Found items
let inMemoryLostFound: LostFoundItem[] = [
  {
    id: 'lf-101',
    userId: 'stud-demo-1',
    userName: 'Arun Karthik',
    userPhone: '+91 98401 23456',
    type: 'LOST',
    title: 'Blue Boat Airdopes Earbuds Case',
    description: 'Lost near Block A ground floor study reading room yesterday evening around 7:00 PM.',
    location: 'Block A Study Hall',
    itemDate: new Date().toISOString().split('T')[0],
    contactInfo: 'Room A-304 / +91 98401 23456',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'lf-102',
    userId: 'warden-demo',
    userName: 'Security Gate 1',
    userPhone: '+91 98765 43210',
    type: 'FOUND',
    title: 'Black Fastrack Analog Wrist Watch',
    description: 'Found on table 12 in the Mess Dining Hall after dinner service.',
    location: 'Central Mess Hall',
    itemDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    contactInfo: 'Deposited at Warden Office Desk 1',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'medical' or 'lost_found'

  try {
    const supabase = await createClient();

    if (type === 'medical') {
      const { data, error } = await supabase
        .from('medical_requests')
        .select('*, students(room_number, block, users(full_name))')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const formatted: MedicalRequest[] = data.map((m: any) => ({
          id: m.id,
          studentId: m.student_id,
          studentName: m.students?.users?.full_name || 'Resident',
          roomNumber: m.students?.room_number || 'A-108',
          symptoms: m.symptoms,
          urgency: m.urgency as MedicalUrgency,
          temperature: m.temperature,
          requiresAmbulance: m.requires_ambulance,
          status: m.status as MedicalStatus,
          firstAidGiven: m.first_aid_given,
          doctorNotes: m.doctor_notes,
          assignedMaid: m.assigned_maid,
          roomFoodDelivery: m.room_food_delivery,
          dietNotes: m.diet_notes,
          createdAt: m.created_at,
          updatedAt: m.updated_at,
        }));
        return NextResponse.json({ requests: formatted });
      }
      return NextResponse.json({ requests: inMemoryMedicalRequests });
    }

    // Default to Lost & Found
    const { data, error } = await supabase
      .from('lost_found')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ requests: data });
    }
  } catch {
    // Fallback
  }

  if (type === 'medical') {
    return NextResponse.json({ requests: inMemoryMedicalRequests });
  }

  return NextResponse.json({ requests: inMemoryLostFound });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requestCategory = 'lost_found' } = body;
    const timestamp = new Date().toISOString();

    if (requestCategory === 'medical') {
      const {
        studentId = 'stud-demo-1',
        studentName = 'Arun Karthik',
        roomNumber = 'A-304',
        symptoms,
        urgency = 'ROUTINE',
        temperature,
        requiresAmbulance = false,
        roomFoodDelivery = false,
        dietNotes,
      } = body;

      if (!symptoms) {
        return NextResponse.json({ error: 'Symptoms description is required' }, { status: 400 });
      }

      const newId = `med-${Date.now()}`;
      const newMedical: MedicalRequest = {
        id: newId,
        studentId,
        studentName,
        roomNumber,
        symptoms,
        urgency,
        temperature,
        requiresAmbulance,
        roomFoodDelivery,
        dietNotes: dietNotes || (roomFoodDelivery ? 'Requested mild sick diet & warm water' : undefined),
        status: 'SUBMITTED',
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      try {
        const supabase = await createClient();
        await supabase.from('medical_requests').insert([
          {
            id: newId.includes('-') && newId.length === 36 ? newId : undefined,
            student_id: studentId,
            symptoms,
            urgency,
            temperature,
            requires_ambulance: requiresAmbulance,
            status: 'SUBMITTED',
          },
        ]);
      } catch {
        // Fallback
      }

      inMemoryMedicalRequests.unshift(newMedical);
      return NextResponse.json({ request: newMedical, success: true }, { status: 201 });
    }

    // Lost & Found Request
    const {
      userId = 'stud-demo-1',
      userName = 'Arun Karthik',
      userPhone = '+91 98401 23456',
      type = 'LOST',
      title,
      description,
      location,
      contactInfo,
    } = body;

    if (!title || !description || !location) {
      return NextResponse.json({ error: 'Title, description, and location are required' }, { status: 400 });
    }

    const newId = `lf-${Date.now()}`;
    const newLF: LostFoundItem = {
      id: newId,
      userId,
      userName,
      userPhone,
      type,
      title,
      description,
      location,
      itemDate: new Date().toISOString().split('T')[0],
      contactInfo: contactInfo || `${userName} (${userPhone})`,
      status: 'OPEN',
      createdAt: timestamp,
    };

    try {
      const supabase = await createClient();
      await supabase.from('lost_found').insert([
        {
          id: newId.includes('-') && newId.length === 36 ? newId : undefined,
          user_id: userId,
          type,
          title,
          description,
          location,
          contact_info: newLF.contactInfo,
          status: 'OPEN',
        },
      ]);
    } catch {
      // Fallback
    }

    inMemoryLostFound.unshift(newLF);
    return NextResponse.json({ request: newLF, success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      status,
      requestCategory = 'lost_found',
      firstAidGiven,
      doctorNotes,
      assignedMaid,
      roomFoodDelivery,
      dietNotes,
    } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    if (requestCategory === 'medical') {
      try {
        const supabase = await createClient();
        await supabase
          .from('medical_requests')
          .update({
            status,
            first_aid_given: firstAidGiven || undefined,
            doctor_notes: doctorNotes || undefined,
            updated_at: timestamp,
          })
          .eq('id', id);
      } catch {
        // Fallback
      }

      let updatedMed: MedicalRequest | null = null;
      inMemoryMedicalRequests = inMemoryMedicalRequests.map((m) => {
        if (m.id === id) {
          updatedMed = {
            ...m,
            status,
            firstAidGiven: firstAidGiven !== undefined ? firstAidGiven : m.firstAidGiven,
            doctorNotes: doctorNotes !== undefined ? doctorNotes : m.doctorNotes,
            assignedMaid: assignedMaid !== undefined ? assignedMaid : m.assignedMaid,
            roomFoodDelivery: roomFoodDelivery !== undefined ? roomFoodDelivery : m.roomFoodDelivery,
            dietNotes: dietNotes !== undefined ? dietNotes : m.dietNotes,
            updatedAt: timestamp,
          };
          return updatedMed;
        }
        return m;
      });

      return NextResponse.json({ request: updatedMed, success: true });
    }

    // Lost and found update
    try {
      const supabase = await createClient();
      await supabase
        .from('lost_found')
        .update({ status })
        .eq('id', id);
    } catch {
      // Fallback
    }

    let updatedLF: LostFoundItem | null = null;
    inMemoryLostFound = inMemoryLostFound.map((item) => {
      if (item.id === id) {
        updatedLF = { ...item, status };
        return updatedLF;
      }
      return item;
    });

    return NextResponse.json({ request: updatedLF, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
