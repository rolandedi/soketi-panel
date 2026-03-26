import knex, { Knex } from "knex";

const DB_DRIVER = process.env.DB_DRIVER || "mysql";

const config: Record<string, any> = {
  client: "",
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "soketi",
  database: process.env.DB_NAME || "soketi",
  password: process.env.DB_PASSWORD || "",
};

if (DB_DRIVER === "mysql") {
  config.client = "mysql2";
  config.port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
} else if (DB_DRIVER === "pg" || DB_DRIVER === "postgres") {
  config.client = "pg";
  config.port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;
} else {
  throw new Error("Invalid database driver");
}

let cachedDB: Knex | null = null;

export const useDB = <T extends {} = any>() => {
  if (!cachedDB) {
    cachedDB = knex({
      client: config.client,
      connection: {
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
      },
    });
  }

  return cachedDB as Knex<T, any[]>;
};
