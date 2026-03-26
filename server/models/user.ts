import { Model } from "../lib/orm/model";

export class User extends Model {
  public static table = "sktp_users";

  public id!: string;
  public name!: string;
  public email!: string;
  public emailVerified!: boolean;
  public image!: string | null;
  public role!: string;
  public banned!: boolean;
  public banReason!: string | null;
  public banExpires!: string | null;
  public createdAt!: string;
  public updatedAt!: string | null;
}
