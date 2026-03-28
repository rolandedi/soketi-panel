# Technical Debt & Concerns

**Analysis Date:** 2026-03-27  
**Severity Legend:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

---

## Executive Summary

This Nuxt 4 Soketi Panel application is a functional admin dashboard with authentication, user management, and real-time features. However, several technical debt items, architectural concerns, and security gaps need attention before production deployment at scale.

**Key Findings:**

- 25+ instances of `any` type usage violating TypeScript strict mode
- Empty repository files (ApplicationRepository, MessageRepository)
- Incomplete test coverage (only 2 test files, no integration tests)
- Security middleware present but not consistently applied
- No production monitoring or observability
- Custom ORM lacks relationship management features

---

## 🔴 Critical Issues

### 1. Empty Repository Implementations

**Severity:** Critical  
**Files:** `server/repositories/application.repository.ts`, `server/repositories/message.repository.ts`  
**Impact:** Applications and messages cannot be managed programmatically; API endpoints likely incomplete or using direct DB calls  
**Current State:**

```typescript
// server/repositories/application.repository.ts - EMPTY FILE
// server/repositories/message.repository.ts - EMPTY FILE
```

**Risk:** Business logic duplication across API routes, no centralized data access layer  
**Mitigation:** Implement repository pattern consistently:

```typescript
export class ApplicationRepository {
  async findById(id: string) {
    /* ... */
  }
  async create(data: CreateApplicationDTO) {
    /* ... */
  }
  async delete(id: string) {
    /* ... */
  }
}
```

**Priority:** 1 (Immediate)

### 2. Inconsistent Type Safety

**Severity:** Critical  
**Files:** Multiple (see below)  
**Impact:** Runtime errors possible, TypeScript benefits lost  
**Instances Found:** 25+ uses of `any` type

**Critical Locations:**

```typescript
// knexfile.ts:7
const config: Record<string, any> = { ... }

// server/repositories/user.repository.ts:15,29
async create(data: any) { ... }
async update(id: string, data: any) { ... }

// server/middleware/rate-limit.ts:27
function getRateLimitKey(event: any): string { ... }

// server/lib/orm/model.ts:9,60,70
return data.map((row: any) => this.cast(row)) as unknown as T[];

// app/table-columns/usersColumns.ts:74,86,92,111,132,150,163
h(DataTableColumnHeader<User, any>, { column, title: "..." })
```

**Risk:** Type mismatches, null pointer exceptions, API contract violations  
**Mitigation:**

1. Define proper interfaces for all DTOs
2. Use Zod schemas for runtime validation (already in place)
3. Replace `any` with proper types:

```typescript
// Instead of: async create(data: any)
// Use: async create(data: CreateUserDTO)
interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  role?: "user" | "admin";
}
```

**Priority:** 1 (Immediate)

### 3. Missing Input Validation on Critical Endpoints

**Severity:** Critical  
**Files:** `server/api/users/index.ts`, `server/api/users/[id].ts`, `server/api/users/[id].delete.ts`  
**Impact:** GET and DELETE endpoints don't validate query parameters or route params  
**Current State:**

```typescript
// server/api/users/index.ts - No validation for page/limit query params
const page = Number(query.page) || 1;
const limit = Number(query.limit) || 10;
// No validation: page could be NaN, negative, or extremely large
```

**Risk:**

- DoS via `limit=999999999` (memory exhaustion)
- SQL injection if values not properly sanitized
- Unexpected behavior with invalid inputs

**Mitigation:** Add Zod validation for all inputs:

```typescript
import { z } from "zod";

const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});
```

**Priority:** 1 (Immediate)

---

## 🟠 High Priority Issues

### 4. CSRF Protection Incomplete

**Severity:** High  
**Files:** `server/middleware/csrf.ts`  
**Impact:** CSRF middleware exists but may not be registered globally  
**Current State:**

