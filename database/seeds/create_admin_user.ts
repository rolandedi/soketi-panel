import consola from "consola";
import type { Knex } from "knex";
import { auth } from "../../server/lib/auth";

export async function seed(knex: Knex): Promise<void> {
  consola.info("Seeding admin user...");

  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: "admin@soketi-panel.app",
        password: "P@ssw0rd123",
        name: "John Doe",
      },
    });

    consola.success("Admin user created successfully:", res.user?.email);
  } catch (error: any) {
    if (
      error.status === 400 ||
      error.message?.includes("User already exists")
    ) {
      consola.info("Admin user already exists. Skipping.");
    } else {
      consola.error("Failed to seed user:", error);
    }
  }
}
