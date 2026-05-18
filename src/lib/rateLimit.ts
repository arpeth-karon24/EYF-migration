/**
 * Rate Limiting Utilities
 * In-memory rate limiter for Cloudflare Functions
 * For production, consider using Cloudflare Workers KV or Redis
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Simple in-memory store for rate limiting
// Note: This is per-instance and won't work across multiple function instances
// For production, use Cloudflare KV or external cache
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check if a request is rate limited based on IP and endpoint
 * Returns true if rate limit is exceeded
 */
export function isRateLimited(
  clientIp: string,
  endpoint: string,
  maxRequests: number = 10,
  windowSeconds: number = 60
): boolean {
  const key = `${clientIp}:${endpoint}`;
  const now = Date.now();

  // Get or create rate limit entry
  const entry = rateLimitStore.get(key);

  // If no entry exists or window has reset
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowSeconds * 1000,
    });
    return false;
  }

  // Increment count
  entry.count++;

  // Check if over limit
  if (entry.count > maxRequests) {
    return true;
  }

  return false;
}

/**
 * Get remaining requests for a client
 */
export function getRateLimitStatus(
  clientIp: string,
  endpoint: string,
  maxRequests: number = 10,
  windowSeconds: number = 60
): { remaining: number; resetAt: number; limit: number } {
  const key = `${clientIp}:${endpoint}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    return {
      remaining: maxRequests,
      resetAt: now + windowSeconds * 1000,
      limit: maxRequests,
    };
  }

  return {
    remaining: Math.max(0, maxRequests - entry.count),
    resetAt: entry.resetTime,
    limit: maxRequests,
  };
}

/**
 * Extract client IP from request headers
 * Handles proxies and Cloudflare forwarding
 */
export function getClientIp(request: Request): string {
  // Cloudflare header
  const cfIp = request.headers.get('CF-Connecting-IP');
  if (cfIp) return cfIp;

  // Standard headers
  const forwarded = request.headers.get('X-Forwarded-For');
  if (forwarded) return forwarded.split(',')[0].trim();

  const realIp = request.headers.get('X-Real-IP');
  if (realIp) return realIp;

  // Fallback
  return 'unknown';
}

/**
 * Clean up old rate limit entries (run periodically)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  const entriesToDelete: string[] = [];

  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      entriesToDelete.push(key);
    }
  });

  entriesToDelete.forEach((key) => rateLimitStore.delete(key));
}
