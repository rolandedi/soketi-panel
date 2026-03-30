import type { Knex } from "knex";
import { randomBytes } from "node:crypto";
import consola from "consola";

function generateId(): string {
  return randomBytes(16).toString("hex");
}

function toSQLDatetime(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

const channels = [
  "private-orders",
  "private-chat",
  "presence-team",
  "public-feed",
  "private-notifications",
  "presence-room-1",
  "public-activity",
  "private-support",
  "presence-project-alpha",
  "public-metrics",
];

const events = [
  "order.created",
  "order.updated",
  "message.sent",
  "user.joined",
  "user.left",
  "notification.pushed",
  "project.updated",
  "invoice.paid",
  "ticket.created",
  "presence.synced",
];

const payloadVariants = [
  (index: number, channel: string, event: string) => ({
    id: index,
    channel,
    event,
    actor: {
      id: `user-${(index % 12) + 1}`,
      name: ["Alex", "Sam", "Nina", "Maya", "Omar", "Lina"][index % 6],
    },
    metadata: {
      source: ["web", "mobile", "api"][index % 3],
      region: ["eu-west-1", "us-east-1", "ap-southeast-1"][index % 3],
    },
  }),
  (index: number, channel: string, event: string) => ({
    id: index,
    channel,
    event,
    text: `Message ${index} for ${channel}`,
    unread: index % 2 === 0,
    tags: ["realtime", "demo", ["high", "medium", "low"][index % 3]],
  }),
  (index: number, channel: string, event: string) => ({
    id: index,
    channel,
    event,
    snapshot: {
      status: ["queued", "delivered", "failed"][index % 3],
      attempts: (index % 4) + 1,
      latency_ms: 45 + (index % 8) * 13,
    },
  }),
];

export async function seed(knex: Knex): Promise<void> {
  consola.info("Seeding fake messages...");

  try {
    const applications = await knex("sktp_applications")
      .select("id")
      .orderBy("created_at", "asc")
      .limit(25);

    if (!applications.length) {
      consola.warn(
        "No applications found in sktp_applications. Run application seeds first. Skipping.",
      );
      return;
    }

    await knex("sktp_messages").del();

    const now = Date.now();
    const messages = Array.from({ length: 250 }, (_, index) => {
      const application = applications[index % applications.length];
      const channel = channels[index % channels.length];
      const event = events[index % events.length];
      const payloadFactory = payloadVariants[index % payloadVariants.length];
      const createdAt = new Date(
        now - Math.floor(Math.random() * 30) * 60 * 60 * 1000 - index * 30000,
      );

      return {
        id: generateId(),
        app_id: application.id,
        channel,
        event,
        payload: payloadFactory(index + 1, channel, event),
        created_at: toSQLDatetime(createdAt),
      };
    });

    await knex("sktp_messages").insert(messages);
    consola.success(`${messages.length} messages created successfully`);
  } catch (error) {
    consola.error("Failed to seed messages:", error);
  }
}
