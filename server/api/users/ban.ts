import { UserRepository } from "~~/server/repositories/user.repository";
import { validateWith, createValidationError } from "~~/server/lib/utils";
import { banUserScheme } from "~~/server/validations/users/banUserScheme";

export default defineEventHandler(async (event) => {
  if (!event.context.user || event.context.user.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  const { data, error } = await validateWith(event, "body", banUserScheme);

  if (error) {
    throw createValidationError(error);
  }

  if (event.context.user.id === data.userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "You cannot ban your own account",
    });
  }

  const userRepository = new UserRepository();

  try {
    await userRepository.ban(data.userId, data.banned, data.banReason, data.banExpires);
    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Failed to ban/unban user",
    });
  }
});
