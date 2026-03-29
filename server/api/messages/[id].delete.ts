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
      statusMessage: "Message ID is required",
    });
  }

  const messageRepository = new MessageRepository();

  try {
    const message = await messageRepository.getById(id, user.id);

    if (!message) {
      throw createError({
        statusCode: 404,
        statusMessage: "Message not found",
      });
    }

    const deleted = await messageRepository.deleteByIds([id], user.id);

    return {
      success: true,
      deleted,
    };
  } catch (error: any) {
    throw handleError("messages.deleteById", error, "Failed to delete message");
  }
});
