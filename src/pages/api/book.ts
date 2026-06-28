import type { APIRoute } from 'astro';
import { getDB, bookingRefExists } from '../../lib/db';
import { generateUniqueBookingRef } from '../../lib/booking-ref';

export const POST: APIRoute = async (context) => {
  try {
    const data = await context.request.json();
    const db = getDB(context.locals);

    if (!data.date || !data.customer_name || !data.phone) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
        status: 400, headers: { 'Content-Type': 'application/json' } 
      });
    }

    // Generate unique booking reference based on the date
    const bookingRef = await generateUniqueBookingRef(data.date, (ref) => bookingRefExists(db, ref));

    // Look up service_id based on occasion slug
    let serviceId = null;
    if (data.occasion) {
      const { results } = await db.prepare('SELECT id FROM services WHERE slug = ?').bind(data.occasion).all();
      if (results.length > 0) {
        serviceId = (results[0] as any).id;
      }
    }

    // For SQLite, convert arrays to strings
    const addonsStr = data.addons ? JSON.stringify(data.addons) : '[]';
    const refImagesStr = data.reference_images ? JSON.stringify(data.reference_images) : '[]';

    // Prepare batch statements
    const stmt = db.prepare(`
      INSERT INTO bookings (
        booking_ref, service_id,
        appointment_date, appointment_time,
        customer_name, customer_phone, customer_email, customer_whatsapp, 
        customer_city, customer_pincode, customer_address, notes,
        occasion_type, is_bridal, bridal_scope, family_headcount, family_design_style,
        headcount_range, design_style, body_coverage, addons, booking_urgency,
        location_type, venue_address, travel_charge,
        estimated_duration_mins, recommended_package, estimated_price_min, estimated_price_max,
        is_multiday, reference_image_urls, status
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending'
      )
    `).bind(
      bookingRef,
      serviceId,
      data.date,
      data.time || null,
      data.customer_name,
      data.phone,
      data.email || null,
      data.whatsapp || null,
      data.city || null,
      data.pincode || null,
      null, // address was split into venue_address
      data.notes || null,
      
      // new fields
      data.occasion || null,
      data.occasion === 'bridal' ? 1 : 0,
      data.occasion === 'bridal' ? (Array.isArray(data.bridal_scope) ? data.bridal_scope.join(', ') : (data.bridal_scope || null)) : null,
      data.occasion === 'bridal' ? (data.family_headcount || 0) : 0,
      data.occasion === 'bridal' ? (data.family_design_style || null) : null,
      data.occasion !== 'bridal' ? (data.headcount || null) : null,
      data.occasion !== 'bridal' ? (data.design_style || null) : null,
      data.body_coverage ? JSON.stringify(data.body_coverage) : null,
      addonsStr,
      data.booking_urgency || null,
      data.location_type || null,
      data.venue_address || null,
      data.travel_charge || 0,
      data.estimated_duration_mins || null,
      data.recommended_package || null,
      data.estimated_price_min || null,
      data.estimated_price_max || null,
      data.is_multiday ? 1 : 0,
      refImagesStr
    );

    const result = await stmt.run();
    
    if (!result.success) {
      console.error("DB Insert error:", result.error);
      return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
    }

    // TODO: Trigger internal notification / email

    return new Response(JSON.stringify({ success: true, booking_ref: bookingRef }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('API /api/book error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
