import type { APIRoute } from 'astro';
import {
  getDB,
  getAvailabilityRule,
  getBlockedSlotsForDate
} from '../../lib/db';
import {
  getDayOfWeek,
  generateSlots,
  filterBlockedSlots,
  filterBookedSlots,
  groupSlotsByPeriod,
  isDateInPast
} from '../../lib/slots';

export const GET: APIRoute = async (context) => {
  try {
    const url = new URL(context.request.url);
    const dateStr = url.searchParams.get('date');
    const durationMin = Number(url.searchParams.get('duration_min')) || 60;

    if (!dateStr) {
      return new Response(JSON.stringify({ error: 'Missing or invalid parameters' }), { status: 400 });
    }

    if (isDateInPast(dateStr)) {
      return new Response(JSON.stringify({ date: dateStr, duration: durationMin, slots: { morning: [], afternoon: [], evening: [] } }), { status: 200 });
    }

    const db = getDB(context.locals);

    const dayOfWeek = getDayOfWeek(dateStr);
    const rule = await getAvailabilityRule(db, dayOfWeek);

    if (!rule) {
      return new Response(JSON.stringify({ date: dateStr, duration: durationMin, slots: { morning: [], afternoon: [], evening: [] } }), { status: 200 });
    }

    let specificSlots = undefined;
    if (rule.specific_slots) {
      try {
        const parsed = JSON.parse(rule.specific_slots);
        if (Array.isArray(parsed)) specificSlots = parsed;
      } catch(e) {}
    }

    const allSlots = generateSlots(
      rule.start_time,
      rule.end_time,
      durationMin,
      rule.slot_gap_min,
      specificSlots
    );

    const dayBlocks = await getBlockedSlotsForDate(db, dateStr);
    const unblockedSlots = filterBlockedSlots(allSlots, dayBlocks, durationMin);

    const { results: dayBookings } = await db
      .prepare(`
        SELECT appointment_time, estimated_duration_mins
        FROM bookings
        WHERE appointment_date = ?
          AND status IN ('pending', 'confirmed')
      `)
      .bind(dateStr)
      .all<{ appointment_time: string; estimated_duration_mins: number }>();
    
    // map to { time, duration_min }
    const bookingsForFilter = dayBookings.map(b => ({
      time: b.appointment_time,
      duration_min: b.estimated_duration_mins || 60
    }));

    const availableSlots = filterBookedSlots(unblockedSlots, bookingsForFilter, durationMin);

    const slots = groupSlotsByPeriod(availableSlots);

    return new Response(JSON.stringify({ date: dateStr, duration: durationMin, slots }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API /api/slots error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
