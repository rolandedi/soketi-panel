import { auth } from "~~/server/lib/auth";
import { updateProfileScheme } from "~~/server/validations/profile/updateProfileScheme";
import {
  handleError,
  validateWith,
  createValidationError,
} from "~~/server/lib/utils";

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
    updateProfileScheme,
  );

  if (error) {
    throw createValidationError(error);
  }

  try {
    await auth.api.updateUser({
      headers: event.headers,
      body: { name: data.name },
    });

    if (data.email && data.email !== event.context.user.email) {
      await auth.api.changeEmail({
        headers: event.headers,
        body: { newEmail: data.email },
      });
    }

    return {
      success: true,
    };
  } catch (error: any) {
    throw handleError("profile.update", error, "Failed to update profile");
  }
});
