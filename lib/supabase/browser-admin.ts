import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client for admin auth only.
 * Uses sessionStorage — session ends when the browser tab/window closes (no trusted device).
 */
export function createAdminBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Supabase is not configured");
  }

  return createBrowserClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage:
        typeof window !== "undefined"
          ? {
              getItem: (key) => sessionStorage.getItem(key),
              setItem: (key, value) => sessionStorage.setItem(key, value),
              removeItem: (key) => sessionStorage.removeItem(key),
            }
          : undefined,
    },
  });
}
