import Cookies from "js-cookie";

export const AUTH_KEYS = {
  TOKEN: "authToken",
  USER_ID: "userId",
  USER_ROLE: "userRole",
} as const;

export const getAuthToken = (): string | null => {
  return Cookies.get(AUTH_KEYS.TOKEN) || null;
};

export const setAuthToken = (token: string): void => {
  Cookies.set(AUTH_KEYS.TOKEN, token, { expires: 7 });
};

export const getUserId = (): string | null => {
  return Cookies.get(AUTH_KEYS.USER_ID) || null;
};

export const setUserId = (id: string): void => {
  Cookies.set(AUTH_KEYS.USER_ID, id, { expires: 7 });
};

export const getUserRole = (): string | null => {
  return Cookies.get(AUTH_KEYS.USER_ROLE) || null;
};

export const getUserRoles = (): string[] => {
  const roles = getUserRole();
  if (!roles) return [];
  return roles.split(",").filter(Boolean);
};

export const setUserRole = (role: string): void => {
  Cookies.set(AUTH_KEYS.USER_ROLE, role, { expires: 7 });
};

export const clearAuth = (): void => {
  Cookies.remove(AUTH_KEYS.TOKEN);
  Cookies.remove(AUTH_KEYS.USER_ID);
  Cookies.remove(AUTH_KEYS.USER_ROLE);
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const hasRole = (role: string): boolean => {
  const userRoles = getUserRoles();
  return userRoles.includes(role);
};
