import { z } from "zod";

export const pusherEventScheme = z.object({
  channel: z.string().min(1, "Channel name is required"),
  event: z.string().min(1, "Event name is required"),
  data: z.string().min(1, "Data payload is required"),
  socket_id: z.string().optional(),
});

export type PusherEventScheme = z.infer<typeof pusherEventScheme>;
