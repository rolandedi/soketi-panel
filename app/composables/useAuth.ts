import { authClient } from "~/lib/auth-client";

/**
 * Reactive composable wrapping Better Auth client methods.
 * Exposes session state and auth actions for use in components and middleware.
 */
export function useAuth() {
  const session = authClient.useSession();

  const user = computed(() => session.value?.data?.user ?? null);
  const isAuthenticated = computed(() => !!session.value?.data?.session);
  const isPending = computed(() => session.value?.isPending);
  const isAdmin = computed(() => user.value?.role === "admin");

  async function signIn(email: string, password: string) {
    return authClient.signIn.email({ email, password });
  }

  async function signOut() {
    return authClient.signOut();
  }

  return {
    session,
    user,
    isAuthenticated,
    isPending,
    isAdmin,
    signIn,
    signOut,
  };
}
