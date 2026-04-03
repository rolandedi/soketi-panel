import { z } from "zod";

export const updateSettingsScheme = z.record(
  z.string(),
  z.string().nullable().optional(),
);

export type UpdateSettingsScheme = z.infer<typeof updateSettingsScheme>;
