# Directory Structure & Key Locations

## Project Root
```
soketi-panel/
├── app/                          # Frontend application (Nuxt client)
├── server/                       # Backend (Nitro engine)
├── shared/                       # Shared types and utils
├── database/                     # Migrations and seeds
├── public/                       # Static assets (favicon, images)
├── .planning/                    # GSD project planning
├── node_modules/                 # Dependencies (pnpm)
├── nuxt.config.ts               # Nuxt configuration (SSR, modules, runtimeConfig)
├── tsconfig.json                # TypeScript root config (references .nuxt generated configs)
├── package.json                 # Dependencies and scripts
├── pnpm-lock.yaml               # pnpm lockfile
├── knexfile.ts                  # Knex database configuration
├── eslint.config.mjs            # ESLint configuration (flat config format)
├── components.json              # Shadcn Vue component registry
└── .env.example                 # Environment variable template
```

## Frontend (`app/`)

### Pages (File-Based Routing)
```
app/pages/
├── index.vue                    # Home / dashboard
├── login.vue                    # Login page
├── profile.vue                  # User profile page
├── users.vue                    # User management page
├── applications.vue             # Application management page
├── otp.vue                      # Two-factor authentication flow
├── playground.vue               # WebSocket playground/tester
├── about.vue                    # About page
└── docs/
    └── [...]                    # Documentation pages (nested routing)
```

### Components
```
app/components/
├── Navbar.vue                   # Main navigation bar
├── UserMenu.vue                 # User profile dropdown menu
├── PageHero.vue                 # Page header/title component
├── CodeBlock.vue                # Code snippet display with syntax highlight
├── ThemeSwitcher.vue            # Dark/light mode toggle
├── modals/
│   ├── CreateApplicationModal.vue
│   ├── EditApplicationModal.vue
│   ├── CreateUserModal.vue
│   └── [...]                    # Other action modals
├── data-table/
│   ├── DataTable.vue            # TanStack Table wrapper
│   ├── DataTableHeader.vue
│   ├── DataTableBody.vue
│   └── [...]                    # Column and cell components
└── ui/                          # Shadcn Vue components
    ├── button/                  # Button variants
    ├── card/                    # Card container
    ├── dialog/                  # Modal dialog
    ├── dropdown-menu/           # Dropdown menu
    ├── form/                    # Form helpers
    ├── input/                   # Text input
    ├── label/                   # Form labels
    ├── pagination/              # Pagination controls
    ├── select/                  # Select dropdown
    ├── switch/                  # Toggle switch
    ├── tabs/                    # Tab container
    ├── table/                   # HTML table
    ├── toast/                   # Toast notifications
    ├── tooltip/                 # Tooltip component
    └── [...]                    # Other Shadcn Vue components
```

### Composables (Reusable Logic)
```
app/composables/
└── useAuth.ts                   # Authentication composable
    - user (computed)
    - isAuthenticated (computed)
    - isPending (computed)
    - signIn(email, password)
    - signOut()
```

### Lib (Frontend Utilities)
```
app/lib/
├── auth-client.ts               # Better Auth client instance
└── utils.ts                     # Helper utilities (cn(), etc.)
```

### Middleware
```
app/middleware/
└── auth.global.ts               # Global auth guard for protected routes
```

### Plugins
```
app/plugins/
└── ssr-width.ts                 # SSR-safe window dimension detection
```

### Assets
```
app/assets/
└── css/
    └── tailwind.css             # Tailwind CSS imports and config
```

### Table Columns
```
app/table-columns/
├── users-columns.ts             # TanStack Table columns for users
└── applications-columns.ts      # TanStack Table columns for applications
```

### Layout Templates
```
app/layouts/
└── default.vue                  # Default layout wrapper
```

## Backend (`server/`)

### API Routes (HTTP Endpoints)
```
server/api/
├── auth/
│   └── [...all].ts              # Catch-all Better Auth endpoint
│       Delegates to server/lib/auth.ts
│
├── users/
│   ├── index.ts                 # GET /api/users (list, paginated)
│   ├── index.post.ts            # POST /api/users (create)
│   ├── [id].ts                  # GET /api/users/[id] (get single)
│   ├── [id].put.ts              # PUT /api/users/[id] (update)
│   ├── [id].delete.ts           # DELETE /api/users/[id] (delete)
│   └── ban.ts                   # POST /api/users/ban (ban/unban action)
│
├── applications/
│   ├── index.ts                 # GET /api/applications (list, paginated)
│   ├── index.post.ts            # POST /api/applications (create)
│   ├── [id].ts                  # GET /api/applications/[id]
│   ├── [id].put.ts              # PUT /api/applications/[id]
│   └── [id].delete.ts           # DELETE /api/applications/[id]
│
├── messages/
│   └── index.ts                 # GET /api/messages (list, paginated)
│
└── markdown.ts                  # POST /api/markdown (render markdown)
```

### Models (ORM Entities)
```
server/models/
├── user.ts                      # User model
│   extends Model
│   table: 'sktp_users'
│   casts: { emailVerified, banned: boolean }
│
├── application.ts               # Application model
│   extends Model
│   table: 'sktp_applications'
│   casts: { numeric fields, boolean fields }
│
└── message.ts                   # Message model
    extends Model
    table: 'sktp_messages'
```

### Repositories (Data Access Layer)
```
server/repositories/
├── user.repository.ts           # User database operations
│   UserRepository class
│   - getById(id)
│   - getAll(pagination)
│   - create(data)
│   - update(id, data)
│   - delete(id)
│   - ban(id, reason, expires)
│   - unban(id)
│
├── application.repository.ts    # Application database operations
│   ApplicationRepository class
│   - getById(id)
│   - getByUser(userId)
│   - create(userId, data)
│   - update(id, data)
│   - delete(id)
│
└── message.repository.ts        # Message database operations
    MessageRepository class
    - getByApp(appId, pagination)
    - create(appId, data)
    - deleteOld(appId, days)
```

