export type ErrorVariant = "info" | "warning" | "danger";

export interface ErrorState {
  code: number;
  title: string;
  description: string;
  variant: ErrorVariant;
}

export function getErrorState(statusCode?: number): ErrorState {
  const code = Number.isFinite(statusCode) ? Number(statusCode) : 500;

  switch (code) {
    case 404:
      return {
        code,
        title: "Page not found",
        description:
          "The page you are looking for does not exist, may have moved, or is temporarily unavailable.",
        variant: "info",
      };
    case 401:
      return {
        code,
        title: "Sign in required",
        description:
          "Your session is missing or expired. Sign in again to continue.",
        variant: "warning",
      };
    case 403:
      return {
        code,
        title: "Access denied",
        description:
          "You do not have permission to access this page. Try signing in with another account or return to the dashboard.",
        variant: "warning",
      };
    case 500:
      return {
        code,
        title: "Something went wrong",
        description:
          "An unexpected server error prevented this page from loading.",
        variant: "danger",
      };
    default:
      return {
        code,
        title: "Unexpected error",
        description: "An unexpected problem prevented this page from loading.",
        variant: "danger",
      };
  }
}
