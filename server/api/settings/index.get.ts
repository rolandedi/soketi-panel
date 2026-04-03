import { SettingsRepository } from "~~/server/repositories/settings.repository";
import { handleError } from "~~/server/lib/utils";

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

  const settingsRepository = new SettingsRepository();

  try {
    return await settingsRepository.getAll();
  } catch (error: any) {
    throw handleError("settings.getAll", error, "Failed to fetch settings");
  }
});
