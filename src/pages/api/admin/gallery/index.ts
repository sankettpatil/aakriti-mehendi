import type { APIRoute } from 'astro';
import { getDB } from '../../../../lib/db';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = getDB(locals);
    const { results } = await db.prepare(
      'SELECT * FROM gallery_images ORDER BY display_order ASC, created_at DESC'
    ).all();
    
    return new Response(JSON.stringify({ success: true, images: results }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
