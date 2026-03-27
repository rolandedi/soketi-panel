import { UserRepository } from "~~/server/repositories/user.repository";
import { unbanUserScheme } from "~~/server/validations/users/unbanUserScheme";
import {
  validateWith,
  createValidationError,
  handleError,
} from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
  const { data, error } = await validateWith(event, "body", unbanUserScheme);

  if (error) {
    throw createValidationError(error);
  }

  if (event.context.user?.id === data.userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "You cannot unban your own account",
    });
  }

  const userRepository = new UserRepository();

  try {
    await userRepository.unban(data.userId, event.headers);
    return { success: true };
  } catch (error: any) {
    throw handleError("users.unban", error, "Failed to unban user");
  }
});
