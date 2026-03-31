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
    await auth.api.revokeOtherSessions({
      headers: event.headers,
    });

    return {
      success: true,
    };
  } catch (error: any) {
    throw handleError(
      "profile.revokeOtherSessions",
      error,
      "Failed to revoke other sessions",
    );
  }
});
