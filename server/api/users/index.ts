import { UserRepository } from "~~/server/repositories/user.repository";
import { handleError } from "~~/server/lib/utils";
import { auth } from "~~/server/lib/auth";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const session = await auth.api.getSession({ headers: event.headers });
  const currentUserId = session?.user?.id;

  const userRepository = new UserRepository();

  try {
    return await userRepository.getAll(page, limit, currentUserId);
  } catch (error: any) {
    throw handleError("users.getAll", error, "Failed to fetch users");
  }
});
