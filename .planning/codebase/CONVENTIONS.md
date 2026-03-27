# Code Style & Conventions

## TypeScript

### Strict Mode
- **Enabled:** Yes (via tsconfig.json)
- **No `any`:** Prohibited; always type parameters and return values
- **Null Safety:** Explicit nullability with `T | null` or `T | undefined`

### Type Definitions
- **Interface vs Type:** Prefer `interface` for object shapes, `type` for unions/aliases
- **Shared Types:** All user-facing models in `shared/types.ts`
- **File Naming:** Entity types use filenames matching the entity (e.g., `server/models/user.ts`)

### Example Patterns
```typescript
// ✅ Proper typing
export interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  banned: boolean;
  banExpires: string | null;
}

// ✅ Function signatures
async function getUser(id: string): Promise<User | null> {
  // ...
}

// ❌ Avoid any
function processData(data: any): void { } // BAD

// ✅ Use generics instead
function processData<T>(data: T): T { }
```

## Vue Components

### Structure
```vue
<script setup lang="ts">
// Import statements
// Ref/reactive state
// Computed properties
// Methods
// Lifecycle hooks
</script>

<template>
  <!-- Component markup -->
</template>

<style scoped>
/* Component styles (scoped) */
</style>
```

### Naming
- **File names:** PascalCase (`Navbar.vue`, `UserMenu.vue`)
- **Component names:** Auto-imported, use full name when necessary
- **Props:** Defined with explicit types

### Props Pattern
```typescript
interface Props {
  label: string;
  disabled?: boolean;
  variant?: "default" | "primary" | "danger";
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  variant: "default",
});
```

### Event Handling
- **Emits:** Define all events with `defineEmits<{ eventName: [args] }>()`
- **Naming:** kebab-case in templates, camelCase in TypeScript

## Composables

### Pattern
```typescript
export function useMyFeature() {
  const state = ref("");
  const computed = computed(() => state.value.toUpperCase());
  
  const method = () => {
    // ...
  };
  
  return { state, computed, method };
}
```

### Return Values
- Always return an object with named exports
- Provide clear public API
- Prefix private state with underscore if needed

## Backend Routes

### File Organization
```typescript
// server/api/[resource]/[id].ts
import { useAuth } from "~/server/lib/auth";
import { ApplicationRepository } from "~/server/repositories/application.repository";

export default defineEventHandler(async (event) => {
  // 1. Validate auth
  const session = await useAuth().getSession(event);
  if (!session) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  // 2. Validate input
  const { id } = getRouterParams(event);
  if (!id) {
    throw createError({ statusCode: 400, message: "ID required" });
  }

  // 3. Execute business logic
  const repo = new ApplicationRepository();
  const app = await repo.getById(id);
  
  if (!app || app.user_id !== session.user.id) {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  // 4. Return response
  return { data: app };
});
```

### HTTP Method Conventions
- `index.ts` → GET (list)
- `index.post.ts` → POST (create)
- `[id].ts` → GET (fetch single)
- `[id].put.ts` → PUT (update)
- `[id].delete.ts` → DELETE (delete)
- `action.ts` → POST (custom action, e.g., `ban.ts`)

### Error Handling
```typescript
// Use H3 createError for HTTP errors
throw createError({
  statusCode: 404,
  statusMessage: "Not Found",
  message: "Application not found"
});

// Status codes
// 200 OK, 201 Created
// 400 Bad Request (validation)
// 401 Unauthorized (auth)
// 403 Forbidden (permission)
// 404 Not Found
// 500 Server Error
```

### Response Format
```typescript
// Single resource
return { data: user };

// Collection with pagination
return {
  data: users,
  meta: {
    total: 100,
    perPage: 10,
    currentPage: 1,
    lastPage: 10
  }
};

// Error
throw createError({ statusCode: 400, message: "..." });
```

## Database & ORM

### Model Definition
```typescript
import { Model } from "~/server/lib/orm/model";
import type { User as UserType } from "#shared/types";

export class User extends Model implements UserType {
  public static table = "sktp_users";
  
  public static casts = {
    emailVerified: "boolean" as const,
    banned: "boolean" as const,
  };

  public id!: string;
  public email!: string;
  public emailVerified!: boolean;
  // ... other properties
}
```

### Repository Pattern
```typescript
export class UserRepository {
  async getById(id: string): Promise<User | null> {
    const row = await db.select().from("sktp_users").where("id", id).first();
    return row ? new User(row) : null;
  }

  async getAll(page = 1, perPage = 10) {
    const query = db.select().from("sktp_users");
    const total = await query.count("* as count").first();
    
    const users = await query
      .limit(perPage)
      .offset((page - 1) * perPage);

    return {
      data: users.map(row => new User(row)),
      meta: { total: total.count, perPage, currentPage: page, lastPage: Math.ceil(total.count / perPage) }
    };
  }

  async create(data: Partial<User>): Promise<User> {
    const [id] = await db.insert(data).into("sktp_users");
    return this.getById(id) as Promise<User>;
  }
}
```

### Query Patterns
```typescript
// Always use Knex builder (no raw SQL)
const users = await db.select("*").from("sktp_users");
const user = await db.select().from("sktp_users").where("id", userId).first();
const count = await db.count("* as count").from("sktp_users").first();

// Joins
const apps = await db
  .select("a.*", "u.name as user_name")
  .from("sktp_applications as a")
  .join("sktp_users as u", "a.user_id", "u.id");

// Pagination
const page = 1, perPage = 10;
const results = await db
  .select()
  .from("sktp_users")
  .limit(perPage)
  .offset((page - 1) * perPage);
```

## Form Validation

### Zod Schemas
```typescript
import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
  name: z.string().min(1, "Name required"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
```

