import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("sktp_users", (table) => {
    table.dateTime("banExpires").nullable().defaultTo(null).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("sktp_users", (table) => {
    table.timestamp("banExpires").nullable().defaultTo(null).alter();
  });
}
