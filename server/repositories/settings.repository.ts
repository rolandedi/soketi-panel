import type { Setting as SettingType } from "#shared/types";
import { Setting } from "../models/settings";
import { useDB } from "../lib/orm/db";

export const DEFAULT_SETTINGS: Record<string, string> = {
  default_app_max_connections: "-1",
  default_app_max_backend_events_per_sec: "-1",
  default_app_max_client_events_per_sec: "-1",
  default_app_max_read_req_per_sec: "-1",
  default_app_max_presence_members_per_channel: "100",
  default_app_max_presence_member_size_in_kb: "10",
  default_app_max_channel_name_length: "100",
  default_app_max_event_channels_at_once: "100",
  default_app_max_event_name_length: "100",
  default_app_max_event_payload_in_kb: "100",
  default_app_max_event_batch_size: "10",
  default_app_enable_client_messages: "true",
  default_app_enable_user_authentication: "false",
};

export class SettingsRepository {
  async getAll(): Promise<Record<string, string | null>> {
    const rows = await useDB()<SettingType>(Setting.table).select("*");
    const result: Record<string, string | null> = { ...DEFAULT_SETTINGS };
    for (const row of rows) {
      result[row.key] = row.value;
    }
    return result;
  }

  async getByKey(key: string): Promise<string | null> {
    const row = await useDB()<SettingType>(Setting.table)
      .where({ key })
      .first();
    if (!row) return DEFAULT_SETTINGS[key] ?? null;
    return row.value;
  }

  async upsert(key: string, value: string | null): Promise<void> {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    await useDB()<SettingType>(Setting.table)
      .insert({ key, value, created_at: now, updated_at: now })
      .onConflict("key")
      .merge({ value, updated_at: now });
  }

  async upsertMany(settings: Record<string, string | null>): Promise<void> {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const rows = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      created_at: now,
      updated_at: now,
    }));

    for (const row of rows) {
      await useDB()<SettingType>(Setting.table)
        .insert(row)
        .onConflict("key")
        .merge({ value: row.value, updated_at: now });
    }
  }
}
