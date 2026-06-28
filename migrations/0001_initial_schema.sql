-- ═══════════════════════════════════════════════════════
--  Aakriti Mehndi — Initial Database Schema
--  D1 (SQLite) · Created June 2025
-- ═══════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
--  Services
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  duration_min    INTEGER NOT NULL,
  price_from      INTEGER,
  price_to        INTEGER,
  is_active       INTEGER DEFAULT 1,
  display_order   INTEGER DEFAULT 0
);

-- ─────────────────────────────────────────────
--  Weekly availability rules
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS availability_rules (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  day_of_week     INTEGER NOT NULL,
  start_time      TEXT NOT NULL,
  end_time        TEXT NOT NULL,
  slot_gap_min    INTEGER DEFAULT 30,
  is_active       INTEGER DEFAULT 1
);

-- ─────────────────────────────────────────────
--  Blocked dates / time ranges
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blocked_slots (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  blocked_date    TEXT NOT NULL,
  start_time      TEXT,
  end_time        TEXT,
  reason          TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON blocked_slots(blocked_date);

-- ─────────────────────────────────────────────
--  Bookings
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_ref         TEXT UNIQUE NOT NULL,
  service_id          INTEGER NOT NULL REFERENCES services(id),

  -- Appointment
  appointment_date    TEXT NOT NULL,
  appointment_time    TEXT NOT NULL,

  -- Customer
  customer_name       TEXT NOT NULL,
  customer_phone      TEXT NOT NULL,
  customer_whatsapp   TEXT,
  customer_email      TEXT NOT NULL,
  customer_city       TEXT NOT NULL,

  -- Event context
  event_type          TEXT,
  event_date          TEXT,
  notes               TEXT,

  -- Admin
  status              TEXT DEFAULT 'pending',
  admin_notes         TEXT,
  decline_reason      TEXT,

  status_updated_at   TEXT,
  created_at          TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(appointment_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON bookings(booking_ref);

-- ─────────────────────────────────────────────
--  Admin sessions
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_sessions (
  token       TEXT PRIMARY KEY,
  created_at  TEXT DEFAULT (datetime('now')),
  expires_at  TEXT NOT NULL
);

-- ─────────────────────────────────────────────
--  Gallery images
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_images (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  r2_key          TEXT NOT NULL,
  alt_text        TEXT,
  style_tag       TEXT,
  occasion_tag    TEXT,
  is_visible      INTEGER DEFAULT 1,
  display_order   INTEGER DEFAULT 0,
  created_at      TEXT DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────────
--  Testimonials
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name   TEXT NOT NULL,
  occasion        TEXT,
  city            TEXT,
  year            INTEGER,
  quote           TEXT NOT NULL,
  photo_r2_key    TEXT,
  is_visible      INTEGER DEFAULT 1,
  display_order   INTEGER DEFAULT 0
);
