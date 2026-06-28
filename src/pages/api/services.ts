import type { APIRoute } from 'astro';
import { getDB, getActiveServices } from '../../lib/db';

export const GET: APIRoute = async (context) => {
  try {
    const db = getDB(context.locals);
    const services = await getActiveServices(db);
    
    return new Response(JSON.stringify({ services }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
