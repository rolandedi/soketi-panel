# Tech Stack & Dependencies

## Overview
**Soketi Panel** is a management dashboard for Soketi WebSocket server built with modern JavaScript/TypeScript technologies. It provides administrative control over applications, users, and real-time messaging.

## Runtime & Language
- **Runtime:** Node.js (with TypeScript support via `tsx`)
- **Language:** TypeScript 5.9.3 (strict mode)
- **Type Checking:** Vue TSC 3.2.3 (for Vue component types)

## Core Frameworks

### Frontend (Nuxt 4)
- **Framework:** Nuxt 4.4.2 — Full-stack Vue meta-framework
- **Vue:** 3.5.30 — Reactive component framework
- **Vue Router:** 5.0.4 — Client-side routing
- **Routing Pattern:** File-based routing via Nuxt pages directory (`app/pages/`)

### Backend (Nitro)
- **Engine:** Nitro (bundled with Nuxt 4)
- **API Pattern:** Server-side endpoint files in `server/api/`
- **Endpoint Naming:** Follows Nuxt conventions:
  - `[id].get.ts` → GET `/api/path/[id]`
  - `index.post.ts` → POST `/api/path`
  - `[...all].ts` → Catch-all routes

## Database & ORM
- **Database Drivers:** MySQL 3.20.0 and PostgreSQL 8.20.0
- **Query Builder:** Knex.js 3.2.5
- **Custom ORM:** Model-based wrapper in `server/lib/orm/model.ts`
- **Migrations:** Knex migration system in `database/migrations/`
- **Seeds:** Knex seed system in `database/seeds/`

### Migration Scripts
- `pnpm migrate` — Run pending migrations
- `pnpm migrate:make [name]` — Create new migration
- `pnpm migrate:list` — List migration status
- `pnpm migrate:rollback` — Rollback last migration

## Authentication
- **Library:** Better Auth 1.5.6 (modern authentication framework)
- **Methods:**
  - Email/password (primary)
  - Admin plugin for role-based control
- **Session Management:**
  - 7-day session expiry
  - 24-hour session refresh cycle
  - 5-minute cookie cache for performance
- **Tables:** `sktp_users`, `sktp_accounts`, `sktp_verifications`, `sktp_sessions`
- **Server Setup:** `server/lib/auth.ts`
- **Client Hook:** `app/composables/useAuth.ts`

## UI & Styling

### Component Library
- **Shadcn Vue:** 2.4.3 — Unstyled, accessible component collection
- **Reka UI:** 2.9.2 — Headless UI components (foundation for Shadcn)
- **Component Prefix:** None (components use full names, e.g., `Button`)
- **Component Directory:** `app/components/ui/`

### Styling
- **Framework:** Tailwind CSS 4.2.2 (latest version)
- **Vite Plugin:** @tailwindcss/vite 4.2.2
- **Typography Plugin:** @tailwindcss/typography 0.5.19
- **Animations:** tw-animate-css 1.4.0
- **Utility Merge:** tailwind-merge 3.5.0 for safe class merging
- **CVA Support:** class-variance-authority 0.7.1 for variant utilities
- **CSS Entry:** `app/assets/css/tailwind.css`

### Icons
- **Library:** lucide-vue-next 1.0.0
- **Usage:** Vue components with standard SVG-based icons

## Form Validation & State Management

### Validation
- **Framework:** Zod 4.3.6 (TypeScript-first schema validation)
- **Vue Integration:** @vee-validate/zod 4.15.1
- **Form State:** VeeValidate 4.15.1

### Input Components
- **OTP Input:** vue-input-otp 0.3.2 (for two-factor authentication flows)

### Data Tables
- **TanStack Vue Table:** 8.21.3 (headless table component library)
- **Custom Column Definitions:** `app/table-columns/` directory

## Real-time & WebSockets
- **Pusher Client:** pusher-js 8.4.3 (for receiving real-time updates)
- **Pusher Server:** pusher 5.3.3 (for server-side event publishing)
- **Primary Use:** Connecting to Soketi WebSocket server
- **Client Configuration:** Configured via `nuxt.config.ts` runtimeConfig

## Content & Rendering
- **Markdown Parsing:** marked 17.0.5
- **Syntax Highlighting:** shiki 4.0.2
- **Markdown Rendering Route:** `server/api/markdown.ts`
- **Markdown Files:** `server/markdowns/` directory

## Utility Libraries
- **Date Utilities:** date-fns 4.1.0
- **CSS Utilities:** clsx 2.1.1 (CSS class composition)
- **VueUse:** @vueuse/core 14.2.1 (Vue composition utilities)
- **Console Logging:** consola 3.4.2 (structured logging)
- **Env Management:** dotenv 17.3.1

## Development Tools

### Build & Runtime
- **Build Tool:** Vite (bundled with Nuxt)
- **Module Bundler:** Nuxt 4 with auto-imports
- **Task Runner:** pnpm 9+ (package manager)

### Linting
- **ESLint:** @nuxt/eslint 1.15.2 (Nuxt-configured ESLint)
- **Config:** `eslint.config.mjs` (flat config format)

### Development Utilities
- **Devtools:** Nuxt Devtools 3.2.4 (browser extension enabled)
- **Color Mode:** @nuxtjs/color-mode 4.0.0 (dark/light theme support)
- **Notifications:** vue-sonner 2.0.9 (toast notifications)

## Project Configuration

### Environment Variables
See `.env.example` for all configurable values:
- **App:** APP_ENV, APP_NAME, APP_URL
- **Database:** DB_DRIVER, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- **Auth:** BETTER_AUTH_SECRET, BETTER_AUTH_URL
- **Soketi:** SOKETI_HOST, SOKETI_PORT, SOKETI_METRICS_HOST, SOKETI_METRICS_PORT
- **Pusher:** PUSHER_APP_ID, PUSHER_APP_KEY, PUSHER_APP_SECRET, PUSHER_HOST, PUSHER_PORT, PUSHER_SCHEME, PUSHER_CLUSTER

### Runtime Configuration
Defined in `nuxt.config.ts` runtimeConfig:
- Public config available to frontend
- Private config available only to backend
- Database connection details
- Soketi/Pusher connection parameters

## Development Scripts

```json
{
  "dev": "nuxt dev",           // Start dev server with hot reload
  "build": "nuxt build",       // Build for production
  "preview": "nuxt preview",   // Preview production build
  "generate": "nuxt generate", // Generate static site
  "migrate": "knex migrate:latest",
  "migrate:make": "knex migrate:make",
  "seed": "knex seed:run"
}
```

## Key Characteristics
- **SSR Ready:** Nuxt 4 supports server-side rendering and hybrid rendering modes
- **Auto-imports:** Components, composables, utils auto-imported (Nuxt magic)
- **Type Safety:** Full TypeScript throughout, strict mode enabled
- **Database Agnostic:** Supports MySQL and PostgreSQL via Knex
- **Modern CSS:** Tailwind v4 with Vite plugin for fast compilation
- **API-Driven:** RESTful endpoints with Nitro backend
- **Real-time Ready:** Pusher integration for live updates