```typescript
// server/middleware/csrf.ts - File exists but order matters
// Middleware execution order: auth.ts → csrf.ts → rate-limit.ts → user-admin.ts
```

**Risk:** Cross-site request forgery attacks on state-changing operations  
**Verification Needed:**

1. Confirm middleware is auto-loaded by Nitro (alphabetical order)
2. Verify token validation on all POST/PUT/DELETE routes
3. Check frontend includes CSRF token in requests

**Mitigation:**

```typescript
// Add to nuxt.config.ts or server/tsconfig.json
export default defineNuxtConfig({
  nitro: {
    handlers: [{ middleware: "~/server/middleware/csrf.ts" }],
  },
});
```

**Priority:** 2 (This Sprint)

### 5. Rate Limiting Not Production-Ready

**Severity:** High  
**Files:** `server/middleware/rate-limit.ts`  
**Impact:** In-memory rate limiting doesn't work in clustered deployments  
**Current State:**

```typescript
// In-memory store
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup every 5 minutes
setInterval(cleanupOldEntries, 5 * 60 * 1000);
```

**Risk:**

- Rate limits reset on server restart
- No distributed rate limiting (multiple server instances)
- Memory leak potential with high traffic
- Easy to bypass by changing IP addresses

**Mitigation:** Use Redis for distributed rate limiting:

```typescript
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

async function checkRateLimit(key: string) {
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 60); // 1 minute window
  }
  return count;
}
```

**Priority:** 2 (This Sprint)

### 6. Ban Enforcement Gaps

**Severity:** High  
**Files:** `server/middleware/auth.ts`, `app/middleware/auth.global.ts`  
**Impact:** Banned users may still access some endpoints  
**Current State:**

```typescript
// server/middleware/auth.ts:17-22
if (session.user.banned) {
  throw createError({
    statusCode: 403,
    statusMessage: "Forbidden: Account is banned.",
  });
}
// ✅ Server-side check in place

// app/middleware/auth.global.ts:18-20
if (session.user.banned) {
  return navigateTo("/login?error=Your+account+has+been+banned");
}
// ✅ Client-side redirect in place
```

**Risk:** Banned users could still access:

- Static assets
- Public API endpoints
- WebSocket connections (Soketi)

**Mitigation:**

1. Add ban check to Soketi authentication middleware
2. Invalidate sessions immediately on ban
3. Add ban check to all API routes, not just auth middleware

```typescript
// server/lib/auth.ts - Add to Better Auth config
session: {
  expiresIn: 60 * 60 * 24 * 7,
  // Add custom validation
  validate: async (session) => {
    const user = await User.find(session.userId);
    if (user?.banned) {
      return false; // Invalidate session
    }
    return true;
  }
}
```

**Priority:** 2 (This Sprint)

### 7. No Database Connection Pool Configuration

**Severity:** High  
**Files:** `server/lib/orm/db.ts`, `server/lib/auth.ts`  
**Impact:** Default pool settings may cause connection exhaustion  
**Current State:**

```typescript
// server/lib/orm/db.ts - No pool configuration
const config: Knex.Config = {
  client: DB_DRIVER === "pg" ? "pg" : "mysql2",
  // No max/min connections defined
};

// server/lib/auth.ts - No pool limits
const pool = mysql.createPool({
  host: DB_HOST,
  // No max connections, idle timeout, etc.
});
```

**Risk:**

- Connection exhaustion under load
- Database performance degradation
- Application crashes when pool exhausted

**Mitigation:**

```typescript
// server/lib/orm/db.ts
const config: Knex.Config = {
  client: 'mysql2',
  connection: { ... },
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 10000,
  }
};
```

**Priority:** 2 (This Sprint)

### 8. Message Retention Policy Missing

**Severity:** High  
**Files:** `database/migrations/20260325194928_create_messages_table.ts`  
**Impact:** Messages table grows indefinitely  
**Current State:**

```typescript
// No TTL, no cleanup job, no retention policy
// sktp_messages table has created_at but no index or cleanup
```

