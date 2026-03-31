import { z } from "zod";

export const changePasswordScheme = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters long")
      .max(255, "Current password must be at most 255 characters long"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(255, "Password must be at most 255 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password confirmation must be at least 8 characters long")
      .max(255, "Password confirmation must be at most 255 characters long"),
    revokeOtherSessions: z.boolean().optional(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordScheme = z.infer<typeof changePasswordScheme>;