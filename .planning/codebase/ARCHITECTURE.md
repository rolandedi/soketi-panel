# Architecture

**Analysis Date:** 2026-03-27

## Pattern Overview

**Overall:** Nuxt 4 Full-Stack Application with Clear Separation of Concerns

**Key Characteristics:**

- Nuxt 4 with Nitro server engine for hybrid SSR/SPA rendering
- Strict separation between `app/` (frontend Vue 3) and `server/` (Nitro backend)
- Repository pattern for data access abstraction
- Middleware chain for cross-cutting concerns (auth, csrf, rate-limit, admin)
- Better Auth for authentication with admin plugin
- Knex.js ORM with custom Model base class for database operations
- Zod validation for all API request payloads

## Layers

**Frontend Layer (`app/`):**

- Purpose: Vue 3 reactive UI with Shadcn Vue components
- Location: `app/`
- Contains: Pages, components, composables, client-side middleware
- Depends on: Better Auth client, shared types
- Used by: End users via browser

**Backend API Layer (`server/api/`):**

- Purpose: RESTful API endpoints following Nuxt file-based routing
- Location: `server/api/`
- Contains: Route handlers with HTTP method suffixes (`.get.ts`, `.post.ts`)
- Depends on: Services, repositories, validations, middleware
- Used by: Frontend via `useFetch` or direct API calls

**Service Layer (`server/services/`):**

- Purpose: Business logic orchestration
- Location: `server/services/`
- Contains: Business rules, external API integrations
- Depends on: Repositories, models
- Used by: API route handlers

**Repository Layer (`server/repositories/`):**

- Purpose: Data access abstraction
- Location: `server/repositories/`
- Contains: CRUD operations using Knex queries
- Depends on: Models, Knex ORM
- Used by: Services and API handlers

**Model Layer (`server/models/`):**

- Purpose: Type definitions and ORM entities
- Location: `server/models/`
- Contains: TypeScript interfaces and Model classes
- Depends on: Shared types
- Used by: Repositories and services

**Middleware Layer (`server/middleware/`):**

- Purpose: Cross-cutting concerns and request preprocessing
- Location: `server/middleware/`
- Contains: Auth, CSRF, rate-limiting, admin protection
- Depends on: Auth configuration, session management
- Used by: All API routes automatically

## Data Flow

**Authentication Flow:**

1. User submits credentials via login form in `app/pages/login.vue`
2. `useAuth().signIn()` calls Better Auth client in `app/lib/auth-client.ts`
3. Request hits `server/api/auth/[...all].ts` (Better Auth catch-all route)
4. Better Auth validates credentials against database
5. Session created and stored in `sktp_sessions` table
6. Session cookie returned to client
7. Subsequent requests include session cookie
8. `server/middleware/auth.ts` validates session on protected routes
9. User context attached to `event.context.user`

**API Request Flow (Protected Route):**

1. Frontend calls `useFetch('/api/users')` from `app/pages/users.vue`
2. Request passes through middleware chain (alphabetical order):
   - `auth.ts` - Validates session, attaches user context
   - `csrf.ts` - Validates CSRF token for unsafe methods
   - `rate-limit.ts` - Enforces request limits (100 req/min)
   - `user-admin.ts` - Checks admin role for `/api/users` routes
3. Route handler `server/api/users/index.ts` executes
4. Handler validates request body with Zod schema via `validateWith()`
5. Handler instantiates repository: `new UserRepository()`
6. Repository executes Knex query via `User.paginate()`
7. Data returned through handler to client
8. Error handling via `createError()` with appropriate status codes

**Database Query Flow:**

1. Repository method calls `User.paginate(page, limit)`
2. `User` extends `Model` base class from `server/lib/orm/model.ts`
3. `Model.paginate()` builds Knex query via `this.buildQuery()`
4. `useDB()` returns cached Knex instance from `server/lib/orm/db.ts`
5. Query executes against MySQL/PostgreSQL database
6. Results cast to model type via `Model.cast()`
7. Pagination metadata calculated and returned

