import type { APIRoute } from 'astro';
import { getDB, getUniqueCustomers } from '../../../lib/db';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = getDB(locals);
    const customers = await getUniqueCustomers(db);
    return new Response(JSON.stringify({ success: true, customers }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
