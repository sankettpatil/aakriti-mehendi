import type { APIRoute } from 'astro';
import { getDB } from "../../../../lib/db";

export const PUT: APIRoute = async ({ params, request, locals }) => {
  try {
    const id = params.id;
    if (!id) return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });

    const db = getDB(locals);
    const data = await request.json();

    const result = await db.prepare(
      `UPDATE services 
       SET name = ?, slug = ?, description = ?, duration_min = ?, price_from = ?, price_to = ?, is_active = ?, display_order = ?
       WHERE id = ?`
    ).bind(
      data.name, 
      data.slug, 
      data.description || null, 
      data.duration_min, 
      data.price_from || null, 
      data.price_to || null, 
      data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1,
      data.display_order || 0,
      id
    ).run();

    if (result.success) {
      const updated = await db.prepare('SELECT * FROM services WHERE id = ?').bind(id).first();
      return new Response(JSON.stringify({ success: true, service: updated }), { status: 200 });
    } else {
      throw new Error('Failed to update service');
    }
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return new Response(JSON.stringify({ error: 'A service with this slug already exists.' }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const id = params.id;
    if (!id) return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });

    const db = getDB(locals);
    
    // Check if the service has bookings
    const bookingsCount = await db.prepare('SELECT COUNT(*) as count FROM bookings WHERE service_id = ?').bind(id).first();
    if (bookingsCount && (bookingsCount as any).count > 0) {
      // Instead of deleting, just deactivate it if there are bookings attached
      await db.prepare('UPDATE services SET is_active = 0 WHERE id = ?').bind(id).run();
      return new Response(JSON.stringify({ success: true, message: 'Service deactivated instead of deleted because it has existing bookings.' }), { status: 200 });
    }

    await db.prepare('DELETE FROM services WHERE id = ?').bind(id).run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
