# 📊 Analyse Mise à Jour — Soketi Panel

## 1. Ce qui a changé depuis la v1

| Ajout | Détail |
|-------|--------|
| **TailwindCSS v4** | Via `@tailwindcss/vite` plugin Vite, config dans [tailwind.css](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/assets/css/tailwind.css) |
| **shadcn-nuxt 2.4.3** | Module Nuxt + CLI initialisé, couleur Neutral, no prefix |
| **8 composants UI installés** | `Button`, `Card`, `Badge`, `Alert`, `Tabs`, `Select`, `Input`, `Label` |
| **[app/lib/utils.ts](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/lib/utils.ts)** | Utilitaire [cn()](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/lib/utils.ts#5-8) — `clsx` + `tailwind-merge` |
| **[app/plugins/ssr-width.ts](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/plugins/ssr-width.ts)** | `provideSSRWidth(1024)` pour @vueuse/core en SSR |
| **Nouvelles dépendances** | `clsx`, `tailwind-merge`, `lucide-vue-next`, `class-variance-authority`, `tw-animate-css` |

---

## 2. Stack Complète (v2)

```
Framework      : Nuxt 4 (app router) + Vue 3.5 + TypeScript strict
Styling        : TailwindCSS v4 (Vite plugin) + tw-animate-css
UI Components  : shadcn-vue (Reka UI) — 8 composants installés
Icônes         : lucide-vue-next
Utilitaires    : clsx + tailwind-merge → cn(), class-variance-authority
SSR Fix        : provideSSRWidth(1024) via plugin Nuxt
State/Utils    : @vueuse/core
Notifications  : vue-sonner
Validation     : Zod 4
Auth           : better-auth 1.5.x
WebSocket      : pusher-js (client) + pusher (SDK serveur)
DB/ORM         : knex 3.x
Date           : date-fns
Linting        : @nuxt/eslint
Package mgr    : pnpm
```

---

## 3. État des Phases (Mis à Jour)

### ✅ Phase 1 — Fondations & Design System (Partiellement complétée)

| Tâche | Statut |
|-------|--------|
| TailwindCSS v4 installé + configuré | ✅ Fait |
| shadcn-vue initialisé | ✅ Fait |
| Composants UI de base installés | ✅ Fait (8 composants) |
| Plugin SSR width | ✅ Fait |
| [lib/utils.ts](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/lib/utils.ts) avec [cn()](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/lib/utils.ts#5-8) | ✅ Fait |
| [nuxt.config.ts](file:///Users/rolandedi/dev/codivoire/soketi-panel/nuxt.config.ts) avec runtimeConfig (clés Soketi) | ❌ À faire |
| `.env.example` | ❌ À faire |
| knex configuré + migrations | ❌ À faire |
| Layout [default.vue](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/layouts/default.vue) avec sidebar/nav | ❌ À faire |
| Layout [auth.vue](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/layouts/auth.vue) | ❌ À faire |
| Middleware [auth.ts](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/middleware/auth.ts) | ❌ À faire |

> [!IMPORTANT]
> Il manque encore les éléments **structurants** de la Phase 1 : runtimeConfig, DB, layouts, middleware. Ces bloquants doivent être résolus avant de passer à la Phase 2.

---

## 4. Plan d'Implémentation Réajusté

---

### 🏗️ Phase 1 — Complétion des Fondations (Suite)

**Estimé** : 2-3 jours restants

#### 1.1 Configuration & Environnement

- [ ] Ajouter `runtimeConfig` dans [nuxt.config.ts](file:///Users/rolandedi/dev/codivoire/soketi-panel/nuxt.config.ts) :

  ```ts
  runtimeConfig: {
    soketiHost: '', soketiPort: '6001',
    soketiAppId: '', soketiKey: '', soketiSecret: '',
    databaseUrl: 'sqlite://./data.db',
    public: { soketiHost: '', soketiPort: '' }
  }
  ```

- [ ] Créer `.env.example`
- [ ] Configurer knex : `server/utils/db.ts` + connexion SQLite dev / PG prod

#### 1.2 Layouts & Navigation

- [ ] [layouts/default.vue](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/layouts/default.vue) : sidebar avec navigation (Applications, Playground, Docs, Users), header, zone principale
- [ ] [layouts/auth.vue](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/layouts/auth.vue) : layout centré minimaliste

#### 1.3 Middleware

- [ ] [middleware/auth.ts](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/middleware/auth.ts) : rediriger vers `/auth/login` si pas de session

---

### 🔐 Phase 2 — Authentification

**Estimé** : 4-5 jours

- [ ] `server/utils/auth.ts` : instance better-auth + knex adapter
- [ ] Migration DB : table `users`
- [ ] `server/api/auth/[...all].ts` : handler better-auth
- [ ] `app/composables/useAuth.ts` : session réactive, login/logout
- [ ] [pages/auth/login.vue](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/pages/auth/login.vue) : formulaire email/password + validation Zod
- [ ] Page [users.vue](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/pages/users.vue) : CRUD admins

---

### 📱 Phase 3 — Gestion Applications Soketi

**Estimé** : 1 semaine

- [ ] Migration DB : table `soketi_apps`
- [ ] API CRUD : `GET/POST /api/applications`, `GET/PUT/DELETE /api/applications/:id`
- [ ] [pages/applications.vue](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/pages/applications.vue) : liste + modale création + copie des clés
- [ ] `pages/applications/[id].vue` : détail + stats

---

### 🎮 Phase 4 — Playground WebSocket

**Estimé** : 4-5 jours

- [ ] Connexion pusher-js (client only via `import.meta.client`)
- [ ] Sélecteur d'app, subscribe channel, publish event
- [ ] Log temps réel des événements + statut de connexion

---

### 📚 Phase 5 — Documentation, QA & Deploy

**Estimé** : 3-4 jours

- [ ] Pages [docs/client.vue](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/pages/docs/client.vue) et [docs/server.vue](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/pages/docs/server.vue) avec code examples
- [ ] Dashboard [index.vue](file:///Users/rolandedi/dev/codivoire/soketi-panel/app/pages/index.vue) avec métriques globales
- [ ] Tests E2E Playwright
- [ ] Dockerfile + README complet

---

## 5. Risques Mis à Jour

| ID | Risque | Statut |
|----|--------|--------|
| R2 | Exposition des clés Soketi côté client | ⚠️ Toujours actif — pas encore de runtimeConfig |
| R3 | better-auth + Nuxt SSR | ⚠️ Actif — pas encore implémenté |
| R5 | pusher-js en SSR | ✅ Atténué — plugin SSR width en place, pattern clair |
| R7 | Absence de tests | ⚠️ Actif — aucun test ajouté |

> [!TIP]
> Avec shadcn-vue installé, les Phases 1-3 seront significativement plus rapides à implémenter. Concentrez-vous sur `runtimeConfig` + knex + layouts pour débloquer la Phase 2.
