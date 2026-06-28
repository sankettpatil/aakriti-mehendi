/**
 * D1 database helpers.
 * Wraps common queries for reuse across API routes.
 */

import type { D1Database } from '@cloudflare/workers-types';

// ── Types ────────────────────────────────────────────────

export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  duration_min: number;
  price_from: number | null;
  price_to: number | null;
  is_active: number;
  display_order: number;
}

export interface AvailabilityRule {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_gap_min: number;
  is_active: number;
  specific_slots: string | null;
}

export interface BlockedSlot {
  id: number;
  blocked_date: string;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
}

export interface Artist {
  id: number;
  name: string;
  bio: string | null;
  photo_r2_key: string | null;
  is_active: number;
  created_at?: string;
}

export interface Booking {
  id: number;
  booking_ref: string;
  service_id: number;
  assigned_artist_id: number | null;
  appointment_date: string;
  appointment_time: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string | null;
  customer_email: string;
  customer_city: string;
  event_type: string | null;
  event_date: string | null;
  notes: string | null;
  status: string;
  admin_notes: string | null;
  decline_reason: string | null;
  status_updated_at: string | null;
  created_at: string;
}

// ── Helper to extract D1 from Astro context ──────────────

import { env } from 'cloudflare:workers';

/**
 * Get the D1 database binding.
 * In Astro v6+, we use cloudflare:workers env.
 */
export function getDB(locals: App.Locals): D1Database {
  if (!env || !env.DB) {
    throw new Error(
      'D1 database binding "DB" not found. ' +
      'Check wrangler.jsonc d1_databases config and platformProxy settings.',
    );
  }
  return env.DB;
}

// ── Queries ──────────────────────────────────────────────

/** Get all active services, ordered by display_order. */
export async function getActiveServices(db: D1Database): Promise<Service[]> {
  const { results } = await db
    .prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC')
    .all<Service>();
  return results;
}

/** Get ALL services including inactive ones (for admin). */
export async function getAllServices(db: D1Database): Promise<Service[]> {
  const { results } = await db
    .prepare('SELECT * FROM services ORDER BY display_order ASC, id ASC')
    .all<Service>();
  return results;
}

/** Get a single service by ID. */
export async function getServiceById(db: D1Database, id: number): Promise<Service | null> {
  return db
    .prepare('SELECT * FROM services WHERE id = ? AND is_active = 1')
    .bind(id)
    .first<Service>();
}

// ── Artist Queries ───────────────────────────────────────

/** Get all active artists. */
export async function getActiveArtists(db: D1Database): Promise<Artist[]> {
  const { results } = await db
    .prepare('SELECT * FROM artists WHERE is_active = 1 ORDER BY id ASC')
    .all<Artist>();
  return results;
}

/** Get all artists including inactive ones. */
export async function getAllArtists(db: D1Database): Promise<Artist[]> {
  const { results } = await db
    .prepare('SELECT * FROM artists ORDER BY id ASC')
    .all<Artist>();
  return results;
}

/** Get a single artist by ID. */
export async function getArtistById(db: D1Database, id: number): Promise<Artist | null> {
  return db
    .prepare('SELECT * FROM artists WHERE id = ?')
    .bind(id)
    .first<Artist>();
}

/** Get the availability rule for a specific day of week. */
export async function getAvailabilityRule(
  db: D1Database,
  dayOfWeek: number,
): Promise<AvailabilityRule | null> {
  return db
    .prepare('SELECT * FROM availability_rules WHERE day_of_week = ? AND is_active = 1')
    .bind(dayOfWeek)
    .first<AvailabilityRule>();
}

/** Get all active availability rules (for calendar colouring). */
export async function getAllAvailabilityRules(db: D1Database): Promise<AvailabilityRule[]> {
  const { results } = await db
    .prepare('SELECT * FROM availability_rules WHERE is_active = 1')
    .all<AvailabilityRule>();
  return results;
}

/** Get blocked slots for a specific date. */
export async function getBlockedSlotsForDate(
  db: D1Database,
  date: string,
): Promise<BlockedSlot[]> {
  const { results } = await db
    .prepare('SELECT * FROM blocked_slots WHERE blocked_date = ?')
    .bind(date)
    .all<BlockedSlot>();
  return results;
}

/** Get all blocked dates in a month. */
export async function getBlockedSlotsForMonth(
  db: D1Database,
  year: number,
  month: number,
): Promise<BlockedSlot[]> {
  const monthStr = String(month).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;
  const { results } = await db
    .prepare("SELECT * FROM blocked_slots WHERE blocked_date LIKE ? || '%'")
    .bind(prefix)
    .all<BlockedSlot>();
  return results;
}

/**
 * Get confirmed/pending bookings for a specific date.
 * Used to check slot availability.
 */
export async function getBookingsForDate(
  db: D1Database,
  date: string,
): Promise<Array<{ appointment_time: string; duration_min: number }>> {
  const { results } = await db
    .prepare(
      `SELECT b.appointment_time, s.duration_min
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       WHERE b.appointment_date = ?
         AND b.status IN ('pending', 'confirmed')`,
    )
    .bind(date)
    .all<{ appointment_time: string; duration_min: number }>();
  return results;
}

