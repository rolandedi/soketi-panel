import { User } from "~~/server/models/user";

export default defineEventHandler(async (event) => {
  const limit = 10;
  const page = 1;

  try {
    const users = await User.query()
      .limit(limit)
      .offset((page - 1) * limit);

    return users;
  } catch (error: any) {
    console.error(error);
    return createError({
      statusCode: 500,
      statusMessage: error?.message || "Failed to fetch users",
    });
  }
});
