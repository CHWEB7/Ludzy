"use client";

import { useEffect } from "react";
import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";

export function AdminShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-test-header]");
    const convora = document.querySelector<HTMLElement>("#convora-widget-root");
    if (header) header.style.display = "none";
    if (convora) convora.style.display = "none";

    return () => {
      if (header) header.style.display = "";
      if (convora) convora.style.display = "";
    };
  }, []);

  return (
    <AdminThemeProvider>
      <div className="fixed right-4 top-4 z-[100]">
        <AdminThemeToggle />
      </div>
      {children}
    </AdminThemeProvider>
  );
}