## State Management

**Client-Side State:**

- Vue 3 Composition API with `ref()`, `computed()`, `reactive()`
- Better Auth session state via `authClient.useSession()` in `useAuth()` composable
- Composables in `app/composables/` for reusable reactive logic
- No global state management library (Pinia/Vuex) - relies on Vue reactivity

**Server-Side State:**

- Stateless API design - each request self-contained
- Session state stored in database (`sktp_sessions` table)
- Rate limit state in memory (`Map` in `server/middleware/rate-limit.ts`)
- Database connection cached via singleton pattern in `useDB()`

## Key Abstractions

**Model Base Class:**

- Purpose: Generic ORM functionality with Knex
- Examples: `server/models/user.ts`, `server/models/application.ts`, `server/models/message.ts`
- Pattern: Extends `Model` from `server/lib/orm/model.ts` with static table name and casts

**Repository Pattern:**

- Purpose: Encapsulate data access logic
- Examples: `server/repositories/user.repository.ts`, `server/repositories/application.repository.ts`
- Pattern: One repository per aggregate root, uses Better Auth API or direct Knex queries

**Validation Schemas:**

- Purpose: Zod schemas for request validation
- Examples: `server/validations/users/createUserScheme.ts`, `server/validations/users/updateUserScheme.ts`
- Pattern: Export Zod schema, import in route handler, validate with `validateWith()` helper

**Auth Composable:**

- Purpose: Reactive authentication state for Vue components
- Location: `app/composables/useAuth.ts`
- Pattern: Wraps Better Auth client, exposes `user`, `isAuthenticated`, `signIn`, `signOut`

## Entry Points

**Nuxt Application Entry:**

- Location: `app/app.vue`
- Triggers: Browser navigation or initial page load
- Responsibilities: Root Vue component, renders `<NuxtPage />` with layouts

**Nitro Server Entry:**

- Location: Auto-generated by Nuxt from `server/` directory
- Triggers: HTTP requests to `/api/*` routes
- Responsibilities: Route matching, middleware execution, handler invocation

**Better Auth Routes:**

- Location: `server/api/auth/[...all].ts`
- Triggers: All `/api/auth/*` requests
- Responsibilities: Delegates to Better Auth internal handlers

**Health Check:**

- Location: `server/api/health.get.ts`
- Triggers: GET `/api/health`
- Responsibilities: Returns server status for monitoring

## Error Handling

**Strategy:** H3 `createError()` with structured error responses

**Patterns:**

- Validation errors: `createValidationError()` helper returns 400 with Zod issue message
- Authentication errors: 401 with "Unauthorized" message
- Authorization errors: 403 with "Forbidden" message
- Server errors: 500 with sanitized error message
- Logging via `consola` with context prefix

**Error Propagation:**

1. Route handlers wrap logic in try-catch
2. Errors logged via `logError()` helper
3. Structured error returned via `createError()`
4. Frontend handles errors in `useFetch` error state

## Cross-Cutting Concerns

**Logging:** Consola for structured logging with context prefixes

**Validation:** Zod schemas in `server/validations/` with `validateWith()` helper

**Authentication:** Better Auth middleware in `server/middleware/auth.ts` - runs on all routes except `/api/auth/*`

**Authorization:** Role-based access control via `server/middleware/user-admin.ts` for admin routes

**Rate Limiting:** In-memory rate limiting in `server/middleware/rate-limit.ts` - 100 requests per minute per user/IP

**CSRF Protection:** Token-based CSRF validation in `server/middleware/csrf.ts` for unsafe HTTP methods

**Caching:**

- Better Auth session cookie cache (5 minutes)
- Database connection singleton
- Rate limit store with periodic cleanup

---

_Architecture analysis: 2026-03-27_
