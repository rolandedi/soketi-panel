import { z } from "zod";

export const banUserScheme = z.object({
  userId: z.string(),
  banned: z.boolean(),
  banReason: z.string().max(255).optional().nullable(),
  banExpires: z.string().optional().nullable(),
});

export type BanUserScheme = z.infer<typeof banUserScheme>;
