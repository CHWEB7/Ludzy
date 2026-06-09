import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Server client for reading auth session from cookies (admin API validation). */
export async function createAdminServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  const cookieStore = await cookies();

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, {
              ...options,
              // Session cookie — expires when browser closes (no persistent trusted device)
              maxAge: undefined,
              expires: undefined,
            }),
          );
        } catch {
          // setAll from Server Component — ignore
        }
      },
    },
  });
}
