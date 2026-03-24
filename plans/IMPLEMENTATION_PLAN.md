# 📊 Plan d'Implémentation Global — Soketi Panel

> **Objectif** : Créer une interface d'administration Nuxt 4 (Vue 3) pour gérer les applications d'un serveur WebSocket Soketi, en incluant l'authentification et un environnement de test temps réel.

---

## 🏗️ Phase 1 : Fondations & Design System (En cours - Presque terminé)

- [x] **1.1 Configuration Base du Projet**
  - [x] Initialisation Nuxt 4 + Vue 3.
  - [x] Configuration TailwindCSS v4 via Vite.
  - [x] Configuration ESLint, Typescript (`typeCheck: true`).
- [x] **1.2 Design System (shadcn-vue)**
  - [x] Installation du module `shadcn-nuxt`.
  - [x] Ajout des utilitaires `app/lib/utils.ts` (cn, clsx, tailwind-merge).
  - [x] Installation des composants de base: `Button`, `Input`, `Card`, `Badge`, `Alert`, `Tabs`, `Select`, `Label`, `Sonner`, `Table`, `Dialog`, etc.
  - [x] Plugin SSR width (`app/plugins/ssr-width.ts`).
- [x] **1.3 Environnement (Variables)**
  - [x] Création de `.env.example` avec config Soketi, Auth, et DB.
  - [x] Configuration native `runtimeConfig` dans `nuxt.config.ts`.
- [ ] **1.4 Base de Données (Setup)**
  - [x] Installation `sqlite3` et `better-sqlite3`.
  - [x] Logique initiale Knex dans `server/utils/db.ts`.
  - [ ] Configuration du CLI Knex (`knexfile.ts` & scripts npm).
- [ ] **1.5 Layouts et Structure UI**
  - [x] Layout principal `default.vue` avec Sidebar.
  - [x] Layout spécial d'authentification `auth.vue`.
  - [ ] Pages stubs (déjà créées, à habiller par la suite).

---

## 🔐 Phase 2 : Authentification (Better Auth)

- [ ] **2.1 Base de Données & Migrations (Auth)**
  - [ ] Générer une migration pour les tables Better Auth (`user`, `session`, `account`, `verification`).
  - [ ] Exécuter la migration (`migrate:latest`).
- [ ] **2.2 Configuration Serveur API (Better Auth)**
  - [ ] Instancier Better Auth dans `server/utils/auth.ts` avec plugin `emailAndPassword` et DB Knex.
  - [ ] Créer le route handler `server/api/auth/[...all].ts` pour l'API REST.
- [ ] **2.3 Composables Nuxt (Frontend)**
  - [ ] Intégrer l'instance client `app/lib/auth-client.ts`.
  - [ ] Exposer les états avec un composable réactif `useAuth.ts` (signIn, signOut, useSession).
- [ ] **2.4 UI Login & Protection des Routes**
  - [ ] Page login `app/pages/auth/login.vue` (UI avec zod, shadcn, et formulaires).
  - [ ] Middleware global `app/middleware/auth.ts` redirigeant les non-authentifiés.
  - [ ] Protéger conditionnellement l'affichage du header et de la sidebar (bouton Logout).
  - [ ] (Optionnel) Script de seeding pour le compte Admin.

---

## 📱 Phase 3 : Gestion des Applications Soketi (Core CRUD)

- [ ] **3.1 Modèle de Données (Soketi Apps)**
  - [ ] Migration table `soketi_apps` (`id`, `name`, `app_id`, `app_key`, `app_secret`, `max_connections`, etc).
- [ ] **3.2 API Routes Server (Nitro)**
  - [ ] `GET /api/applications` : Lister.
  - [ ] `POST /api/applications` : Créer (génération sécurisée app id/key/secret).
  - [ ] `GET /api/applications/:id` : Lire.
  - [ ] `PUT /api/applications/:id` : Éditer.
  - [ ] `DELETE /api/applications/:id` : Supprimer.
- [ ] **3.3 UI Dashboard Applications**
  - [ ] `pages/applications.vue` : Table listant les apps, actions (créer, supprimer).
  - [ ] Modale (Dialog) pour l'ajout d'une nouvelle application Soketi.
- [ ] **3.4 UI Vue Détaillée d'une Application**
  - [ ] `pages/applications/[id].vue` : Affichage clés API masquées (reveal/copy au clic).
  - [ ] Historique / Mini-graphiques de stat de connexions (si dispo via webhooks Soketi).

---

## 🎮 Phase 4 : Playground WebSocket

- [ ] **4.1 Intégration Pusher-js**
  - [ ] Configuration client statique de `pusher-js` (`import.meta.client`).
- [ ] **4.2 Console Interactive**
  - [ ] Sélecteur d'applications actives existantes dans la base.
  - [ ] Panel "Connecter/Déconnecter".
  - [ ] Interface de "Subscribe" à un channel (public/privé).
  - [ ] Interface "Publish Events" via l'API Serveur (Client -> Nuxt Nitro -> Soketi Server).
- [ ] **4.3 Event Logs UI**
  - [ ] Console visuelle avec terminal log affichant les messages en temps réel.
  - [ ] Filter pour auto-scroll ou masquer le format JSON.

---

## 📚 Phase 5 : Tableaux de bord, Documentation & Finalisation

- [ ] **5.1 Panneau d'accueil (Dashboard)**
  - [ ] `pages/index.vue` : Compilation des métriques (Apps totales, Stats d'activité).
- [ ] **5.2 Gestion des Administrateurs**
  - [ ] `pages/users.vue` : Gestion et CRUD simple sur la table `Users` de Better Auth pour ajouter de nouveaux accès au panel.
- [ ] **5.3 Documentation In-App**
  - [ ] `pages/docs/client.vue` & `pages/docs/server.vue` : Exemples de configuration code copiables.
- [ ] **5.4 Qualité & Déploiement**
  - [ ] Écriture de tests unitaires/e2e minimaux.
  - [ ] Ajustements Dockerfile/Docker-compose.
  - [ ] Instructions de déploiements dans `README.md`.
