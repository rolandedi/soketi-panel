# External Integrations & APIs

## Database Integrations

### MySQL / MariaDB
- **Driver:** mysql2 3.20.0
- **Connection:** Pool-based for concurrency
- **Default Port:** 3306
- **Environment Variables:**
  - `DB_DRIVER=mysql`
  - `DB_HOST` (default: localhost)
  - `DB_PORT` (default: 3306)
  - `DB_NAME` (default: soketi_db)
  - `DB_USER`
  - `DB_PASSWORD`
- **Tables Created:**
  - `sktp_users` (Better Auth custom table)
  - `sktp_accounts` (Better Auth)
  - `sktp_sessions` (Better Auth)
  - `sktp_verifications` (Better Auth)
  - `sktp_applications` (Soketi Panel custom)
  - `sktp_messages` (Soketi Panel custom)

### PostgreSQL
- **Driver:** pg 8.20.0
- **Connection:** Pool-based for concurrency
- **Default Port:** 5432
- **Setup:** Same environment variables, set `DB_DRIVER=postgres` or `DB_DRIVER=pg`
- **Schema Support:** Via `SOKETI_DB_SCHEMA` (Postgres-specific)

## Authentication & Authorization

### Better Auth Server
- **Endpoint:** `server/lib/auth.ts`
- **Provider:** Better Auth 1.5.6 self-hosted
- **Auth Route:** `POST /api/auth/[...all]` (catch-all for all auth operations)
- **Features:**
  - Email/password registration and login
  - Session management
  - Admin plugin for role management
  - User verification
- **Environment Variables:**
  - `BETTER_AUTH_SECRET` (required for session signing)
  - `BETTER_AUTH_URL` (backend URL for auth redirects)
- **Cookie Settings:**
  - 7-day session TTL
  - 24-hour session refresh
  - 5-minute cache TTL
- **Roles:** Admin and user roles stored in `sktp_users.role`

### Better Auth Client
- **Endpoint:** `app/lib/auth-client.ts`
- **Composable:** `app/composables/useAuth.ts`
- **Session State:** Reactive via `authClient.useSession()`
- **Methods:**
  - `signIn.email(email, password)`
  - `signOut()`
  - User and session data access

## Real-time Communication

### Soketi WebSocket Server
- **Service:** Self-hosted WebSocket server (external binary)
- **Port:** 6001 (configurable via `SOKETI_PORT`)
- **Metrics Port:** 9601 (for admin metrics)
- **Connection:** From Pusher client library
- **Environment Variables:**
  - `SOKETI_HOST` (server address)
  - `SOKETI_PORT` (WebSocket port)
  - `SOKETI_METRICS_HOST`
  - `SOKETI_METRICS_SERVER_PORT` (also `SOKETI_METRICS_PORT`)
  - Database settings for Soketi's own persistence:
    - `SOKETI_DB_HOST`, `SOKETI_DB_PORT`, `SOKETI_DB_DATABASE`
    - `SOKETI_DB_USERNAME`, `SOKETI_DB_PASSWORD`
    - `SOKETI_DB_SCHEMA` (Postgres only)
    - `SOKETI_DB_APP_TABLE` (default: applications)

### Pusher Client & Server Libraries
- **Client:** pusher-js 8.4.3 (frontend WebSocket client)
- **Server:** pusher 5.3.3 (backend event publisher)
- **Configuration:**
  - `PUSHER_APP_ID`, `PUSHER_APP_KEY`, `PUSHER_APP_SECRET`
  - `PUSHER_HOST` (Soketi address)
  - `PUSHER_PORT` (Soketi WebSocket port)
  - `PUSHER_SCHEME` (http/https)
  - `PUSHER_TLS` (0 or 1)
  - `PUSHER_APP_CLUSTER` (required for Pusher playground)
- **Features:**
  - Publish events to channels
  - Subscribe to private/presence channels
  - Client event broadcasting (if enabled in Application settings)

## Content Delivery

### Markdown Processing
- **Service:** `server/api/markdown.ts`
- **Parser:** marked 17.0.5
- **Syntax Highlighting:** shiki 4.0.2
- **Purpose:** Server-side markdown rendering with syntax highlighting
- **Input:** Raw markdown content
- **Output:** Highlighted HTML
- **Storage:** Markdown files in `server/markdowns/` directory

## Admin Dashboard Integration

### Role-Based Access
- **Plugin:** Better Auth admin plugin
- **User Roles:**
  - `admin` — Full access to all features
  - `user` — Limited access (applications, messages)
- **Role Field:** `sktp_users.role`
- **Ban Management:**
  - `sktp_users.banned` (boolean)
  - `sktp_users.banReason` (string)
  - `sktp_users.banExpires` (nullable timestamp)
- **Enforced Via:** Route middleware in `app/middleware/auth.global.ts`

## API Response Format

### Pagination
All collection endpoints return:
```typescript
{
  data: T[],
  meta: {
    total: number,
    perPage: number,
    currentPage: number,
    lastPage: number
  }
}
```

### User Model (from Better Auth + custom fields)
```typescript
{
  id: string,
  name: string,
  email: string,
  emailVerified: boolean,
  image: string | null,
  role: "admin" | "user",
  banned: boolean,
  banReason: string | null,
  banExpires: string | null,
  createdAt: string,
  updatedAt: string
}
```

### Application Model
```typescript
{
  id: string,
  name: string,
  key: string,
  secret: string,
  max_connections: number,
  enable_client_messages: boolean,
  enabled: boolean,
  max_backend_events_per_sec: number,
  max_client_events_per_sec: number,
  max_read_req_per_sec: number,
  webhooks: string,
  max_presence_members_per_channel: number,
  max_presence_member_size_in_kb: number,
  max_channel_name_length: number,
  max_event_channels_at_once: number,
  max_event_name_length: number,
  max_event_payload_in_kb: number,
  max_event_batch_size: number,
  enable_user_authentication: boolean,
  created_at: string,
  updated_at: string,
  user_id: string,
  user?: User  // populated optionally
}
```

### Message Model
```typescript
{
  id: string,
  app_id: string,
  channel: string,
  event: string,
  payload: string,
  created_at: string
}
```

## Service Dependencies

### Soketi Panel ↔ Soketi Server
- Panel connects to Soketi metrics API (`http://SOKETI_METRICS_HOST:9601`)
- Panel publishes events via Pusher library to Soketi WebSocket server
- Soketi stores its own application config in shared database

### Soketi Panel ↔ Database
- All user, application, message data persisted in shared database
- Soketi also reads application config from same database

### Client ↔ Soketi Server
- Browser clients connect via Pusher client library to Soketi at `SOKETI_HOST:SOKETI_PORT`
- Real-time channel subscriptions and event broadcasts

## No Third-Party SaaS Dependencies
- **No external APIs** (Stripe, Auth0, email services, etc.)
- **Self-hosted auth** (Better Auth)
- **Self-hosted WebSocket** (Soketi)
- **No analytics** (no Segment, Mixpanel, etc.)
- **No external CDN** (assets served locally)
