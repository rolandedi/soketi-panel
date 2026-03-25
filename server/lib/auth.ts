import { betterAuth } from "better-auth";
import mysql from "mysql2/promise";

export const auth = betterAuth({
  appName: process.env.APP_NAME || "Soketi Panel",
  database: mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || process.env.DB_USERNAME || "soketi",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "soketi_db",
  }),
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
});
