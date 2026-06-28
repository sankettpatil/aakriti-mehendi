import type { APIRoute } from 'astro';
import { getDB, getAnalyticsStats, getAvailableAnalyticsMonths } from '../../../lib/db';

export const GET: APIRoute = async ({ locals, request }) => {
  try {
    const db = getDB(locals);
    const url = new URL(request.url);
    const month = url.searchParams.get('month');

    const [stats, months] = await Promise.all([
      getAnalyticsStats(db, month || undefined),
      getAvailableAnalyticsMonths(db)
    ]);

    return new Response(JSON.stringify({ success: true, stats, months }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
