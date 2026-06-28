/**
 * Booking reference generator.
 *
 * Format: AKT-YYYYMMDD-XXXX
 * - AKT = Aakriti prefix
 * - YYYYMMDD = appointment date
 * - XXXX = 4-digit random number (checked for uniqueness in D1)
 */

/**
 * Generate a booking reference string.
 * Does NOT check uniqueness — caller must verify against D1.
 */
export function createBookingRef(appointmentDate: string): string {
  const datePart = appointmentDate.replace(/-/g, '');
  const randomPart = String(Math.floor(1000 + Math.random() * 9000)); // 1000–9999
  return `AKT-${datePart}-${randomPart}`;
}

/**
 * Generate a unique booking ref, retrying if there's a collision.
 *
 * @param appointmentDate  "YYYY-MM-DD"
 * @param existsCheck      Async function that returns true if ref already exists in D1
 * @param maxRetries       Max attempts before giving up (default 5)
 */
export async function generateUniqueBookingRef(
  appointmentDate: string,
  existsCheck: (ref: string) => Promise<boolean>,
  maxRetries: number = 5,
): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    const ref = createBookingRef(appointmentDate);
    const exists = await existsCheck(ref);
    if (!exists) return ref;
  }

  // Fallback: add timestamp milliseconds for near-guaranteed uniqueness
  const datePart = appointmentDate.replace(/-/g, '');
  const tsPart = String(Date.now()).slice(-6);
  return `AKT-${datePart}-${tsPart}`;
}
