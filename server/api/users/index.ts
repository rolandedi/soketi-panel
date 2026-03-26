import type { User } from "#shared/types";

export default defineEventHandler(async (event) => {
  const users: User[] = [
    {
      id: "1",
      name: "Admin",
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
      createdAt: "2022-01-01T00:00:00.000Z",
      updatedAt: "2022-01-01T00:00:00.000Z",
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
      createdAt: "2022-01-01T00:00:00.000Z",
      updatedAt: "2022-01-01T00:00:00.000Z",
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
      createdAt: "2022-01-01T00:00:00.000Z",
      updatedAt: "2022-01-01T00:00:00.000Z",
      role: "user",
      banned: false,
      banReason: null,
      banExpires: null,
    },
  ];

  return users;
});
