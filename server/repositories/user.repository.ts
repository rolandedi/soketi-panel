import { auth } from "../lib/auth";
import { User } from "../models/user";
import type { User as UserType } from "#shared/types";

export class UserRepository {
  async getAll(page: number = 1, limit: number = 10) {
    // Utiliser le modèle personnalisé pour la pagination car Better Auth ne propose pas de pagination native simple pour sktp_users
    return await User.paginate(page, limit);
  }

  async getById(id: string): Promise<UserType | undefined> {
    const user = await User.find(id);
    return user as unknown as UserType | undefined;
  }

  async create(data: any) {
    // L'API de Better Auth attend un objet body avec les paramètres
    const res = await auth.api.createUser({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role || "user",
      },
    });

    return res;
  }

  async update(id: string, data: any) {
    return await auth.api.updateUser({
      body: {
        userId: id,
        ...data,
      },
    });
  }

  async delete(id: string) {
    return await auth.api.deleteUser({
      body: {
        userId: id,
      },
    });
  }

  async ban(id: string, banned: boolean, reason?: string | null, expires?: string | null) {
    return await auth.api.banUser({
      body: {
        userId: id,
        banned,
        banReason: reason ?? undefined,
        banExpires: expires ?? undefined,
      },
    });
  }
}
