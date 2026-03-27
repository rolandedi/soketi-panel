import { UserRepository } from "~~/server/repositories/user.repository";

export default defineEventHandler(async (event) => {
  if (!event.context.user || event.context.user.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  const { id } = getRouterParams(event);
  const userRepository = new UserRepository();

  try {
    const user = await userRepository.getById(id);

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    return user;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Failed to fetch user",
    });
  }
});
