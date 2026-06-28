import type { APIRoute } from 'astro';
import { getDB } from '../../../../lib/db';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = getDB(locals);
    // Get all blocks from today onwards
    const { results } = await db.prepare(
      "SELECT * FROM blocked_slots WHERE blocked_date >= date('now', '+05:30') ORDER BY blocked_date ASC"
    ).all();
    
    return new Response(JSON.stringify({ success: true, blocks: results }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDB(locals);
    const data = await request.json();
    
    const { blocked_date, start_time, end_time, reason } = data;
    
    if (!blocked_date) {
      return new Response(JSON.stringify({ error: 'blocked_date is required' }), { status: 400 });
    }

    const { results } = await db.prepare(
      'INSERT INTO blocked_slots (blocked_date, start_time, end_time, reason) VALUES (?, ?, ?, ?) RETURNING *'
    ).bind(blocked_date, start_time || null, end_time || null, reason || null).all();

    return new Response(JSON.stringify({ success: true, block: results[0] }), { status: 201 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
