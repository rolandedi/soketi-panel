import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("sktp_users", (table) => {
    table.string("role").notNullable().defaultTo("user");
    table.boolean("banned").notNullable().defaultTo(false);
    table.string("banReason").nullable().defaultTo(null);
    table.timestamp("banExpires").nullable().defaultTo(null);
  });
  await knex.schema.alterTable("sktp_sessions", (table) => {
    table.string("impersonatedBy").nullable().defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("sktp_users", (table) => {
    table.dropColumn("role");
    table.dropColumn("banned");
    table.dropColumn("banReason");
    table.dropColumn("banExpires");
  });
  await knex.schema.alterTable("sktp_sessions", (table) => {
    table.dropColumn("impersonatedBy");
  });
}
