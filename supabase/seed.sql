-- =============================================================================
-- HOSTEL MANAGEMENT PLATFORM - SEED DATA FOR HACKATHON DEMO
-- SSB SAVEETHA ENGINEERING NEW ACADEMIC HOSTEL MENU (AUGUST 2026)
-- Timings:
-- Breakfast: 07:00 AM - 08:30 AM
-- Lunch: 11:00 AM - 01:30 PM
-- Snacks: 04:30 PM - 05:30 PM
-- Dinner: 07:00 PM - 08:30 PM
-- =============================================================================

-- 1. Weekly Mess Menu (Saveetha New Academic Hostel Menu)
INSERT INTO public.mess_menu (day_of_week, meal_type, items, timing, is_special) VALUES
-- MONDAY
('MONDAY', 'BREAKFAST', ARRAY['Karam Idly', 'Sweet Attukulu Upma', 'Small Onion Sambar', 'Onion Tomato Pachadi', 'Fruit Kesari', 'Bread / Jam', 'Scrambled Egg', 'Hot Milk', 'Coffee'], '07:00 AM - 08:30 AM', false),
('MONDAY', 'LUNCH', ARRAY['Steamed Rice', 'Andhra Tomato Pappu', 'Pudina Rice', 'Cabbage Thoran', 'Coconut Thoviyal', 'Pepper Rasam', 'Curd Rice', 'Buttermilk', 'Curd Chilly', 'Potato Chips (Veg)', 'Egg Chettinad Curry'], '11:00 AM - 01:30 PM', false),
('MONDAY', 'SNACKS', ARRAY['Keerai Bonda', 'Milk', 'Coffee', 'Tea'], '04:30 PM - 05:30 PM', false),
('MONDAY', 'DINNER', ARRAY['Palak Chappathi (4 nos)', 'Rayalaseema Style Chicken Gravy', 'Mushroom Masala (Veg)', 'Idly', 'Coconut Chutney', 'Steamed Rice', 'Raw Banana Varuval', 'Dal Rasam', 'Hot Milk', 'Banana'], '07:00 PM - 08:30 PM', true),

-- TUESDAY
('TUESDAY', 'BREAKFAST', ARRAY['Noodles Idly', 'Adai Dosa', 'Andhra Tiffin Sambar', 'Allam Chutney', 'Bread Omelette', 'Plain Bread', 'Jam', 'Hot Milk', 'Coffee'], '07:00 AM - 08:30 AM', false),
('TUESDAY', 'LUNCH', ARRAY['Steamed Rice', 'Bandakaya Vatha Kulambu', 'Majiga Pulusu', 'Lemon Rice', 'Fryums', 'Yam Vepudu', 'Snake Gourd Kootu', 'Garlic Rasam', 'Buttermilk', 'Parupu Podi & Ghee', 'Fruit Kesari'], '11:00 AM - 01:30 PM', false),
('TUESDAY', 'SNACKS', ARRAY['Peanut Chat', 'Milk', 'Coffee', 'Tea'], '04:30 PM - 05:30 PM', false),
('TUESDAY', 'DINNER', ARRAY['Mushroom, Soya, Veg Dum Biriyani', 'Nellore Chicken Pulusu', 'Rajma Masala (For Veg)', 'Idly', 'Coconut Chutney', 'Steamed Rice', 'Rasam', 'Mango Pickle', 'Hot Milk', 'Banana'], '07:00 PM - 08:30 PM', true),

-- WEDNESDAY
('WEDNESDAY', 'BREAKFAST', ARRAY['Idly', 'Ven Pongal', 'Brinjal Kosthu', 'Coconut Chutney', 'Medhu Vadai', 'Karam', 'Gingely Oil', 'Hot Milk', 'Coffee'], '07:00 AM - 08:30 AM', false),
('WEDNESDAY', 'LUNCH', ARRAY['Steamed Rice', 'Gutti Vankaya Koora', 'Coconut Rice', 'Potato Chips', 'Thoviyal', 'Cabbage Kootu', 'Pepper Rasam', 'Curd Rice', 'Semiya Kheer', 'Pickle', 'Chicken Semi Gravy', 'Veg Roll (Veg)'], '11:00 AM - 01:30 PM', true),
('WEDNESDAY', 'SNACKS', ARRAY['Black Channa Sundal', 'Milk', 'Coffee', 'Tea'], '04:30 PM - 05:30 PM', false),
('WEDNESDAY', 'DINNER', ARRAY['Methi Chappathi', 'Veg Chettinad Curry', 'Idly', 'Bisebellabath', 'Coconut Chutney', 'Steamed Rice', 'Rasam', 'Curd Rice', 'Hot Milk', 'Papaya Cut', 'Lime Pickle'], '07:00 PM - 08:30 PM', true),

