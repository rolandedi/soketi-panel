import { authClient } from "~/lib/auth-client";

export default defineNuxtRouteMiddleware(async () => {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: useRequestHeaders(["cookie"]),
    },
  });

  if (session?.user.role !== "admin") {
    return navigateTo("/");
  }
});
