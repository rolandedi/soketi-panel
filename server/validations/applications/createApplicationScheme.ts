import { z } from "zod";

const applicationConfigScheme = {
  max_connections: z.coerce.number().int().optional(),
  enable_client_messages: z.boolean().optional(),
  enabled: z.boolean().optional(),
  max_backend_events_per_sec: z.coerce.number().int().optional(),
  max_client_events_per_sec: z.coerce.number().int().optional(),
  max_read_req_per_sec: z.coerce.number().int().optional(),
  webhooks: z
    .union([z.string().min(1), z.array(z.string().min(1))])
    .nullable()
    .optional(),
  max_presence_members_per_channel: z.coerce.number().int().optional(),
  max_presence_member_size_in_kb: z.coerce.number().int().optional(),
  max_channel_name_length: z.coerce.number().int().optional(),
  max_event_channels_at_once: z.coerce.number().int().optional(),
  max_event_name_length: z.coerce.number().int().optional(),
  max_event_payload_in_kb: z.coerce.number().int().optional(),
  max_event_batch_size: z.coerce.number().int().optional(),
  enable_user_authentication: z.boolean().optional(),
};

export const createApplicationScheme = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(255, "Name must be at most 255 characters long"),
  ...applicationConfigScheme,
});

export type CreateApplicationScheme = z.infer<typeof createApplicationScheme>;
