import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  try {
    const data = await request.json();
    const password = data.password;

    if (!password) {
      return new Response(JSON.stringify({ error: 'Password is required' }), { status: 400 });
    }

    // Get the password from env vars, fallback to default for dev
    const expectedPassword = process.env.ADMIN_PASSWORD || 'AakritiAdmin2026!';

    if (password !== expectedPassword) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 });
    }

    // Generate a simple session token (in production, use a secure random string)
    const sessionToken = crypto.randomUUID();

    // Store in KV with a 24 hour expiration (86400 seconds)
    const { env } = await import('cloudflare:workers');
    const kv = env?.SESSION;
    if (kv) {
      await kv.put(`session:${sessionToken}`, 'active', { expirationTtl: 86400 });
    }

    // Set HTTP-only cookie
    cookies.set('admin_session', kv ? sessionToken : 'dev_mock_session', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 // 24 hours
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 });
  }
};