**Risk:**

- Database disk exhaustion
- Performance degradation on message queries
- Compliance issues (GDPR data retention)

**Mitigation:**

```typescript
// 1. Add index for cleanup
await knex.schema.alterTable("sktp_messages", (table) => {
  table.index("created_at");
});

// 2. Create cleanup service
// server/services/message-cleanup.service.ts
export class MessageCleanupService {
  async deleteOlderThan(days: number) {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return await db("sktp_messages").where("created_at", "<", cutoff).delete();
  }
}

// 3. Schedule with cron job or API endpoint
```

**Priority:** 2 (This Sprint)

---

## 🟡 Medium Priority Issues

### 9. Service Layer Missing

**Severity:** Medium  
**Files:** N/A (missing directory)  
**Impact:** Business logic duplicated across API routes  
**Current State:**

```
server/
├── api/          # Business logic here (BAD)
├── repositories/ # Only data access
└── services/     # MISSING
```

**Example of duplication risk:**

```typescript
// server/api/users/index.post.ts
const userRepository = new UserRepository();
return await userRepository.create(data);

// server/api/admin/users/bulk-create.ts (future)
// Will duplicate validation, error handling, business logic
```

**Risk:**

- Code duplication
- Harder to test business logic in isolation
- Inconsistent error handling

**Mitigation:** Create service layer:

```typescript
// server/services/user.service.ts
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private emailService: EmailService,
  ) {}

  async createUser(dto: CreateUserDTO) {
    // Validation
    // Business logic
    // Email notifications
    // Audit logging
  }
}
```

**Priority:** 3 (Next Sprint)

### 10. No Caching Strategy

**Severity:** Medium  
**Files:** Throughout codebase  
**Impact:** All queries hit database directly  
**Current State:** No Redis or in-memory caching observed

**Risk:**

- Database load increases linearly with traffic
- Slow response times for frequently accessed data
- No session cache optimization (Better Auth supports Redis)

**Mitigation:**

```typescript
// server/lib/cache.ts
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },
  async set(key: string, value: any, ttlSeconds: number) {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  },
};
```

**Priority:** 3 (Next Sprint)

### 11. N+1 Query Risk

**Severity:** Medium  
**Files:** Repositories, API routes  
**Impact:** Performance degradation with large datasets  
**Current State:**

```typescript
// Pattern observed in repositories
const users = await User.paginate(page, limit);
// If applications needed, would require separate query per user
```

**Risk:** 100 users = 101 queries (1 for users + 100 for applications)

**Mitigation:**

```typescript
// Use eager loading or joins
const users = await db("sktp_users as u")
  .select("u.*", db.raw("COUNT(a.id) as app_count"))
  .leftJoin("sktp_applications as a", "u.id", "a.user_id")
  .groupBy("u.id")
  .limit(limit)
  .offset((page - 1) * limit);
```

**Priority:** 3 (Next Sprint)

### 12. Inconsistent Error Handling

**Severity:** Medium  
**Files:** Multiple API routes  
**Impact:** Inconsistent API responses, information leakage  
**Current State:**

```typescript
// server/api/users/index.ts
return createError({
  statusCode: 500,
  statusMessage: error?.message || "Failed to fetch users",
});

// server/api/users/index.post.ts
throw createError({
  statusCode: 500,
  statusMessage: err.message || "Failed to create user",
});
```

**Risk:**

- Internal error messages exposed to clients
- Inconsistent error response format
- Hard to debug in production

**Mitigation:** Create error handling utility:

```typescript
// server/lib/errors.ts
export function handleApiError(error: unknown, context: string) {
  logError(context, error);

  if (error instanceof ZodError) {
    return createError({ statusCode: 400, message: "Validation failed" });
  }
  if (error instanceof DatabaseError) {
    return createError({ statusCode: 500, message: "Database error" });
  }
  return createError({ statusCode: 500, message: "Internal server error" });
}
```

