"use client";

import { useEffect } from "react";
import { ADMIN_IDLE_MS, ADMIN_SESSION_KEY } from "@/lib/auth/admin-access";
import { createAdminBrowserClient } from "@/lib/supabase/browser-admin";

function touchActivity() {
  sessionStorage.setItem(ADMIN_SESSION_KEY, String(Date.now()));
}

export function getLastActivity(): number {
  const v = sessionStorage.getItem(ADMIN_SESSION_KEY);
  return v ? Number(v) : 0;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-test-header]");
    const convora = document.querySelector<HTMLElement>("#convora-widget-root");
    if (header) header.style.display = "none";
    if (convora) convora.style.display = "none";

    touchActivity();

    const onActivity = () => touchActivity();
    window.addEventListener("mousemove", onActivity, { passive: true });
    window.addEventListener("keydown", onActivity, { passive: true });
    window.addEventListener("click", onActivity, { passive: true });

    const idleCheck = window.setInterval(async () => {
      const last = getLastActivity();
      if (last && Date.now() - last > ADMIN_IDLE_MS) {
        const supabase = createAdminBrowserClient();
        await supabase.auth.signOut();
        sessionStorage.clear();
        window.location.href = "/admin/login?reason=idle";
      }
    }, 60_000);

    return () => {
      if (header) header.style.display = "";
      if (convora) convora.style.display = "";
      window.removeEventListener("mousemove", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("click", onActivity);
      window.clearInterval(idleCheck);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {children}
    </div>
  );
}
