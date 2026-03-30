import { MessageRepository } from "~~/server/repositories/message.repository";
import {
  createValidationError,
  handleError,
  validateWith,
} from "~~/server/lib/utils";
import { deleteMessagesScheme } from "~~/server/validations/messages/deleteMessagesScheme";

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
    deleteMessagesScheme,
  );

  if (error) {
    throw createValidationError(error);
  }

  const messageRepository = new MessageRepository();

  try {
    const deleted = await messageRepository.deleteByIds(data.ids, user.id);

    return {
      success: true,
      deleted,
    };
  } catch (error: any) {
    throw handleError("messages.delete", error, "Failed to delete messages");
  }
});
