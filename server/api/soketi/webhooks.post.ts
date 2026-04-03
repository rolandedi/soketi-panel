import { createHash } from "node:crypto";
import { MessageRepository } from "~~/server/repositories/message.repository";
import { ApplicationRepository } from "~~/server/repositories/application.repository";
import {
  soketiWebhookScheme,
  type SoketiWebhookEvent,
} from "~~/server/validations/soketi/webhookScheme";
import {
  handleError,
  createValidationError,
  validateWith,
} from "~~/server/lib/utils";
import { consola } from "consola";

function getWebhookSource(eventName: string): string {
  switch (eventName) {
    case "client_event":
      return "client_webhook";
    case "channel_occupied":
    case "channel_vacated":
      return "presence_webhook";
    case "member_added":
    case "member_removed":
      return "presence_webhook";
    default:
      return "soketi_webhook";
  }
}

function getEventType(eventName: string): string {
  switch (eventName) {
    case "client_event":
      return "client_event";
    case "channel_occupied":
      return "channel_occupied";
    case "channel_vacated":
      return "channel_vacated";
    case "member_added":
      return "member_added";
    case "member_removed":
      return "member_removed";
    default:
      return eventName;
  }
}

function generateIdempotencyKey(
  appId: string,
  evt: SoketiWebhookEvent,
): string {
  const dataStr = JSON.stringify(evt.data ?? "");
  return createHash("sha256")
    .update(`${appId}:${evt.channel}:${evt.name}:${dataStr}:${evt.time_ms ?? 0}`)
    .digest("hex")
    .slice(0, 32);
}

export default defineEventHandler(async (event) => {
  const { data, error } = await validateWith(event, "body", soketiWebhookScheme);

  if (error) {
    throw createValidationError(error);
  }

  const messageRepository = new MessageRepository();
  const applicationRepository = new ApplicationRepository();

  try {
    const results = [];

    for (const evt of data.events) {
      const source = getWebhookSource(evt.name);
      const eventType = getEventType(evt.name);

      const appId = evt.channel.split("-")[0] ?? "";

      const application = await applicationRepository.getById(appId);

      if (!application) {
        consola.warn(
          `[soketi.webhook] Application not found for channel: ${evt.channel}`,
        );
        continue;
      }

      const idempotencyKey = generateIdempotencyKey(application.id, evt);

      const existing =
        await messageRepository.findByIdempotencyKey(idempotencyKey);
      if (existing) {
        consola.debug(
          `[soketi.webhook] Duplicate webhook event skipped: ${idempotencyKey}`,
        );
        results.push({ skipped: true, idempotency_key: idempotencyKey });
        continue;
      }

      const message = await messageRepository.create({
        app_id: application.id,
        channel: evt.channel,
        event: evt.event ?? evt.name,
        payload: evt.data ?? null,
        source,
        event_type: eventType,
        socket_id: evt.socket_id ?? null,
        user_id: evt.user_id ?? null,
        metadata: evt.user_info
          ? { user_info: evt.user_info }
          : null,
        raw_payload: JSON.stringify(evt),
        idempotency_key: idempotencyKey,
        received_at: evt.time_ms ? new Date(evt.time_ms) : new Date(),
      });

      results.push({ stored: true, id: message.id });
    }

    return {
      received: data.events.length,
      stored: results.filter((r) => "stored" in r).length,
      skipped: results.filter((r) => "skipped" in r).length,
    };
  } catch (error: any) {
    throw handleError("soketi.webhooks.ingest", error, "Failed to ingest webhooks");
  }
});
