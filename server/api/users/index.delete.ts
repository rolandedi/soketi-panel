import { z } from "zod";
import { UserRepository } from "~~/server/repositories/user.repository";
import {
  validateWith,
  createValidationError,
  handleError,
} from "~~/server/lib/utils";

const bodySchema = z.object({
  ids: z.array(z.string()).min(1, "ids must be a non-empty array of user ids"),
});

export default defineEventHandler(async (event) => {
  const { data, error } = await validateWith(event, "body", bodySchema);

  if (error) {
    throw createValidationError(error as any);
  }

  const userRepository = new UserRepository();

  try {
    return await userRepository.delete(data.ids, event.headers);
  } catch (err: any) {
    throw handleError("users.delete", err, "Failed to delete users");
  }
});
