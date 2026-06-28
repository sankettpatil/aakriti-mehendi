import type { APIRoute } from 'astro';
import {
  getDB,
  getAllAvailabilityRules,
  getBlockedSlotsForMonth,
} from '../../lib/db';
import {
  getDaysInMonth,
  formatDate,
  isDateInPast,
  getDayOfWeek,
  generateSlots,
  filterBlockedSlots,
  getDateAvailability,
  filterBookedSlots
} from '../../lib/slots';

export const GET: APIRoute = async (context) => {
  try {
    const url = new URL(context.request.url);
    const month = Number(url.searchParams.get('month'));
    const year = Number(url.searchParams.get('year'));
    const durationMin = Number(url.searchParams.get('duration_min')) || 60;

    if (isNaN(month) || isNaN(year)) {
      return new Response(JSON.stringify({ error: 'Missing or invalid parameters' }), { status: 400 });
    }

    const db = getDB(context.locals);

    const rules = await getAllAvailabilityRules(db);
    const rulesByDay = new Map(rules.map(r => [r.day_of_week, r]));

    const blockedSlots = await getBlockedSlotsForMonth(db, year, month);
    
    // Get all bookings for the month
    const monthStr = String(month).padStart(2, '0');
    const prefix = `${year}-${monthStr}`;
    const { results: monthBookings } = await db
      .prepare(`
        SELECT appointment_date, appointment_time, estimated_duration_mins
        FROM bookings
        WHERE appointment_date LIKE ? || '%'
          AND status IN ('pending', 'confirmed')
      `)
      .bind(prefix)
      .all<{ appointment_date: string; appointment_time: string; estimated_duration_mins: number }>();

    const bookingsByDate = monthBookings.reduce((acc, curr) => {
      if (!acc[curr.appointment_date]) acc[curr.appointment_date] = [];
      acc[curr.appointment_date].push({
        time: curr.appointment_time,
        duration_min: curr.estimated_duration_mins || 60
      });
      return acc;
    }, {} as Record<string, { time: string; duration_min: number }[]>);

    const blockedByDate = blockedSlots.reduce((acc, curr) => {
      if (!acc[curr.blocked_date]) acc[curr.blocked_date] = [];
      acc[curr.blocked_date].push(curr);
      return acc;
    }, {} as Record<string, typeof blockedSlots>);

    const daysInMonth = getDaysInMonth(year, month);
    const dates: Record<string, string> = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month, day);

      if (isDateInPast(dateStr)) {
        continue;
      }

      const dayOfWeek = getDayOfWeek(dateStr);
      const rule = rulesByDay.get(dayOfWeek);

      if (!rule) {
        dates[dateStr] = 'blocked';
        continue;
      }

      const allSlots = generateSlots(
        rule.start_time,
        rule.end_time,
        durationMin,
        rule.slot_gap_min
      );

      const dayBlocks = blockedByDate[dateStr] || [];
      const dayBookings = bookingsByDate[dateStr] || [];

      // Assume time slot mode for all now
      const isFullyBlocked = dayBlocks.some(b => !b.start_time && !b.end_time);
      if (isFullyBlocked) {
        dates[dateStr] = 'blocked';
        continue;
      }

      const unblockedSlots = filterBlockedSlots(allSlots, dayBlocks, durationMin);
      const availableSlots = filterBookedSlots(unblockedSlots, dayBookings, durationMin);
      dates[dateStr] = getDateAvailability(availableSlots.length);
    }

    return new Response(JSON.stringify({ dates }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API /api/available-dates error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
