/**
 * Cloudflare Pages Functions Middleware
 * Handles CORS, request logging, and common configurations
 */

export async function onRequest(context: {
  request: Request;
  functionPath: string;
  data?: unknown;
  next: (request?: Request) => Promise<Response>;
}): Promise<Response> {
  // Only apply middleware to API routes
  if (!context.functionPath.startsWith('/api/')) {
    return context.next();
  }

  const request = context.request;
  const origin = request.headers.get('Origin') || '';

  // Log request details
  console.log(`[${new Date().toISOString()}] ${request.method} ${context.functionPath}`);

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': isAllowedOrigin(origin) ? origin : process.env.NEXT_PUBLIC_SITE_URL || '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Process the request
  let response = await context.next();

  // Add CORS headers to response
  const allowedOrigin = isAllowedOrigin(origin) ? origin : process.env.NEXT_PUBLIC_SITE_URL || '*';
  response = new Response(response.body, response);
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

/**
 * Check if origin is allowed for CORS
 */
function isAllowedOrigin(origin: string): boolean {
  const allowedOrigins = [
    'https://engage-youth.org',
    'https://www.engage-youth.org',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  // Allow all Cloudflare Pages preview deployments
  if (origin.endsWith('.pages.dev')) return true;

  return allowedOrigins.includes(origin);
}
