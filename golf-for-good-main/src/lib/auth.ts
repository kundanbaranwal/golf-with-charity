export type AuthUser = {
  id: number;
  name: string;
  email: string;
  isAdmin?: boolean;
  charity_id?: number | null;
  charity_percentage?: number;
};

const TOKEN_KEY = "golfgives_token";
const USER_KEY = "golfgives_user";

export const getToken = () => localStorage.getItem(TOKEN_KEY) || "";

export const setSession = (token: string, user: AuthUser) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
