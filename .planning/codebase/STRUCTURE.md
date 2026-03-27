# Codebase Structure

**Analysis Date:** 2026-03-27

## Directory Layout

```
soketi-panel/
├── app/                    # Frontend Vue 3 application
│   ├── assets/            # Static assets (CSS, images)
│   │   └── css/           # Stylesheets (Tailwind CSS v4)
│   ├── components/        # Vue components
│   │   ├── ui/            # Shadcn Vue base components
│   │   ├── modals/        # Modal dialog components
│   │   └── data-table/    # Data table components
│   ├── composables/       # Reusable Vue composition functions
│   ├── layouts/           # Page layout components
│   ├── lib/               # Frontend utilities and clients
│   ├── middleware/        # Client-side route middleware
│   ├── pages/             # File-based routing (Nuxt)
│   ├── plugins/           # Vue plugins and initialization
│   ├── table-columns/     # Data table column definitions
│   └── app.vue            # Root Vue component
├── server/                # Nitro backend engine
│   ├── api/               # REST API endpoints
│   │   ├── applications/  # Application management routes
│   │   ├── auth/          # Authentication routes (Better Auth)
│   │   ├── messages/      # Message management routes
│   │   └── users/         # User management routes
│   ├── lib/               # Server-side utilities
│   │   └── orm/           # Custom ORM implementation
│   ├── markdowns/         # Markdown content for docs
│   ├── middleware/        # Server middleware (Nitro)
│   ├── models/            # Type definitions and ORM models
│   ├── repositories/      # Data access layer
│   ├── services/          # Business logic layer
│   ├── validations/       # Zod validation schemas
│   └── types.d.ts         # Server-side type declarations
├── shared/                # Shared code (frontend + backend)
│   ├── types.ts           # TypeScript interfaces
│   └── utils.ts           # Shared utility functions
├── database/              # Database management
│   ├── migrations/        # Knex schema migrations
│   └── seeds/             # Database seed data
├── test/                  # Test files
│   └── repositories/      # Repository tests
├── plans/                 # GSD planning artifacts
├── .agents/               # Agent skills and instructions
├── .planning/             # GSD planning directory
│   └── codebase/          # Codebase analysis documents
└── nuxt.config.ts         # Nuxt configuration
```

## Directory Purposes

**`app/`:**

- Purpose: Frontend Vue 3 application with Shadcn Vue components
- Contains: Pages, components, composables, layouts, client utilities
- Key files: `app/app.vue` (root), `app/pages/index.vue` (home), `app/composables/useAuth.ts`
- Conventions: `.vue` files for components, TypeScript with Composition API

**`server/`:**

- Purpose: Nitro server backend with API routes and business logic
- Contains: API endpoints, middleware, repositories, services, models, validations
- Key files: `server/lib/auth.ts` (Better Auth config), `server/lib/orm/model.ts` (base ORM)
- Conventions: `.ts` files, file-based routing with HTTP method suffixes

**`shared/`:**

- Purpose: Code shared between frontend and backend
- Contains: TypeScript interfaces, utility functions
- Key files: `shared/types.ts` (domain types), `shared/utils.ts` (shared helpers)
- Conventions: Pure TypeScript, no framework-specific code

**`database/`:**

- Purpose: Database schema and seed data management
- Contains: Knex migrations and seed files
- Key files: Timestamped migration files, seed scripts
- Conventions: Sequential timestamps in filenames, reversible migrations

**`test/`:**

- Purpose: Automated test suite
- Contains: Repository tests, utility tests
- Key files: `test/utils.test.ts`, `test/setup.ts`
- Conventions: `.test.ts` suffix, co-located with source or in parallel structure

## Key File Locations

**Entry Points:**

- `app/app.vue`: Root Vue component, mounts application
- `server/api/auth/[...all].ts`: Better Auth catch-all endpoint
- `server/api/health.get.ts`: Health check endpoint

**Configuration:**

- `nuxt.config.ts`: Nuxt 4 configuration (runtime config, modules, plugins)
- `app/lib/auth-client.ts`: Better Auth client configuration
- `server/lib/auth.ts`: Better Auth server configuration
- `server/lib/orm/db.ts`: Knex database connection setup

**Core Logic:**

- `server/repositories/user.repository.ts`: User data access
- `server/models/user.ts`: User model with ORM
- `app/composables/useAuth.ts`: Authentication composable
- `shared/types.ts`: Domain type definitions

**Middleware:**

- `server/middleware/auth.ts`: Session validation
- `server/middleware/csrf.ts`: CSRF token validation
- `server/middleware/rate-limit.ts`: Request rate limiting
- `server/middleware/user-admin.ts`: Admin role authorization

**Validation:**

- `server/validations/users/createUserScheme.ts`: User creation schema
- `server/validations/users/updateUserScheme.ts`: User update schema
- `server/validations/users/banUserScheme.ts`: User ban schema

**UI Components:**

- `app/components/ui/button/`: Button component variants
- `app/components/ui/dialog/`: Dialog/modal components
- `app/components/ui/table/`: Data table components
- `app/components/data-table/`: Application-specific data tables

