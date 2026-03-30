import Pusher from "pusher";

import { ApplicationRepository } from "~~/server/repositories/application.repository";
import { MessageRepository } from "~~/server/repositories/message.repository";
import { broadcastScheme } from "~~/server/validations/playground/broadcastScheme";
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

  const { data, error } = await validateWith(event, "body", broadcastScheme);

  if (error) {
    throw createValidationError(error);
  }

  const applicationRepository = new ApplicationRepository();
  const messageRepository = new MessageRepository();
  const runtimeConfig = useRuntimeConfig();

  try {
    const application = await applicationRepository.getById(
      data.app_id,
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
      payload = JSON.parse(data.payload);
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: "Payload must be valid JSON",
      });
    }

    const pusher = new Pusher({
      appId: application.id,
      key: application.key,
      secret: application.secret,
      cluster: runtimeConfig.pusherAppCluster,
      host: runtimeConfig.pusherHost,
      port: runtimeConfig.pusherPort,
      useTLS: runtimeConfig.pusherTls === "1",
    });

    await pusher.trigger(data.channel, data.event, payload);

    return await messageRepository.create({
      app_id: application.id,
      channel: data.channel,
      event: data.event,
      payload,
    });
  } catch (error: any) {
    throw handleError(
      "playground.broadcast",
      error,
      "Failed to broadcast event",
    );
  }
});
