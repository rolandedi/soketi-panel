import consola from "consola";
import type { Knex } from "knex";
import { auth } from "../../server/lib/auth";

export async function seed(knex: Knex): Promise<void> {
  consola.info("Seeding admin user...");

  const { SOKETI_PANEL_EMAIL, SOKETI_PANEL_PASSWORD } = process.env;

  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: SOKETI_PANEL_EMAIL || "admin@soketi-panel.app",
        password: SOKETI_PANEL_PASSWORD || "P@ssw0rd123",
        name: "Soketi Admin",
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
