import { authClient } from "~/lib/auth-client";

const PUBLIC_ROUTES = new Set(["/login", "/auth/login"]);

export default defineNuxtRouteMiddleware(async (to) => {
  if (PUBLIC_ROUTES.has(to.path)) {
    return;
  }

  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: useRequestHeaders(["cookie"]),
    },
  });

  // If no session, redirect to login
  if (!session) {
    return navigateTo("/login");
  }

  // If user is banned, redirect to login with error
  if (session.user.banned) {
    return navigateTo("/login?error=Your+account+has+been+banned");
  }
});
