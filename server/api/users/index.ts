import { User } from "~~/server/models/user";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  try {
    return await User.paginate(page, limit);
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error?.message || "Failed to fetch users",
    });
  }
});
