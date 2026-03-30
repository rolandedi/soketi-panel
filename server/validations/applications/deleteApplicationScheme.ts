import { z } from "zod";

export const deleteApplicationScheme = z.object({
  ids: z
    .array(z.string().min(1))
    .min(1, "At least one application ID is required"),
});

export type DeleteApplicationScheme = z.infer<typeof deleteApplicationScheme>;
