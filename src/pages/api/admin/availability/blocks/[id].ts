import type { APIRoute } from 'astro';
import { getDB } from '../../../../../lib/db';

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Block ID required' }), { status: 400 });
    }

    const db = getDB(locals);
    await db.prepare('DELETE FROM blocked_slots WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