**Priority:** 3 (Next Sprint)

### 13. Chart Component TODO

**Severity:** Medium  
**Files:** `app/components/ui/chart/ChartTooltipContent.vue`  
**Impact:** Code maintenance risk  
**Current State:**

```vue
<!-- Uses createElement() and render() for dynamic content -->
<!-- Comment indicates template-based rendering not suitable -->
```

**Risk:** Fragile code, harder to maintain  
**Mitigation:** Refactor to use Vue's `<component :is="...">` pattern  
**Priority:** 6 (Backlog)

### 14. Pagination Not Enforced

**Severity:** Medium  
**Files:** `server/api/users/index.ts`, `server/api/applications/index.ts`  
**Impact:** Large result sets could exhaust memory  
**Current State:**

```typescript
const limit = Number(query.limit) || 10;
// No maximum limit enforced
```

**Risk:** `limit=999999` could crash server  
**Mitigation:**

```typescript
const limit = Math.min(Math.max(1, Number(query.limit)), 100);
// Enforce 1-100 range
```

**Priority:** 3 (Next Sprint)

### 15. No Database Indexes

**Severity:** Medium  
**Files:** Database migrations  
**Impact:** Slow queries on large tables  
**Current State:**

```typescript
// Only primary keys have indexes
// No indexes on:
// - sktp_users.email (used for login)
// - sktp_messages.app_id, created_at (used for filtering)
// - sktp_applications.user_id (used for joins)
```

**Mitigation:** Add migration for indexes:

```typescript
await knex.schema.alterTable("sktp_users", (table) => {
  table.index("email");
  table.index("role");
});

await knex.schema.alterTable("sktp_messages", (table) => {
  table.index(["app_id", "created_at"]);
});
```

**Priority:** 3 (Next Sprint)

---

## 🟢 Low Priority Issues

### 16. Version Pinning

**Severity:** Low  
**Files:** `package.json`  
**Impact:** Potential breaking changes on install  
**Current State:**

```json
{
  "dependencies": {
    "nuxt": "^4.4.2",
    "better-auth": "^1.5.6"
  }
}
```

**Risk:** Auto-update to major versions could break app  
**Mitigation:** Use lockfile-only updates or tighter constraints  
**Priority:** 7 (Maintenance)

### 17. No Docker Configuration

**Severity:** Low  
**Files:** N/A (missing)  
**Impact:** Deployment inconsistency  
**Current State:** No Dockerfile or docker-compose.yml

**Risk:** Environment drift between dev/staging/prod  
**Mitigation:** Add containerization  
**Priority:** 7 (Before Production)

### 18. No API Documentation

**Severity:** Low  
**Files:** N/A  
**Impact:** Harder for frontend developers to integrate  
**Current State:** No OpenAPI/Swagger docs

**Mitigation:** Add OpenAPI spec generation  
**Priority:** 8 (Nice to have)

### 19. No Health Check Endpoint

**Severity:** Low  
**Files:** `server/api/health.get.ts` exists but needs verification  
**Impact:** Load balancers can't determine app health  
**Current State:** File exists, needs to check:

- Database connectivity
- Soketi connectivity
- Cache connectivity

**Mitigation:** Implement comprehensive health check  
**Priority:** 4 (Before Production)

### 20. No v-html Sanitization

**Severity:** Low  
**Files:** `app/pages/docs/client.vue`, `app/pages/docs/server.vue`, `app/components/CodeBlock.vue`  
**Impact:** XSS risk if markdown content not trusted  
**Current State:**

```vue
<div v-html="content"></div>
```

**Risk:** XSS if markdown comes from untrusted sources  
**Mitigation:** Use DOMPurify if content is user-generated  
**Priority:** 5 (If content is user-generated)

---

## Security Concerns

### Authentication & Authorization

