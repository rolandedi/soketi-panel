import { z, type ZodError } from "zod";
import type { H3Event } from "h3";
import { consola } from "consola";

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

export function createValidationError(error: ZodError<any> | undefined) {
  consola.error("Validation error:", error?.issues);
  return createError({
    statusCode: 400,
    statusMessage: error?.issues[0]?.message || "Validation error occurred",
  });
}

export function logError(context: string, error: any) {
  consola.error(`[${context}]`, {
    message: error?.message || "Unknown error",
    stack: error?.stack,
    ...error,
  });
}
