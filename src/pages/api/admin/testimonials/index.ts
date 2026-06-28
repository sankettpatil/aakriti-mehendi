import type { APIRoute } from 'astro';
import { getDB } from '../../../../lib/db';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = getDB(locals);
    const { results } = await db.prepare(
      'SELECT * FROM testimonials ORDER BY display_order ASC, id DESC'
    ).all();
    
    return new Response(JSON.stringify({ success: true, testimonials: results }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDB(locals);
    const data = await request.json();
    
    const { customer_name, occasion, city, year, quote, photo_r2_key, is_visible } = data;
    
    if (!customer_name || !quote) {
      return new Response(JSON.stringify({ error: 'Name and quote are required' }), { status: 400 });
    }

    const { results } = await db.prepare(
      `INSERT INTO testimonials 
      (customer_name, occasion, city, year, quote, photo_r2_key, is_visible, display_order) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 0) 
      RETURNING *`
    ).bind(
      customer_name, 
      occasion || null, 
      city || null, 
      year || null, 
      quote, 
      photo_r2_key || null, 
      is_visible !== false ? 1 : 0
    ).all();

    return new Response(JSON.stringify({ success: true, testimonial: results[0] }), { status: 201 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
