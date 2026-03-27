import { randomBytes, createHash } from "node:crypto";
import { consola } from "consola";

// CSRF token configuration
const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";
const TOKEN_LENGTH = 32;
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

// Safe methods that don't require CSRF protection
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Generate a cryptographically secure CSRF token
 */
function generateCsrfToken(): string {
  return randomBytes(TOKEN_LENGTH).toString("hex");
}

/**
 * Generate a hash of the token for comparison
 */
function hashToken(token: string): string {
  return createHash("sha256")
    .update(token)
    .digest("hex")
    .slice(0, TOKEN_LENGTH);
}

/**
 * Validate CSRF token from request
 */
function validateCsrfToken(
  token: string | undefined,
  sessionToken: string,
): boolean {
  if (!token) {
    return false;
  }

  // Token should be hash of session token or a stored CSRF token
  const expectedToken = hashToken(sessionToken);
  return token === expectedToken;
}

export default defineEventHandler(async (event) => {
  const method = event.node.req.method || "GET";

  // Skip CSRF check for safe methods
  if (SAFE_METHODS.has(method)) {
    // Set CSRF token in response for safe methods (GET, HEAD, OPTIONS)
    const sessionToken = event.context.session?.token;
    if (sessionToken) {
      const csrfToken = hashToken(sessionToken);
      setCookie(event, CSRF_COOKIE_NAME, csrfToken, {
        httpOnly: false, // Client needs to read this
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: TOKEN_EXPIRY_MS / 1000,
        path: "/",
      });
      setHeader(event, "X-CSRF-Token", csrfToken);
    }
    return;
  }

  // Skip CSRF check for auth routes (Better Auth handles its own CSRF)
  if (event.path.startsWith("/api/auth")) {
    return;
  }

  // Get the session token from context (set by auth middleware)
  const sessionToken = event.context.session?.token;

  if (!sessionToken) {
    // No session, skip CSRF check (auth will handle this)
    return;
  }

  // Get CSRF token from request header
  const csrfToken = event.headers.get(CSRF_HEADER_NAME);

  if (!csrfToken) {
    consola.warn("CSRF token missing from request", {
      path: event.path,
      method,
    });

    throw createError({
      statusCode: 403,
      statusMessage: "CSRF token missing",
      data: {
        code: "CSRF_TOKEN_MISSING",
        message:
          "The required CSRF token was not found in the request headers.",
      },
    });
  }

  // Validate the CSRF token
  if (!validateCsrfToken(csrfToken, sessionToken)) {
    consola.warn("CSRF token validation failed", {
      path: event.path,
      method,
      tokenProvided: csrfToken ? "yes" : "no",
    });

    throw createError({
      statusCode: 403,
      statusMessage: "CSRF token invalid",
      data: {
        code: "CSRF_TOKEN_INVALID",
        message: "The provided CSRF token is invalid or has expired.",
      },
    });
  }

  // Token is valid, continue
  event.context.csrfValidated = true;
});