-- THURSDAY
('THURSDAY', 'BREAKFAST', ARRAY['Rava Idly', 'Podi Dosai / Plain Dosai', 'Pumpkin Sambar', 'Kara Chutney', 'Bread', 'Jam', 'Boiled Egg', 'Hot Milk', 'Coffee'], '07:00 AM - 08:30 AM', false),
('THURSDAY', 'LUNCH', ARRAY['Steamed Rice', 'Gongura Tomato Pappu', 'Tamarind Rice', 'Raw Banana Fry', 'Greens Kootu', 'Ulava Rasam', 'Curd Rice', 'Buttermilk', 'Pappad', 'Pickle', 'Andhra Chepala Pulisu (Fish)', 'Aloo Gobi Paneer Adarki Dry (Veg)'], '11:00 AM - 01:30 PM', false),
('THURSDAY', 'SNACKS', ARRAY['South Style Pasta', 'Milk', 'Coffee', 'Tea'], '04:30 PM - 05:30 PM', false),
('THURSDAY', 'DINNER', ARRAY['Parotta (3 nos)', 'Veg Paya', 'Idly', 'Chennai Sambar', 'Peanut Chutney', 'Steamed Rice', 'Rasam', 'Hot Milk', 'Morris Banana', 'Mango Pickle', 'Curd Rice'], '07:00 PM - 08:30 PM', false),

-- FRIDAY
('FRIDAY', 'BREAKFAST', ARRAY['Rice Uppindi', 'Moong Dal Sambar', 'White Chutney', 'Poori', 'Black Channa Kadala Curry', 'Bread', 'Jam', 'Hot Milk', 'Coffee'], '07:00 AM - 08:30 AM', false),
('FRIDAY', 'LUNCH', ARRAY['Steamed Rice', 'Beans Sambar', 'Tomato Pappu', 'Ambur Spl Egg Biriyani', 'Onion Raitha', 'Gongura Potato Fry', 'Potlakaya Vepudu', 'Tomato Rasam', 'Curd Rice', 'Buttermilk', 'Appalam', 'Bread Halwa'], '11:00 AM - 01:30 PM', true),
('FRIDAY', 'SNACKS', ARRAY['Keerai Bonda', 'Milk', 'Coffee', 'Ginger Tea'], '04:30 PM - 05:30 PM', false),
('FRIDAY', 'DINNER', ARRAY['Idly', 'Kal Dosai', 'Chicken Chettinad Masala', 'Aloo Palak (Veg)', 'Red Chutney', 'Steamed Rice', 'Mixed Veg Poriyal', 'Rasam', 'Hot Milk', 'Water Melon', 'Lime Pickle', 'Curd Rice'], '07:00 PM - 08:30 PM', true),

-- SATURDAY
('SATURDAY', 'BREAKFAST', ARRAY['Idly', 'Poha Mixer', 'Garelu (Medu Vada)', 'Andhra Tiffin Sambar', 'Tomato Chutney', 'Bread', 'Jam', 'Hot Milk', 'Coffee'], '07:00 AM - 08:30 AM', false),
('SATURDAY', 'LUNCH', ARRAY['Steamed Rice', 'Greens Sambar', 'Bindi Karakukambu', 'Curryleaf Rice', 'Ridge Gourd Kootu', 'Mix Veg Poriyal', 'Garlic Rasam', 'Curd Rice', 'Potato Chips (Veg)', 'Buttermilk', 'Pappad / Pickle', 'Mutton Masala (Village Style)', 'Aloo 65 (Veg)'], '11:00 AM - 01:30 PM', true),
('SATURDAY', 'SNACKS', ARRAY['Mysore Bonda', 'Milk', 'Coffee', 'Tea'], '04:30 PM - 05:30 PM', false),
('SATURDAY', 'DINNER', ARRAY['Schezwan Egg Fried Rice', 'Schezwan Veg Fried Rice', 'Tomato Ketchup', 'Idly', 'Rava Uppindi', 'Coconut Chutney', 'Steamed Rice', 'Rasam', 'Hot Milk', 'Lime Pickle', 'Banana'], '07:00 PM - 08:30 PM', false),

