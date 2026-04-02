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
    event.context.user = session.user;

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
