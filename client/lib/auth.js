const USER_KEY = "tiketku_user";

export function getUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return getUser() !== null;
}

export function hasRole(role) {
  const user = getUser();
  return user?.role === role;
}
