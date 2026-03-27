import { Message } from "~~/server/models/message";
import { logError } from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  try {
    return await Message.paginate(page, limit);
  } catch (error: any) {
    logError("messages.getAll", error);
    return createError({
      statusCode: 500,
      statusMessage: error?.message || "Failed to fetch messages",
    });
  }
});
