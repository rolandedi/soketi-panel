import { DashboardRepository } from "~~/server/repositories/dashboard.repository";
import { getSoketiMetrics } from "~~/server/services/soketi";
import { handleError } from "~~/server/lib/utils";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const repo = new DashboardRepository();
  const isAdmin = user.role === "admin";
  const userId = isAdmin ? undefined : user.id;

  try {
    const [appStats, messageStats, recentApps, soketiMetrics] =
      await Promise.all([
        repo.getAppStats(userId, isAdmin),
        repo.getMessageStats(),
        repo.getRecentApps(userId, isAdmin, 5),
        getSoketiMetrics(),
      ]);

    return {
      apps: appStats,
      messages: messageStats,
      connections: soketiMetrics.connectedSockets,
      serverStatus: soketiMetrics.serverStatus,
      recentApps,
    };
  } catch (error: any) {
    throw handleError(
      "dashboard.stats",
      error,
      "Failed to fetch dashboard stats",
    );
  }
});
