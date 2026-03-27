# Testing & Quality Assurance

## Current Testing Status

**Testing Framework:** None currently configured

- No `vitest`, `jest`, or other test runners installed
- No test files (`.test.ts`, `.spec.ts`) present in codebase

## Recommended Testing Strategy

### Frontend Unit Tests (Recommended Setup)

- **Framework:** Vitest (similar API to Jest, Vite-native)
- **Component Testing:** @vue/test-utils (official Vue testing library)
- **Utilities:** Happy-dom or jsdom for DOM simulation
- **What to test:**
  - Composables (`useAuth.ts`)
  - Utility functions (`cn()`, `utils.ts`)
  - Component props and events (Navbar, UserMenu, modals)

### Backend Unit Tests (Recommended Setup)

- **Framework:** Vitest
- **Mocking:** Vitest mocking, or msw for HTTP mocks
- **What to test:**
  - Repository methods (database queries)
  - Validation schemas (Zod)
  - API route handlers (create, update, delete)
  - Service logic (if services are added)

### E2E Tests (Future)

- **Framework:** Playwright or Cypress
- **What to test:**
  - Login/logout flow
  - Application CRUD workflow
  - User management workflow
  - Real-time messaging (via Pusher)

## Code Quality

### Linting

- **Tool:** ESLint (configured via `@nuxt/eslint`)
- **Config File:** `eslint.config.mjs` (flat config format)
- **Current Status:** Minimal configuration (inherits Nuxt defaults)
- **Severity:** Errors only (no warnings as errors)

### Type Checking

- **Tool:** TypeScript 5.9.3
- **Mode:** Strict mode enabled
- **Checker:** Vue TSC 3.2.3 for component types
- **Validation Schemas:** Zod for runtime validation

### Build Process

```bash
pnpm build     # Nuxt production build (includes type checking)
pnpm dev       # Nuxt dev server with HMR
pnpm preview   # Preview production build locally
```

### Pre-commit Hooks (Not Currently Set Up)

Would typically use `husky` + `lint-staged` to:

- Run ESLint on staged files
- Run TypeScript type check
- Run tests on affected files
- Prevent commits with violations

## Known Code Issues & TODOs

### Documented TODOs

- **Location:** `app/components/ui/chart/ChartTooltipContent.vue`
- **Issue:** Currently using `createElement` and `render` for tooltip rendering
- **Reason:** Template-based rendering not suitable for dynamic content
- **Priority:** Low (chart component working, but could be optimized)

## Quality Metrics (Baseline)

### Coverage Gaps

- **No unit tests** → 0% coverage
- **No integration tests** → Manual testing required
- **No E2E tests** → QA relies on manual flows

### Codebase Health Indicators

- **TypeScript Strict Mode:** ✅ Enabled (good type safety)
- **No `any` Types:** ✅ Generally clean (no unsafe types observed)
- **ESLint:** ✅ Configured (minimal violations expected)
- **Component Structure:** ✅ Well-organized (pages, components, composables)
- **API Route Structure:** ✅ Follows conventions (REST patterns)

## Testing Strategy Moving Forward

### Phase 1: Setup & Infrastructure

1. Install Vitest and dependencies
2. Configure `vitest.config.ts`
3. Add testing utilities and test helpers
4. Create test template files

### Phase 2: Composables & Utils

1. Test `useAuth.ts` (session state, login, logout)
2. Test `cn()` utility (class merging)
3. Test shared `types.ts` (type guards if added)

### Phase 3: API Routes

1. Test user routes (GET, POST, PUT, DELETE)
2. Test application routes
3. Test auth route delegation
4. Test error handling (401, 403, 404)

### Phase 4: Repositories

1. Test `UserRepository` (query methods)
2. Test `ApplicationRepository`
3. Test `MessageRepository`
4. Test pagination logic

### Phase 5: Models

1. Test ORM `Model` base class (casting, instantiation)
2. Test model properties and relationships

### Phase 6: E2E

1. Setup Playwright
2. Test complete user workflows
3. Test data consistency across flows

## Testing Best Practices

### Unit Test Pattern

```typescript
// tests/server/repositories/user.repository.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { UserRepository } from "~/server/repositories/user.repository";
import { db } from "~/server/lib/orm/db";

describe("UserRepository", () => {
  let repo: UserRepository;

  beforeEach(async () => {
    repo = new UserRepository();
    // Setup test data
  });

  afterEach(async () => {
    // Cleanup test data
  });

  it("should get user by id", async () => {
    const user = await repo.getById("123");
    expect(user).toBeDefined();
    expect(user?.email).toBe("test@example.com");
  });

  it("should return null for non-existent user", async () => {
    const user = await repo.getById("invalid-id");
    expect(user).toBeNull();
  });
});
```

