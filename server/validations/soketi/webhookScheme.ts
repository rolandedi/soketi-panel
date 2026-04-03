import { z } from "zod";

const soketiWebhookEvent = z.object({
  name: z.string(),
  channel: z.string(),
  event: z.string().optional(),
  data: z.unknown().optional(),
  socket_id: z.string().optional(),
  user_id: z.string().optional(),
  user_info: z.unknown().optional(),
  time_ms: z.number().optional(),
});

export const soketiWebhookScheme = z.object({
  time_ms: z.number().optional(),
  events: z.array(soketiWebhookEvent).min(1, "At least one event is required"),
});

export type SoketiWebhookScheme = z.infer<typeof soketiWebhookScheme>;
export type SoketiWebhookEvent = z.infer<typeof soketiWebhookEvent>;
