import type { APIRoute } from 'astro';
import { getDB, getAllServices } from '../../../../lib/db';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = getDB(locals);
    const services = await getAllServices(db);
    return new Response(JSON.stringify({ success: true, services }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDB(locals);
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.slug || !data.duration_min) {
      return new Response(JSON.stringify({ error: 'Name, slug, and duration are required' }), { status: 400 });
    }

    const result = await db.prepare(
      `INSERT INTO services (name, slug, description, duration_min, price_from, price_to, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      data.name, 
      data.slug, 
      data.description || null, 
      data.duration_min, 
      data.price_from || null, 
      data.price_to || null, 
      data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1,
      data.display_order || 0
    ).run();

    if (result.success) {
      const newService = await db.prepare('SELECT * FROM services WHERE id = ?').bind(result.meta.last_row_id).first();
      return new Response(JSON.stringify({ success: true, service: newService }), { status: 201 });
    } else {
      throw new Error('Failed to insert service');
    }
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return new Response(JSON.stringify({ error: 'A service with this slug already exists.' }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