### Component Test Pattern

```typescript
// tests/app/composables/useAuth.test.ts
import { describe, it, expect } from "vitest";
import { useAuth } from "~/app/composables/useAuth";

describe("useAuth", () => {
  it("should return auth state and methods", () => {
    const { user, isAuthenticated, signIn, signOut } = useAuth();

    expect(user).toBeDefined();
    expect(isAuthenticated).toBeDefined();
    expect(typeof signIn).toBe("function");
    expect(typeof signOut).toBe("function");
  });
});
```

### API Route Test Pattern

```typescript
// tests/server/api/users/index.test.ts
import { describe, it, expect } from "vitest";
import { createEventHandler } from "h3";
import handler from "~/server/api/users/index.ts";

describe("GET /api/users", () => {
  it("should return paginated users", async () => {
    const result = await handler({
      /* mock event */
    });

    expect(result.data).toBeInstanceOf(Array);
    expect(result.meta.total).toBeGreaterThanOrEqual(0);
  });

  it("should return 401 if not authenticated", async () => {
    // Test without auth
  });
});
```

## Manual Testing Checklist

### Authentication

- [ ] User registration with valid email/password
- [ ] User login with correct credentials
- [ ] Login fails with incorrect password
- [ ] Logout clears session
- [ ] Protected routes redirect to login
- [ ] Admin-only routes block non-admin users

### Users Management

- [ ] List all users with pagination
- [ ] Search/filter users
- [ ] Create new user (admin only)
- [ ] Edit user details
- [ ] Delete user account
- [ ] Ban/unban user functionality
- [ ] Role assignment (admin/user)

### Applications Management

- [ ] Create new application
- [ ] View application details (key, secret)
- [ ] Edit application settings
- [ ] Delete application
- [ ] Configure WebSocket settings (max connections, events per second, etc.)
- [ ] Enable/disable application

### Messages & Real-time

- [ ] View message history
- [ ] Messages paginated correctly
- [ ] Real-time message updates via Pusher
- [ ] WebSocket playground connects to Soketi
- [ ] Event broadcasting works

### UI/UX

- [ ] Dark/light mode toggle works
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Form validation messages display correctly
- [ ] Error toasts appear for failed operations
- [ ] Success toasts appear for completed operations
- [ ] Loading states show during async operations

### Database

- [ ] Migrations run without errors
- [ ] All tables created with correct schema
- [ ] Foreign key relationships work
- [ ] Data persists after page reload
- [ ] Pagination queries are performant

## Performance Considerations

### Database

- **N+1 Query Problem:** Could occur when fetching users with applications
  - Solution: Use Knex joins or implement eager loading
  - Example: `select().from('users').join('applications', ...)`

### Real-time

- **WebSocket Scalability:** Single Soketi instance may bottleneck at scale
  - Solution: Use Redis adapter for multi-instance Soketi
  - Future: Implement pub/sub for server-to-client messaging

### Frontend

- **Bundle Size:** Shadcn components imported but unused will bloat bundle
  - Solution: Use tree-shaking and component-level imports
  - Monitor: Check build output with `pnpm build`

### Monitoring

- No built-in monitoring/metrics yet
- Could add:
  - Sentry for error tracking
  - Application metrics (API response times, error rates)
  - Database query profiling

## Security Considerations

### Current Implementation

- ✅ Auth via Better Auth (secure session management)
- ✅ TypeScript prevents some class of bugs
- ✅ Zod validation on all inputs
- ✅ HTTP-only cookies for sessions
- ⚠️ No CSRF protection explicitly mentioned
- ⚠️ No rate limiting on APIs
- ⚠️ No SQL injection prevention (Knex builder is safe, but worth verifying)

### Recommendations

- Add CSRF token validation
- Implement rate limiting (e.g., `express-rate-limit` or Nuxt middleware)
- Audit sensitive operations (user deletion, ban, secret generation)
- Use HTTPS in production (enforce via `nuxt.config.ts`)
- Sanitize user inputs (especially for message payloads)

## CI/CD & Automation

### Current Status

- No CI pipeline configured (no GitHub Actions, GitLab CI, etc.)

### Recommended Pipeline

```yaml
name: CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      -  # Deploy to production
```

## Documentation Gaps

### Missing Documentation

- No API documentation (OpenAPI/Swagger)
- No database schema diagram
- No deployment guide
- No troubleshooting guide for common issues
- No contributing guidelines

### Recommended Additions

- Add README with quick start guide
- Document all environment variables
- Create deployment guide for Docker/Kubernetes
- Document Soketi integration details
- API documentation (could use Swagger or OpenAPI)
