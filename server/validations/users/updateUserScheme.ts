import { z } from "zod";

export const updateUserScheme = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(255, "Name must be at most 255 characters long")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  role: z.enum(["user", "admin"], "Invalid role").optional(),
  banned: z.boolean().optional(),
  banReason: z.string().max(255).optional().nullable(),
  banExpires: z.string().optional().nullable(),
});

export type UpdateUserScheme = z.infer<typeof updateUserScheme>;
