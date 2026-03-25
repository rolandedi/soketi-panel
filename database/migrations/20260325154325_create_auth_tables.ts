import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("sktp_users", (table) => {
    table.string("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.boolean("emailVerified").notNullable().defaultTo(false);
    table.string("image");
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("sktp_sessions", (table) => {
    table.string("id").primary();
    table.timestamp("expiresAt").notNullable();
    table.string("token").notNullable().unique();
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    table.string("ipAddress");
    table.string("userAgent");
    table
      .string("userId")
      .notNullable()
      .references("id")
      .inTable("sktp_users")
      .onDelete("CASCADE");
  });

  await knex.schema.createTable("sktp_accounts", (table) => {
    table.string("id").primary();
    table.string("accountId").notNullable();
    table.string("providerId").notNullable();
    table
      .string("userId")
      .notNullable()
      .references("id")
      .inTable("sktp_users")
      .onDelete("CASCADE");
    table.text("accessToken");
    table.text("refreshToken");
    table.timestamp("accessTokenExpiresAt");
    table.timestamp("refreshTokenExpiresAt");
    table.string("scope");
    table.text("idToken");
    table.text("password");
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("sktp_verifications", (table) => {
    table.string("id").primary();
    table.string("identifier").notNullable();
    table.string("value").notNullable();
    table.timestamp("expiresAt").notNullable();
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("sktp_verifications");
  await knex.schema.dropTableIfExists("sktp_accounts");
  await knex.schema.dropTableIfExists("sktp_sessions");
  await knex.schema.dropTableIfExists("sktp_users");
}
