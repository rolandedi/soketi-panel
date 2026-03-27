import { UserRepository } from "~~/server/repositories/user.repository";
import { handleError } from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const userRepository = new UserRepository();

  try {
    return await userRepository.getAll(page, limit);
  } catch (error: any) {
    throw handleError("users.getAll", error, "Failed to fetch users");
  }
});
