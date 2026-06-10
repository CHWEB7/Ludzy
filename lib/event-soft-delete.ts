import type { SupabaseClient } from "@supabase/supabase-js";

/** Soft-deleted events are kept in the database for this many days. */
export const EVENT_SOFT_DELETE_DAYS = 7;

export const EVENT_SOFT_DELETE_MS = EVENT_SOFT_DELETE_DAYS * 24 * 60 * 60 * 1000;

export function getEventSoftDeleteCutoffIso(): string {
  return new Date(Date.now() - EVENT_SOFT_DELETE_MS).toISOString();
}

export function getEventPurgeBeforeIso(): string {
  return getEventSoftDeleteCutoffIso();
}

export function formatEventPurgeDate(deletedAt: string): string {
  const purgeAt = new Date(new Date(deletedAt).getTime() + EVENT_SOFT_DELETE_MS);
  return purgeAt.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Permanently remove events that were soft-deleted more than 7 days ago. */
export async function purgeExpiredDeletedEvents(
  supabase: SupabaseClient,
): Promise<void> {
  const purgeBefore = getEventPurgeBeforeIso();
  await supabase.from("events").delete().not("deleted_at", "is", null).lt("deleted_at", purgeBefore);
}