/**
 * Get all bookings for a month (for calendar colouring).
 * Returns date + count of active bookings.
 */
export async function getBookingCountsForMonth(
  db: D1Database,
  year: number,
  month: number,
): Promise<Record<string, number>> {
  const monthStr = String(month).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;
  const { results } = await db
    .prepare(
      `SELECT appointment_date, COUNT(*) as count
       FROM bookings
       WHERE appointment_date LIKE ? || '%'
         AND status IN ('pending', 'confirmed')
       GROUP BY appointment_date`,
    )
    .bind(prefix)
    .all<{ appointment_date: string; count: number }>();

  const counts: Record<string, number> = {};
  for (const row of results) {
    counts[row.appointment_date] = row.count;
  }
  return counts;
}

export interface CustomerCRM {
  name: string;
  phone: string;
  email: string;
  city: string;
  total_bookings: number;
  last_booking_date: string;
  first_booking_date: string;
}

/** Get unique customers aggregated from bookings (for Admin CRM) */
export async function getUniqueCustomers(db: D1Database): Promise<CustomerCRM[]> {
  const { results } = await db
    .prepare(`
      SELECT 
        MAX(customer_name) as name, 
        MAX(customer_phone) as phone,
        customer_email as email,
        MAX(customer_city) as city,
        COUNT(id) as total_bookings,
        MAX(appointment_date) as last_booking_date,
        MIN(appointment_date) as first_booking_date
      FROM bookings
      GROUP BY customer_email
      ORDER BY last_booking_date DESC
    `)
    .all<CustomerCRM>();
  return results;
}

/** Check if a booking ref already exists. */
export async function bookingRefExists(db: D1Database, ref: string): Promise<boolean> {
  const row = await db
    .prepare('SELECT 1 FROM bookings WHERE booking_ref = ?')
    .bind(ref)
    .first();
  return row !== null;
}

export interface AnalyticsStats {
  total_bookings: number;
  total_revenue: number;
  popular_service: string;
}

/** Get available months for analytics filtering */
export async function getAvailableAnalyticsMonths(db: D1Database): Promise<string[]> {
  const { results } = await db.prepare(`
    SELECT DISTINCT strftime('%Y-%m', appointment_date) as month
    FROM bookings
    WHERE appointment_date IS NOT NULL AND status IN ('confirmed', 'pending')
    ORDER BY month DESC
  `).all<{ month: string }>();
  return results.map(r => r.month).filter(Boolean);
}

/** Get basic analytics stats for confirmed/completed bookings */
export async function getAnalyticsStats(db: D1Database, monthYear?: string): Promise<AnalyticsStats> {
  const dateFilter = monthYear ? `AND strftime('%Y-%m', appointment_date) = ?` : '';
  
  const stmtStats = db.prepare(`
    SELECT 
      COUNT(id) as total_bookings,
      SUM(IFNULL(final_confirmed_price, estimated_price_min)) as total_revenue
    FROM bookings
    WHERE status IN ('confirmed') ${dateFilter}
  `);
  const results = monthYear ? await stmtStats.bind(monthYear).all<{ total_bookings: number; total_revenue: number }>() : await stmtStats.all<{ total_bookings: number; total_revenue: number }>();

  const stats = results.results[0] || { total_bookings: 0, total_revenue: 0 };

  const stmtServices = db.prepare(`
    SELECT 
      COALESCE(b.occasion_type, s.name, 'Unknown') as name, 
      COUNT(b.id) as count
    FROM bookings b
    LEFT JOIN services s ON b.service_id = s.id
    WHERE b.status IN ('confirmed', 'pending') ${dateFilter}
    GROUP BY name
    ORDER BY count DESC
    LIMIT 1
  `);
  const topServices = monthYear ? await stmtServices.bind(monthYear).all<{ name: string }>() : await stmtServices.all<{ name: string }>();

  return {
    total_bookings: stats.total_bookings || 0,
    total_revenue: stats.total_revenue || 0,
    popular_service: topServices.results.length > 0 ? topServices.results[0].name.replace(/_/g, ' ') : 'N/A',
  };
}

/** Get a booking by its reference (public — limited fields). */
export async function getBookingByRef(
  db: D1Database,
  ref: string,
): Promise<{
  booking_ref: string;
  status: string;
  service_name: string | null;
  occasion_type: string | null;
  appointment_date: string;
  appointment_time: string | null;
  customer_name: string;
  customer_email: string;
  created_at: string;
  final_confirmed_price: number | null;
  estimated_price_min: number | null;
  estimated_price_max: number | null;
} | null> {
  return db
    .prepare(
      `SELECT b.booking_ref, b.status, s.name as service_name, b.occasion_type,
              b.appointment_date, b.appointment_time,
              b.customer_name, b.customer_email, b.created_at,
              b.final_confirmed_price, b.estimated_price_min, b.estimated_price_max
       FROM bookings b
       LEFT JOIN services s ON b.service_id = s.id
       WHERE b.booking_ref = ?`,
    )
    .bind(ref)
    .first();
}
