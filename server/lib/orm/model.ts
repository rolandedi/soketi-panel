import { useDB } from "./db";

export class Model {
  public static readonly table: string;
  public static casts: Record<
    string,
    "boolean" | "number" | "string" | "json"
  > = {};

  public static CREATED_AT = "created_at";
  public static UPDATED_AT = "updated_at";

  public static async all<T extends Model>(
    this: (new () => T) & typeof Model,
  ): Promise<T[]> {
    const data = await this.query();
    return data.map((row: any) => this.cast(row)) as unknown as T[];
  }

  public static async find<T extends Model>(
    this: (new () => T) & typeof Model,
    id: number | string,
  ): Promise<T | undefined> {
    const row = await this.query().where({ id }).first();
    return row ? (this.cast(row) as unknown as T) : undefined;
  }

  public static async create<T extends Model>(
    this: (new () => T) & typeof Model,
    data: Partial<T>,
  ) {
    return this.buildQuery().insert(data);
  }

  public static async update<T extends Model>(
    this: (new () => T) & typeof Model,
    id: number | string,
    data: Partial<T>,
  ) {
    return this.buildQuery().update(data).where({ id });
  }

  public static async delete<T extends Model>(
    this: (new () => T) & typeof Model,
    id: number | string,
  ) {
    return this.buildQuery().delete().where({ id });
  }

  public static query() {
    return this.buildQuery().select("*");
  }

  public static async paginate<T extends Model>(
    this: (new () => T) & typeof Model,
    page: number = 1,
    limit: number = 15,
    orderBy?: { column: string; direction: "asc" | "desc" },
  ) {
    const offset = (page - 1) * limit;

    orderBy = orderBy || { column: this.CREATED_AT, direction: "desc" };

    const [countResult] = await this.buildQuery().count("* as count");
    const total = Number(countResult.count || 0);
    const lastPage = Math.ceil(total / limit);

    const data = await this.query()
      .orderBy(orderBy.column, orderBy.direction)
      .limit(limit)
      .offset(offset);

    return {
      data: data.map((row: any) => this.cast(row)) as T[],
      meta: {
        total,
        perPage: limit,
        currentPage: page,
        lastPage,
      },
    };
  }

  protected static cast(data: any) {
    const casted = { ...data };

    for (const [key, type] of Object.entries(this.casts)) {
      if (casted[key] === undefined || casted[key] === null) continue;

      if (type === "boolean") {
        casted[key] = Boolean(casted[key]);
      } else if (type === "number") {
        casted[key] = Number(casted[key]);
      } else if (type === "string") {
        casted[key] = String(casted[key]);
      } else if (type === "json") {
        try {
          casted[key] =
            typeof casted[key] === "string"
              ? JSON.parse(casted[key])
              : casted[key];
        } catch (e) {
          console.error(`Failed to parse JSON for key "${key}":`, e);
          casted[key] = null;
        }
      }
    }

    return casted;
  }

  private static buildQuery() {
    if (!this.table) {
      throw new Error(`Table name is not defined on model ${this.name}`);
    }
    return useDB().from(this.table);
  }
}
