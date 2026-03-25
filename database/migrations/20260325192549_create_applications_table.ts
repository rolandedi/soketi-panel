import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("soketi_applications", (table) => {
    table.string("id", 255).primary();
    table.string("key", 255).notNullable();
    table.string("secret", 255).notNullable();
    table.integer("max_connections").notNullable();
    table.boolean("enable_client_messages").notNullable();
    table.boolean("enabled").notNullable();
    table.integer("max_backend_events_per_sec").notNullable();
    table.integer("max_client_events_per_sec").notNullable();
    table.integer("max_read_req_per_sec").notNullable();
    table.json("webhooks").nullable();
    table.boolean("max_presence_members_per_channel").nullable();
    table.boolean("max_presence_member_size_in_kb").nullable();
    table.boolean("max_channel_name_length").nullable();
    table.boolean("max_event_channels_at_once").nullable();
    table.boolean("max_event_name_length").nullable();
    table.boolean("max_event_payload_in_kb").nullable();
    table.boolean("max_event_batch_size").nullable();
    table.boolean("enable_user_authentication").notNullable();

    // Additional fields for Soketi Panel
    table.string("name", 255).notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable().defaultTo(null);
    table
      .string("user_id", 255)
      .notNullable()
      .references("id")
      .inTable("sktp_users")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("soketi_applications");
}
