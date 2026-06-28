import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, locals } = context;
  
  const isAdminRoute = url.pathname.startsWith('/admin') && !url.pathname.startsWith('/admin/login');
  const isAdminApi = url.pathname.startsWith('/api/admin') && !url.pathname.startsWith('/api/admin/login');

  if (isAdminRoute || isAdminApi) {
    const sessionToken = cookies.get('admin_session')?.value;
    
    if (!sessionToken) {
      if (isAdminApi) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
      return context.redirect('/admin/login');
    }
    
    // Verify session in KV
    let kv = null;
    try {
      const { env } = await import('cloudflare:workers');
      kv = env?.SESSION;
    } catch (e) {
      // Ignored for environments without cloudflare bindings
    }
    
    // In dev mode without Cloudflare bindings, we fallback to a simple mock check
    // but with wrangler properly configured, env.SESSION should exist.
    if (kv) {
      const isValid = await kv.get(`session:${sessionToken}`);
      if (!isValid) {
        // Token expired or invalid
        cookies.delete('admin_session', { path: '/' });
        if (isAdminApi) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        return context.redirect('/admin/login');
      }
    } else {
      // Fallback for purely local dev if KV fails to bind (should not happen with wrangler)
      if (sessionToken !== 'dev_mock_session') {
        if (isAdminApi) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        return context.redirect('/admin/login');
      }
    }
  }
  
  return next();
});
