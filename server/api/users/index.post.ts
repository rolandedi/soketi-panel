import { useAuth } from "~~/server/lib/auth";
import { validateWith } from "~~/server/lib/utils";
import { createUserScheme } from "~~/server/validations/users/createUserScheme";

export default defineEventHandler(async (event) => {
  const { data, error } = await validateWith(event, "body", createUserScheme);

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }

  try {
    const { user } = await useAuth().createUser({
      body: {
        role: data.role,
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    return user;
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err.message || "Failed to create user",
    });
  }
});
