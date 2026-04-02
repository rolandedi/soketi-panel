import type { Knex } from "knex";
import { faker } from "@faker-js/faker";
import consola from "consola";

import { useAuth } from "../../server/lib/auth";

const FAKE_USERS_COUNT = 25;

function createRandomUser() {
  const isBanned = faker.datatype.boolean();

  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    image: faker.image.avatar(),
    role: "user" as const,
    banned: isBanned,
    banReason: isBanned ? faker.lorem.sentence() : null,
    banExpires: isBanned ? faker.date.future().toISOString() : null,
  };
}

export async function seed(_knex: Knex): Promise<void> {
  const auth = useAuth();

  const fixedUsers = [
    {
      name: "Admin User",
      email: "admin@email.com",
      image: null,
      role: "admin" as const,
      banned: false,
      banReason: null,
      banExpires: null,
    },
    {
      name: "John Doe",
      email: "john.doe@email.com",
      image: null,
      role: "user" as const,
      banned: false,
      banReason: null,
      banExpires: null,
    },
  ];

  const fakeUsers = faker.helpers.multiple(createRandomUser, {
    count: FAKE_USERS_COUNT,
  });

  const users = [...fixedUsers, ...fakeUsers];

  try {
    for (const user of users) {
      await auth.createUser({
        body: {
          email: user.email,
          password: "Password123",
          name: user.name,
          image: user.image ?? null,
          role: user.role,
        },
      });

      consola.info(`User ${user.email} created`);
    }

    consola.success(`${users.length} users created successfully`);
  } catch (error) {
    consola.error(error);
  }
}
