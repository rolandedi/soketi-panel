import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  baseURL: import.meta.server ? process.env.BETTER_AUTH_URL : undefined,
});
