"use client";

import { useEffect, useState } from "react";
import { checkAdminEmailAllowed } from "@/lib/auth/check-admin-email-client";
import { createAdminBrowserClient } from "@/lib/supabase/browser-admin";

export type AdminSessionState = "loading" | "guest" | "admin";

export function useAdminSession(): AdminSessionState {
  const [state, setState] = useState<AdminSessionState>("loading");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const supabase = createAdminBrowserClient();
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user;
        if (!user) {
          if (!cancelled) setState("guest");
          return;
        }

        const { allowed } = await checkAdminEmailAllowed(user.email ?? "");
        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (!allowed || aal?.currentLevel !== "aal2") {
          if (!cancelled) setState("guest");
          return;
        }

        if (!cancelled) setState("admin");
      } catch {
        if (!cancelled) setState("guest");
      }
    }

    void check();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
