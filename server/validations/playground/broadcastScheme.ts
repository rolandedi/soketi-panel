import { z } from "zod";

export const broadcastScheme = z.object({
  app_id: z.string().min(1, "Application is required"),
  channel: z.string().min(1, "Channel name is required"),
  event: z.string().min(1, "Event name is required"),
  payload: z.string().min(1, "Payload is required"),
});
