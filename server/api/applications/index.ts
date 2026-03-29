import { ApplicationRepository } from "~~/server/repositories/application.repository";
import { handleError } from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const query = getQuery(event);
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  const applicationRepository = new ApplicationRepository();

  try {
    const userId = user.role === "admin" ? null : user.id;
    return await applicationRepository.getAll(userId, page, limit);
  } catch (error: any) {
    throw handleError(
      "applications.getAll",
      error,
      "Failed to fetch applications",
    );
  }
});
