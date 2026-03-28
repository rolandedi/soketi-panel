# Coding Conventions

**Analysis Date:** 2026-03-27

## TypeScript Usage

**Strict Mode:**
- TypeScript is configured with strict typing via Nuxt's auto-generated tsconfig
- Root `tsconfig.json` references `.nuxt/tsconfig.*` configs for app, server, shared, and node contexts
- Avoid `any` type - use proper type definitions from `#shared/types`

**Type Safety:**
- All API endpoints use Zod schemas for runtime validation
- Models implement shared interfaces for type consistency
- Composables and utilities are fully typed with TypeScript

## Naming Conventions

**Files:**
- **API routes**: `[resource]/[action].httpMethod.ts` (e.g., `users/index.post.ts`, `users/[id].put.ts`)
- **Components**: PascalCase (e.g., `CreateUserModal.vue`, `DataTable.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Models**: PascalCase matching entity name (e.g., `user.ts`, `application.ts`)
- **Repositories**: `[Entity]Repository.ts` (e.g., `user.repository.ts`)
- **Validations**: `[action]Scheme.ts` (e.g., `createUserScheme.ts`)
- **Utils**: camelCase (e.g., `utils.ts`)

**Functions:**
- camelCase for all functions
- Descriptive names indicating action (e.g., `handleFetch`, `handleCreated`, `validateWith`)
- Async functions use `async/await` pattern

**Variables:**
- camelCase for variables and constants
- Const used for immutable values
- Reactive refs use `ref()` with descriptive names

**Components:**
- PascalCase for Vue component filenames
- Single-file components (`.vue`) for UI components
- Export main component as default in `index.ts` barrel files

## Code Organization Patterns

**Project Structure:**
```
soketi-panel/
├── app/                    # Frontend application
│   ├── components/        # Vue components
│   │   ├── ui/           # Shadcn Vue base components
│   │   ├── data-table/   # DataTable components
│   │   └── modals/       # Modal components
│   ├── composables/       # Reusable Vue logic
│   ├── layouts/          # Layout components
│   ├── lib/              # Frontend utilities
│   ├── pages/            # File-based routing
│   └── table-columns/    # DataTable column definitions
├── server/                # Nitro backend
│   ├── api/              # REST API endpoints
│   ├── lib/              # Server utilities
│   │   ├── auth.ts      # Better Auth configuration
│   │   ├── orm/         # Custom ORM layer
│   │   └── utils.ts     # Server helpers
│   ├── middleware/       # API middleware
│   ├── models/           # Database models
│   ├── repositories/     # Data access layer
│   ├── services/         # Business logic
│   └── validations/      # Zod schemas
├── shared/               # Shared code
│   ├── types.ts         # TypeScript interfaces
│   └── utils.ts         # Shared utilities
├── database/             # Knex migrations & seeds
└── test/                 # Vitest tests
```

**Layer Separation:**
- **Frontend (`app/`)**: UI components, composables, pages, client-side logic
- **Backend (`server/`)**: API routes, repositories, services, validations
- **Shared (`shared/`)**: Type definitions, constants, utilities used by both

## Import/Export Patterns

**Path Aliases:**
- `@/` or `~/` - Maps to `app/` directory
- `~~/` - Maps to project root (used in server files)
- `#shared/` - Maps to `shared/` directory

**Import Organization:**
1. External dependencies (Vue, libraries)
2. Internal imports (using aliases)
3. Relative imports (components, utils)

**Example:**
```typescript
import { ref, onMounted } from "vue";
import type { PaginatedResponse, User } from "#shared/types";
import { usersColumns } from "~/table-columns/usersColumns";
import { DataTable } from "~/components/data-table";
import CreateUserModal from "~/components/modals/CreateUserModal.vue";
```

**Barrel Exports:**
- UI components use `index.ts` for named exports
- Example: `app/components/ui/button/index.ts` exports `Button` component and `buttonVariants`

**Default vs Named Exports:**
- Vue components: Default export (`export default defineComponent(...)`)
- Utilities: Named exports (`export function cn(...)`)
- Types: Named exports (`export interface User { ... }`)

## Error Handling Approaches

**API Error Handling:**
- Use `createError()` from H3/Nitro for API errors
- Always include `statusCode` and `statusMessage`
- Log errors with context using `logError()` helper

**Pattern:**
```typescript
try {
  return await userRepository.create(data);
} catch (err: any) {
  logError("users.create", err);
  throw createError({
    statusCode: 500,
    statusMessage: err.message || "Failed to create user",
  });
}
```

**Validation Errors:**
- Use `createValidationError()` helper for Zod validation failures
- Returns 400 status with first validation issue message

**Logging:**
- Use `consola` for structured logging
- `logError(context, error)` helper includes context tag and error details
- Console errors mocked during tests to avoid noise

**Frontend Error Handling:**
- Use `try/catch/finally` with loading states
- Display errors via toast notifications (`vue-sonner`)

```typescript
async function handleFetch() {
  loading.value = true;
  try {
    const res = await $fetch<PaginatedResponse<User>>("/api/users");
    data.value = res.data;
  } catch (err: any) {
    toast.error(err?.message || "Failed to fetch users");
  } finally {
    loading.value = false;
  }
}
```

## Validation Patterns (Zod)

**Schema Definition:**
- All API request validation uses Zod schemas
- Schemas located in `server/validations/[entity]/[action]Scheme.ts`
- Export both schema and inferred type

**Example:**
```typescript
import { z } from "zod";

export const createUserScheme = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(255, "Name must be at most 255 characters long"),
  email: z.email("Invalid email address"),
  role: z.enum(["user", "admin"], "Invalid role"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(255, "Password must be at most 255 characters long"),
});

export type CreateUserScheme = z.infer<typeof createUserScheme>;
```

**Validation Helper:**
```typescript
export async function validateWith(
  event: H3Event,
  source: "body" | "query" | "params",
  schema: z.ZodType<any>
) {
  let data: any;
  switch (source) {
    case "body":
      data = await readBody(event);
      break;
    case "query":
      data = getQuery(event);
      break;
    case "params":
      data = getRouterParams(event);
      break;
  }
  return schema.safeParse(data);
}
```

**Usage in API Routes:**
```typescript
const { data, error } = await validateWith(event, "body", createUserScheme);
if (error) {
  throw createValidationError(error);
}
```

## Type Definitions and Models

**Shared Types:**
- Core interfaces defined in `shared/types.ts`
- Used by both frontend and backend for type consistency
- Includes: `User`, `Application`, `Message`, `PaginatedResponse<T>`

**Example:**
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: "admin" | "user";
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}
```

**Database Models:**
- Extend base `Model` class from `server/lib/orm/model.ts`
- Define static `table` property for table name
- Define static `casts` for type conversion (boolean, number, string, json)
- Implement shared interface for type safety

**Example:**
```typescript
import type { User as UserType } from "#shared/types";
import { Model } from "../lib/orm/model";

