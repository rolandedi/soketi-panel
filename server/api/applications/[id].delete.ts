import { ApplicationRepository } from "~~/server/repositories/application.repository";
import { handleError } from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  const user = event.context.user;

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const applicationRepository = new ApplicationRepository();

  try {
    const userId = user.role === "admin" ? null : user.id;
    await applicationRepository.delete(id as string, userId);
    return { success: true };
  } catch (error: any) {
    throw handleError(
      "applications.delete",
      error,
      "Failed to delete application",
    );
  }
});