### Services (Business Logic)
```
server/services/                 # (Directory reserved, not yet populated)
(Future services for complex business logic)
```

### ORM Library
```
server/lib/orm/
├── model.ts                     # Base Model class
│   Static methods:
│   - find(id)
│   - all()
│   - create(data)
│   - update(id, data)
│   - delete(id)
│   Instance type casting via casts property
│
└── db.ts                        # Knex database instance
    - Drivers: MySQL or PostgreSQL
    - Pool configuration
    - Connection management
```

### Auth Library
```
server/lib/
├── auth.ts                      # Better Auth configuration
│   - betterAuth instance
│   - Database pool factory
│   - Email/password method setup
│   - Admin plugin configuration
│   - Session settings (7 days TTL, 24h refresh)
│
└── utils.ts                     # Server-side helper utilities
```

### Validations
```
server/validations/
└── users/
    └── createUserScheme.ts      # Zod schema for user creation
```

### Markdown
```
server/markdowns/                # Static markdown files
                                 # Served via /api/markdown endpoint
```

## Shared Code (`shared/`)
```
shared/
├── types.ts                     # Type definitions used by both client and server
│   - User interface
│   - Application interface
│   - Message interface
│   - PaginatedResponse<T> generic
│
└── utils.ts                     # Utility functions shared between layers
```

## Database (`database/`)

### Migrations
```
database/migrations/
├── 20260325154325_create_auth_tables.ts
│   Creates Better Auth tables:
│   - sktp_users
│   - sktp_accounts
│   - sktp_verifications
│   - sktp_sessions
│
├── 20260325192549_create_applications_table.ts
│   Creates sktp_applications table
│   Columns: id, name, key, secret, limits, webhook config, etc.
│   Foreign key: user_id → sktp_users
│
├── 20260325194928_create_messages_table.ts
│   Creates sktp_messages table
│   Columns: id, app_id, channel, event, payload, created_at
│   Foreign key: app_id → sktp_applications
│
└── 20260326133005_add_admin_columns_in_auth_tables.ts
    Adds admin-related columns to sktp_users:
    - role (admin | user)
    - banned (boolean)
    - banReason (nullable)
    - banExpires (nullable)
```

### Seeds
```
database/seeds/                  # Seed scripts for development data
```

## Configuration Files

### `nuxt.config.ts`
- App metadata (title, icon, robots)
- Module imports (eslint, shadcn, color-mode, vue-sonner)
- CSS imports (Tailwind)
- Shadcn configuration (componentDir, prefix)
- runtimeConfig (app, database, auth, soketi, pusher variables)

### `knexfile.ts`
- Database driver configuration (MySQL/PostgreSQL)
- Migration directory
- Seed directory
- Connection pooling settings

### `tsconfig.json`
- References to .nuxt generated TypeScript configs for app, server, shared, node

### `eslint.config.mjs`
- Nuxt ESLint configuration wrapper (flat config format)

### `components.json`
- Shadcn Vue component registry
- Component paths and import aliases

### `.env.example`
- Template for all environment variables
- Grouped by feature (app, auth, database, soketi, pusher)

## Public Assets
```
public/
├── favicon.png                  # Site favicon
└── [other static files]
```

## Static Files Not Committed
```
.nuxt/                           # Build artifacts (auto-generated)
.env                             # Actual environment variables (gitignored)
node_modules/                    # Dependencies (pnpm, gitignored)
```

## Planning & Tracking
```
.planning/
├── codebase/                    # Codebase mapping documents (this directory)
│   ├── STACK.md
│   ├── INTEGRATIONS.md
│   ├── ARCHITECTURE.md
│   ├── STRUCTURE.md
│   ├── CONVENTIONS.md
│   ├── TESTING.md
│   └── CONCERNS.md
├── STATE.md                     # Project state summary
├── research/                    # Phase research artifacts
└── phases/                      # Completed phase milestones
```

## File Naming Conventions

### Pages & Routes
- Kebab-case: `login.vue`, `user-profile.vue`
- Dynamic segments: `[id].ts`, `[...all].ts`

### Components
- PascalCase: `Navbar.vue`, `UserMenu.vue`, `CodeBlock.vue`
- UI: `Button.vue`, `Dialog.vue`, `Input.vue`

### Composables
- camelCase with `use` prefix: `useAuth.ts`, `useForm.ts`

### TypeScript
- Classes: PascalCase: `User.ts`, `Application.ts`
- Interfaces: PascalCase with suffix: `UserType`, `ApplicationType`
- Functions: camelCase: `getUser()`, `createApplication()`

### Files
- Classes: PascalCase: `Model.ts`
- Logic: camelCase: `auth.ts`, `utils.ts`
- Schemas: camelCase with suffix: `createUserScheme.ts`

## Key Paths for Development

| What | Where | Access |
|------|-------|--------|
| Frontend pages | `app/pages/` | Auto-imported by Nuxt |
| Frontend components | `app/components/` | Auto-imported by Nuxt |
| Composables | `app/composables/` | Auto-imported by Nuxt |
| API endpoints | `server/api/` | `POST /api/path/to/file` |
| Database models | `server/models/` | Import directly `server/models/user.ts` |
| Repositories | `server/repositories/` | Import directly, use in endpoints |
| Shared types | `shared/types.ts` | Import from `#shared/types` (alias) |
| Database migrations | `database/migrations/` | `pnpm migrate` commands |
| ENV config | `nuxt.config.ts` | Access via `useRuntimeConfig()` |
| Tailwind styles | `app/assets/css/tailwind.css` | Auto-applied |
