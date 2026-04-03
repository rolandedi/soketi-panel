import { ApplicationRepository } from "~~/server/repositories/application.repository";
import { publishBatchToSoketi } from "~~/server/services/soketi-publish";
import { pusherBatchEventScheme } from "~~/server/validations/pusher/pusherBatchEventScheme";
import {
  handleError,
  createValidationError,
  validateWith,
} from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const { appId } = getRouterParams(event);

  if (!appId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Application ID is required",
    });
  }

  const { data, error } = await validateWith(
    event,
    "body",
    pusherBatchEventScheme,
  );

  if (error) {
    throw createValidationError(error);
  }

  const applicationRepository = new ApplicationRepository();

  try {
    const application = await applicationRepository.getById(
      appId,
      user.role === "admin" ? null : user.id,
    );

    if (!application) {
      throw createError({
        statusCode: 404,
        statusMessage: "Application not found",
      });
    }

    const parsedEvents = data.batch.map((evt: { channel: string; event: string; data: string; socket_id?: string }) => ({
      channel: evt.channel,
      event: evt.event,
      data: JSON.parse(evt.data),
      socket_id: evt.socket_id,
    }));

    const result = await publishBatchToSoketi(application, parsedEvents);

    if (!result.success) {
      throw createError({
        statusCode: 502,
        statusMessage: `Some events failed: ${result.errors.join(", ")}`,
      });
    }

    return {
      success: true,
      messageIds: result.messageIds,
    };
  } catch (error: any) {
    throw handleError(
      "pusher.batch_events.publish",
      error,
      "Failed to publish batch events",
    );
  }
});
