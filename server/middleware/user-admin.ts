/**
 * Middleware de protection des routes admin de gestion des utilisateurs.
 * S'exécute après le middleware auth (ordre alphabétique) et vérifie le rôle admin.
 */
export default defineEventHandler(async (event) => {
  // Ne s'applique qu'aux routes de gestion des utilisateurs
  if (!event.path.startsWith("/api/users")) {
    return;
  }

  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: Authentication required.",
    });
  }

  if (user.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden: Administrator access required.",
    });
  }
});