-- SUNDAY
('SUNDAY', 'BREAKFAST', ARRAY['Kothimeera Milagu Pongal', 'Medhu Vadai', 'Dal Kosthu', 'Ragi Kozhi', 'Peanut Chutney', 'Hot Milk', 'Coffee', 'Bread', 'Jam'], '07:00 AM - 08:30 AM', false),
('SUNDAY', 'LUNCH', ARRAY['Steamed Rice', 'Kalyana Sambar', 'Manathakali Vatha Kulambu', 'Beetroot Channa Poriyal', 'Tomato Rasam', 'Curd Rice', 'Buttermilk', 'Potato Chips (Veg)', 'Ice Cream', 'Chicken Biriyani (Seeraga Samba)', 'Brinjal Masala', 'Mushroom Biriyani (Veg)'], '11:00 AM - 01:30 PM', true),
('SUNDAY', 'SNACKS', ARRAY['Ragi Puttu', 'Milk', 'Coffee', 'Tea'], '04:30 PM - 05:30 PM', false),
('SUNDAY', 'DINNER', ARRAY['Idly', 'Masala Uthappam', 'Sambar', 'Coconut Chutney', 'Steamed Rice', 'Yam Fry', 'Rasam', 'Hot Milk', 'Morris Banana', 'Idly Podi', 'Gingely Oil'], '07:00 PM - 08:30 PM', true)
ON CONFLICT (day_of_week, meal_type) DO UPDATE SET
  items = EXCLUDED.items,
  timing = EXCLUDED.timing,
  is_special = EXCLUDED.is_special;

-- 2. AI Knowledge Base Starter FAQs
INSERT INTO public.ai_knowledge (category, question, answer, keywords) VALUES
('MESS', 'What are the daily mess meal timings?', 'Official Saveetha Academic Hostel dining timings: Breakfast: 07:00 AM - 08:30 AM, Lunch: 11:00 AM - 01:30 PM, Snacks: 04:30 PM - 05:30 PM, Dinner: 07:00 PM - 08:30 PM.', ARRAY['mess', 'food', 'time', 'timing', 'breakfast', 'lunch', 'snacks', 'dinner', 'hours']),
('MESS', 'Can a maid bring food to my room if I am sick?', 'Yes. Sick students can submit a medical request through the Medical Help desk and check "Request Sick Room Food Delivery". The Warden will assign a hostel maid (caretaker) to deliver mild curd rice, warm rasam soup, porridge, and drinking water directly to your room.', ARRAY['sick', 'maid', 'room food', 'curd rice', 'porridge', 'delivery']),
('LEAVE', 'How do I apply for weekend leave?', 'Go to Student Dashboard -> "Apply Outpass" or navigate to /student/leave. Fill in destination, departure/return dates, and check parent consent. Your block warden will verify and approve the digital QR outpass.', ARRAY['leave', 'outing', 'home', 'permission', 'outpass']),
('CURFEW', 'What is the hostel gate curfew time?', 'The main hostel gate closes promptly at 09:30 PM on weekdays and 10:00 PM on weekends. Late entries without pre-approved outpass incur a disciplinary remark.', ARRAY['curfew', 'gate', 'entry', 'time', 'late', 'hours']),
('MAINTENANCE', 'How long does a complaint take to be fixed?', 'Standard electrical and plumbing complaints are attended to within 24 hours. Wi-Fi and carpentry issues are addressed within 48 hours.', ARRAY['complaint', 'maintenance', 'fix', 'electrician', 'wifi', 'plumber']),
('PARCEL', 'Where do I collect my parcels?', 'Parcels delivered by Amazon, Flipkart, or courier services are held at the Warden Office Dispatch Desk. Present your 4-digit OTP shown in your Parcels tab to collect.', ARRAY['parcel', 'courier', 'delivery', 'amazon', 'flipkart', 'otp', 'warden']);
