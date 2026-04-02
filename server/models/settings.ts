import type { Setting as SettingType } from "#shared/types";
import { Model } from "../lib/orm/model";

export class Setting extends Model implements SettingType {
  public static override readonly table = "sktp_settings";

  public static readonly CREATED_AT = "created_at";
  public static readonly UPDATED_AT = "updated_at";

  public static override readonly casts = {
    value: "string" as const,
  };

  public key!: string;
  public value!: string | null;
  public created_at!: string;
  public updated_at!: string;
}
