// Public routes that don't require authentication
const PUBLIC_ROUTES = new Set(["/login", "/auth/login"]);

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth();

  // Allow public routes without session check
  if (PUBLIC_ROUTES.has(to.path)) {
    return;
  }

  // If no session, redirect to login
  if (!auth.isAuthenticated.value) {
    return navigateTo("/login");
  }
});
