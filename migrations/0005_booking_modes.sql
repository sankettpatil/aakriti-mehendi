-- Add booking_mode to services
ALTER TABLE services ADD COLUMN booking_mode TEXT DEFAULT 'time_slot';

-- Allow nullable appointment_time in bookings for full day services
-- SQLite does not support ALTER COLUMN to remove NOT NULL easily.
-- But D1 allows relaxing constraints in some cases. Actually, the safest way in SQLite is:
-- 1. Create a new table without the NOT NULL constraint on appointment_time.
-- Wait, let's just create the new table and copy data.

CREATE TABLE bookings_new (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_ref         TEXT NOT NULL,
  service_id          INTEGER NOT NULL REFERENCES services(id),

  -- Appointment
  appointment_date    TEXT NOT NULL,
  appointment_time    TEXT, -- NOW NULLABLE

  -- Customer
  customer_name       TEXT NOT NULL,
  customer_phone      TEXT NOT NULL,
  customer_whatsapp   TEXT,
  customer_email      TEXT NOT NULL,
  customer_city       TEXT NOT NULL,
  customer_pincode    TEXT,
  customer_address    TEXT,

  -- Event context
  event_type          TEXT,
  event_date          TEXT,
  notes               TEXT,

  -- Admin
  status              TEXT DEFAULT 'pending',
  admin_notes         TEXT,
  decline_reason      TEXT,
  assigned_artist_id  INTEGER REFERENCES artists(id),

  status_updated_at   TEXT,
  created_at          TEXT DEFAULT (datetime('now'))
);

INSERT INTO bookings_new SELECT * FROM bookings;
DROP TABLE bookings;
ALTER TABLE bookings_new RENAME TO bookings;

CREATE INDEX idx_bookings_date ON bookings(appointment_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_ref ON bookings(booking_ref);
