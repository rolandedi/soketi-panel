import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

import { auth } from "~~/server/lib/auth";

const MAX_AVATAR_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const parts = await readMultipartFormData(event);
  const avatarPart = parts?.find(
    (part) => part.name === "avatar" && part.filename,
  );

  if (!avatarPart?.filename) {
    throw createError({
      statusCode: 400,
      statusMessage: "Avatar file is required",
    });
  }

  if (!avatarPart.type || !Object.hasOwn(ALLOWED_MIME_TYPES, avatarPart.type)) {
    throw createError({
      statusCode: 415,
      statusMessage: "Only PNG, JPEG, and WebP images are allowed",
    });
  }

  if (avatarPart.data.byteLength > MAX_AVATAR_SIZE) {
    throw createError({
      statusCode: 413,
      statusMessage: "Avatar must be smaller than 10 MB",
    });
  }

  const avatarDirectory = join(process.cwd(), "public", "uploads", "avatars");
  await mkdir(avatarDirectory, { recursive: true });

  const extension = ALLOWED_MIME_TYPES[avatarPart.type];
  const fileName = `${user.id}-${Date.now()}-${randomUUID()}.${extension}`;
  const filePath = join(avatarDirectory, fileName);

  const previousImage = typeof user.image === "string" ? user.image : null;
  const previousImagePath = previousImage?.startsWith("/uploads/avatars/")
    ? join(process.cwd(), "public", previousImage.replace(/^\//, ""))
    : null;

  await writeFile(filePath, Buffer.from(avatarPart.data));

  try {
    await auth.api.updateUser({
      headers: event.headers,
      body: {
        image: `/uploads/avatars/${fileName}`,
      },
    });
  } catch (error: any) {
    await unlink(filePath);
    throw error;
  }

  if (previousImagePath && previousImagePath !== filePath) {
    try {
      await unlink(previousImagePath);
    } catch {
      // Ignore stale files.
    }
  }

  return {
    image: `/uploads/avatars/${fileName}`,
  };
});
