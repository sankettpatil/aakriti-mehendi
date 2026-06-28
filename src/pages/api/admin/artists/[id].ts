import type { APIRoute } from 'astro';
import { getDB } from '../../../../lib/db';

export const PATCH: APIRoute = async ({ params, request, locals }) => {
  try {
    const id = params.id;
    if (!id) return new Response(JSON.stringify({ error: 'ID required' }), { status: 400 });

    const db = getDB(locals);
    const data = await request.json();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.bio !== undefined) {
      updates.push('bio = ?');
      values.push(data.bio);
    }
    if (data.photo_r2_key !== undefined) {
      updates.push('photo_r2_key = ?');
      values.push(data.photo_r2_key);
    }
    if (data.is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(data.is_active);
    }

    if (updates.length === 0) {
      return new Response(JSON.stringify({ error: 'No updates provided' }), { status: 400 });
    }

    values.push(id);
    
    await db.prepare(`UPDATE artists SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
    
    const updated = await db.prepare('SELECT * FROM artists WHERE id = ?').bind(id).first();

    return new Response(JSON.stringify({ success: true, artist: updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const id = params.id;
    if (!id) return new Response(JSON.stringify({ error: 'ID required' }), { status: 400 });

    const db = getDB(locals);
    
    // Check if artist is assigned to any bookings
    const assignments = await db.prepare('SELECT count(*) as count FROM bookings WHERE assigned_artist_id = ?').bind(id).first<{count: number}>();
    
    if (assignments && assignments.count > 0) {
      return new Response(JSON.stringify({ error: 'Cannot delete artist assigned to bookings. Deactivate them instead.' }), { status: 400 });
    }

    await db.prepare('DELETE FROM artists WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};
