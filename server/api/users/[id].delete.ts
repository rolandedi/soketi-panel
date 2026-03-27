import { UserRepository } from "~~/server/repositories/user.repository";

export default defineEventHandler(async (event) => {
  if (event.context.user?.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  const { id } = getRouterParams(event);

  if (event.context.user.id === id) {
    throw createError({
      statusCode: 400,
      statusMessage: "You cannot delete your own account",
    });
  }

  const userRepository = new UserRepository();

  try {
    await userRepository.delete(id as string);
    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || error.message || "Failed to delete user",
    });
  }
});
