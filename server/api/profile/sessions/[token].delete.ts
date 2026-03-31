import { auth } from "~~/server/lib/auth";
import { handleError } from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const { token } = getRouterParams(event);

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: "Session token is required",
    });
  }

  try {
    await auth.api.revokeSession({
      headers: event.headers,
      body: { token },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    throw handleError(
      "profile.revokeSession",
      error,
      "Failed to revoke session",
    );
  }
});
