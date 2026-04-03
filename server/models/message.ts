import type { Message as MessageType } from "#shared/types";
import { Model } from "../lib/orm/model";

export class Message extends Model implements MessageType {
  public static override readonly table = "sktp_messages";

  public static override readonly casts = {
    payload: "json" as const,
    metadata: "json" as const,
    raw_payload: "json" as const,
  };

  public id!: string;
  public app_id!: string;
  public channel!: string;
  public event!: string;
  public payload!: unknown;
  public created_at!: string;
  public source!: string;
  public event_type!: string | null;
  public socket_id!: string | null;
  public user_id!: string | null;
  public metadata!: Record<string, unknown> | null;
  public raw_payload!: string | null;
  public idempotency_key!: string | null;
  public received_at!: string | null;
}
