import type { APIRoute } from 'astro';
import { getDB } from '../../../../lib/db';

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Testimonial ID required' }), { status: 400 });
    }

    const db = getDB(locals);
    await db.prepare('DELETE FROM testimonials WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ params, request, locals }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Testimonial ID required' }), { status: 400 });
    }

    const data = await request.json();
    const { customer_name, occasion, city, year, quote, photo_r2_key, is_visible, display_order } = data;

    const db = getDB(locals);
    
    const updates: string[] = [];
    const values: any[] = [];

    if (customer_name !== undefined) { updates.push('customer_name = ?'); values.push(customer_name); }
    if (occasion !== undefined) { updates.push('occasion = ?'); values.push(occasion); }
    if (city !== undefined) { updates.push('city = ?'); values.push(city); }
    if (year !== undefined) { updates.push('year = ?'); values.push(year); }
    if (quote !== undefined) { updates.push('quote = ?'); values.push(quote); }
    if (photo_r2_key !== undefined) { updates.push('photo_r2_key = ?'); values.push(photo_r2_key); }
    if (is_visible !== undefined) { updates.push('is_visible = ?'); values.push(is_visible ? 1 : 0); }
    if (display_order !== undefined) { updates.push('display_order = ?'); values.push(display_order); }

    if (updates.length === 0) {
      return new Response(JSON.stringify({ error: 'No updates provided' }), { status: 400 });
    }

    values.push(id);

    const query = `UPDATE testimonials SET ${updates.join(', ')} WHERE id = ?`;
    await db.prepare(query).bind(...values).run();

    const updated = await db.prepare('SELECT * FROM testimonials WHERE id = ?').bind(id).first();

    return new Response(JSON.stringify({ success: true, testimonial: updated }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
