import { createAuthClient } from "better-auth/vue";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.server
    ? (process.env.BETTER_AUTH_INTERNAL_URL ?? process.env.BETTER_AUTH_URL)
    : undefined,
  plugins: [adminClient()],
});
