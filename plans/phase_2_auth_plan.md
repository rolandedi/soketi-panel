# 🔐 Phase 2 — Plan d'Implémentation de l'Authentification

> **Objectif** : Mettre en place une authentification end-to-end sécurisée avec `better-auth`, un backend Knex/SQLite et un frontend Nuxt avec protections de routes.

---

## 📅 Roadmap des Tâches & Sous-Tâches Actionnables

### 🗄️ Étape 1 : Configuration Base de Données & Migrations
*Fournir l'infrastructure de stockage pour les utilisateurs et les sessions Better Auth.*

- [ ] **1.1 Câbler l'outil de migration Knex**
  - Créer le fichier `knexfile.ts` à la racine pour la configuration knex CLI.
  - Ajouter les scripts `"migrate:make"`, `"migrate:latest"` et `"migrate:rollback"` dans le [package.json](file:///Users/rolandedi/dev/codivoire/soketi-panel/package.json).
- [ ] **1.2 Créer les schémas de base de données (Better Auth core)**
  - Générer une migration pour les tables requises (ex: `user`, `session`, `account`, `verification`).
  - Définir les colonnes correspondantes (id, name, email, emailVerified, password, image, createdAt, updatedAt).
- [ ] **1.3 Exécuter la migration initiale**
  - Assurer que le fichier `data.db` contient bien la structure complète avant de poursuivre.

### ⚙️ Étape 2 : Configuration du Backend (Server API)
*Initialiser l'instance `better-auth` avec l'adapter base de données et exposer les routes API.*

- [ ] **2.1 Instancier Better Auth**
  - Installer/vérifier le package `better-auth`.
  - Créer `server/utils/auth.ts`.
  - Configurer `betterAuth()` avec :
    - `emailAndPassword` plugin (pour l'authentification standard).
    - `database` adapter via knex (ou générique kyle).
    - `baseURL` pointant vers la runtimeConfig de Nuxt.
- [ ] **2.2 Exposer le Catch-All Route Handler**
  - Créer le fichier `server/api/auth/[...all].ts`.
  - Relier l'instance auth (via `auth.handler(toWebRequest(event))`) pour intercepter les appels REST de Better Auth (login, register, session, etc.).

### 🖥️ Étape 3 : Client Nuxt & Composables
*Mettre à disposition les méthodes et l'état de session Better Auth pour les composants frontend.*

- [ ] **3.1 Créer l'instance client Better Auth**
  - Créer `app/lib/auth-client.ts`.
  - Initialiser `createAuthClient()` avec `baseURL`.
- [ ] **3.2 Créer le composable réactif `useAuth`**
  - Créer `app/composables/useAuth.ts`.
  - Exposer `useSession()`, `signIn()`, `signOut()` pour une intégration fluide dans l'écosystème Vue 3.

### 🛡️ Étape 4 : Interface Utilisateur & Protection
*Créer la page de connexion, la protection des vues administrateurs et le flux UX.*

- [ ] **4.1 Implémenter le middleware Nuxt ([middleware/auth.ts](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/middleware/auth.ts))**
  - Lire le cookie de session ou faire une pré-requête au hook `useSession()`.
  - Si l'utilisateur n'est pas identifié, bloquer l'accès aux pages système (`/`, `/applications`, etc.) et le rediriger vers `/auth/login`.
- [ ] **4.2 Câbler le layout `default.vue` avec l'état Auth**
  - Ajouter un bouton `Log out` dans le header ou le dropdown utilisateur.
  - Afficher conditionnellement les info du User (email, avatar) s'il est loggué.
- [ ] **4.3 Créer la page `/auth/login.vue`**
  - Utiliser le layout `auth.vue`.
  - Câbler le flux UI : Titre, Card shadcn, Input email/password, Button submit, gestion des erreurs avec `vue-sonner`.
- [ ] **4.4 Créer un script de Seeding (Optionnel mais recommandé)**
  - Un utilitaire pour créer le premier compte "Admin" système facilement.
