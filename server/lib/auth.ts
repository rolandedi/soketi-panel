import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import mysql from "mysql2/promise";
import { Pool } from "pg";

const {
  APP_NAME = "Soketi Panel",
  DB_DRIVER = "mysql",
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_USER = "soketi",
  DB_PASSWORD = "",
  DB_NAME = "soketi_db",
} = process.env;

function createDbPool() {
  if (DB_DRIVER === "mysql") {
    return mysql.createPool({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });
  } else if (DB_DRIVER === "pg" || DB_DRIVER === "postgres") {
    return new Pool({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });
  }

  throw new Error(`Unsupported database driver: ${DB_DRIVER}`);
}

export const auth = betterAuth({
  appName: APP_NAME,
  database: createDbPool(),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: "sktp_users",
  },
  account: {
    modelName: "sktp_accounts",
  },
  verification: {
    modelName: "sktp_verifications",
  },
  session: {
    modelName: "sktp_sessions",
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minute cache
    },
  },
  plugins: [
    admin({
      defaultBanReason: "Admin choice",
      bannedUserMessage:
        "Your account has been banned. Please contact Admin for more information.",
    }),
  ],
});

export const useAuth = () => {
  return auth.api;
};
