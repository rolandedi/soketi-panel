import { auth } from "~~/server/lib/auth";
import {
  handleError,
  validateWith,
  createValidationError,
} from "~~/server/lib/utils";
import { updateProfileScheme } from "~~/server/validations/profile/updateProfileScheme";

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
      body: data,
    });

    return {
      success: true,
    };
  } catch (error: any) {
    throw handleError("profile.update", error, "Failed to update profile");
  }
});
