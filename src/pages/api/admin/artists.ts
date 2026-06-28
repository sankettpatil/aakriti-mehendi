import type { APIRoute } from 'astro';
import { getDB } from '../../../lib/db';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = getDB(locals);
    const { results } = await db.prepare('SELECT * FROM artists ORDER BY id ASC').all();
    
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDB(locals);
    const data = await request.json();
    
    const { name, bio, photo_r2_key, is_active } = data;
    
    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
    }

    const result = await db.prepare(
      'INSERT INTO artists (name, bio, photo_r2_key, is_active) VALUES (?, ?, ?, ?) RETURNING *'
    ).bind(name, bio || null, photo_r2_key || null, is_active !== undefined ? is_active : 1).first();

    return new Response(JSON.stringify({ success: true, artist: result }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error creating artist:", error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};
