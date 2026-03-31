import { auth } from "~~/server/lib/auth";
import {
  createValidationError,
  handleError,
  validateWith,
} from "~~/server/lib/utils";
import { changePasswordScheme } from "~~/server/validations/profile/changePasswordScheme";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const { data, error } = await validateWith(
    event,
    "body",
    changePasswordScheme,
  );

  if (error) {
    throw createValidationError(error);
  }

  try {
    await auth.api.changePassword({
      headers: event.headers,
      body: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: data.revokeOtherSessions ?? false,
      },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    throw handleError(
      "profile.changePassword",
      error,
      "Failed to change password",
    );
  }
});
