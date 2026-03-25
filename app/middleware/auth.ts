import { authClient } from "~/lib/auth-client";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: session } = await authClient.useSession();

  if (!session?.session) {
    if (to.path === "/dashboard") {
      return navigateTo("/");
    }
  }
});
