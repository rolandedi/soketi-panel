import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("sktp_messages", (table) => {
    table.string("id").primary();
    table.string("app_id", 255).notNullable();
    table.string("channel", 255).notNullable();
    table.string("event", 255).notNullable();
    table.json("payload").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("sktp_messages");
}
