import { z, type ZodError } from "zod";
import type { H3Event } from "h3";

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
  return createError({
    statusCode: 400,
    statusMessage: error?.issues[0]?.message || "Validation error occurred",
  });
}
