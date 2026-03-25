import knex from "knex";

const databaseUrl = process.env.DATABASE_URL || "sqlite://./data.db";

const getDatabaseConnection = () => {
  if (databaseUrl.startsWith("sqlite://")) {
    return {
      client: "better-sqlite3",
      connection: {
        filename: databaseUrl.replace("sqlite://", ""),
      },
      useNullAsDefault: true,
    };
  }

  return {
    client: "pg", // fallback to postgres or any other DB if configured via connection string
    connection: databaseUrl,
  };
};

export const db = knex(getDatabaseConnection());
