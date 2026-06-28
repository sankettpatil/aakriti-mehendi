import type { APIRoute } from 'astro';
import { getDB, getAllAvailabilityRules } from '../../../../lib/db';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = getDB(locals);
    const rules = await getAllAvailabilityRules(db);
    return new Response(JSON.stringify({ success: true, rules }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDB(locals);
    const data = await request.json();
    
    // We expect an array of rules to update
    const rules = data.rules;
    if (!Array.isArray(rules)) {
      return new Response(JSON.stringify({ error: 'Rules must be an array' }), { status: 400 });
    }

    // Process each rule in a transaction
    const stmts = rules.map(rule => {
      const specificSlotsStr = rule.specific_slots ? JSON.stringify(rule.specific_slots) : null;
      return db.prepare(
        'UPDATE availability_rules SET start_time = ?, end_time = ?, is_active = ?, slot_gap_min = ?, specific_slots = ? WHERE day_of_week = ?'
      ).bind(rule.start_time, rule.end_time, rule.is_active ? 1 : 0, rule.slot_gap_min || 30, specificSlotsStr, rule.day_of_week);
    });

    await db.batch(stmts);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
