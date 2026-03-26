import type { Message as MessageType } from "#shared/types";
import { Model } from "../lib/orm/model";

export class Message extends Model implements MessageType {
  public static table = "sktp_messages";
  public static casts = {
    payload: "json" as const,
  };

  public id!: string;
  public app_id!: string;
  public channel!: string;
  public event!: string;
  public payload!: string;
  public created_at!: string;
}
