/**
 * Wraps $fetch to automatically attach the CSRF token header on mutating requests.
 * The token is read from the `csrf_token` cookie issued by the CSRF middleware
 * on every GET response when the user is authenticated.
 */
export function useCsrfFetch() {
  const csrfToken = useCookie("csrf_token");

  function csrfFetch<T = unknown>(
    url: string,
    options?: Parameters<typeof $fetch<T>>[1],
  ): ReturnType<typeof $fetch<T>> {
    return $fetch<T>(url, {
      // ensure cookies (session) are sent to the API
      credentials: "include",
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        "x-csrf-token": csrfToken.value ?? "",
      },
    });
  }

  return { csrfFetch };
}
