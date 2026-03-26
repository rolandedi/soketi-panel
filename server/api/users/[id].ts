import { User } from "../../models/user";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required",
    });
  }

  const user = await User.find(id);

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }

  return user;
});
