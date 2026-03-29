import { ApplicationRepository } from "~~/server/repositories/application.repository";
import {
  createValidationError,
  handleError,
  validateWith,
} from "~~/server/lib/utils";
import { deleteApplicationScheme } from "~~/server/validations/applications/deleteApplicationScheme";

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
    deleteApplicationScheme,
  );

  if (error) {
    throw createValidationError(error);
  }

  const applicationRepository = new ApplicationRepository();

  try {
    const deleted = await applicationRepository.delete(data.ids, user.id);

    return {
      success: true,
      deleted,
    };
  } catch (error: any) {
    throw handleError(
      "applications.delete",
      error,
      "Failed to delete applications",
    );
  }
});
