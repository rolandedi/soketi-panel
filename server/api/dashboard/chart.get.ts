import { getSoketiMetrics } from "~~/server/services/soketi";
import { kvGet, kvSet } from "~~/server/services/kv";
import { handleError } from "~~/server/lib/utils";

const KEY_PREFIX = "dashboard:connections:";
/** Days of history to return */
const HISTORY_DAYS = 30;
/** TTL: 35 days so data is retained beyond the 30-day window */
const TTL_SECONDS = 35 * 24 * 60 * 60;

function todayKey(): string {
  return KEY_PREFIX + new Date().toISOString().slice(0, 10);
}

function dateKey(date: Date): string {
  return KEY_PREFIX + date.toISOString().slice(0, 10);
}

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  try {
    // Opportunistic snapshot: fetch current connections and store in Redis
    const { connectedSockets } = await getSoketiMetrics();
    if (connectedSockets !== null) {
      const existing = await kvGet(todayKey());
      // Keep the highest value seen today
      const prev = existing === null ? 0 : Number(existing);
      const value = Math.max(prev, connectedSockets);
      await kvSet(todayKey(), String(value), TTL_SECONDS);
    }

    // Build the last 30 days
    const entries: { date: string; connections: number }[] = [];
    for (let i = HISTORY_DAYS - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dateKey(d);
      const dateLabel = key.replace(KEY_PREFIX, "");
      const raw = await kvGet(key);
      entries.push({
        date: dateLabel,
        connections: raw === null ? 0 : Number(raw),
      });
    }

    return { data: entries };
  } catch (error: any) {
    throw handleError("dashboard.chart", error, "Failed to fetch chart data");
  }
});
