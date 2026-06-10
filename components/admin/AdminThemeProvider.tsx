"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getStoredAdminTheme,
  storeAdminTheme,
  type AdminTheme,
} from "@/lib/admin/theme";
import "@/app/admin/admin-theme.css";

type AdminThemeContextValue = {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
  toggleTheme: () => void;
};

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setThemeState(getStoredAdminTheme());
    setReady(true);
  }, []);

  const setTheme = useCallback((next: AdminTheme) => {
    setThemeState(next);
    storeAdminTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next: AdminTheme = current === "dark" ? "light" : "dark";
      storeAdminTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <AdminThemeContext.Provider value={value}>
      <div
        className="admin-root min-h-screen"
        data-admin-theme={ready ? theme : "dark"}
        suppressHydrationWarning
      >
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme(): AdminThemeContextValue {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider");
  }
  return ctx;
}
