import type { Application as ApplicationType } from "#shared/types";
import { Model } from "../lib/orm/model";

export class Application extends Model implements ApplicationType {
  public static table = "sktp_applications";

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
  public webhooks!: string;
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
