# Technical Debt & Concerns

## Critical Issues

### 1. Chart Component TODO

- **Location:** `app/components/ui/chart/ChartTooltipContent.vue`
- **Issue:** Current implementation uses `createElement()` and `render()` to dynamically render tooltip content
- **Problem:** Template-based rendering not suitable for complex dynamic content
- **Impact:** Tooltip functionality works but code is fragile; maintenance risk
- **Priority:** Medium (working, but should be refactored)
- **Solution:** Consider using Vue's `<component :is="...">` or restructuring tooltip logic

## Architectural Concerns

### 1. No Service Layer Yet

- **Current State:** Logic lives directly in API routes and repositories
- **Issue:** Business logic not separated from HTTP handling; harder to test and reuse
- **Impact:** Routes becoming fat; difficult to share logic between endpoints
- **Risk:** Low for current scope, but will become problematic at scale
- **Mitigation:** Add `server/services/` when endpoints begin to share logic
- **Example Services Needed:**
  - `UserService` (user creation, banning, role management)
  - `ApplicationService` (app CRUD, limit validation)
  - `MessageService` (message archival, cleanup)

### 2. No Caching Strategy

- **Current State:** All queries hit database directly
- **Issue:** No cache layer; repeated queries are expensive
- **Impact:** Database load increases with user growth; no session cache optimization
- **Risk:** High under load
- **Solution:** Add Redis for:
  - Session cache (already configured in Better Auth but could be optimized)
  - Application settings cache (rarely changes)
  - Message pagination (expensive queries)

### 3. Custom ORM vs Industry Standard

- **Current State:** Lightweight custom ORM wrapper around Knex
- **Issue:** Less feature-rich than Prisma/TypeORM; requires manual relationship handling
- **Impact:** More code to maintain; no auto-migrations or relation loading
- **Risk:** Medium; works well for current project size
- **Trade-off:** Simplicity vs completeness
- **Future:** Could migrate to Prisma if complexity increases

## Performance Concerns

### 1. N+1 Query Risk

- **Location:** Repositories when fetching related data
- **Example:** Getting users with their applications counts
- **Current Risk:** High if not careful with eager loading
- **Mitigation:** Always use Knex `.join()` or load relationships explicitly
- **Test Case Needed:**

  ```typescript
  // BAD: N+1 query
  const users = await User.all();
  for (const user of users) {
    user.applications = await Application.where("user_id", user.id).all();
  }

  // GOOD: Single join query
  const users = await db
    .select("u.*", db.raw("COUNT(a.id) as app_count"))
    .from("users as u")
    .leftJoin("applications as a", "u.id", "a.user_id")
    .groupBy("u.id");
  ```

### 2. Pagination Not Implemented Consistently

- **Issue:** Some endpoints may not paginate large result sets
- **Risk:** Memory exhaustion with large datasets
- **Solution Needed:** Audit all collection endpoints for pagination
- **Default:** 10-25 items per page for large collections

### 3. No Database Connection Pooling Limits

- **Current:** MySQL and PostgreSQL pools configured with defaults
- **Risk:** Could exhaust connections under load
- **Solution:** Explicitly set `max` and `min` pool sizes in `server/lib/orm/db.ts`
  ```typescript
  // Recommended
  mysql.createPool({
    max: 10, // Max connections
    min: 2, // Min connections
    idleTimeoutMillis: 30000,
  });
  ```

## Security Concerns

### 1. No CSRF Protection

- **Issue:** POST/PUT/DELETE endpoints don't validate CSRF tokens
- **Risk:** Medium; depends on how admin users access the app
- **Mitigation Needed:** Add CSRF middleware to Nitro routes
  ```typescript
  // server/middleware/csrf.ts
  export default defineEventHandler(async (event) => {
    if (["POST", "PUT", "DELETE"].includes(event.node.req.method)) {
      const token = getHeader(event, "x-csrf-token");
      // Validate token from session
    }
  });
  ```

### 2. No Rate Limiting

