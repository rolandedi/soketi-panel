import { UserRepository } from "~~/server/repositories/user.repository";
import {
  validateWith,
  createValidationError,
  logError,
} from "~~/server/lib/utils";
import { updateUserScheme } from "~~/server/validations/users/updateUserScheme";

export default defineEventHandler(async (event) => {
  // Protection admin via middleware user-admin.ts

  const { id } = getRouterParams(event);
  const { data, error } = await validateWith(event, "body", updateUserScheme);

  if (error) {
    throw createValidationError(error);
  }

  const userRepository = new UserRepository();

  try {
    await userRepository.update(id as string, data);
    return { success: true };
  } catch (error: any) {
    logError("users.update", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || error.message || "Failed to update user",
    });
  }
});
