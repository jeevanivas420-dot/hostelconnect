import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Parcel, ParcelStatus } from '@/types/parcel';

// Shared in-memory parcel store for instant zero-latency hackathon demos
let inMemoryParcels: Parcel[] = [
  {
    id: 'par-101',
    studentId: 'stud-demo-1',
    studentName: 'Arun Karthik',
    roomNumber: 'A-304',
    trackingNumber: 'DEL-AMZ-98231',
    courierCompany: 'Amazon India',
    arrivalDate: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    otpCode: '4921',
    status: 'ARRIVED',
    notes: 'Fragile electronics package - held at Desk A',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'par-102',
    studentId: 'stud-demo-2',
    studentName: 'Surya Narayanan',
    roomNumber: 'B-215',
    trackingNumber: 'BD-8834710',
    courierCompany: 'BlueDart Express',
    arrivalDate: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    otpCode: '8310',
    status: 'ARRIVED',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'par-103',
    studentId: 'stud-demo-3',
    studentName: 'Arun Karthik',
    roomNumber: 'A-304',
    trackingNumber: 'FK-551928',
    courierCompany: 'Flipkart Logistics',
    arrivalDate: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    collectionDate: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    otpCode: '1029',
    status: 'COLLECTED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const status = searchParams.get('status');

  try {
    const supabase = await createClient();
    let query = supabase
      .from('parcels')
      .select('*, students(room_number, block, users(full_name))')
      .order('arrival_date', { ascending: false });

    if (studentId) query = query.eq('student_id', studentId);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      const formatted: Parcel[] = data.map((item: any) => ({
        id: item.id,
        studentId: item.student_id,
        studentName: item.students?.users?.full_name || 'Resident Student',
        roomNumber: item.students?.room_number || 'A-304',
        trackingNumber: item.tracking_number,
        courierCompany: item.courier_company,
        arrivalDate: item.arrival_date,
        collectionDate: item.collection_date,
        otpCode: item.otp_code,
        status: item.status as ParcelStatus,
        notes: item.notes,
        createdAt: item.created_at,
      }));
      return NextResponse.json({ parcels: formatted });
    }
  } catch {
    // Fallback
  }

  let results = [...inMemoryParcels];
  if (studentId) {
    results = results.filter((p) => p.studentId === studentId || p.studentName === 'Arun Karthik');
  }
  if (status) {
    results = results.filter((p) => p.status === status);
  }

  return NextResponse.json({ parcels: results });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentId = 'stud-demo-1',
      studentName = 'Arun Karthik',
      roomNumber = 'A-304',
      trackingNumber,
      courierCompany = 'Amazon India',
      notes,
    } = body;

    if (!trackingNumber) {
      return NextResponse.json({ error: 'Tracking number is required' }, { status: 400 });
    }

    const newId = `par-${Date.now()}`;
    // Generate secure 4-digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const timestamp = new Date().toISOString();

    const newParcel: Parcel = {
      id: newId,
      studentId,
      studentName,
      roomNumber,
      trackingNumber,
      courierCompany,
      arrivalDate: timestamp,
      otpCode,
      status: 'ARRIVED',
      notes,
      createdAt: timestamp,
    };

    try {
      const supabase = await createClient();
      await supabase.from('parcels').insert([
        {
          id: newId.includes('-') && newId.length === 36 ? newId : undefined,
          student_id: studentId,
          tracking_number: trackingNumber,
          courier_company: courierCompany,
          arrival_date: timestamp,
          otp_code: otpCode,
          status: 'ARRIVED',
          notes,
        },
      ]);
    } catch {
      // Fallback
    }

    inMemoryParcels.unshift(newParcel);
    return NextResponse.json({ parcel: newParcel, success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log parcel' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status = 'COLLECTED', enteredOtp } = body;

    if (!id) {
      return NextResponse.json({ error: 'Parcel ID is required' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    // Verify OTP if supplied
    const target = inMemoryParcels.find((p) => p.id === id);
    if (enteredOtp && target && target.otpCode && target.otpCode !== enteredOtp.trim()) {
      return NextResponse.json({ error: 'Incorrect verification OTP entered.' }, { status: 400 });
    }

    try {
      const supabase = await createClient();
      await supabase
        .from('parcels')
        .update({
          status,
          collection_date: status === 'COLLECTED' ? timestamp : undefined,
        })
        .eq('id', id);
    } catch {
      // Fallback
    }

    let updatedParcel: Parcel | null = null;
    inMemoryParcels = inMemoryParcels.map((p) => {
      if (p.id === id) {
        updatedParcel = {
          ...p,
          status,
          collectionDate: status === 'COLLECTED' ? timestamp : p.collectionDate,
        };
        return updatedParcel;
      }
      return p;
    });

    return NextResponse.json({ parcel: updatedParcel, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update parcel status' }, { status: 500 });
  }
}
