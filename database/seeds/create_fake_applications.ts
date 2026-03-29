import type { Knex } from "knex";
import consola from "consola";
import { randomBytes } from "crypto";

function generateKey(): string {
  return randomBytes(12).toString("hex");
}

function generateSecret(): string {
  return randomBytes(24).toString("hex");
}

function generateId(): string {
  return randomBytes(8).toString("hex");
}

const appNames = [
  "Chat en Temps Réel",
  "Tableau de Bord Analytics",
  "Notifications Push",
  "Système de Trading",
  "Live Support",
  "Collaboration Équipe",
  "Jeu Multijoueur",
  "Flux de Données IoT",
  "Ticketing Live",
  "Plateforme E-learning",
  "Suivi de Livraison",
  "Streaming Vidéo",
  "Enchères en Direct",
  "Santé Connectée",
  "Logistique Temps Réel",
  "Marketplace B2B",
  "CRM Intelligent",
  "Alertes de Sécurité",
  "Gestion de Projet",
  "Portail Banque",
  "App Mobile Retail",
  "Plateforme RH",
  "Dashboard Energie",
  "Smart Home",
  "Réseau Social Interne",
];

export async function seed(knex: Knex): Promise<void> {
  consola.info("Seeding fake applications...");

  try {
    // Use the admin user (first created) so all apps are visible when logged in as admin
    const adminUser = await knex("sktp_users")
      .select("id")
      .orderBy("createdAt", "asc")
      .first();

    if (!adminUser) {
      consola.warn(
        "No users found in sktp_users. Run user seeds first. Skipping.",
      );
      return;
    }

    // Clear existing seeded applications to avoid duplicates on re-run
    await knex("sktp_applications").del();

    const applications = appNames.map((name, i) => ({
      id: generateId(),
      name,
      key: generateKey(),
      secret: generateSecret(),
      max_connections: [-1, 100, 500, 1000, 2000][i % 5],
      enable_client_messages: i % 3 !== 0,
      enabled: i % 7 !== 0,
      max_backend_events_per_sec: [-1, 50, 100, 200][i % 4],
      max_client_events_per_sec: [-1, 30, 60, 120][i % 4],
      max_read_req_per_sec: [-1, 100, 500][i % 3],
      webhooks: null,
      max_presence_members_per_channel: [50, 100, 200, 500][i % 4],
      max_presence_member_size_in_kb: [5, 10, 20][i % 3],
      max_channel_name_length: 100,
      max_event_channels_at_once: [10, 50, 100][i % 3],
      max_event_name_length: 100,
      max_event_payload_in_kb: [50, 100, 256][i % 3],
      max_event_batch_size: [5, 10, 20][i % 3],
      enable_user_authentication: i % 4 === 0,
      created_at: new Date(
        Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      updated_at: null,
      user_id: adminUser.id,
    }));

    await knex("sktp_applications").insert(applications);
    consola.success(`${applications.length} applications created successfully`);
  } catch (error) {
    consola.error("Failed to seed applications:", error);
  }
}
