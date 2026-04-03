import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const hasSource = await knex.schema.hasColumn("sktp_messages", "source");
  if (!hasSource) {
    await knex.schema.alterTable("sktp_messages", (table) => {
      table.string("source", 50).notNullable().defaultTo("backend_api");
      table.string("event_type", 100).nullable();
      table.string("socket_id", 255).nullable();
      table.string("user_id", 255).nullable();
      table.json("metadata").nullable();
      table.json("raw_payload").nullable();
      table.string("idempotency_key", 255).nullable();
      table.timestamp("received_at").nullable();
    });
  }

  await knex.schema.alterTable("sktp_messages", (table) => {
    table.index("source", "idx_messages_source");
    table.index("app_id", "idx_messages_app_id");
    table.index("created_at", "idx_messages_created_at");
    table.index("idempotency_key", "idx_messages_idempotency_key");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("sktp_messages", (table) => {
    table.dropIndex([], "idx_messages_source");
    table.dropIndex([], "idx_messages_app_id");
    table.dropIndex([], "idx_messages_created_at");
    table.dropIndex([], "idx_messages_idempotency_key");
    table.dropColumn("source");
    table.dropColumn("event_type");
    table.dropColumn("socket_id");
    table.dropColumn("user_id");
    table.dropColumn("metadata");
    table.dropColumn("raw_payload");
    table.dropColumn("idempotency_key");
    table.dropColumn("received_at");
  });
}
