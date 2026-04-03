import { auth } from "../lib/auth";
import { User } from "../models/user";
import type { User as UserType } from "#shared/types";

export class UserRepository {
  async getAll(page: number = 1, limit: number = 10, excludeId?: string) {
    if (!excludeId) {
      return await User.paginate(page, limit);
    }

    const offset = (page - 1) * limit;
    const orderBy = { column: User.CREATED_AT, direction: "desc" as const };

    const [countResult] = await (User as any)
      .buildQuery()
      .whereNot({ id: excludeId })
      .count("* as count");
    const total = Number(countResult.count || 0);
    const lastPage = Math.ceil(total / limit);

    const rows = await (User as any)
      .buildQuery()
      .select("*")
      .whereNot({ id: excludeId })
      .orderBy(orderBy.column, orderBy.direction)
      .limit(limit)
      .offset(offset);

    return {
      data: rows.map((row: any) => (User as any).cast(row)),
      meta: { total, perPage: limit, currentPage: page, lastPage },
    };
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

  async delete(ids: string | string[], headers?: Headers) {
    const deleteds = [];

    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    for (const userId of ids) {
      const res = await auth.api.removeUser({
        headers,
        body: { userId },
      });

      deleteds.push(res);
    }

    return deleteds;
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
          ? Math.floor((new Date(expires).getTime() - Date.now()) / 1000)
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
