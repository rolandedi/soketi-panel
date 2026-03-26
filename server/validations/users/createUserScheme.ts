import { z } from "zod";

export const createUserScheme = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(255, "Name must be at most 255 characters long"),
  email: z.email("Invalid email address"),
  role: z.enum(["user", "admin"], "Invalid role"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(255, "Password must be at most 255 characters long"),
});

export type CreateUserScheme = z.infer<typeof createUserScheme>;
