import { auth } from "~~/server/lib/auth";
import { handleError } from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  try {
    return await auth.api.listSessions({
      headers: event.headers,
    });
  } catch (error: any) {
    throw handleError("profile.listSessions", error, "Failed to list sessions");
  }
});
