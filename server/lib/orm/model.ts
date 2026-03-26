import { useDB } from "./db";

export class Model {
  public static table: string;

  async all() {
    return (this.constructor as typeof Model).buildQuery().select("*");
  }

  async find(id: number | string) {
    return (this.constructor as typeof Model)
      .buildQuery()
      .where({ id })
      .first();
  }

  async create(data: any) {
    return (this.constructor as typeof Model).buildQuery().insert(data);
  }

  async update(id: number | string, data: any) {
    return (this.constructor as typeof Model)
      .buildQuery()
      .update(data)
      .where({ id });
  }

  async delete(id: number | string) {
    return (this.constructor as typeof Model)
      .buildQuery()
      .delete()
      .where({ id });
  }

  public static query() {
    return (this as any).buildQuery().select("*");
  }

  private static buildQuery() {
    return useDB().from((this as any).table);
  }
}
