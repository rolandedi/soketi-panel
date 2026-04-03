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

  const runtimeConfig = useRuntimeConfig();

  try {
    const metrics = await getSoketiMetrics();

    return {
      soketi: {
        host: runtimeConfig.soketiHost,
        port: runtimeConfig.soketiPort,
      },
      metrics: {
        host: runtimeConfig.soketiMetricsHost,
        port: runtimeConfig.soketiMetricsPort,
      },
      pusher: {
        host: runtimeConfig.pusherHost,
        port: runtimeConfig.pusherPort,
        scheme: runtimeConfig.pusherScheme,
        tls: runtimeConfig.pusherTls === "1",
        cluster: runtimeConfig.pusherAppCluster || null,
      },
      redis: {
        url: runtimeConfig.redisUrl,
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
