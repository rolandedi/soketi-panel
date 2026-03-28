import { z, type ZodError } from "zod";
import type { H3Event } from "h3";
import { consola } from "consola";

/**
 * Validate H3 request data using a Zod schema.
 *
 * - `event`: the current H3 event (used to read body, query, or params).
 * - `source`: where to read the data from: `body`, `query`, or `params`.
 * - `schema`: the Zod schema to validate against.
 *
 * Returns the result of `schema.safeParse(data)`, which contains `success` and `data`/`error`.
 */
export async function validateWith(
  event: H3Event<globalThis.EventHandlerRequest>,
  source: "body" | "query" | "params",
  schema: z.ZodType<any>,
) {
  let data: any;

  switch (source) {
    case "body":
      data = await readBody(event);
      break;
    case "query":
      data = getQuery(event);
      break;
    case "params":
      data = getRouterParams(event);
      break;
  }

  return schema.safeParse(data);
}

/**
 * Create and return a standardized HTTP 400 error for a failed Zod validation.
 *
 * - Logs the validation issues via `consola` to aid debugging.
 * - Uses `createError` to build an H3 error with `statusCode: 400`.
 *
 * @param error - The optional Zod error returned by `safeParse`.
 * @returns An H3 error created via `createError` with a descriptive message.
 */
export function createValidationError(error: ZodError<any> | undefined) {
  consola.error("Validation error:", error?.issues);
  return createError({
    statusCode: 400,
    statusMessage: error?.issues[0]?.message || "Validation error occurred",
  });
}

/**
 * Log a generic error with a provided context.
 *
 * - Adds the `context` in brackets to make logs easier to filter.
 * - Includes the message, stack, and any additional error properties.
 *
 * @param context - Textual context (e.g. function or module name).
 * @param error - The error object to log.
 */
export function logError(context: string, error: any) {
  consola.error(`[${context}]`, {
    message: error?.message || "Unknown error",
    stack: error?.stack,
    ...error,
  });
}

/**
 * Handle a server-side API error: log it and convert to a standardized H3 error.
 *
 * - Prefers `error.statusMessage` or `error.message` for the returned message.
 * - Logs the full error for debugging.
 * - Returns an error constructed with `createError`, using `error.statusCode` when available.
 *
 * @param context - Context string for logging (e.g. service name).
 * @param error - The caught error.
 * @param defaultMessage - Default message if the error provides none.
 * @returns An H3 error created via `createError` (default statusCode: 500).
 */
export function handleError(
  context: string,
  error: any,
  defaultMessage = "An error occurred",
) {
  const message = error.statusMessage || error.message || defaultMessage;

  consola.error(`[${context}]`, {
    message,
    stack: error?.stack,
    ...error,
  });

  return createError({
    statusCode: error.statusCode || 500,
    statusMessage: message,
  });
}
