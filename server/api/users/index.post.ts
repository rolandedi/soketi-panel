import { UserRepository } from "~~/server/repositories/user.repository";
import { createUserScheme } from "~~/server/validations/users/createUserScheme";
import {
  createValidationError,
  validateWith,
  handleError,
} from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
  const { data, error } = await validateWith(event, "body", createUserScheme);

  if (error) {
    throw createValidationError(error);
  }

  const userRepository = new UserRepository();

  try {
    return await userRepository.create(data, event.headers);
  } catch (err: any) {
    throw handleError("users.create", err, "Failed to create user");
  }
});
