import { ApplicationRepository } from "~~/server/repositories/application.repository";
import { handleError } from "~~/server/lib/utils";

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

  const applicationRepository = new ApplicationRepository();

  try {
    const application = await applicationRepository.regenerate(id, user.id);

    if (!application) {
      throw createError({
        statusCode: 404,
        statusMessage: "Application not found",
      });
    }

    return {
      key: application.key,
      secret: application.secret,
      application,
    };
  } catch (error: any) {
    throw handleError(
      "applications.regenerate",
      error,
      "Failed to regenerate application credentials",
    );
  }
});
