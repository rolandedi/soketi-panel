import { SettingsRepository } from "~~/server/repositories/settings.repository";
import {
  createValidationError,
  handleError,
  validateWith,
} from "~~/server/lib/utils";
import { updateSettingsScheme } from "~~/server/validations/settings/updateSettingsScheme";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  if (user.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  const { data, error } = await validateWith(
    event,
    "body",
    updateSettingsScheme,
  );

  if (error) {
    throw createValidationError(error);
  }

  const settingsRepository = new SettingsRepository();

  try {
    await settingsRepository.upsertMany(data as Record<string, string | null>);
    return await settingsRepository.getAll();
  } catch (error: any) {
    throw handleError("settings.update", error, "Failed to update settings");
  }
});
