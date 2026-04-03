import consola from "consola";
import type { Knex } from "knex";

const DEFAULT_SETTINGS: Array<{ key: string; value: string }> = [
  { key: "default_app_max_connections", value: "-1" },
  { key: "default_app_max_backend_events_per_sec", value: "-1" },
  { key: "default_app_max_client_events_per_sec", value: "-1" },
  { key: "default_app_max_read_req_per_sec", value: "-1" },
  { key: "default_app_max_presence_members_per_channel", value: "100" },
  { key: "default_app_max_presence_member_size_in_kb", value: "10" },
  { key: "default_app_max_channel_name_length", value: "100" },
  { key: "default_app_max_event_channels_at_once", value: "100" },
  { key: "default_app_max_event_name_length", value: "100" },
  { key: "default_app_max_event_payload_in_kb", value: "100" },
  { key: "default_app_max_event_batch_size", value: "10" },
  { key: "default_app_enable_client_messages", value: "true" },
  { key: "default_app_enable_user_authentication", value: "false" },
];

export async function seed(knex: Knex): Promise<void> {
  consola.info("Creating default settings...");

  const now = new Date().toISOString().slice(0, 19).replace("T", " ");

  for (const setting of DEFAULT_SETTINGS) {
    const existing = await knex("sktp_settings")
      .where({ key: setting.key })
      .first();

    if (existing) {
      consola.info(`Setting "${setting.key}" already exists. Skipping.`);
      continue;
    }

    await knex("sktp_settings").insert({
      key: setting.key,
      value: setting.value,
      created_at: now,
      updated_at: now,
    });

    consola.info(`Setting "${setting.key}" = "${setting.value}" created.`);
  }

  consola.success("Default settings created successfully.");
}
