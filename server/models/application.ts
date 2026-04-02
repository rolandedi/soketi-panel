import type { Application as ApplicationType } from "#shared/types";
import { Model } from "../lib/orm/model";

export class Application extends Model implements ApplicationType {
  public static override readonly table = "sktp_applications";

  public static override readonly casts = {
    max_connections: "number" as const,
    enable_client_messages: "boolean" as const,
    enabled: "boolean" as const,
    max_backend_events_per_sec: "number" as const,
    max_client_events_per_sec: "number" as const,
    max_read_req_per_sec: "number" as const,
    webhooks: "json" as const,
    max_presence_members_per_channel: "number" as const,
    max_presence_member_size_in_kb: "number" as const,
    max_channel_name_length: "number" as const,
    max_event_channels_at_once: "number" as const,
    max_event_name_length: "number" as const,
    max_event_payload_in_kb: "number" as const,
    max_event_batch_size: "number" as const,
    enable_user_authentication: "boolean" as const,
  };

  public id!: string;
  public name!: string;
  public key!: string;
  public secret!: string;
  public max_connections!: number;
  public enable_client_messages!: boolean;
  public enabled!: boolean;
  public max_backend_events_per_sec!: number;
  public max_client_events_per_sec!: number;
  public max_read_req_per_sec!: number;
  public webhooks!: string | string[] | null;
  public max_presence_members_per_channel!: number;
  public max_presence_member_size_in_kb!: number;
  public max_channel_name_length!: number;
  public max_event_channels_at_once!: number;
  public max_event_name_length!: number;
  public max_event_payload_in_kb!: number;
  public max_event_batch_size!: number;
  public enable_user_authentication!: boolean;
  public created_at!: string;
  public updated_at!: string;
  public user_id!: string;
}
