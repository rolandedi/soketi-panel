import type {
  Application as ApplicationType,
  PaginatedResponse,
} from "#shared/types";
import { Application } from "../models/application";
import { useDB } from "../lib/orm/db";
import { toSQLDatetime, castRow } from "../lib/orm/utils";
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
  return castRow<ApplicationType>(row, Application.casts);
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

    const [countResult, enabledResult, disabledResult] = await Promise.all([
      query.clone().count<{ count: string | number }[]>("* as count"),
      query
        .clone()
        .where({ enabled: true })
        .count<{ count: string | number }[]>("* as count"),
      query
        .clone()
        .where({ enabled: false })
        .count<{ count: string | number }[]>("* as count"),
    ]);

    const total = Number(countResult[0]?.count || 0);
    const enabledTotal = Number(enabledResult[0]?.count || 0);
    const disabledTotal = Number(disabledResult[0]?.count || 0);
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
        enabledTotal,
        disabledTotal,
      },
    };
  }

  async getById(
    id: string,
    userId?: string | null,
  ): Promise<ApplicationType | undefined> {
    const query = useDB().from(Application.table).where({ id });

    if (userId !== undefined && userId !== null) {
      query.where({ user_id: userId });
    }

    const application = await query.first();

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

  async delete(ids: string | string[], userId: string | null) {
    const applicationIds = Array.isArray(ids) ? ids : [ids];
    const query = useDB()
      .from(Application.table)
      .whereIn("id", applicationIds);

    if (userId !== null) {
      query.where({ user_id: userId });
    }

    return await query.delete();
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
