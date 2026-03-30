import type { Message as MessageType, PaginatedResponse } from "#shared/types";
import { randomUUID } from "node:crypto";
import { Application } from "../models/application";
import { Message } from "../models/message";
import { useDB } from "../lib/orm/db";

function castMessage(row: Record<string, any>): MessageType {
  const casted: Record<string, any> = { ...row };

  for (const [key, type] of Object.entries(Message.casts)) {
    if (casted[key] === undefined || casted[key] === null) {
      continue;
    }

    if (type === "boolean") {
      casted[key] = Boolean(casted[key]);
    } else if (type === "number") {
      casted[key] = Number(casted[key]);
    } else if (type === "string") {
      casted[key] = String(casted[key]);
    } else if (type === "json") {
      try {
        casted[key] =
          typeof casted[key] === "string"
            ? JSON.parse(casted[key])
            : casted[key];
      } catch {
        casted[key] = null;
      }
    }
  }

  return casted as MessageType;
}

function toSQLDatetime(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export class MessageRepository {
  async create(data: {
    app_id: string;
    channel: string;
    event: string;
    payload: unknown;
  }): Promise<MessageType> {
    const id = randomUUID();

    await useDB()
      .from(Message.table)
      .insert({
        id,
        app_id: data.app_id,
        channel: data.channel,
        event: data.event,
        payload: JSON.stringify(data.payload),
        created_at: toSQLDatetime(new Date()),
      });

    const message = await useDB().from(Message.table).where({ id }).first();

    if (!message) {
      throw new Error("Failed to create message");
    }

    return castMessage(message);
  }

  async getAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<MessageType>> {
    const offset = (page - 1) * limit;
    const query = useDB().from(Message.table);

    const [countResult] = await query
      .clone()
      .count<{ count: string | number }[]>("* as count");
    const total = Number(countResult?.count || 0);
    const lastPage = Math.ceil(total / limit);

    const data = await query
      .clone()
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);

    return {
      data: data.map((row) => castMessage(row)),
      meta: {
        total,
        perPage: limit,
        currentPage: page,
        lastPage,
      },
    };
  }

  async getById(id: string, userId?: string): Promise<MessageType | undefined> {
    const query = useDB().from(Message.table).where({ id });

    if (userId) {
      query.whereIn(
        "app_id",
        useDB().from(Application.table).select("id").where({ user_id: userId }),
      );
    }

    const message = await query.first();

    return message ? castMessage(message) : undefined;
  }

  async paginateByAppId(
    appId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<MessageType>> {
    const offset = (page - 1) * limit;
    const query = useDB().from(Message.table).where({ app_id: appId });

    const [countResult] = await query
      .clone()
      .count<{ count: string | number }[]>("* as count");
    const total = Number(countResult?.count || 0);
    const lastPage = Math.ceil(total / limit);

    const data = await query
      .clone()
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);

    return {
      data: data.map((row) => castMessage(row)),
      meta: {
        total,
        perPage: limit,
        currentPage: page,
        lastPage,
      },
    };
  }

  async deleteByIds(ids: string[], userId?: string) {
    const query = useDB().from(Message.table).whereIn("id", ids);

    if (userId) {
      query.whereIn(
        "app_id",
        useDB().from(Application.table).select("id").where({ user_id: userId }),
      );
    }

    return await query.delete();
  }
}