| Issue              | Severity | Status               |
| ------------------ | -------- | -------------------- |
| CSRF Protection    | High     | ⚠️ Partial           |
| Rate Limiting      | High     | ⚠️ In-memory only    |
| Ban Enforcement    | High     | ✅ Server-side       |
| Input Validation   | Critical | ❌ Incomplete        |
| SQL Injection Risk | Medium   | ⚠️ Using Knex (safe) |
| XSS Risk           | Low      | ⚠️ v-html usage      |

### Session Security

```typescript
// server/lib/auth.ts - Good practices observed
session: {
  expiresIn: 60 * 60 * 24 * 7, // 7 days ✅
  updateAge: 60 * 60 * 24, // Refresh every 24h ✅
  cookieCache: {
    enabled: true,
    maxAge: 60 * 5, // 5 minute cache ✅
  },
}
```

**Recommendations:**

1. Add session invalidation on password change
2. Add "remember me" functionality
3. Add session listing/revocation UI
4. Add login attempt throttling (Better Auth may have this)

---

## Performance Concerns

### Database Performance

| Concern                      | Impact | Likelihood | Mitigation            |
| ---------------------------- | ------ | ---------- | --------------------- |
| No connection pooling limits | High   | Medium     | Configure pool size   |
| No query caching             | Medium | High       | Add Redis cache       |
| No database indexes          | Medium | High       | Add strategic indexes |
| N+1 queries                  | High   | Medium     | Use eager loading     |
| No pagination enforcement    | High   | Low        | Enforce max limits    |

### Frontend Performance

| Concern                   | Impact | Status             |
| ------------------------- | ------ | ------------------ |
| No lazy loading of routes | Medium | ❌ Not implemented |
| No image optimization     | Low    | N/A (no images)    |
| No bundle analysis        | Medium | ❌ Not configured  |
| No service worker         | Low    | N/A (admin app)    |

---

## Testing Gaps

### Current Test Coverage

```bash
test/
├── repositories/
│   └── user.repository.test.ts  # ✅ Unit tests
├── utils.test.ts                 # ✅ Basic utils
└── setup.ts                      # Test configuration
```

**Coverage:** ~5% (estimated)  
**Missing:**

- ❌ API integration tests
- ❌ Component tests (Vue)
- ❌ E2E tests (Playwright/Cypress)
- ❌ Middleware tests
- ❌ Service layer tests (when created)
- ❌ Database migration tests

### Test Infrastructure

**Good:**

- ✅ Vitest configured
- ✅ Happy-DOM environment
- ✅ Coverage reporting enabled
- ✅ Test utilities in place

**Missing:**

- ❌ No test database configuration
- ❌ No test data factories
- ❌ No API test helpers
- ❌ No mock data for frontend

### Priority Test Cases

1. **User Authentication Flow** (Critical)
   - Login with valid credentials
   - Login with invalid credentials
   - Session expiration
   - Ban enforcement

2. **User Management API** (Critical)
   - Create user (admin only)
   - Update user
   - Delete user
   - Ban/unban user

3. **Application CRUD** (High)
   - Create application
   - Update application
   - Delete application
   - List applications (pagination)

4. **Message Handling** (High)
   - Store message
   - Retrieve messages
   - Message cleanup job

---

## Monitoring & Observability Gaps

### Current State

**Logging:**

- ✅ Consola configured
- ❌ No persistent logs
- ❌ No log levels (debug, info, warn, error)
- ❌ No structured logging (JSON format)

**Metrics:**

- ❌ No application metrics
- ❌ No database query metrics
- ❌ No API response time tracking
- ❌ No error rate tracking

**Alerting:**

- ❌ No error tracking (Sentry)
- ❌ No uptime monitoring
- ❌ No performance alerts

### Recommended Stack

```yaml
Logging: Pino or Winston (JSON format)
Metrics: Prometheus + Grafana
Error Tracking: Sentry
APM: Datadog or New Relic (optional)
Uptime: Uptime Kuma or Pingdom
```

