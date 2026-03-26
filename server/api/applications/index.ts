import { Application } from "~~/server/models/application";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  try {
    return await Application.paginate(page, limit);
  } catch (error: any) {
    console.error(error);
    return createError({
      statusCode: 500,
      statusMessage: error?.message || "Failed to fetch applications",
    });
  }
});
