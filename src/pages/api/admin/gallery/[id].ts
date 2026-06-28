import type { APIRoute } from 'astro';
import { getDB } from '../../../../lib/db';

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Image ID required' }), { status: 400 });
    }

    const db = getDB(locals);
    
    // First get the image to get its R2 key
    const image = await db.prepare('SELECT r2_key FROM gallery_images WHERE id = ?').bind(id).first();
    
    if (image) {
      const { env } = await import('cloudflare:workers');
      const bucket = env?.GALLERY_BUCKET;
      if (bucket) {
        await bucket.delete((image as any).r2_key);
      }
    }

    await db.prepare('DELETE FROM gallery_images WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ params, request, locals }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Image ID required' }), { status: 400 });
    }

    const data = await request.json();
    const { is_visible, display_order, alt_text, style_tag, occasion_tag } = data;

    const db = getDB(locals);
    
    const updates: string[] = [];
    const values: any[] = [];

    if (is_visible !== undefined) {
      updates.push('is_visible = ?');
      values.push(is_visible ? 1 : 0);
    }
    
    if (display_order !== undefined) {
      updates.push('display_order = ?');
      values.push(display_order);
    }

    if (alt_text !== undefined) {
      updates.push('alt_text = ?');
      values.push(alt_text);
    }

    if (style_tag !== undefined) {
      updates.push('style_tag = ?');
      values.push(style_tag);
    }

    if (occasion_tag !== undefined) {
      updates.push('occasion_tag = ?');
      values.push(occasion_tag);
    }

    if (updates.length === 0) {
      return new Response(JSON.stringify({ error: 'No updates provided' }), { status: 400 });
    }

    values.push(id);

    const query = `UPDATE gallery_images SET ${updates.join(', ')} WHERE id = ?`;
    await db.prepare(query).bind(...values).run();

    const updated = await db.prepare('SELECT * FROM gallery_images WHERE id = ?').bind(id).first();

    return new Response(JSON.stringify({ success: true, image: updated }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
