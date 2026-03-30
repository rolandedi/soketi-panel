import { ApplicationRepository } from "~~/server/repositories/application.repository";
import {
  createValidationError,
  handleError,
  validateWith,
} from "~~/server/lib/utils";
import { updateApplicationScheme } from "~~/server/validations/applications/updateApplicationScheme";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const { id } = getRouterParams(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Application ID is required",
    });
  }

  const { data, error } = await validateWith(
    event,
    "body",
    updateApplicationScheme,
  );

  if (error) {
    throw createValidationError(error);
  }

  const applicationRepository = new ApplicationRepository();

  try {
    const application = await applicationRepository.update(id, user.id, data);

    if (!application) {
      throw createError({
        statusCode: 404,
        statusMessage: "Application not found",
      });
    }

    return application;
  } catch (error: any) {
    throw handleError(
      "applications.update",
      error,
      "Failed to update application",
    );
  }
});
