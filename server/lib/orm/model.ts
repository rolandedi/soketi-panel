import { useDB } from "./db";

export class Model {
  public static table: string;

  public static async all<T extends Model>(this: (new () => T) & typeof Model): Promise<T[]> {
    return this.query() as unknown as Promise<T[]>;
  }

  public static async find<T extends Model>(
    this: (new () => T) & typeof Model,
    id: number | string
  ): Promise<T | undefined> {
    return this.query().where({ id }).first() as unknown as Promise<T | undefined>;
  }

  public static async create<T extends Model>(
    this: (new () => T) & typeof Model,
    data: Partial<T>
  ) {
    return this.buildQuery().insert(data);
  }

  public static async update<T extends Model>(
    this: (new () => T) & typeof Model,
    id: number | string,
    data: Partial<T>
  ) {
    return this.buildQuery().update(data).where({ id });
  }

  public static async delete<T extends Model>(
    this: (new () => T) & typeof Model,
    id: number | string
  ) {
    return this.buildQuery().delete().where({ id });
  }

  public static query() {
    return this.buildQuery().select("*");
  }

  public static async paginate<T extends Model>(
    this: (new () => T) & typeof Model,
    page: number = 1,
    limit: number = 15
  ) {
    const offset = (page - 1) * limit;

    const [countResult] = await this.buildQuery().count("* as count");
    const total = Number(countResult.count || 0);
    const lastPage = Math.ceil(total / limit);

    const data = await this.query().limit(limit).offset(offset);

    return {
      data: data as T[],
      meta: {
        total,
        perPage: limit,
        currentPage: page,
        lastPage,
      },
    };
  }

  private static buildQuery() {
    if (!this.table) {
      throw new Error(`Table name is not defined on model ${this.name}`);
    }
    return useDB().from(this.table);
  }
}
