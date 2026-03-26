import knex, { Knex } from "knex";

let cachedDB: Knex | null = null;

export const useDB = <T extends {} = any>() => {
  if (!cachedDB) {
    const DB_URL = process.env.DATABASE_URL;
    const DB_DRIVER = process.env.DB_DRIVER || "mysql";
    
    const config: Knex.Config = {
      client: DB_DRIVER === "pg" || DB_DRIVER === "postgres" ? "pg" : "mysql2",
    };

    if (DB_URL) {
      config.connection = DB_URL;
    } else {
      let defaultPort = 3306;
      if (DB_DRIVER === "pg" || DB_DRIVER === "postgres") {
        defaultPort = 5432;
      }

      config.connection = {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : defaultPort,
        user: process.env.DB_USER || "soketi",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "soketi",
      };
    }

    cachedDB = knex(config);
  }

  return cachedDB as Knex<T, any[]>;
};
