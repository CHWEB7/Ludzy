import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client for API routes.
 * Prefer SUPABASE_SERVICE_ROLE_KEY (bypasses RLS, reliable inserts).
 * Falls back to anon key when service role is not set (requires RLS insert policy).
 */
export function createServerSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    return createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (anon) {
    return createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return null;
}
