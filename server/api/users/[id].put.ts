import { UserRepository } from "~~/server/repositories/user.repository";
import { updateUserScheme } from "~~/server/validations/users/updateUserScheme";
import {
  validateWith,
  createValidationError,
  handleError,
} from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { data, error } = await validateWith(event, "body", updateUserScheme);

  if (error) {
    throw createValidationError(error);
  }

  const userRepository = new UserRepository();

  try {
    await userRepository.updateAdmin(id as string, data, event.headers);
    return { success: true };
  } catch (error: any) {
    throw handleError("users.update", error, "Failed to update user");
  }
});
