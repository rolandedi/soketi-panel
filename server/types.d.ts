import type { Session } from "better-auth";
import { UserWithRole } from "better-auth/plugins";

declare module "h3" {
  interface H3EventContext {
    user: UserWithRole | null;
    session: Session | null;
  }
}

export {};
