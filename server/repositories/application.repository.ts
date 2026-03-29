import type {
  Application as ApplicationType,
  PaginatedResponse,
} from "#shared/types";
import { Application } from "../models/application";
import { useDB } from "../lib/orm/db";
import {
  generateAppId,
  generateAppKey,
  generateAppSecret,
} from "../services/crypto";

type ApplicationInput = {
  name?: string;
  max_connections?: number;
  enable_client_messages?: boolean;
  enabled?: boolean;
  max_backend_events_per_sec?: number;
  max_client_events_per_sec?: number;
  max_read_req_per_sec?: number;
  webhooks?: string | string[] | null;
  max_presence_members_per_channel?: number;
  max_presence_member_size_in_kb?: number;
  max_channel_name_length?: number;
  max_event_channels_at_once?: number;
  max_event_name_length?: number;
  max_event_payload_in_kb?: number;
  max_event_batch_size?: number;
  enable_user_authentication?: boolean;
};

const defaultApplicationValues = {
  max_connections: -1,
  enable_client_messages: true,
  enabled: true,
  max_backend_events_per_sec: -1,
  max_client_events_per_sec: -1,
  max_read_req_per_sec: -1,
  webhooks: null,
  max_presence_members_per_channel: 100,
  max_presence_member_size_in_kb: 10,
  max_channel_name_length: 100,
  max_event_channels_at_once: 100,
  max_event_name_length: 100,
  max_event_payload_in_kb: 100,
  max_event_batch_size: 10,
  enable_user_authentication: false,
} satisfies Omit<
  ApplicationType,
  "id" | "name" | "key" | "secret" | "created_at" | "updated_at" | "user_id"
>;

function toSQLDatetime(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

function serializeWebhooks(webhooks: ApplicationInput["webhooks"]) {
  if (webhooks === undefined) {
    return undefined;
  }

  if (webhooks === null) {
    return null;
  }

  return typeof webhooks === "string" ? webhooks : JSON.stringify(webhooks);
}

function castApplication(row: Record<string, any>): ApplicationType {
  const casted: Record<string, any> = { ...row };

  for (const [key, type] of Object.entries(Application.casts)) {
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

  return casted as ApplicationType;
}

export class ApplicationRepository {
  async getAll(
    userId: string | null,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<ApplicationType>> {
    const offset = (page - 1) * limit;
    const query = useDB().from(Application.table);
    if (userId !== null) {
      query.where({ user_id: userId });
    }

    const countResult = await query
      .clone()
      .count<{ count: string | number }[]>("* as count");
    const total = Number(countResult[0]?.count || 0);
    const lastPage = Math.ceil(total / limit);

    const data = await query
      .clone()
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);

    return {
      data: data.map((row) => castApplication(row)),
      meta: {
        total,
        perPage: limit,
        currentPage: page,
        lastPage,
      },
    };
  }

  async getById(
    id: string,
    userId: string,
  ): Promise<ApplicationType | undefined> {
    const application = await useDB()
      .from(Application.table)
      .where({ id, user_id: userId })
      .first();

    return application ? castApplication(application) : undefined;
  }

  async create(data: ApplicationInput, userId: string) {
    const applicationId = generateAppId();
    const application = {
      id: applicationId,
      key: generateAppKey(),
      secret: generateAppSecret(),
      name: data.name,
      user_id: userId,
      created_at: toSQLDatetime(new Date()),
      updated_at: null,
      ...defaultApplicationValues,
      ...data,
      webhooks: serializeWebhooks(data.webhooks),
    };

    await useDB().from(Application.table).insert(application);

    return await this.getById(applicationId, userId);
  }

  async update(id: string, userId: string, data: ApplicationInput) {
    const payload: Record<string, any> = {
      ...data,
      updated_at: toSQLDatetime(new Date()),
    };

    if (data.webhooks !== undefined) {
      payload.webhooks = serializeWebhooks(data.webhooks);
    }

    const updated = await useDB()
      .from(Application.table)
      .where({ id, user_id: userId })
      .update(payload);

    if (!updated) {
      return undefined;
    }

    return await this.getById(id, userId);
  }

  async delete(ids: string | string[], userId: string) {
    const applicationIds = Array.isArray(ids) ? ids : [ids];

    return await useDB()
      .from(Application.table)
      .where({ user_id: userId })
      .whereIn("id", applicationIds)
      .delete();
  }

  async regenerate(id: string, userId: string) {
    const payload = {
      key: generateAppKey(),
      secret: generateAppSecret(),
      updated_at: toSQLDatetime(new Date()),
    };

    const updated = await useDB()
      .from(Application.table)
      .where({ id, user_id: userId })
      .update(payload);

    if (!updated) {
      return undefined;
    }

    return await this.getById(id, userId);
  }
}