### Implementation Priority

1. **Structured Logging** (High Priority)

```typescript
// server/lib/logger.ts
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
```

2. **Error Tracking** (High Priority)

```typescript
// app/plugins/sentry.client.ts
import * as Sentry from "@sentry/vue";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.1,
});
```

3. **Health Check Endpoint** (Medium Priority)

```typescript
// server/api/health.get.ts
export default defineEventHandler(async () => {
  const checks = {
    database: await checkDatabase(),
    soketi: await checkSoketi(),
    memory: process.memoryUsage(),
  };

  const status = Object.values(checks).every((c) => c.ok)
    ? "healthy"
    : "unhealthy";

  return { status, checks };
});
```

---

## Deployment & Operations

### Environment Configuration

**Current State:**

```bash
# .env.example present ✅
# .env in .gitignore ✅
# Runtime config in nuxt.config.ts ✅
```

**Missing:**

- ❌ No environment validation on startup
- ❌ No migration rollback strategy
- ❌ No backup strategy
- ❌ No disaster recovery plan

### Deployment Checklist

**Pre-Production:**

- [ ] Add environment validation
- [ ] Configure connection pooling
- [ ] Set up Redis for caching/sessions
- [ ] Add database indexes
- [ ] Implement rate limiting with Redis
- [ ] Add health check endpoint
- [ ] Configure logging
- [ ] Set up error tracking
- [ ] Add Docker configuration
- [ ] Create deployment runbook

**Production:**

- [ ] Database replication
- [ ] Load balancer configuration
- [ ] SSL/TLS certificates
- [ ] CDN for static assets
- [ ] Monitoring dashboards
- [ ] Alerting rules
- [ ] Backup automation
- [ ] Disaster recovery plan

---

## Dependency & Compatibility

### Critical Dependencies

| Package     | Version | Risk   | Notes                                |
| ----------- | ------- | ------ | ------------------------------------ |
| Nuxt        | ^4.4.2  | Medium | Major version could change           |
| Better Auth | ^1.5.6  | Medium | Early stage, API changes possible    |
| Knex        | ^3.2.5  | Low    | Stable                               |
| Vue         | ^3.5.30 | Low    | Stable                               |
| Tailwind    | ^4.2.2  | Medium | v4 is new, breaking changes possible |
| Zod         | ^4.3.6  | Medium | v4 is new                            |

### Dependency Risks

1. **Better Auth** - Early stage library
   - Risk: Breaking changes, undocumented features
   - Mitigation: Pin to specific version, monitor changelog

2. **Nuxt 4** - Recently released
   - Risk: Ecosystem still maturing
   - Mitigation: Follow Nuxt release notes, test upgrades in staging

3. **Tailwind v4** - Major version change
   - Risk: Syntax changes, plugin compatibility
   - Mitigation: Review Tailwind v4 migration guide

### Update Strategy

```bash
# Use lockfile for reproducible builds
pnpm install --frozen-lockfile

# Review updates before applying
pnpm outdated

# Update one dependency at a time
pnpm update better-auth

# Run tests after each update
pnpm test
```

---

## Technical Debt Summary

### Debt Breakdown by Category

| Category     | Count  | Critical | High   | Medium | Low   |
| ------------ | ------ | -------- | ------ | ------ | ----- |
| Code Quality | 8      | 2        | 2      | 3      | 1     |
| Security     | 5      | 1        | 3      | 1      | 0     |
| Performance  | 5      | 0        | 2      | 3      | 0     |
| Testing      | 4      | 1        | 1      | 2      | 0     |
| Architecture | 4      | 1        | 1      | 2      | 0     |
| Operations   | 5      | 0        | 1      | 2      | 2     |
| **Total**    | **31** | **5**    | **10** | **13** | **3** |

### Effort Estimation

