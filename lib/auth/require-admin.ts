import { createServerSupabase } from "@/lib/supabase/server";
import {
  getJwtClaim,
  hasMfaSession,
  isAdminEmail,
} from "@/lib/auth/admin-access";
import { createAdminServerClient } from "@/lib/supabase/server-admin";
import type { User } from "@supabase/supabase-js";

export type AdminAuthResult =
  | { ok: true; user: User; accessToken: string }
  | { ok: false; status: number; error: string };

/**
 * Validates admin API requests: authenticated user, allowed email, MFA (aal2) JWT.
 */
export async function requireAdminAuth(
  bearerToken?: string | null,
): Promise<AdminAuthResult> {
  let accessToken = bearerToken?.replace(/^Bearer\s+/i, "") ?? null;
  let user: User | null = null;

  if (accessToken) {
    const supabase = createServerSupabase();
    if (!supabase) {
      return { ok: false, status: 503, error: "Supabase not configured" };
    }
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data.user) {
      return { ok: false, status: 401, error: "Invalid or expired session" };
    }
    user = data.user;
  } else {
    const supabase = await createAdminServerClient();
    if (!supabase) {
      return { ok: false, status: 503, error: "Supabase not configured" };
    }
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session?.user) {
      return { ok: false, status: 401, error: "Not signed in" };
    }
    user = data.session.user;
    accessToken = data.session.access_token;
  }

  if (!isAdminEmail(user.email)) {
    return { ok: false, status: 403, error: "Not authorised for admin access" };
  }

  if (!accessToken || !hasMfaSession(accessToken)) {
    const aal = getJwtClaim(accessToken ?? "", "aal");
    return {
      ok: false,
      status: 403,
      error:
        aal === "aal1"
          ? "Multi-factor authentication required"
          : "MFA must be enabled on this account",
    };
  }

  return { ok: true, user, accessToken };
}
