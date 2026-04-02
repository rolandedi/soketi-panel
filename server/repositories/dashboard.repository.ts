import { useDB } from "../lib/orm/db";
import { Application } from "../models/application";
import { Message } from "../models/message";

export interface AppStats {
  total: number;
  enabled: number;
  disabled: number;
}

export interface MessageStats {
  total: number;
  today: number;
  yesterday: number;
  trendPercent: number | null;
}

export interface RecentApp {
  id: string;
  name: string;
  enabled: boolean;
}

function toSQLDateStart(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 19).replace("T", " ");
}

function toSQLDateEnd(date: Date): string {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.toISOString().slice(0, 19).replace("T", " ");
}

export class DashboardRepository {
  async getAppStats(userId?: string, isAdmin = false): Promise<AppStats> {
    const db = useDB();
    const query = db(Application.table);
    if (!isAdmin && userId) {
      query.where("user_id", userId);
    }

    const rows = await query.select(
      db.raw("COUNT(*) as total"),
      db.raw("SUM(CASE WHEN enabled = 1 THEN 1 ELSE 0 END) as enabled"),
    );

    const total = Number(rows[0]?.total ?? 0);
    const enabled = Number(rows[0]?.enabled ?? 0);

    return { total, enabled, disabled: total - enabled };
  }

  async getMessageStats(
    userId?: string,
    isAdmin = false,
  ): Promise<MessageStats> {
    const db = useDB();
    const now = new Date();

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    function baseQuery() {
      const q = db(Message.table).join(
        Application.table,
        `${Application.table}.id`,
        `${Message.table}.app_id`,
      );
      if (!isAdmin && userId) {
        q.where(`${Application.table}.user_id`, userId);
      }
      return q;
    }

    const [totalRow, todayRow, yesterdayRow] = await Promise.all([
      baseQuery().count("* as count").first(),
      baseQuery()
        .count("* as count")
        .where(`${Message.table}.created_at`, ">=", toSQLDateStart(now))
        .where(`${Message.table}.created_at`, "<=", toSQLDateEnd(now))
        .first(),
      baseQuery()
        .count("* as count")
        .where(`${Message.table}.created_at`, ">=", toSQLDateStart(yesterday))
        .where(`${Message.table}.created_at`, "<=", toSQLDateEnd(yesterday))
        .first(),
    ]);

    const total = Number(totalRow?.count ?? 0);
    const today = Number(todayRow?.count ?? 0);
    const yesterdayCount = Number(yesterdayRow?.count ?? 0);

    let trendPercent: number | null = null;
    if (yesterdayCount > 0) {
      trendPercent = Math.round(
        ((today - yesterdayCount) / yesterdayCount) * 100,
      );
    } else if (today > 0) {
      trendPercent = 100;
    }

    return { total, today, yesterday: yesterdayCount, trendPercent };
  }

  async getRecentApps(
    userId?: string,
    isAdmin = false,
    limit = 5,
  ): Promise<RecentApp[]> {
    const db = useDB();
    const query = db(Application.table)
      .select("id", "name", "enabled")
      .orderBy("created_at", "desc")
      .limit(limit);

    if (!isAdmin && userId) {
      query.where("user_id", userId);
    }

    const rows = await query;
    return rows.map((r) => ({
      id: String(r.id),
      name: String(r.name),
      enabled: Boolean(r.enabled),
    }));
  }
}
