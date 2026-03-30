import { z } from "zod";

export const deleteMessagesScheme = z.object({
  ids: z.array(z.string().min(1)).min(1, "At least one message ID is required"),
});

export type DeleteMessagesScheme = z.infer<typeof deleteMessagesScheme>;
