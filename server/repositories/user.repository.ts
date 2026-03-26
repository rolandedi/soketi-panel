import { Users } from "../models/user";

export class UserRepository {
  async getAll() {
    return await Users().select("*");
  }

  async getById(id: string) {
    return await Users().where({ id }).first();
  }

  async create(data: any) {
    return await Users().insert(data);
  }

  async update(id: string, data: any) {
    return await Users().where({ id }).update(data);
  }

  async delete(id: string) {
    return await Users().where({ id }).delete();
  }
}
