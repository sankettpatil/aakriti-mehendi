/**
 * Input validation for booking requests.
 */

export interface BookingItemInput {
  service_id: number;
  date: string;
  time: string | null;
}

export interface BookingInput {
  items: BookingItemInput[];
  customer_name: string;
  phone: string;
  whatsapp?: string;
  email: string;
  city: string;
  pincode: string;
  address: string;
  event_type?: string;
  event_date?: string;
  notes?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  sanitised?: BookingInput;
}

const VALID_EVENT_TYPES = [
  'Wedding',
  'Engagement',
  'Karwa Chauth',
  'Diwali',
  'Eid',
  'Teej',
  'Birthday',
  'Other',
];

/**
 * Validate and sanitise a booking submission.
 */
export function validateBookingInput(body: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: { _form: 'Invalid request body.' } };
  }

  const data = body as Record<string, unknown>;

  // ── Required fields ──────────────────────────────────────

  // Items
  const rawItems = Array.isArray(data.items) ? data.items : [];
  const sanitisedItems: BookingItemInput[] = [];

  if (rawItems.length === 0) {
    errors.items = 'Please select at least one service.';
  } else {
    rawItems.forEach((item: any, idx: number) => {
      const serviceId = Number(item.service_id);
      if (!item.service_id || isNaN(serviceId) || serviceId < 1) {
        errors[`items.${idx}.service_id`] = 'Please select a service.';
      }

      const date = String(item.date || '').trim();
      if (!date) {
        errors[`items.${idx}.date`] = 'Please select a date.';
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        errors[`items.${idx}.date`] = 'Invalid date format.';
      } else {
        const d = new Date(date + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (isNaN(d.getTime())) {
          errors[`items.${idx}.date`] = 'Invalid date.';
        } else if (d < today) {
          errors[`items.${idx}.date`] = 'Date must be in the future.';
        }
      }

      const time = item.time ? String(item.time).trim() : null;
      if (time && !/^\d{2}:\d{2}$/.test(time)) {
        errors[`items.${idx}.time`] = 'Invalid time format.';
      }

      sanitisedItems.push({
        service_id: serviceId,
        date,
        time,
      });
    });
  }

  // customer_name
  const name = String(data.customer_name || '').trim();
  if (!name) {
    errors.customer_name = 'Name is required.';
  } else if (name.length < 2) {
    errors.customer_name = 'Name must be at least 2 characters.';
  } else if (name.length > 100) {
    errors.customer_name = 'Name is too long.';
  }

  // phone — must start with +91 or be 10 digits (we normalise)
  const rawPhone = String(data.phone || '').trim();
  const phone = normalisePhone(rawPhone);
  if (!rawPhone) {
    errors.phone = 'Phone number is required.';
  } else if (!phone) {
    errors.phone = 'Enter a valid Indian phone number.';
  }

  // email
  const email = String(data.email || '').trim().toLowerCase();
  if (!email) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address.';
  }

  // city
  const city = String(data.city || '').trim();
  if (!city) {
    errors.city = 'City / area is required.';
  } else if (city.length > 100) {
    errors.city = 'City name is too long.';
  }

  // pincode
  const pincode = String(data.pincode || '').trim();
  if (!pincode) {
    errors.pincode = 'Pincode is required.';
  } else if (!/^\d{6}$/.test(pincode)) {
    errors.pincode = 'Please enter a valid 6-digit Indian pincode.';
  }

  // address
  const address = String(data.address || '').trim();
  if (!address) {
    errors.address = 'Full address is required.';
  } else if (address.length < 5) {
    errors.address = 'Please provide a more detailed address.';
  } else if (address.length > 1000) {
    errors.address = 'Address is too long.';
  }

  // ── Optional fields ──────────────────────────────────────

  // whatsapp
  let whatsapp: string | undefined;
  if (data.whatsapp && String(data.whatsapp).trim()) {
    whatsapp = normalisePhone(String(data.whatsapp).trim()) || undefined;
  }

  // event_type
  let eventType: string | undefined;
  if (data.event_type && String(data.event_type).trim()) {
    const et = String(data.event_type).trim();
    if (!VALID_EVENT_TYPES.includes(et)) {
      errors.event_type = 'Invalid event type.';
    } else {
      eventType = et;
    }
  }

  // event_date
  let eventDate: string | undefined;
  if (data.event_date && String(data.event_date).trim()) {
    const ed = String(data.event_date).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ed)) {
      errors.event_date = 'Invalid event date format.';
    } else {
      eventDate = ed;
    }
  }

  // notes (200 char max)
  let notes: string | undefined;
  if (data.notes && String(data.notes).trim()) {
    const n = String(data.notes).trim();
    if (n.length > 200) {
      errors.notes = 'Notes must be under 200 characters.';
    } else {
      notes = n;
    }
  }

  // ── Result ───────────────────────────────────────────────

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    sanitised: {
      items: sanitisedItems,
      customer_name: name,
      phone: phone!,
      whatsapp,
      email,
      city,
      pincode,
      address,
      event_type: eventType,
      event_date: eventDate,
      notes,
    },
  };
}

// ── Helpers ──────────────────────────────────────────────

/**
 * Normalise an Indian phone number to +91XXXXXXXXXX format.
 * Accepts: "9876543210", "09876543210", "+919876543210", "91 9876 543210"
 * Returns null if invalid.
 */
function normalisePhone(raw: string): string | null {
  // Strip spaces, dashes, parentheses
  const digits = raw.replace(/[\s\-()]+/g, '');

  // Already has +91
  if (/^\+91\d{10}$/.test(digits)) return digits;

  // Starts with 91 (no +)
  if (/^91\d{10}$/.test(digits)) return '+' + digits;

  // Starts with 0 + 10 digits
  if (/^0\d{10}$/.test(digits)) return '+91' + digits.slice(1);

  // Just 10 digits
  if (/^\d{10}$/.test(digits)) return '+91' + digits;

  return null;
}

/**
 * Basic email validation — not RFC 5322, but good enough for a booking form.
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
