export function isEventsTableMissingError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("could not find the table") ||
    lower.includes("schema cache") ||
    lower.includes('relation "public.events" does not exist')
  );
}

export const EVENTS_TABLE_SETUP_MESSAGE =
  "Events table not found. Open Supabase → SQL Editor, run the full contents of supabase/events-schema.sql, then refresh this page.";

export function formatSupabaseEventsError(message: string): {
  message: string;
  code?: "TABLE_MISSING";
} {
  if (isEventsTableMissingError(message)) {
    return { message: EVENTS_TABLE_SETUP_MESSAGE, code: "TABLE_MISSING" };
  }
  return { message };
}

export function isBlogsTableMissingError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("could not find the table") ||
    lower.includes("schema cache") ||
    lower.includes('relation "public.blogs" does not exist')
  );
}

export const BLOGS_TABLE_SETUP_MESSAGE =
  "Blogs table not found. Open Supabase → SQL Editor, run the full contents of supabase/blogs-schema.sql, then refresh this page.";

export function formatSupabaseBlogsError(message: string): {
  message: string;
  code?: "TABLE_MISSING";
} {
  if (isBlogsTableMissingError(message)) {
    return { message: BLOGS_TABLE_SETUP_MESSAGE, code: "TABLE_MISSING" };
  }
  return { message };
}
