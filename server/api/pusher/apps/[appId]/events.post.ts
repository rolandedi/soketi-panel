import { ApplicationRepository } from "~~/server/repositories/application.repository";
import { publishToSoketi } from "~~/server/services/soketi-publish";
import { pusherEventScheme } from "~~/server/validations/pusher/pusherEventScheme";
import {
  handleError,
  createValidationError,
  validateWith,
} from "~~/server/lib/utils";
import { createHash } from "node:crypto";

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

  const { data, error } = await validateWith(event, "body", pusherEventScheme);

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

    let payload: unknown;

    try {
      payload = JSON.parse(data.data);
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: "Data must be valid JSON",
      });
    }

    const idempotencyKey = createHash("sha256")
      .update(`${appId}:${data.channel}:${data.event}:${data.data}`)
      .digest("hex")
      .slice(0, 32);

    const result = await publishToSoketi({
      application,
      channel: data.channel,
      event: data.event,
      data: payload,
      socket_id: data.socket_id,
      source: "backend_api",
      raw_payload: data.data,
      idempotency_key: idempotencyKey,
    });

    if (!result.success) {
      throw createError({
        statusCode: 502,
        statusMessage: `Failed to publish to Soketi: ${result.error}`,
      });
    }

    return {
      id: result.messageId,
      app_id: application.id,
      channel: data.channel,
      event: data.event,
    };
  } catch (error) {
    throw handleError(
      "pusher.events.publish",
      error as Error,
      "Failed to publish event",
    );
  }
});
