import { useDB } from "~~/server/lib/orm/db";

export default defineEventHandler(async (event) => {
  try {
    // Check database connection
    await useDB().raw("SELECT 1");

    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
      },
    };
  } catch (error: any) {
    throw createError({
      statusCode: 503,
      statusMessage: "Service Unavailable",
      data: {
        database: "disconnected",
        error: error.message,
      },
    });
  }
});