## Naming Conventions

**Files:**

- Vue components: `PascalCase.vue` (e.g., `UserProfile.vue`)
- API routes: `kebab-case.method.ts` (e.g., `index.post.ts`, `[id].delete.ts`)
- Utilities: `camelCase.ts` (e.g., `auth-client.ts`, `utils.ts`)
- Models: `camelCase.ts` (e.g., `user.ts`, `application.ts`)
- Repositories: `entity.repository.ts` (e.g., `user.repository.ts`)
- Validations: `actionEntityScheme.ts` (e.g., `createUserScheme.ts`)
- Middleware: `kebab-case.ts` (e.g., `user-admin.ts`, `rate-limit.ts`)
- Migrations: `YYYYMMDDHHMMSS_description.ts` (e.g., `20260325154325_create_auth_tables.ts`)

**Directories:**

- All lowercase with hyphens: `data-table/`, `ui/`, `composables/`
- Feature-based grouping: `users/`, `applications/`, `messages/`

## Where to Add New Code

**New Feature:**

- API routes: `server/api/{feature}/index.ts` or `server/api/{feature}/{action}.ts`
- Frontend pages: `app/pages/{feature}.vue` or `app/pages/{feature}/index.vue`
- Components: `app/components/{feature}/` or `app/components/ui/{feature}/`
- Composables: `app/composables/use{Feature}.ts`

**New Entity:**

- Model: `server/models/{entity}.ts` extending `Model` base class
- Repository: `server/repositories/{entity}.repository.ts`
- Validation schemas: `server/validations/{entity}/{action}Scheme.ts`
- Types: Add interface to `shared/types.ts`

**New API Endpoint:**

- Route file: `server/api/{resource}/{action}.{method}.ts`
- Method suffixes: `.get.ts`, `.post.ts`, `.put.ts`, `.delete.ts`
- Dynamic params: `[id].ts`, `[id].put.ts`, etc.

**New Middleware:**

- Server middleware: `server/middleware/{name}.ts` (auto-loaded, alphabetical order)
- Client middleware: `app/middleware/{name}.ts` (route-level)

**Database Changes:**

- Migration: `pnpm knex migrate:make {description}` → `database/migrations/`
- Seed: `database/seeds/{description}.ts`

**Utilities:**

- Shared utils: `shared/utils.ts` or `shared/{util}.ts`
- Server utils: `server/lib/{util}.ts`
- Frontend utils: `app/lib/{util}.ts`

## Module Organization

**Authentication Module:**

- Server: `server/lib/auth.ts`, `server/api/auth/[...all].ts`
- Client: `app/lib/auth-client.ts`, `app/composables/useAuth.ts`
- Middleware: `server/middleware/auth.ts`
- Tables: `sktp_users`, `sktp_accounts`, `sktp_sessions`, `sktp_verifications`

**User Management Module:**

- Routes: `server/api/users/` (index.ts, [id].ts, [id].put.ts, [id].delete.ts, ban.ts)
- Repository: `server/repositories/user.repository.ts`
- Model: `server/models/user.ts`
- Validations: `server/validations/users/`
- Pages: `app/pages/users.vue`, `app/pages/profile.vue`

**Application Management Module:**

- Routes: `server/api/applications/index.ts`
- Repository: `server/repositories/application.repository.ts`
- Model: `server/models/application.ts`
- Pages: `app/pages/applications.vue`

**Message Management Module:**

- Routes: `server/api/messages/index.ts`
- Repository: `server/repositories/message.repository.ts`
- Model: `server/models/message.ts`

## Special Directories

**`app/components/ui/`:**

- Purpose: Shadcn Vue base component library
- Generated: Yes (via Shadcn CLI)
- Committed: Yes
- Modification: Avoid direct edits, use Shadcn CLI for updates

**`server/api/auth/`:**

- Purpose: Better Auth catch-all routes
- Generated: Manual setup
- Committed: Yes
- Modification: Only update catch-all handler `[...all].ts`

**`database/migrations/`:**

- Purpose: Database schema version control
- Generated: Knex CLI
- Committed: Yes
- Modification: Never edit applied migrations, create new ones for changes

**`.planning/codebase/`:**

- Purpose: GSD codebase analysis documents
- Generated: GSD mapper agents
- Committed: Yes
- Contains: ARCHITECTURE.md, STRUCTURE.md, STACK.md, etc.

**`plans/`:**

- Purpose: GSD phase plans and execution artifacts
- Generated: GSD workflow
- Committed: Yes
- Contains: Phase directories with PLAN.md, execution logs

## Test Structure

**Location:** `test/` directory at root

**Organization:**

- `test/setup.ts`: Test configuration and setup
- `test/utils.test.ts`: Utility function tests
- `test/repositories/`: Repository layer tests

**Pattern:**

- Test files: `{name}.test.ts` suffix
- Setup: Vitest configuration in `nuxt.config.ts` or separate `vitest.config.ts`
- Assertions: Expect-based testing
- Mocking: ViTest mocks for external dependencies

**Run Commands:**

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage report
```

---

_Structure analysis: 2026-03-27_
