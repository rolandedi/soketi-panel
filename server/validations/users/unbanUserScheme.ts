import { z } from "zod";

export const unbanUserScheme = z.object({
  userId: z.string(),
});

export type UnbanUserScheme = z.infer<typeof unbanUserScheme>;
