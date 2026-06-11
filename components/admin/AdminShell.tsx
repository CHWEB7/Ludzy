"use client";

import { useEffect } from "react";
import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";

export function AdminShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-test-header]");
    const crispChatbox = document.querySelector<HTMLElement>("#crisp-chatbox");
    if (header) header.style.display = "none";
    if (crispChatbox) crispChatbox.style.display = "none";
    (
      window as Window & { $crisp?: Array<unknown> }
    ).$crisp?.push(["do", "chat:hide"]);

    return () => {
      if (header) header.style.display = "";
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
