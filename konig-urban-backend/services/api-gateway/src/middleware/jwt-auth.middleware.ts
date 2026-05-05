import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Request, Response, NextFunction } from 'express';

// Public routes that bypass JWT verification
const PUBLIC_ROUTES: Array<{ method: string; prefix: string }> = [
  { method: 'GET', prefix: '/health' },
  { method: 'GET', prefix: '/api/docs' },
  { method: 'GET', prefix: '/docs/yaml' },
];

function isPublicRoute(method: string, path: string): boolean {
  return PUBLIC_ROUTES.some(
    (r) => r.method === method && path.startsWith(r.prefix),
  );
}

let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required');
    supabase = createClient(url, key, { auth: { persistSession: false } });
  }
  return supabase;
}

export async function jwtAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // 🚀 DEVELOPMENT BYPASS: Allow absolutely all requests in development mode
  if (process.env.NODE_ENV === 'development') {
    // Inject mock headers to ensure downstream services have identity context
    req.headers['x-user-id'] = '00000000-0000-0000-0000-000000000000';
    req.headers['x-user-email'] = 'professor-tester@konigurban.dev';
    req.headers['x-user-role'] = 'admin'; // Grant full access to ERP/HR/Production
    next();
    return;
  }

  if (isPublicRoute(req.method, req.path)) {
    next();
    return;
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const { data, error } = await getSupabaseClient().auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    const role = data.user.app_metadata?.role || data.user.user_metadata?.role || 'user';

    // 1. Inject verified identity as headers for downstream services to consume
    req.headers['x-user-id'] = data.user.id;
    req.headers['x-user-email'] = data.user.email ?? '';
    req.headers['x-user-role'] = role;

    // 2. Perform rudimentary RBAC (Role Based Access Control)
    const isAdminRoute = req.path.includes('/erp/') ||
      req.path.includes('/admin/') ||
      req.path.includes('/api/v1/hr') ||
      req.path.includes('/api/v1/production');

    if (isAdminRoute && role !== 'admin') {
      res.status(403).json({ error: 'Forbidden: Admin access required for this ERP endpoint' });
      return;
    }

    next();
  } catch (error) {
    console.error('Supabase Auth verification failed:', error);
    res.status(500).json({ error: 'Internal auth service failure' });
  }
}
