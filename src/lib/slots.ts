/**
 * Slot computation — pure functions, no D1 dependency.
 * All times are "HH:MM" strings in 24-hour format.
 */

/** Parse "HH:MM" → minutes since midnight */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Minutes since midnight → "HH:MM" */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Generate all possible slot start times within a window.
 *
 * @param startTime  Day start, e.g. "08:00"
 * @param endTime    Day end, e.g. "19:00"
 * @param serviceDurationMin  How long the service takes (minutes)
 * @param slotGapMin  Gap between slot start times (minutes, default 60)
 * @returns Array of "HH:MM" strings
 */
export function generateSlots(
  startTime: string,
  endTime: string,
  serviceDurationMin: number,
  slotGapMin: number = 60,
  specificSlots?: string[]
): string[] {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const slots: string[] = [];

  const maxDuration = end - start;
  // Cap the duration check to the max hours in a day so large bookings (multi-day) can still be started
  const effectiveDuration = Math.min(serviceDurationMin, maxDuration);

  // If specificSlots is provided, use that. Otherwise fallback to the old ALLOWED_TIMES
  const allowedTimes = (specificSlots && specificSlots.length > 0) 
    ? specificSlots 
    : ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00"];

  for (const timeStr of allowedTimes) {
    const t = timeToMinutes(timeStr);
    if (t >= start && t + effectiveDuration <= end) {
      slots.push(timeStr);
    }
  }

  return slots;
}

/**
 * Remove slots that conflict with already-booked appointments.
 *
 * A slot conflicts if its service window overlaps any booked window.
 *
 * @param allSlots         All generated slot times
 * @param bookedSlots      Array of { time: "HH:MM", duration_min: number }
 * @param serviceDurationMin  Duration of the service being booked
 */
export function filterBookedSlots(
  allSlots: string[],
  bookedSlots: { time: string; duration_min: number }[],
  serviceDurationMin: number,
): string[] {
  return allSlots.filter((slot) => {
    const slotStart = timeToMinutes(slot);
    const slotEnd = slotStart + serviceDurationMin;

    // Check if this slot overlaps any existing booking
    return !bookedSlots.some((booked) => {
      const bookedStart = timeToMinutes(booked.time);
      const bookedEnd = bookedStart + booked.duration_min;
      // Overlap: starts before other ends AND ends after other starts
      return slotStart < bookedEnd && slotEnd > bookedStart;
    });
  });
}

/**
 * Remove slots that fall within blocked time ranges.
 *
 * @param slots  Available slot times
 * @param blocks Array of { start_time: "HH:MM" | null, end_time: "HH:MM" | null }
 *               null times = full day block
 * @param serviceDurationMin Duration of the service
 */
export function filterBlockedSlots(
  slots: string[],
  blocks: { start_time: string | null; end_time: string | null }[],
  serviceDurationMin: number,
): string[] {
  // If any block has null times, the full day is blocked
  if (blocks.some((b) => b.start_time === null || b.end_time === null)) {
    return [];
  }

  return slots.filter((slot) => {
    const slotStart = timeToMinutes(slot);
    const slotEnd = slotStart + serviceDurationMin;

    return !blocks.some((block) => {
      const blockStart = timeToMinutes(block.start_time!);
      const blockEnd = timeToMinutes(block.end_time!);
      return slotStart < blockEnd && slotEnd > blockStart;
    });
  });
}

/**
 * Group slot times into morning / afternoon / evening.
 *
 * Morning:   before 12:00
 * Afternoon: 12:00 – 16:59
 * Evening:   17:00+
 */
export function groupSlotsByPeriod(slots: string[]): {
  morning: string[];
  afternoon: string[];
  evening: string[];
} {
  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];

  for (const slot of slots) {
    const mins = timeToMinutes(slot);
    if (mins < 720) {
      morning.push(slot);
    } else if (mins < 1020) {
      afternoon.push(slot);
    } else {
      evening.push(slot);
    }
  }

  return { morning, afternoon, evening };
}

/**
 * Determine the availability label for a date.
 *
 * - "available": 3+ slots remaining
 * - "limited":   1–2 slots remaining
 * - "full":      0 slots remaining
 */
export function getDateAvailability(
  availableSlotCount: number,
): 'available' | 'limited' | 'full' {
  if (availableSlotCount === 0) return 'full';
  if (availableSlotCount <= 2) return 'limited';
  return 'available';
}

/**
 * Get the number of days in a month.
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Get the day of week (0=Sun, 1=Mon, ..., 6=Sat) for a date.
 */
export function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getDay();
}

/**
 * Format a date as YYYY-MM-DD.
 */
export function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Check if a date string is in the past (before today).
 */
export function isDateInPast(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr + 'T00:00:00');
  return date < today;
}
