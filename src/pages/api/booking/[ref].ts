import type { APIRoute } from 'astro';
import { getDB, getBookingByRef } from '../../../lib/db';

export const POST: APIRoute = async (context) => {
  try {
    const ref = context.params.ref;

    if (!ref) {
      return new Response(JSON.stringify({ error: 'Missing booking reference' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const body = await context.request.json().catch(() => ({}));
    const email = body.email;
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const db = getDB(context.locals);
    const booking = await getBookingByRef(db, ref);

    if (!booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    
    if (booking.customer_email.toLowerCase().trim() !== email.toLowerCase().trim()) {
      return new Response(JSON.stringify({ error: 'Email does not match the booking record' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    // Only return safe public fields
    return new Response(JSON.stringify({
      booking_ref: booking.booking_ref,
      status: booking.status,
      service_name: booking.service_name,
      occasion_type: booking.occasion_type,
      appointment_date: booking.appointment_date,
      appointment_time: booking.appointment_time,
      customer_name: booking.customer_name.split(' ')[0], // First name only for privacy
      created_at: booking.created_at,
      final_confirmed_price: booking.final_confirmed_price,
      estimated_price_min: booking.estimated_price_min,
      estimated_price_max: booking.estimated_price_max
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
