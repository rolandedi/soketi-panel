# Testing Patterns

**Analysis Date:** 2026-03-27

## Test Framework

**Runner:**
- Vitest 4.1.2
- Config: `vitest.config.ts`

**Assertion Library:**
- Vitest built-in assertions (Jest-compatible API)

**Environment:**
- Happy DOM for DOM simulation
- Setup file: `test/setup.ts`

**Run Commands:**
```bash
pnpm test              # Run all tests in watch mode
pnpm test:run          # Run all tests once
pnpm test:ui           # Open Vitest UI
pnpm test:coverage     # Run tests with coverage report
```

## Test File Organization

**Location:**
- Tests in `test/` directory at project root
- Co-located with source structure (e.g., `test/repositories/user.repository.test.ts`)

**Naming:**
- Pattern: `[name].test.ts`
- Example: `user.repository.test.ts`, `utils.test.ts`

**Structure:**
```
test/
├── setup.ts                  # Global test setup
├── utils.test.ts            # Utility function tests
└── repositories/
    └── user.repository.test.ts  # Repository tests
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { UserRepository } from "../../server/repositories/user.repository";
import { User } from "../../server/models/user";

describe("UserRepository", () => {
  let repository: UserRepository;

  beforeEach(() => {
    repository = new UserRepository();
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return paginated users with default parameters", async () => {
      const mockUsers = [
        { id: "1", email: "test1@example.com", name: "Test 1" },
      ];

      vi.mocked(User.paginate).mockResolvedValue({
        data: mockUsers,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      });

      const result = await repository.getAll();

      expect(User.paginate).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual({
        data: mockUsers,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      });
    });
  });
});
```

**Patterns:**
- Use `describe` blocks for logical grouping
- `beforeEach` for test isolation
- `vi.clearAllMocks()` to reset mocks between tests
- Arrange-Act-Assert pattern in test cases

## Mocking

**Framework:** Vitest mocking utilities

**Patterns:**
```typescript
// Mock modules
vi.mock("../../server/models/user", () => ({
  User: {
    paginate: vi.fn(),
    find: vi.fn(),
  },
}));

vi.mock("../../server/lib/auth", () => ({
  auth: {
    api: {
      createUser: vi.fn(),
      updateUser: vi.fn(),
      removeUser: vi.fn(),
      banUser: vi.fn(),
      unbanUser: vi.fn(),
    },
  },
}));

// Mock typed functions
vi.mocked(User.paginate).mockResolvedValue({
  data: mockUsers,
  pagination: { ... },
});

// Mock console
const originalWarn = console.warn;
console.warn = vi.fn();

// Restore after tests
afterAll(() => {
  console.warn = originalWarn;
});
```

**What to Mock:**
- Database models and queries
- External APIs (Better Auth, Pusher)
- File system operations
- Time-dependent functions (use `vi.useFakeTimers()`)

**What NOT to Mock:**
- Utility functions being tested
- Pure functions with no side effects
- Test helpers and fixtures

## Fixtures and Factories

**Test Data:**
```typescript
const mockUsers = [
  { id: "1", email: "test1@example.com", name: "Test 1" },
  { id: "2", email: "test2@example.com", name: "Test 2" },
];

const mockUser = {
  id: "user-123",
  email: "test@example.com",
  name: "Test User",
  role: "admin",
};
```

**Location:**
- Inline in test files for simple cases
- Consider `test/fixtures/` for complex shared fixtures (not yet implemented)

## Coverage

**Requirements:** Not currently enforced

**Configuration:**
```typescript
coverage: {
  provider: "v8",
  reporter: ["text", "json", "html"],
  include: ["server/**/*.{ts,js}", "app/**/*.{ts,vue}"],
  exclude: [
    "test/**",
    "**/node_modules/**",
    "**/.nuxt/**",
    "**/dist/**",
    "**/*.d.ts",
    "**/*.config.ts",
  ],
}
```

**View Coverage:**
```bash
pnpm test:coverage
# Opens HTML report in browser
```

## Test Types

**Unit Tests:**
- **Scope:** Individual functions, classes, composables
- **Approach:** Mock dependencies, test in isolation
- **Examples:**
  - Repository methods (`UserRepository.getAll()`)
  - Utility functions (`cn()` class merger)
  - Validation schemas (Zod schemes)

**Integration Tests:**
- **Scope:** Multiple components working together
- **Approach:** Minimal mocking, test interactions
- **Not yet implemented** - future opportunity

**E2E Tests:**
- **Framework:** Not configured
- **Future:** Consider Playwright or Cypress
- **Test flows:**
  - Login/logout
  - User CRUD operations
  - Application management

## What's Being Tested

**Currently Covered:**

1. **Repositories** (`test/repositories/user.repository.test.ts`):
   - `UserRepository.getAll()` - pagination
   - `UserRepository.getById()` - single fetch
   - Mocking of User model and Better Auth API

