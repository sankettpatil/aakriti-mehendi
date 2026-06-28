import type { APIRoute } from 'astro';
import { getDB } from '../../../../lib/db';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const alt_text = formData.get('alt_text') as string;
    const style_tag = formData.get('style_tag') as string;
    const occasion_tag = formData.get('occasion_tag') as string;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
    }

    // Generate unique key
    const ext = file.name.split('.').pop();
    const r2_key = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    // Get bucket and DB
    const { env } = await import('cloudflare:workers');
    const bucket = env?.GALLERY_BUCKET;
    const db = getDB(locals);

    if (bucket) {
      // Convert File to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      await bucket.put(r2_key, arrayBuffer, {
        httpMetadata: { contentType: file.type }
      });
    } else {
      // In purely local dev without wrangler, we'd mock it, 
      // but with wrangler it should be defined even locally
      console.warn('R2 bucket not found, skipping file upload but creating DB entry');
    }

    // Insert into DB
    const { results } = await db.prepare(
      'INSERT INTO gallery_images (r2_key, alt_text, style_tag, occasion_tag, is_visible, display_order) VALUES (?, ?, ?, ?, 1, 0) RETURNING *'
    ).bind(r2_key, alt_text || null, style_tag || null, occasion_tag || null).all();

    return new Response(JSON.stringify({ success: true, image: results[0] }), { status: 201 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
