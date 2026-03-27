import { UserRepository } from "~~/server/repositories/user.repository";
import { logError } from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
  // Protection admin via middleware user-admin.ts

  const { id } = getRouterParams(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required",
    });
  }

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
    logError("users.getById", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || error.message || "Failed to fetch user",
    });
  }
});