2. **Utilities** (`test/utils.test.ts`):
   - `cn()` className merger function
   - Conditional class handling
   - Tailwind merge behavior
   - Validation helper existence checks

**Test Infrastructure:**
- Setup file mocks console.error to reduce noise
- Vitest configured with globals enabled
- Happy DOM for lightweight DOM simulation

## Missing Test Coverage

**High Priority:**

1. **API Routes:**
   - `server/api/users/index.post.ts`
   - `server/api/users/[id].put.ts`
   - `server/api/users/[id].delete.ts`
   - `server/api/users/ban.ts`
   - `server/api/applications/*`
   - `server/api/auth/[...all].ts`

2. **Validation Schemas:**
   - `createUserScheme`
   - `updateUserScheme`
   - `banUserScheme`
   - Test valid/invalid inputs

3. **Composables:**
   - `useAuth()` - authentication state
   - Test reactive behavior

4. **Models:**
   - `User` model methods
   - `Application` model methods
   - `Model` base class pagination

5. **Middleware:**
   - `auth.ts` - session handling
   - `user-admin.ts` - admin protection
   - `rate-limit.ts` - rate limiting
   - `csrf.ts` - CSRF protection

**Medium Priority:**

6. **Services:**
   - `server/services/kv.ts` - key-value operations
   - `server/services/crypto.ts` - crypto utilities

7. **Frontend Components:**
   - DataTable components
   - Modal components
   - Form components

8. **Database Operations:**
   - Knex queries
   - Migrations (test rollback/apply)

**Low Priority:**

9. **Shared Utils:**
   - `shared/utils.ts` functions

10. **E2E Flows:**
    - Complete user workflows
    - Real-time features (Pusher integration)

## Common Patterns

**Async Testing:**
```typescript
it("should return paginated users", async () => {
  vi.mocked(User.paginate).mockResolvedValue(mockData);
  const result = await repository.getAll();
  expect(result).toEqual(expected);
});
```

**Error Testing:**
```typescript
it("should throw error on invalid input", async () => {
  vi.mocked(User.find).mockRejectedValue(new Error("Not found"));
  await expect(repository.getById("invalid")).rejects.toThrow("Not found");
});
```

**Testing Validation:**
```typescript
import { createUserScheme } from "~/server/validations/users/createUserScheme";

describe("createUserScheme", () => {
  it("should accept valid user data", () => {
    const validData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "user" as const,
    };
    const result = createUserScheme.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const invalidData = { ...validData, email: "invalid" };
    const result = createUserScheme.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["email"]);
  });
});
```

**Testing Composables:**
```typescript
import { renderHook, act } from "@testing-library/vue";
import { useAuth } from "~/composables/useAuth";

describe("useAuth", () => {
  it("should return authentication state", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.value.isAuthenticated.value).toBe(false);
  });

  it("should sign in successfully", async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.value.signIn("test@example.com", "password");
    });
    expect(result.value.isAuthenticated.value).toBe(true);
  });
});
```

## Vitest Configuration

**Config File:** `vitest.config.ts`
```typescript
import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup.ts"],
    include: ["test/**/*.test.{ts,js}"],
    exclude: [
      "**/node_modules/**",
      "**/.nuxt/**",
      "**/dist/**",
      "**/playwright/**",
      "**/e2e/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["server/**/*.{ts,js}", "app/**/*.{ts,vue}"],
    },
  },
});
```

## Test Setup

**File:** `test/setup.ts`
```typescript
import { afterAll } from "vitest";

// Mock console.error during tests to avoid noise
const originalConsoleError = console.error;
console.error = (...args) => {
  // Only log errors that are not expected during tests
  if (args[0]?.toString().includes("CSRF") || 
      args[0]?.toString().includes("Rate limit")) {
    originalConsoleError(...args);
  }
};

// Cleanup after all tests
afterAll(() => {
  console.error = originalConsoleError;
});
```

## Running Tests

**Development:**
```bash
pnpm test              # Watch mode - reruns on file changes
pnpm test:ui           # Open Vitest dashboard
```

**CI/Production:**
```bash
pnpm test:run          # Run once and exit
pnpm test:coverage     # Run with coverage report
```

**Filter Tests:**
```bash
pnpm test user         # Run tests matching "user"
pnpm test -- --grep "should return"  # Run tests matching pattern
```

## Future Testing Improvements

1. **Add Integration Tests:**
   - Test API routes with real database (test container)
   - Test middleware chains
   - Test validation + repository integration

2. **Component Testing:**
   - Add `@testing-library/vue` for Vue component tests
   - Test user interactions
   - Test prop validation and events

3. **E2E Testing:**
   - Set up Playwright
   - Test critical user flows
   - Visual regression testing

4. **Test Coverage Enforcement:**
   - Set minimum coverage thresholds
   - Add coverage badge to README
   - Block PRs below threshold

5. **Test Utilities:**
   - Create test factories for mock data
   - Add test helpers for common setups
   - Mock Better Auth consistently

---

*Testing analysis: 2026-03-27*
