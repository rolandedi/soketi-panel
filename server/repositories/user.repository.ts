import { auth } from "../lib/auth";
import { User } from "../models/user";
import type { User as UserType } from "#shared/types";

export class UserRepository {
  async getAll(page: number = 1, limit: number = 10) {
    return await User.paginate(page, limit);
  }

  async getById(id: string): Promise<UserType | undefined> {
    const user = await User.find(id);
    return user as unknown as UserType | undefined;
  }

  async create(data: any, headers?: Headers) {
    // Le plugin admin expose ses propres méthodes sur auth.api
    const res = await auth.api.createUser({
      headers,
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role || "user",
      },
    });

    return res;
  }

  async update(id: string, data: any, headers?: Headers) {
    return await auth.api.updateUser({
      headers,
      body: {
        userId: id,
        ...data,
      },
    });
  }

  async updateAdmin(id: string, data: any, headers?: Headers) {
    return await auth.api.adminUpdateUser({
      headers,
      body: {
        userId: id,
        data,
      },
    });
  }

  async delete(id: string, headers?: Headers) {
    return await auth.api.removeUser({
      headers,
      body: {
        userId: id,
      },
    });
  }

  async ban(
    id: string,
    reason?: string | null,
    expires?: string | null,
    headers?: Headers,
  ) {
    return await auth.api.banUser({
      headers,
      body: {
        userId: id,
        banReason: reason ?? undefined,
        banExpiresIn: expires
          ? new Date(expires).getTime() - Date.now()
          : undefined,
      },
    });
  }

  async unban(id: string, headers?: Headers) {
    return await auth.api.unbanUser({
      headers,
      body: {
        userId: id,
      },
    });
  }
}
