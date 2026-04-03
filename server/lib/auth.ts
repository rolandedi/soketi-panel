import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { Pool } from "pg";
import mysql from "mysql2/promise";
import consola from "consola";

const {
  APP_NAME = "Soketi Panel",
  DB_DRIVER = "mysql",
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_NAME = "soketi",
  DB_USER = "soketi",
  DB_PASSWORD = "",
  BETTER_AUTH_URL,
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
  baseURL: BETTER_AUTH_URL,
  trustedOrigins: ["*"],
  database: createDbPool(),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: "sktp_users",
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
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
      maxAge: 60 * 60, // 1 hour cache
    },
  },
  plugins: [
    admin({
      defaultBanReason: "Admin choice",
      bannedUserMessage:
        "Your account has been banned. Please contact Admin for more information.",
    }),
  ],
  logger: {
    disabled: false,
    level: "error",
    log: (level, message, ...args) => {
      consola[level](message, ...args);
    },
  },
  onAPIError: {
    throw: true,
    onError: (error, _ctx) => {
      consola.error(error);
    },
  },
});

export const useAuth = () => {
  return auth.api;
};
