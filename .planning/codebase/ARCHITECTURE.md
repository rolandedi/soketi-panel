# Architecture & System Design

## Architectural Pattern

**Nuxt 4 Full-Stack with Layered Backend**

```
┌─────────────────────────────────────────────┐
│        Browser / Client                     │
│  (Vue SPA with file-based routing)          │
└────────┬────────────────────────────────────┘
         │ HTTP / WebSocket
         ↓
┌─────────────────────────────────────────────┐
│        Nuxt Server (Nitro)                  │
│  ┌──────────────────────────────────────┐   │
│  │  API Routes (server/api/)            │   │
│  │  - Endpoints with middleware         │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │  Services (server/services/)         │   │
│  │  - Business logic, orchestration     │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │  Repositories (server/repositories/) │   │
│  │  - Database queries, Knex wrapper    │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │  Models (server/models/)             │   │
│  │  - ORM entities with typing          │   │
│  └──────────────────────────────────────┘   │
└────────┬────────────────────────────────────┘
         │ SQL
         ↓
┌─────────────────────────────────────────────┐
│        MySQL / PostgreSQL                   │
│  (Shared database with Soketi server)       │
└─────────────────────────────────────────────┘
```

## Frontend Layer (`app/`)

### Pages (File-Based Routing)
- `app/pages/index.vue` → Home / dashboard
- `app/pages/login.vue` → Authentication
- `app/pages/profile.vue` → User profile
- `app/pages/users.vue` → User management
- `app/pages/applications.vue` → Application management
- `app/pages/otp.vue` → Two-factor authentication
- `app/pages/playground.vue` → WebSocket playground
- `app/pages/about.vue` → About page
- `app/pages/docs/` → Documentation pages (nested)

### Components
- `app/components/Navbar.vue` — Top navigation
- `app/components/UserMenu.vue` — User profile dropdown
- `app/components/PageHero.vue` — Page title section
- `app/components/CodeBlock.vue` — Code snippet display
- `app/components/ThemeSwitcher.vue` — Dark/light mode toggle
- `app/components/data-table/` — Reusable table components for TanStack Table
- `app/components/ui/` — Shadcn Vue components (imported via `shadcn-nuxt`)
- `app/components/modals/` — Modal dialogs for actions (create, edit, delete)

### Composables (Reusable Logic)
- `app/composables/useAuth.ts` — Authentication state and methods
  - `user` — Current user data
  - `isAuthenticated` — Auth state check
  - `isPending` — Loading state
  - `signIn(email, password)` — Login
  - `signOut()` — Logout

### Lib (Frontend Utils)
- `app/lib/auth-client.ts` — Better Auth client configuration
- `app/lib/utils.ts` — Helper utilities (e.g., `cn()` for Tailwind merging)

### Middleware
- `app/middleware/auth.global.ts` — Global auth guard
  - Protects routes, redirects to login if not authenticated
  - Checks user roles for admin features

### Plugins
- `app/plugins/ssr-width.ts` — SSR-safe window width detection

### Assets
- `app/assets/css/tailwind.css` — Tailwind configuration and imports

### Table Columns
- `app/table-columns/` — TanStack Vue Table column definitions for data tables

## Backend Layer (`server/`)

### API Routes (`server/api/`)
Follows Nuxt file-based routing for HTTP methods:

**Auth Routes**
- `server/api/auth/[...all].ts` — Catch-all for Better Auth endpoints
  - Delegates to `server/lib/auth.ts`

**User Routes**
- `server/api/users/index.ts` — List users (paginated)
- `server/api/users/index.post.ts` — Create user
- `server/api/users/[id].ts` — Get user
- `server/api/users/[id].put.ts` — Update user
- `server/api/users/[id].delete.ts` — Delete user
- `server/api/users/ban.ts` — Ban/unban user action

**Application Routes**
- `server/api/applications/index.ts` — List applications (paginated)
- `server/api/applications/index.post.ts` — Create application
- Similar patterns for GET, PUT, DELETE

**Message Routes**
- `server/api/messages/index.ts` — List messages (paginated)

**Utility Routes**
- `server/api/markdown.ts` — Markdown rendering endpoint

### Services (`server/services/`)
(Directory exists but not yet populated; reserved for business logic layer)

**Future Services:**
- `UserService` — User operations (create, ban, role management)
- `ApplicationService` — Application CRUD and Soketi integration
- `MessageService` — Message archival and search

### Repositories (`server/repositories/`)
Data access layer wrapping Knex queries:

