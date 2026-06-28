-- Make service_id nullable (SQLite doesn't support ALTER COLUMN, so we recreate if needed)
-- Since we already migrated to 'bookings_new' with nullable appointment_time in 0005, 
-- we will drop the old one and recreate bookings again.

CREATE TABLE bookings_new_2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_ref TEXT UNIQUE NOT NULL,
  
  -- service_id is now nullable and largely unused in the new flow
  service_id INTEGER NULL,
  
  -- Date and Time
  appointment_date TEXT NOT NULL,
  appointment_time TEXT,
  
  -- Customer Details
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_whatsapp TEXT,
  customer_email TEXT,
  customer_city TEXT,
  customer_pincode TEXT,
  customer_address TEXT,
  
  -- Event Details
  event_type TEXT,
  event_date TEXT,
  notes TEXT,
  
  -- New 10-Step Fields
  occasion_type TEXT,
  is_bridal INTEGER DEFAULT 0,
  bridal_scope TEXT,
  family_headcount INTEGER DEFAULT 0,
  family_design_style TEXT,
  headcount_range TEXT,
  headcount_numeric INTEGER,
  design_style TEXT,
  body_coverage TEXT,
  addons TEXT,
  booking_urgency TEXT,
  location_type TEXT,
  venue_address TEXT,
  travel_charge INTEGER DEFAULT 0,
  estimated_duration_mins INTEGER,
  recommended_package TEXT,
  estimated_price_min INTEGER,
  estimated_price_max INTEGER,
  is_multiday INTEGER DEFAULT 0,
  reference_image_urls TEXT,
  admin_notes TEXT,
  final_confirmed_price INTEGER,
  
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO bookings_new_2 (
  id, booking_ref, service_id, appointment_date, appointment_time,
  customer_name, customer_phone, customer_whatsapp, customer_email,
  customer_city, customer_pincode, customer_address,
  event_type, event_date, notes, status, created_at
)
SELECT 
  id, booking_ref, service_id, appointment_date, appointment_time,
  customer_name, customer_phone, customer_whatsapp, customer_email,
  customer_city, customer_pincode, customer_address,
  event_type, event_date, notes, status, created_at
FROM bookings;

DROP TABLE bookings;
ALTER TABLE bookings_new_2 RENAME TO bookings;
