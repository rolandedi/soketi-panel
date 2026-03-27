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

  async create(data: any) {
    // Le plugin admin expose ses propres méthodes sur auth.api
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
    // Pour mettre à jour un autre utilisateur en tant qu'admin, on utilise le plugin admin s'il est exposé
    // Sinon on peut utiliser le modèle directement ou les méthodes admin de l'API
    return await auth.api.updateUser({
      body: {
        userId: id,
        ...data,
      },
    });
  }

  async delete(id: string) {
    return await auth.api.removeUser({
      body: {
        userId: id,
      },
    });
  }

  async ban(
    id: string,
    banned: boolean,
    reason?: string | null,
    expires?: string | null,
  ) {
    if (banned) {
      return await auth.api.banUser({
        body: {
          userId: id,
          banReason: reason ?? undefined,
          // Better Auth attend banExpiresIn (ms) ou une date selon la version,
          // mais ici l'erreur TS disait banExpiresIn?: number
          banExpiresIn: expires
            ? new Date(expires).getTime() - Date.now()
            : undefined,
        },
      });
    } else {
      return await auth.api.unbanUser({
        body: {
          userId: id,
        },
      });
    }
  }
}
