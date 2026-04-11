/**
 * Auth utility – reads user info from localStorage.
 * The Go backend should return { token, role, name, email } on login.
 * Role values: "admin" | "organizer" | "user"
 */

export function getUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getRole() {
  const user = getUser();
  return user?.role ?? null;
}

export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("token"));
}

export function saveAuth({ token, user }) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

/**
 * Call at the top of a dashboard page (inside useEffect) to guard routes.
 * Redirects to /auth/login when unauthenticated, or to /dashboard when role
 * doesn't match the required role(s).
 *
 * @param {import('next/router').NextRouter} router
 * @param {string | string[]} [allowedRoles]  – omit to allow any authenticated user
 */
export function requireAuth(router, allowedRoles) {
  if (!isAuthenticated()) {
    router.replace("/auth/login");
    return false;
  }
  if (allowedRoles) {
    const role = getRole();
    const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!allowed.includes(role)) {
      router.replace("/dashboard");
      return false;
    }
  }
  return true;
}

/** Redirect to the role-appropriate dashboard after login. */
export function dashboardPath(role) {
  switch (role) {
    case "admin":
      return "/dashboard/admin";
    case "organizer":
      return "/dashboard/organizer";
    default:
      return "/dashboard/user";
  }
}
