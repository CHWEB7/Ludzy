"use client";

import { useAdminTheme } from "@/components/admin/AdminThemeProvider";

export function AdminThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useAdminTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`admin-theme-toggle inline-flex items-center gap-2 border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition ${className}`}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Dark mode" : "Light mode"}
    >
      <span className="text-base leading-none" aria-hidden>
        {isLight ? "☀" : "☾"}
      </span>
      <span>{isLight ? "Light" : "Dark"}</span>
    </button>
  );
}