### Usage in Routes
```typescript
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  try {
    const data = createUserSchema.parse(body);
    // Process validated data
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error.issues.map(i => i.message).join(", ")
    });
  }
});
```

## Styling

### Tailwind CSS v4
- **Syntax:** Use `class=""` directly, no need for `@apply` in most cases
- **Responsive:** Prefix with breakpoint: `md:text-lg`, `lg:flex`
- **Dark Mode:** Prefix with `dark:`: `dark:bg-slate-900`
- **Variants:** Use built-in variants: `hover:`, `focus:`, `disabled:`

### Component Classes
```vue
<template>
  <!-- ✅ Descriptive and semantic -->
  <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
    Click me
  </button>

  <!-- ✅ Use cn() helper for conditional classes -->
  <div :class="cn('p-4 rounded', isActive && 'bg-blue-100 border-blue-500')">
    Content
  </div>

  <!-- ❌ Avoid @apply, use classes directly -->
  <style scoped>
    .btn { @apply px-4 py-2 rounded; } /* Not preferred */
  </style>
</template>
```

### Color Palette
- **Primary:** `blue-600` (links, primary buttons)
- **Success:** `green-600`
- **Warning:** `amber-600`
- **Danger:** `red-600`
- **Background:** `white`, `gray-50`, `gray-900` (dark mode)
- **Text:** `gray-900` (light), `white` (dark mode)
- **Borders:** `gray-200` (light), `gray-700` (dark mode)

### Shadcn Vue Components
```vue
<template>
  <!-- Use Shadcn components from auto-imports -->
  <Button variant="default" size="lg">Default</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="destructive">Delete</Button>
  <Button disabled>Disabled</Button>

  <!-- Card layout -->
  <Card>
    <CardHeader>
      <CardTitle>Title</CardTitle>
    </CardHeader>
    <CardContent>Content</CardContent>
  </Card>

  <!-- Dialog/Modal -->
  <Dialog>
    <DialogTrigger>Open</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm</DialogTitle>
      </DialogHeader>
      Dialog content
    </DialogContent>
  </Dialog>
</template>

<!-- ✅ Use cn() for merging custom classes with component defaults -->
<script setup lang="ts">
const customClass = cn("text-sm", props.isSmall && "text-xs");
</script>
```

## Auth Patterns

### Client-Side
```typescript
// app/composables/useAuth.ts pattern
const { user, isAuthenticated, signIn, signOut } = useAuth();

// Route protection
if (!isAuthenticated.value) {
  navigateTo("/login");
}
```

### Server-Side
```typescript
// Check auth in route handler
const session = await useAuth().getSession(event);
if (!session?.user) {
  throw createError({ statusCode: 401 });
}

// Use session data
const userId = session.user.id;
```

## Naming Conventions

### Variables & Functions
- **camelCase:** `userName`, `getUserData()`, `isLoading`
- **Constants:** `UPPERCASE_SNAKE_CASE` only if truly constant
- **Boolean flags:** Prefix with `is`, `has`, `can`: `isLoading`, `hasError`

### Files & Directories
- **Directories:** kebab-case: `data-table/`, `ui/components/`
- **Components:** PascalCase: `Navbar.vue`, `UserCard.vue`
- **Composables:** camelCase + `use` prefix: `useAuth.ts`
- **Utils:** camelCase: `utils.ts`, `helpers.ts`
- **Models/Classes:** PascalCase: `User.ts`, `Model.ts`
- **Routes:** kebab-case or index pattern: `[id].ts`, `index.post.ts`

### Database
- **Tables:** snake_case with prefix: `sktp_users`, `sktp_applications`
- **Columns:** snake_case: `user_id`, `created_at`, `max_connections`
- **Relationships:** snake_case foreign keys: `user_id`, `app_id`

## Comments

### When to Comment
- **Complex logic:** Explain the "why" not the "what"
- **Workarounds:** Document why a non-obvious solution was chosen
- **Gotchas:** Note potential issues or side effects

### When NOT to Comment
- Self-explanatory code
- Type hints that speak for themselves
- One-liners or obvious assignments

### Example
```typescript
// ✅ Good: explains the why
// Cache results for 5 minutes to reduce database hits
const cachedUser = memo(() => getUser(id), { maxAge: 5 * 60 * 1000 });

// ❌ Bad: obvious what the code does
// Get the user's email
const email = user.email;

// ✅ Good: documents a gotcha
// Must compare role before checking permissions—role is transformed in middleware
if (user.role === "admin" && hasPermission(user.id)) { ... }
```

## Code Organization

### Import Order
1. External libraries (`vue`, `zod`, etc.)
2. Nuxt utilities (`#app`, `#shared`)
3. Local modules (`~/server`, `~/app`)
4. Types and interfaces

```typescript
import { ref, computed } from "vue";
import { z } from "zod";
import { defineEventHandler, useAuth } from "#app";
import type { User } from "#shared/types";
import { UserRepository } from "~/server/repositories/user.repository";
```

### Avoid Circular Imports
- Models import types, types don't import models
- Repositories use models, routes use repositories
- Composables use utils, utils don't use composables

## Performance Guidelines

### Frontend
- Lazy-load routes: `defineRouteRules` in component
- Memoize expensive computed properties
- Use `<ClientOnly>` for components that need SSR hydration mismatch workarounds
- Prefer `const` over `let` when possible

### Backend
- Use repository pattern for testability
- Batch database queries where possible
- Implement pagination for large collections (10-25 items per page)
- Cache expensive queries if data doesn't change frequently

### Database
- Add indexes on frequently queried columns (`user_id`, `app_id`)
- Use `limit()` and `offset()` for pagination
- Avoid N+1 queries (use eager loading via joins)
