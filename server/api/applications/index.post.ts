import { ApplicationRepository } from "~~/server/repositories/application.repository";
import {
  createValidationError,
  handleError,
  validateWith,
} from "~~/server/lib/utils";
import { createApplicationScheme } from "~~/server/validations/applications/createApplicationScheme";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const { data, error } = await validateWith(
    event,
    "body",
    createApplicationScheme,
  );

  if (error) {
    throw createValidationError(error);
  }

  const applicationRepository = new ApplicationRepository();

  try {
    return await applicationRepository.create(data, user.id);
  } catch (error: any) {
    throw handleError(
      "applications.create",
      error,
      "Failed to create application",
    );
  }
});
