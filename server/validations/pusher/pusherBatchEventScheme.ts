import { z } from "zod";

export const pusherBatchEventScheme = z.object({
  batch: z.array(
    z.object({
      channel: z.string().min(1, "Channel name is required"),
      event: z.string().min(1, "Event name is required"),
      data: z.string().min(1, "Data payload is required"),
      socket_id: z.string().optional(),
    }),
  ),
});

export type PusherBatchEventScheme = z.infer<typeof pusherBatchEventScheme>;