- **Issue:** APIs have no throttling; prone to DoS attacks
- **Risk:** Medium; admin app not internet-facing by default
- **Solution:** Add rate limiting middleware or use service like Cloudflare
  ```typescript
  // Example: rate limit by user ID
  const rateLimiter = new Map<string, number[]>();
  const MAX_REQUESTS = 100;
  const WINDOW = 60000; // 1 minute
  ```

### 3. Message Payload Validation

- **Issue:** Message payloads stored as strings; could be large or malicious
- **Risk:** Low for internal use; could be vector if messages come from untrusted sources
- **Solution:** Add payload size limits and validation
  ```typescript
  const maxPayloadSize = 10 * 1024; // 10KB
  if (payload.length > maxPayloadSize) {
    throw createError({ statusCode: 413, message: "Payload too large" });
  }
  ```

### 4. User Ban System Not Enforced at Application Level

- **Issue:** `sktp_users.banned` flag exists but may not be checked on every route
- **Risk:** Medium; banned users could still access API if middleware not applied
- **Audit Needed:** Verify `auth.global.ts` or API middleware checks `user.banned`
- **Solution:** Add global middleware to reject banned users
  ```typescript
  export default defineEventHandler(async (event) => {
    const session = await useAuth().getSession(event);
    if (session?.user?.banned) {
      throw createError({ statusCode: 403, message: "User is banned" });
    }
  });
  ```

## Scalability Issues

### 1. Single Soketi Instance

- **Current:** App depends on single self-hosted Soketi server
- **Issue:** No failover; if Soketi goes down, all real-time features fail
- **Risk:** High for production use
- **Solution:** Implement Soketi clustering with Redis adapter

### 2. Single Database Instance

- **Current:** No replication or failover
- **Risk:** Data loss if database goes down
- **Solution:** Set up database replication (MySQL Master-Slave or PostgreSQL streaming replication)

### 3. No Message Retention Policy

- **Issue:** Messages accumulate in `sktp_messages` table indefinitely
- **Risk:** High; disk usage grows unbounded
- **Mitigation Needed:**

  ```typescript
  // Auto-cleanup old messages (add to repository)
  async deleteOlderThan(days: number) {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return await db('sktp_messages')
      .where('created_at', '<', cutoff)
      .delete();
  }

  // Schedule with cron job or API endpoint
  ```

## Code Quality Concerns

### 1. No Error Logging

- **Issue:** API errors thrown without logging
- **Impact:** Hard to debug production issues
- **Solution:** Add structured logging

  ```typescript
  import { consola } from "consola"; // Already in dependencies

  // In routes
  try {
    // ...
  } catch (error) {
    consola.error("Failed to create user", error);
    throw createError({ statusCode: 500 });
  }
  ```

### 2. No Input Sanitization for Display

- **Issue:** User-provided data (names, emails) rendered in templates without escaping
- **Risk:** Low in Vue (auto-escapes by default), but watch for `v-html`
- **Audit:** Search codebase for `v-html` usage

### 3. Inconsistent Error Messages

- **Issue:** Error messages may leak implementation details
- **Risk:** Low; internal app, but should still be mindful
- **Example:**

  ```typescript
  // BAD: Exposes database structure
  throw new Error(`Table "sktp_users" not found`);

  // GOOD: Generic message
  throw createError({ statusCode: 500, message: "An error occurred" });
  ```

## Testing Gaps

### 1. Zero Test Coverage

- **Issue:** No unit or integration tests
- **Risk:** High; hard to ensure code changes don't break functionality
- **Impact:** Manual testing required; regression prone
- **Priority:** High (should be first addition)

### 2. No API Integration Tests

- **Issue:** Can't verify API contracts (request/response formats)
- **Risk:** Medium; client and server changes could go out of sync
- **Solution:** Add basic integration tests for each endpoint

### 3. No E2E Tests

- **Issue:** Full workflows (login → create app → publish message) untested
- **Risk:** Medium; UI could break without tests catching it
- **Solution:** Add Playwright tests for critical paths

