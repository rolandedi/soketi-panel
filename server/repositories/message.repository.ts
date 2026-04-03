import type { Message as MessageType, PaginatedResponse } from "#shared/types";
import { randomUUID } from "node:crypto";
import { Application } from "../models/application";
import { Message } from "../models/message";
import { useDB } from "../lib/orm/db";
import { toSQLDatetime, castRow } from "../lib/orm/utils";

function castMessage(row: Record<string, any>): MessageType {
  return castRow<MessageType>(row, Message.casts);
}

export class MessageRepository {
  async create(data: {
    app_id: string;
    channel: string;
    event: string;
    payload: unknown;
    source?: string;
    event_type?: string | null;
    socket_id?: string | null;
    user_id?: string | null;
    metadata?: Record<string, unknown> | null;
    raw_payload?: string | null;
    idempotency_key?: string | null;
    received_at?: Date | null;
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
        source: data.source ?? "backend_api",
        event_type: data.event_type ?? null,
        socket_id: data.socket_id ?? null,
        user_id: data.user_id ?? null,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        raw_payload: data.raw_payload ?? null,
        idempotency_key: data.idempotency_key ?? null,
        received_at: data.received_at
          ? toSQLDatetime(data.received_at)
          : toSQLDatetime(new Date()),
        created_at: toSQLDatetime(new Date()),
      });

    const message = await useDB().from(Message.table).where({ id }).first();

    if (!message) {
      throw new Error("Failed to create message");
    }

    return castMessage(message);
  }

  async findByIdempotencyKey(
    idempotencyKey: string,
  ): Promise<MessageType | undefined> {
    const message = await useDB()
      .from(Message.table)
      .where({ idempotency_key: idempotencyKey })
      .first();

    return message ? castMessage(message) : undefined;
  }

  async getAll(
    page: number = 1,
    limit: number = 10,
    userId?: string,
  ): Promise<PaginatedResponse<MessageType>> {
    const offset = (page - 1) * limit;
    const query = useDB().from(Message.table);

    if (userId) {
      query.whereIn(
        "app_id",
        useDB().from(Application.table).select("id").where({ user_id: userId }),
      );
    }

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
