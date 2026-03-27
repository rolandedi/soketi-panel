# Agent Mandates & Project Standards

This document defines the foundational rules and architectural patterns for the **Soketi Panel** project. All AI agents MUST adhere to these instructions.

---

## 🏗️ Project Architecture

The project follows a **Nuxt 4** structure with a clear separation between frontend and backend logic.

- **`app/`**: Contains the frontend application.
  - `components/ui/`: Base UI components (Shadcn Vue).
  - `composables/`: Reusable Vue logic (e.g., `useAuth.ts`).
  - `pages/`: File-based routing.
  - `lib/`: Frontend utilities and clients (e.g., `auth-client.ts`).
- **`server/`**: Nitro backend engine.
  - `api/`: REST API endpoints. Follow Nuxt naming: `[id].get.ts`, `index.post.ts`.
  - `repositories/`: Data access layer (Knex queries).
  - `services/`: Business logic.
  - `models/`: Type definitions for database entities.
  - `validations/`: Zod schemas for request validation.
- **`database/`**: Knex migrations and seeds.
- **`shared/`**: Code shared between `app/` and `server/` (types, constants, basic utils).

---

## 🛠️ Technical Standards

### 1. Styling & UI

- **Tailwind CSS v4**: Use the latest syntax. Avoid legacy Tailwind configs.
- **Shadcn Vue**: Always use components from `app/components/ui/`.
- **Icons**: Use `lucide-vue-next`.
- **Utilities**: Always use the `cn()` helper from `@/lib/utils` for class merging.

### 2. Database (Knex.js)

- Never use raw SQL if a Knex builder can do it.
- All schema changes MUST be done via migrations in `database/migrations/`.
- Use **Repositories** in `server/repositories/` to encapsulate database logic.

### 3. Authentification (Better Auth)

- Use `server/lib/auth.ts` for server-side auth checks.
- Use `app/composables/useAuth.ts` for client-side state.
- Always protect sensitive API routes using the `auth` middleware or manual session checks.

### 4. Code Quality

- **TypeScript**: Strict typing is mandatory. Avoid `any`.
- **Validation**: Use **Zod** for all API request payloads.
- **Error Handling**: Use `createError` from H3 (Nitro) for API errors with appropriate status codes.

---

## 🤖 Agent Workflow Instructions

1. **Research First**: Before modifying a route or adding a feature, check the existing `repositories` and `services` to avoid duplication.
2. **Surgical Edits**: When updating UI components, ensure you don't break the existing Shadcn-Vue structure.
3. **Database Changes**: If a feature requires a new field, create a migration first. Do not modify existing migrations that have already been applied.
4. **Environment Variables**: Always check `nuxt.config.ts` and `.env.example` before introducing new configuration needs.

---

## 🧪 Testing Strategy

- Ensure all new API logic is covered by a basic unit test if possible.
- Use `pnpm migrate` and `pnpm seed` to verify the state of the database during development.
