export function getSupabaseProjectRef(url?: string | null): string | null {
  if (!url) return null;
  const match = url.match(/https:\/\/([a-z0-9-]+)\.supabase\.co/i);
  return match?.[1] ?? null;
}

export function getSupabaseSqlEditorUrl(url?: string | null): string | null {
  const ref = getSupabaseProjectRef(url);
  if (!ref) return null;
  return `https://supabase.com/dashboard/project/${ref}/sql/new`;
}

export function getSupabaseTableEditorUrl(url?: string | null): string | null {
  const ref = getSupabaseProjectRef(url);
  if (!ref) return null;
  return `https://supabase.com/dashboard/project/${ref}/editor`;
}
