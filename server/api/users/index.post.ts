import { User } from "~~/server/models/user";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.email || !body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and name are required",
    });
  }

  try {
    const user = await User.create({
      name: body.name,
      email: body.email,
      role: body.role || "user",
      banned: false,
    });

    return user;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to create user",
    });
  }
});
