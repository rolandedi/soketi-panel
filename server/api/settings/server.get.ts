import { getSoketiMetrics } from "~~/server/services/soketi";
import { handleError } from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  try {
    const metrics = await getSoketiMetrics();

    return {
      soketi: {
        host: process.env.SOKETI_HOST || "127.0.0.1",
        port: process.env.SOKETI_PORT || 6001,
      },
      metrics: {
        host: process.env.SOKETI_METRICS_HOST || "127.0.0.1",
        port: process.env.SOKETI_METRICS_PORT || 9601,
      },
      pusher: {
        host: process.env.PUSHER_HOST || "127.0.0.1",
        port: process.env.PUSHER_PORT || 6001,
        scheme: process.env.PUSHER_SCHEME || "http",
        tls: process.env.PUSHER_TLS === "1",
        cluster: process.env.PUSHER_APP_CLUSTER || "mt1",
      },
      redis: {
        url: process.env.REDIS_URL || "redis://localhost:6379",
      },
      status: {
        connectedSockets: metrics.connectedSockets,
        serverStatus: metrics.serverStatus,
      },
    };
  } catch (error: any) {
    throw handleError(
      "settings.server",
      error,
      "Failed to fetch server information",
    );
  }
});
