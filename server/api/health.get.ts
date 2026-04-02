import { useDB } from "~~/server/lib/orm/db";
import { useRedis } from "~~/server/services/kv";

export default defineEventHandler(async (event) => {
  try {
    // Check database connection
    await useDB().raw("SELECT 1");

    // Check Redis connection
    await useRedis().ping();

    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    throw createError({
      statusCode: 503,
      statusMessage: "Service Unavailable",
      data: {
        database: "disconnected",
        redis: "disconnected",
        error: error.message,
      },
    });
  }
});
