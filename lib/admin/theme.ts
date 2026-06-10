export type AdminTheme = "dark" | "light";

export const ADMIN_THEME_STORAGE_KEY = "ludzy-admin-theme";

export function getStoredAdminTheme(): AdminTheme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem(ADMIN_THEME_STORAGE_KEY);
    return stored === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function storeAdminTheme(theme: AdminTheme): void {
  try {
    localStorage.setItem(ADMIN_THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}
