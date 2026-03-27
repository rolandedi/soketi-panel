import type { Knex } from "knex";
import consola from "consola";
import { useAuth } from "../../server/lib/auth";
import { User } from "../../shared/types";

export async function seed(knex: Knex): Promise<void> {
  const auth = useAuth();

  const users: User[] = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@email.com",
      emailVerified: true,
      image: null,
      createdAt: "2022-01-01T00:00:00.000Z",
      updatedAt: "2022-01-01T00:00:00.000Z",
      role: "admin",
      banned: false,
      banReason: null,
      banExpires: null,
    },
    {
      id: "2",
      name: "Roland Edi",
      email: "roland@email.com",
      emailVerified: true,
      image: null,
      role: "user",
      banned: false,
      banReason: null,
      banExpires: null,
    },
    {
      id: "3",
      name: "John Doe",
      email: "john@example.com",
      emailVerified: true,
      image: null,
      role: "user",
      banned: true,
      banReason: "Spamming",
      banExpires: "2022-01-01T00:00:00.000Z",
    },
    {
      id: "4",
      name: "Jane Smith",
      email: "jane@example.com",
      emailVerified: false,
      image: null,
      role: "user",
      banned: false,
      banReason: null,
      banExpires: null,
    },
  ];

  try {
    for (const user of users) {
      await auth.createUser({
        body: {
          email: user.email,
          password: "Password123",
          name: user.name,
          image: user.image,
          role: user.role,
        },
      });

      consola.info(`User ${user.email} created successfully`);
    }

    consola.success(`Users created successfully`);
  } catch (error) {
    consola.error(error);
  }
}
