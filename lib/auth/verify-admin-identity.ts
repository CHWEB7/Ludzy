import type { User } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";
import { isAdminAuthorized } from "@/lib/auth/admin-access";

export type AdminIdentityResult =
  | { ok: true; user: User }
  | { ok: false; status: number; error: string; reason?: string };

/** Validates signed-in user is allowed admin access (email allowlist or Supabase app_metadata.admin). */
export async function verifyAdminIdentity(
  bearerToken?: string | null,
): Promise<AdminIdentityResult> {
  const accessToken = bearerToken?.replace(/^Bearer\s+/i, "") ?? null;
  if (!accessToken) {
    return { ok: false, status: 401, error: "Not signed in", reason: "not_signed_in" };
  }

  const supabase = createServerSupabase();
  if (!supabase) {
    return { ok: false, status: 503, error: "Supabase not configured", reason: "misconfigured" };
  }

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    return { ok: false, status: 401, error: "Invalid or expired session", reason: "invalid_session" };
  }

  if (!isAdminAuthorized(data.user)) {
    return {
      ok: false,
      status: 403,
      error: "Not authorised for admin access",
      reason: "not_authorised",
    };
  }

  return { ok: true, user: data.user };
}
