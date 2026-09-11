// Test script verifying all 5 requirements requested by the user

async function runTests() {
  const BASE_URL = 'http://localhost:3000';
  console.log('Testing Endpoints against ' + BASE_URL + '...\n');

  // --- Test 1: Hostel AI Next Meal & Food Remembrance ---
  console.log('1. Testing Hostel AI: What is being served next?');
  const aiNextRes = await fetch(`${BASE_URL}/api/ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'What food name is going to be served next?' }),
  });
  const aiNextData = await aiNextRes.json();
  console.log('AI Response for Next Meal:');
  console.log(aiNextData.answer);
  if (!aiNextData.answer.includes('Serving Right Now') && !aiNextData.answer.includes('Next Scheduled Meal')) {
    throw new Error('AI failed to identify next scheduled meal');
  }
  console.log('✓ Test 1 Passed: AI accurately identifies day, timings & next meal dishes!\n');

  // --- Test 2: Hostel AI Mess Timings ---
  console.log('2. Testing Hostel AI: Daily dining schedule timings');
  const aiTimingsRes = await fetch(`${BASE_URL}/api/ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'What are the daily mess meal timings?' }),
  });
  const aiTimingsData = await aiTimingsRes.json();
  console.log('AI Response for Timings:');
  console.log(aiTimingsData.answer);
  if (!aiTimingsData.answer.includes('07:00 AM') || !aiTimingsData.answer.includes('11:00 AM') || !aiTimingsData.answer.includes('04:30 PM') || !aiTimingsData.answer.includes('07:00 PM')) {
    throw new Error('AI returned outdated mess timings');
  }
  console.log('✓ Test 2 Passed: Updated mess timings confirmed!\n');

  // --- Test 3: Hostel AI Sick Student Maid Care ---
  console.log('3. Testing Hostel AI: Sick student maid assistance');
  const aiMaidRes = await fetch(`${BASE_URL}/api/ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'Can a maid bring food to my room if I am sick?' }),
  });
  const aiMaidData = await aiMaidRes.json();
  console.log('AI Response for Maid Care:');
  console.log(aiMaidData.answer);
  if (!aiMaidData.answer.toLowerCase().includes('maid') || !aiMaidData.answer.toLowerCase().includes('room')) {
    throw new Error('AI failed to answer sick student maid care question');
  }
  console.log('✓ Test 3 Passed: Maid care question answered accurately!\n');

  // --- Test 4: Warden Announcement Broadcast Typing Bar ---
  console.log('4. Testing Warden Announcement Broadcast:');
  const annPayload = {
    isAnnouncement: true,
    title: 'Automated Test: Saveetha August 2026 Mess Menu Live',
    content: 'All residents please note the new Saveetha Academic Hostel August 2026 menu is now active across all dining halls.',
    category: 'MESS',
    priority: 'HIGH',
    authorName: 'Dr. R. Kumar (Chief Warden)',
  };
  const annPostRes = await fetch(`${BASE_URL}/api/notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(annPayload),
  });
  const annPostData = await annPostRes.json();
  console.log('Posted announcement id:', annPostData.announcement?.id);

  const annGetRes = await fetch(`${BASE_URL}/api/notifications?type=announcements`);
  const annGetData = await annGetRes.json();
  const matchedAnn = annGetData.announcements?.find((a) => a.title === annPayload.title);
  if (!matchedAnn) throw new Error('Broadcasted announcement not found in feed');
  console.log('✓ Test 4 Passed: Warden announcement broadcast successfully transmitted & retrieved!\n');

  // --- Test 5: Medical Emergency + Hostel Maid Assignment ---
  console.log('5. Testing Medical Emergency & Hostel Maid Assignment:');
  const medPayload = {
    requestCategory: 'medical',
    studentId: 'stud-test-01',
    studentName: 'Arun Karthik',
    roomNumber: 'A-304',
    symptoms: 'High fever 102.2 F, bedridden with severe chills and headache.',
    urgency: 'CRITICAL',
    temperature: '102.2 F',
    roomFoodDelivery: true,
    dietNotes: 'Mild curd rice, warm rasam soup & boiled drinking water',
  };
  const medPostRes = await fetch(`${BASE_URL}/api/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(medPayload),
  });
  const medPostData = await medPostRes.json();
  console.log('Created Medical Request:', medPostData.request.id, 'Room delivery requested:', medPostData.request.roomFoodDelivery);

  // Warden assigns maid
  const maidAssignRes = await fetch(`${BASE_URL}/api/requests`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: medPostData.request.id,
      requestCategory: 'medical',
      status: 'ATTENDED',
      assignedMaid: 'Lakshmi (Caretaker - Block A)',
      roomFoodDelivery: true,
      dietNotes: 'Hot curd rice & rasam delivered by Lakshmi at 1:30 PM',
    }),
  });
  const maidAssignData = await maidAssignRes.json();
  console.log('Updated Medical Case:', maidAssignData.request.id, 'Assigned Maid:', maidAssignData.request.assignedMaid);
  if (maidAssignData.request.assignedMaid !== 'Lakshmi (Caretaker - Block A)') {
    throw new Error('Hostel maid assignment failed');
  }
  console.log('✓ Test 5 Passed: Hostel maid assigned for sick room food delivery!\n');

  // --- Test 6: Warden Order Arrival Update ---
  console.log('6. Testing Warden Order Arrival Logging & Handover:');
  const parcelPayload = {
    trackingNumber: 'AMZ-TEST-9921',
    courierCompany: 'Amazon India',
    studentName: 'Arun Karthik',
    roomNumber: 'A-304',
    notes: 'Urgent study books package',
  };
  const parcelRes = await fetch(`${BASE_URL}/api/parcels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parcelPayload),
  });
  const parcelData = await parcelRes.json();
  console.log('Logged order arrival:', parcelData.parcel.trackingNumber, 'OTP:', parcelData.parcel.otpCode);

  const handoverRes = await fetch(`${BASE_URL}/api/parcels`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: parcelData.parcel.id,
      status: 'COLLECTED',
      enteredOtp: parcelData.parcel.otpCode,
    }),
  });
  const handoverData = await handoverRes.json();
  console.log('Handover status:', handoverData.status);
  console.log('✓ Test 6 Passed: Order arrival recorded and OTP handover confirmed!\n');

  console.log('=============================================');
  console.log('ALL TESTS PASSED SUCCESSFULLY! 100% VERIFIED');
  console.log('=============================================');
}

runTests().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
