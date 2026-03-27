import { consola } from "consola";

import {
  CSRF_HEADER_NAME,
  deriveCsrfToken,
  issueCsrfToken,
  SAFE_METHODS,
} from "../lib/csrf-token";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method ?? "GET";
  const sessionToken = event.context.session?.token as string | undefined;

  // On safe methods, refresh the CSRF token so the client stays up to date.
  if (SAFE_METHODS.has(method)) {
    if (sessionToken) {
      issueCsrfToken(event, sessionToken);
    }
    return;
  }

  // Better Auth manages its own CSRF protection for auth routes.
  if (event.path.startsWith("/api/auth")) {
    return;
  }

  // No session means the request is unauthenticated; let the auth
  // middleware handle it rather than returning a misleading 403.
  if (!sessionToken) {
    return;
  }

  const csrfToken = event.headers.get(CSRF_HEADER_NAME);

  if (!csrfToken) {
    consola.warn("[csrf] token missing", { path: event.path, method });
    throw createError({
      statusCode: 403,
      statusMessage:
        "The required CSRF token was not found in the request headers.",
    });
  }

  if (csrfToken !== deriveCsrfToken(sessionToken)) {
    consola.warn("[csrf] token invalid", { path: event.path, method });
    throw createError({
      statusCode: 403,
      statusMessage: "The provided CSRF token is invalid or has expired.",
    });
  }

  event.context.csrfValidated = true;
});
