import { UserRepository } from "~~/server/repositories/user.repository";
import { handleError } from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
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
    throw handleError("users.getById", error, "Failed to fetch user");
  }
});