## Monitoring & Observability

### 1. No Application Metrics

- **Issue:** No visibility into app performance
- **Missing:** Response times, error rates, database slow queries
- **Solution:** Add APM tool (Datadog, New Relic, or open-source like Prometheus)

### 2. No Error Tracking

- **Issue:** Errors in production go unseen
- **Missing:** Stack traces, context, frequency
- **Solution:** Add Sentry or similar error tracking

### 3. No Logging

- **Issue:** No centralized logs for debugging
- **Missing:** Request/response logs, business events
- **Solution:** Add structured logging (winston, pino, or consola with persistence)

### 4. No Database Monitoring

- **Issue:** Can't see slow queries or connection pool status
- **Solution:** Add database monitoring via EXPLAIN ANALYZE, or use database tools

## Deployment & Operations

### 1. No Docker Configuration

- **Issue:** No containerized deployment option
- **Risk:** Deployment inconsistency between environments
- **Solution Needed:** Add `Dockerfile` and `docker-compose.yml`

### 2. No Environment Configuration Best Practices

- **Issue:** Database secrets in `.env` (shared repo)
- **Risk:** Accidental secret commits
- **Mitigation:** Use `.env.example` template (already exists) and `.gitignore` (already configured)

### 3. No Migration Safety Checks

- **Issue:** Migrations run automatically on deploy; no rollback safety
- **Solution:** Add pre-migration backup or change data capture (CDC)

### 4. No Health Check Endpoint

- **Issue:** Load balancers/orchestrators can't determine app health
- **Solution Needed:** Add `GET /api/health` endpoint
  ```typescript
  export default defineEventHandler(async (event) => {
    // Check database, cache, Soketi connectivity
    return { status: "ok" };
  });
  ```

## Dependencies & Compatibility

### 1. No Version Pinning in package.json

- **Issue:** Uses `^` ranges (allows minor updates); could introduce breaking changes
- **Risk:** Low with npm ecosystem, but worth monitoring
- **Solution:** Consider lockfile-only updates or tighter constraints for critical deps

### 2. Nuxt Version Lock

- **Current:** Nuxt 4.4.2 with `^` constraint
- **Issue:** Could auto-update to 5.x (major version) if released
- **Solution:** Monitor Nuxt releases and update intentionally

## Technical Debt Summary

| Issue                | Severity | Effort | Impact                            | Priority |
| -------------------- | -------- | ------ | --------------------------------- | -------- |
| No unit tests        | High     | High   | Enables refactoring, catches bugs | 1        |
| No service layer     | Medium   | Medium | Maintainability, reusability      | 2        |
| No caching           | Medium   | Medium | Performance at scale              | 3        |
| N+1 queries risk     | Medium   | Low    | Performance degradation           | 4        |
| No rate limiting     | Medium   | Low    | Security/DoS protection           | 5        |
| Chart component TODO | Low      | Low    | Code maintenance                  | 6        |
| No Docker            | Low      | Medium | Deployment                        | 7        |
| Message retention    | Medium   | Low    | Storage costs                     | 8        |

## Action Items

### Immediate (This Sprint)

- [x] Add global middleware to check user ban status
- [x] Create health check endpoint
- [x] Audit all collection endpoints for pagination
- [x] Document all environment variables in README

### Short-term (Next 2 Sprints)

- [x] Setup Vitest and write tests for repositories
- [x] Add error logging with consola
- [x] Implement rate limiting middleware
- [x] Resolve chart component TODO
- [x] Add CSRF protection middleware

### Medium-term (Next Month)

- [ ] Create service layer for business logic
- [ ] Add integration tests
- [ ] Implement Redis for session/query caching
- [ ] Add message retention job
- [ ] Create Docker configuration

### Long-term (Roadmap)

- [ ] Setup APM monitoring
- [ ] Add E2E tests with Playwright
- [ ] Implement database replication
- [ ] Setup Soketi clustering
- [ ] Add comprehensive documentation
