import { UserRepository } from "~~/server/repositories/user.repository";
import { logError } from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
  // Protection admin via middleware user-admin.ts

  const { id } = getRouterParams(event);

  if (event.context.user?.id === id) {
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
    logError("users.delete", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || error.message || "Failed to delete user",
    });
  }
});