- `server/repositories/user.repository.ts`
  - Methods: `getById()`, `getAll()`, `create()`, `update()`, `delete()`, `ban()`, `unban()`
  - Returns: User model instances
  
- `server/repositories/application.repository.ts`
  - Methods: `getById()`, `getByUser()`, `create()`, `update()`, `delete()`
  - Returns: Application model instances

- `server/repositories/message.repository.ts`
  - Methods: `getByApp()`, `create()`, `deleteOld()`
  - Returns: Message model instances

### Models (`server/models/`)
ORM entities with type safety:

- `server/models/User.ts`
  - Extends `Model` base class
  - Table: `sktp_users`
  - Casts: emailVerified, banned (boolean)
  - Relationships: Inherits all Better Auth fields

- `server/models/Application.ts`
  - Extends `Model` base class
  - Table: `sktp_applications`
  - Casts: Numeric fields (max_connections, limits), boolean fields (enabled, etc.)
  - Relationships: `user` (foreign key to User)

- `server/models/Message.ts`
  - Extends `Model` base class
  - Table: `sktp_messages`
  - No casts
  - Relationships: `app_id` (foreign key to Application)

### ORM Library (`server/lib/orm/`)
Custom lightweight ORM wrapper:

- `server/lib/orm/model.ts` — Base Model class
  - Static `table` and `casts` properties
  - Methods: `find()`, `all()`, `create()`, `update()`, `delete()`
  - Automatic type casting (boolean, number, JSON)

- `server/lib/orm/db.ts` — Knex instance
  - Database driver selection (MySQL/PostgreSQL)
  - Pool configuration

### Validations (`server/validations/`)
Zod schemas for request validation:

- `server/validations/users/createUserScheme.ts` — User creation validation
- Schema-based approach (one file per endpoint)

### Auth Library (`server/lib/auth.ts`)
- Better Auth instance setup
- Database pool creation (MySQL or PostgreSQL)
- Plugin configuration (admin plugin)
- Session settings
- Email/password method configuration

### Utilities (`server/lib/utils.ts`)
- Helper functions for server-side operations

### Markdowns (`server/markdowns/`)
- Static markdown files for documentation
- Served via `/api/markdown` endpoint

## Data Flow

### User Login
1. Client submits email/password to `POST /api/auth/sign-in/email`
2. Better Auth validates credentials against `sktp_users` table
3. Creates session in `sktp_sessions` table
4. Returns session token (stored in HTTP-only cookie)
5. Client composable updates auth state
6. Middleware checks auth on protected routes

### Application Management
1. Client requests `GET /api/applications`
2. API route uses `ApplicationRepository.getByUser(userId)`
3. Repository executes Knex query: `select().from('sktp_applications').where('user_id', userId)`
4. Results cast to `Application` model instances
5. Response formatted as paginated JSON
6. Frontend renders in data table component

### Real-time Features
1. Client subscribed to Pusher channel via `pusher-js`
2. Server publishes event via `pusher` library: `pusher.trigger(channel, event, data)`
3. Event propagates through Soketi WebSocket server
4. Client receives update and re-renders

## Key Architectural Decisions

### Custom ORM vs Prisma/TypeORM
- **Why Custom:** Minimal overhead, direct Knex control, familiar SQL builder
- **Trade-off:** Less auto-migration, manual relationship handling

### Repositories Pattern
- **Why:** Encapsulates database queries, testable logic layer
- **Usage:** All database access flows through repositories

### Model Classes with Casts
- **Why:** Type safety (boolean/number fields auto-cast), shared types with frontend
- **Usage:** Models validate and transform data on instantiation

### Layered Backend
- **Why:** Clear separation of concerns
- **Layers:**
  1. API Routes (HTTP handling, validation)
  2. Services (business logic, optional)
  3. Repositories (data access)
  4. Models (entity definitions)
  5. ORM (database driver)

### No Global State Management (Pinia)
- **Why:** Component-level state via composables, simpler for CRUD operations
- **Future:** Could add Pinia for complex cross-component state if needed

### Better Auth Self-Hosted
- **Why:** Full control, no third-party vendor lock-in, integrates directly with database
- **Pattern:** All auth routes delegated to catch-all handler

## Scaling Considerations
- **Stateless Backend:** Can horizontally scale with multiple instances (session stored in DB)
- **Database:** Currently single instance, would need replication/clustering for HA
- **WebSocket:** Soketi server is separate, can scale independently
- **Caching:** No caching layer yet; Redis could be added for session cache or query results
