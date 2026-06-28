import type { APIRoute } from 'astro';
import { getDB } from '../../../../lib/db';

export const PATCH: APIRoute = async ({ params, request, locals }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Booking ID required' }), { status: 400 });
    }

    const data = await request.json();
    const { status, admin_notes, decline_reason, assigned_artist_id } = data;

    const db = getDB(locals);
    
    const updates: string[] = [];
    const values: any[] = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
      updates.push("status_updated_at = datetime('now')");
    }
    
    if (admin_notes !== undefined) {
      updates.push('admin_notes = ?');
      values.push(admin_notes);
    }
    
    if (decline_reason !== undefined) {
      updates.push('decline_reason = ?');
      values.push(decline_reason);
    }

    if (assigned_artist_id !== undefined) {
      updates.push('assigned_artist_id = ?');
      // If they send null, we save null to unassign
      values.push(assigned_artist_id);
    }

    if (updates.length === 0) {
      return new Response(JSON.stringify({ error: 'No updates provided' }), { status: 400 });
    }

    values.push(id);

    const query = `UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`;
    await db.prepare(query).bind(...values).run();

    // Fetch the updated booking to return
    const updated = await db.prepare('SELECT * FROM bookings WHERE id = ?').bind(id).first();

    // TODO: In Session 7, this is where we trigger Resend emails (Confirmation or Decline emails) based on status change!

    return new Response(JSON.stringify({ success: true, booking: updated }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};
