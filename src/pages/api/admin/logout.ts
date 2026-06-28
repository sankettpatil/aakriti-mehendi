import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ locals, cookies, request }) => {
  try {
    const sessionToken = cookies.get('admin_session')?.value;
    
    if (sessionToken) {
      const { env } = await import('cloudflare:workers');
      const kv = env?.SESSION;
      if (kv && sessionToken !== 'dev_mock_session') {
        await kv.delete(`session:${sessionToken}`);
      }
      
      cookies.delete('admin_session', { path: '/' });
    }
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/admin/login'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};
