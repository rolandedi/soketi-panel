import { auth } from "../lib/auth";

export default defineEventHandler(async (event) => {
  // On ne vérifie pas l'auth pour les routes d'authentification elles-mêmes
  // Ni pour les routes publiques ou statiques
  if (event.path.startsWith("/api/auth")) {
    return;
  }

  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (session) {
    event.context.session = session.session;
    // Better Auth User type peut avoir des champs additionnels selon les plugins
    event.context.user = session.user as any;

    if (session.user.banned) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden: Account is banned.",
      });
    }
  } else {
    event.context.session = null;
    event.context.user = null;
  }
});
