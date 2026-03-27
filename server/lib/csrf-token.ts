import { createHash } from "node:crypto";

/** The name of the CSRF cookie */
export const CSRF_COOKIE_NAME = "csrf_token";

/** The name of the CSRF header */
export const CSRF_HEADER_NAME = "x-csrf-token";

/** The maximum age of the CSRF cookie in seconds */
export const CSRF_COOKIE_MAX_AGE = 60 * 60; // 1 hour (seconds)

/** These methods are read-only and cannot trigger state changes */
export const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Derive a deterministic CSRF token from the session token.
 * Using a hash avoids storing CSRF tokens server-side while
 * keeping them tied to a specific session.
 */
export function deriveCsrfToken(sessionToken: string): string {
  return createHash("sha256").update(sessionToken).digest("hex").slice(0, 32);
}

/**
 * Issue a CSRF token cookie and response header for the current session.
 * Called on safe methods so the client always has a valid token to use.
 */
export function issueCsrfToken(
  event: Parameters<typeof setCookie>[0],
  sessionToken: string,
): void {
  const token = deriveCsrfToken(sessionToken);

  setCookie(event, CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be readable by JS to set the request header
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: CSRF_COOKIE_MAX_AGE,
    path: "/",
  });

  setHeader(event, "X-CSRF-Token", token);
}
