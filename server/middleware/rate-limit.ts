import { consola } from "consola";

interface RateLimitEntry {
  count: number;
  firstRequest: number;
}

// In-memory store for rate limiting
// For production, consider using Redis for distributed rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute

function cleanupOldEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.firstRequest > WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }
}

// Cleanup old entries every 5 minutes
setInterval(cleanupOldEntries, 5 * 60 * 1000);

function getRateLimitKey(event: any): string {
  // Try to get user ID first (authenticated users)
  if (event.context?.user?.id) {
    return `user:${event.context.user.id}`;
  }

  // Fall back to IP address for anonymous users
  const ip =
    event.headers.get("x-forwarded-for")?.split(",")[0] ||
    event.headers.get("x-real-ip") ||
    "unknown";

  return `ip:${ip}`;
}

export default defineEventHandler(async (event) => {
  // Skip rate limiting for auth routes to avoid blocking login attempts
  // (login has its own brute force protection in Better Auth)
  if (event.path.startsWith("/api/auth")) {
    return;
  }

  const key = getRateLimitKey(event);
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry) {
    // First request in this window
    rateLimitStore.set(key, {
      count: 1,
      firstRequest: now,
    });
    return;
  }

  // Check if we're in a new window
  if (now - entry.firstRequest > WINDOW_MS) {
    // Reset the window
    rateLimitStore.set(key, {
      count: 1,
      firstRequest: now,
    });
    return;
  }

  // We're in the same window, increment counter
  entry.count++;

  if (entry.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.firstRequest + WINDOW_MS - now) / 1000);

    consola.warn(`Rate limit exceeded for ${key}`, {
      count: entry.count,
      max: MAX_REQUESTS,
      windowMs: WINDOW_MS,
      retryAfter,
    });

    setHeader(event, "Retry-After", retryAfter);
    setHeader(event, "X-RateLimit-Limit", MAX_REQUESTS.toString());
    setHeader(event, "X-RateLimit-Remaining", "0");
    setHeader(
      event,
      "X-RateLimit-Reset",
      Math.ceil((entry.firstRequest + WINDOW_MS) / 1000).toString(),
    );

    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
    });
  }

  // Add rate limit headers to successful responses
  event.context.rateLimit = {
    limit: MAX_REQUESTS,
    remaining: MAX_REQUESTS - entry.count,
    reset: Math.ceil((entry.firstRequest + WINDOW_MS) / 1000),
  };
});

// Response middleware to add rate limit headers
export const responseMiddleware = defineEventHandler(async (event) => {
  if (event.context.rateLimit) {
    const { limit, remaining, reset } = event.context.rateLimit;
    setHeader(event, "X-RateLimit-Limit", limit.toString());
    setHeader(event, "X-RateLimit-Remaining", remaining.toString());
    setHeader(event, "X-RateLimit-Reset", reset.toString());
  }
});
