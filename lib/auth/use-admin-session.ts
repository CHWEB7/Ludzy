"use client";

import { useEffect, useState } from "react";
import { checkAdminEmailAllowed } from "@/lib/auth/check-admin-email-client";
import { createAdminBrowserClient } from "@/lib/supabase/browser-admin";

export type AdminSessionState = "loading" | "guest" | "admin";

export function useAdminSession(): AdminSessionState {
  const [state, setState] = useState<AdminSessionState>("loading");

  useEffect(() => {
    let cancelled = false;
    const supabase = createAdminBrowserClient();

    async function check() {
      try {
        const { data, error } = await supabase.auth.getUser();
        const user = error ? null : data.user;
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void check();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
