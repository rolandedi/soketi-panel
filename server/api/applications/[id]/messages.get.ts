import { ApplicationRepository } from "~~/server/repositories/application.repository";
import { MessageRepository } from "~~/server/repositories/message.repository";
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

  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const applicationRepository = new ApplicationRepository();
  const messageRepository = new MessageRepository();

  try {
    const application = await applicationRepository.getById(id, user.id);

    if (!application) {
      throw createError({
        statusCode: 404,
        statusMessage: "Application not found",
      });
    }

    return await messageRepository.paginateByAppId(id, page, limit);
  } catch (error: any) {
    throw handleError(
      "applications.messages.get",
      error,
      "Failed to fetch application messages",
    );
  }
});
