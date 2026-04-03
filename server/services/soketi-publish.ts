import Pusher from "pusher";
import type { Application as ApplicationType } from "#shared/types";
import { MessageRepository } from "../repositories/message.repository";
import { consola } from "consola";

export interface PublishResult {
  messageId: string;
  success: boolean;
  error?: string;
}

export interface PublishInput {
  application: ApplicationType;
  channel: string;
  event: string;
  data: unknown;
  socket_id?: string;
  source?: string;
  event_type?: string | null;
  raw_payload?: string | null;
  idempotency_key?: string | null;
}

function createPusherClient(application: ApplicationType): Pusher {
  const runtimeConfig = useRuntimeConfig();

  return new Pusher({
    appId: application.id,
    key: application.key,
    secret: application.secret,
    cluster: runtimeConfig.pusherAppCluster,
    host: runtimeConfig.pusherHost,
    port: runtimeConfig.pusherPort,
    useTLS: runtimeConfig.pusherTls === "1",
  });
}

export async function publishToSoketi(
  input: PublishInput,
): Promise<PublishResult> {
  const messageRepository = new MessageRepository();

  if (input.idempotency_key) {
    const existing = await messageRepository.findByIdempotencyKey(
      input.idempotency_key,
    );
    if (existing) {
      consola.debug(
        `[soketi.publish] Duplicate idempotency key: ${input.idempotency_key}`,
      );
      return { messageId: existing.id, success: true };
    }
  }

  const pusher = createPusherClient(input.application);

  try {
    await pusher.trigger(input.channel, input.event, input.data, {
      socket_id: input.socket_id,
    });

    const message = await messageRepository.create({
      app_id: input.application.id,
      channel: input.channel,
      event: input.event,
      payload: input.data,
      source: input.source ?? "backend_api",
      event_type: input.event_type ?? null,
      socket_id: input.socket_id ?? null,
      user_id: null,
      metadata: null,
      raw_payload: input.raw_payload ?? null,
      idempotency_key: input.idempotency_key ?? null,
      received_at: new Date(),
    });

    return { messageId: message.id, success: true };
  } catch (error: any) {
    consola.error(`[soketi.publish] Failed to publish: ${error.message}`);

    await messageRepository.create({
      app_id: input.application.id,
      channel: input.channel,
      event: input.event,
      payload: input.data,
      source: input.source ?? "backend_api",
      event_type: input.event_type ?? "publish_failed",
      socket_id: input.socket_id ?? null,
      user_id: null,
      metadata: { error: error.message },
      raw_payload: input.raw_payload ?? null,
      idempotency_key: input.idempotency_key ?? null,
      received_at: new Date(),
    });

    return { messageId: "", success: false, error: error.message };
  }
}

export async function publishBatchToSoketi(
  application: ApplicationType,
  events: {
    channel: string;
    event: string;
    data: unknown;
    socket_id?: string;
  }[],
): Promise<{ success: boolean; messageIds: string[]; errors: string[] }> {
  const messageIds: string[] = [];
  const errors: string[] = [];

  for (const evt of events) {
    const result = await publishToSoketi({
      application,
      channel: evt.channel,
      event: evt.event,
      data: evt.data,
      socket_id: evt.socket_id,
      source: "backend_api",
    });

    if (result.success) {
      messageIds.push(result.messageId);
    } else {
      errors.push(result.error ?? "Unknown error");
    }
  }

  return {
    success: errors.length === 0,
    messageIds,
    errors,
  };
}