| Priority      | Items | Estimated Effort | Timeline    |
| ------------- | ----- | ---------------- | ----------- |
| P1 (Critical) | 3     | 2-3 days         | This week   |
| P2 (High)     | 5     | 3-4 days         | This sprint |
| P3 (Medium)   | 7     | 5-7 days         | Next sprint |
| P4+ (Low)     | 16    | 10-15 days       | Backlog     |

### Quick Wins (Low Effort, High Impact)

1. ✅ Add pagination limits (30 min)
2. ✅ Add database indexes (1 hour)
3. ✅ Configure connection pooling (1 hour)
4. ✅ Add input validation schemas (2 hours)
5. ✅ Replace `any` types with interfaces (4 hours)

### Long-term Improvements

1. Implement service layer (2-3 days)
2. Add Redis caching (1-2 days)
3. Implement comprehensive testing (1-2 weeks)
4. Add monitoring and observability (2-3 days)
5. Containerize with Docker (1-2 days)

---

## Action Items

### Immediate (This Week) 🔴

- [ ] Implement ApplicationRepository and MessageRepository
- [ ] Replace all `any` types with proper interfaces
- [ ] Add input validation for all API endpoints
- [ ] Enforce pagination limits (max 100)
- [ ] Add database connection pooling configuration

### Short-term (This Sprint) 🟠

- [ ] Verify CSRF middleware is active and working
- [ ] Migrate rate limiting to Redis
- [ ] Add ban enforcement to Soketi authentication
- [ ] Create message retention cleanup job
- [ ] Add database indexes for frequently queried columns

### Medium-term (Next Sprint) 🟡

- [ ] Create service layer for business logic
- [ ] Implement Redis caching for frequently accessed data
- [ ] Add N+1 query prevention (eager loading)
- [ ] Standardize error handling across all routes
- [ ] Refactor chart component TODO
- [ ] Add comprehensive API integration tests

### Before Production 🟢

- [ ] Add Docker configuration
- [ ] Implement health check endpoint
- [ ] Set up structured logging
- [ ] Add error tracking (Sentry)
- [ ] Create deployment runbook
- [ ] Set up monitoring dashboards
- [ ] Configure backup strategy
- [ ] Perform security audit
- [ ] Load testing

---

## Appendix: File Reference

### Critical Files to Review

```
server/
├── lib/
│   ├── orm/
│   │   ├── db.ts              # Connection pooling config
│   │   └── model.ts           # Custom ORM (any types)
│   ├── auth.ts                # Better Auth config
│   └── utils.ts               # Validation helpers
├── middleware/
│   ├── auth.ts                # Auth middleware ✅
│   ├── csrf.ts                # CSRF protection ⚠️
│   ├── rate-limit.ts          # Rate limiting ⚠️
│   └── user-admin.ts          # Admin role check ✅
├── repositories/
│   ├── user.repository.ts     # Implemented ✅
│   ├── application.repository.ts  # EMPTY ❌
│   └── message.repository.ts  # EMPTY ❌
└── api/
    ├── users/                 # User management
    ├── applications/          # Application management
    └── messages/              # Message handling

app/
├── middleware/
│   └── auth.global.ts         # Client-side auth ✅
├── components/
│   ├── chart/
│   │   └── ChartTooltipContent.vue  # TODO comment
│   └── CodeBlock.vue          # v-html usage
└── pages/
    ├── docs/
    │   ├── client.vue         # v-html usage
    │   └── server.vue         # v-html usage
    └── users.vue              # User management UI

database/
├── migrations/
│   ├── 20260325154325_create_auth_tables.ts
│   ├── 20260325192549_create_applications_table.ts
│   └── 20260325194928_create_messages_table.ts
└── seeds/
    ├── create_admin_user.ts
    └── create_fake_users.ts

test/
├── repositories/
│   └── user.repository.test.ts  # Only repo tested
└── utils.test.ts                # Basic utils tested
```

---

**Last Updated:** 2026-03-27  
**Next Review:** After P1 items completion  
**Owner:** Development Team
