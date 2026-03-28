import { UserRepository } from "~~/server/repositories/user.repository";
import { handleError } from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  if (event.context.user?.id === id) {
    throw createError({
      statusCode: 400,
      statusMessage: "You cannot delete your own account",
    });
  }

  const userRepository = new UserRepository();

  try {
    await userRepository.delete(id as string, event.headers);
    return { success: true };
  } catch (error: any) {
    throw handleError("users.delete", error, "Failed to delete user");
  }
});
