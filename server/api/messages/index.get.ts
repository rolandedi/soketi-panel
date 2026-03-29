import { MessageRepository } from "~~/server/repositories/message.repository";
import { handleError } from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  try {
    const messageRepository = new MessageRepository();

    return await messageRepository.getAll(page, limit);
  } catch (error: any) {
    throw handleError("messages.getAll", error, "Failed to fetch messages");
  }
});