export class User extends Model implements UserType {
  public static override table = "sktp_users";

  public static override casts = {
    emailVerified: "boolean" as const,
    banned: "boolean" as const,
  };

  public id!: string;
  public name!: string;
  public email!: string;
  // ... other properties
}
```

**Model Pattern:**
- Repository pattern for data access (`UserRepository`)
- Models handle database queries via Knex
- Repositories encapsulate business logic and auth operations

## Comment and Documentation Standards

**JSDoc Comments:**
- Use JSDoc for composables and complex functions
- Include description, params, and return type

**Example:**
```typescript
/**
 * Reactive composable wrapping Better Auth client methods.
 * Exposes session state and auth actions for use in components and middleware.
 */
export function useAuth() {
  // ...
}
```

**Inline Comments:**
- Use sparingly - code should be self-documenting
- French comments present in some files (middleware, auth)
- Prefer English for consistency

**Test Comments:**
- Describe test setup and purpose
- Use `describe` blocks for organization
- Include comments for mock restoration

**TODO Comments:**
- Track technical debt with inline comments
- Documented in `.planning/codebase/CONCERNS.md`

## Component Patterns

**Vue 3 Composition API:**
- Use `<script setup lang="ts">` syntax
- Define props with `defineProps<Props>()`
- Use `withDefaults()` for prop defaults

**Example:**
```vue
<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { Primitive } from "reka-ui"
import { cn } from "@/lib/utils"

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  class?: HTMLAttributes["class"]
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
})
</script>

<template>
  <Primitive
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
```

**UI Components:**
- Use Shadcn Vue components from `app/components/ui/`
- Use `cn()` helper for class merging
- Use `lucide-vue-next` for icons
- Support variants via `class-variance-authority` (cva)

**Data Tables:**
- Use `@tanstack/vue-table` via custom DataTable components
- Column definitions in `app/table-columns/[entity]Columns.ts`
- Reusable components: `DataTable`, `DataTableColumnHeader`, `DataTableRowActions`

## State Management

**Composables:**
- Use `useAuth()` for authentication state
- Reactive state via Vue's `ref()` and `computed()`
- No global state management library (Pinia/Vuex) - use composables

**Example:**
```typescript
export function useAuth() {
  const session = authClient.useSession();
  const user = computed(() => session.value?.data?.user ?? null);
  const isAuthenticated = computed(() => !!session.value?.data?.session);
  
  return {
    session,
    user,
    isAuthenticated,
    signIn,
    signOut,
  };
}
```

## Utility Functions

**Class Name Merger:**
```typescript
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage:**
```typescript
: class="cn(buttonVariants({ variant, size }), props.class)"
```

---

*Convention analysis: 2026-03-27*
