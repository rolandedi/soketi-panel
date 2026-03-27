import { UserRepository } from "~~/server/repositories/user.repository";

export default defineEventHandler(async (event) => {
  // Vérification de rôle centralisée pour l'admin
  if (!event.context.user || event.context.user.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const userRepository = new UserRepository();

  try {
    return await userRepository.getAll(page, limit);
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error?.message || "Failed to fetch users",
    });
  }
});
