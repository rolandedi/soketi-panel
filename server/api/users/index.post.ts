import { UserRepository } from "~~/server/repositories/user.repository";
import {
  createValidationError,
  validateWith,
  logError,
} from "~~/server/lib/utils";
import { createUserScheme } from "~~/server/validations/users/createUserScheme";

export default defineEventHandler(async (event) => {
  if (event.context.user?.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  const { data, error } = await validateWith(event, "body", createUserScheme);

  if (error) {
    throw createValidationError(error);
  }

  const userRepository = new UserRepository();

  try {
    return await userRepository.create(data);
  } catch (err: any) {
    logError("users.create", err);
    throw createError({
      statusCode: 500,
      statusMessage: err.message || "Failed to create user",
    });
  }
});
