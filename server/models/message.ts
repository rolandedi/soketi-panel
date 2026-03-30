import type { Message as MessageType } from "#shared/types";
import { Model } from "../lib/orm/model";

export class Message extends Model implements MessageType {
  public static override readonly table = "sktp_messages";

  public static override readonly casts = {
    payload: "json" as const,
  };

  public id!: string;
  public app_id!: string;
  public channel!: string;
  public event!: string;
  public payload!: unknown;
  public created_at!: string;
}
