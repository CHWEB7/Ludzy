import { googleMapsSearchUrl } from "@/lib/event-date-format";
import { resolveEventImageUrl, resolveEventImageUrls } from "@/lib/event-image-url";
import { applyActiveEventFilter, supportsEventSoftDelete } from "@/lib/event-soft-delete";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  previousEvents,
  upcomingEvents,
  type PreviousEvent,
  type UpcomingEvent,
} from "@/lib/events-data";

export type EventRecord = {
  id: string;
  event_type: "previous" | "upcoming";
  slug: string | null;
  title: string;
  date_display: string;
  event_date: string | null;
  venue: string | null;
  location: string | null;
  maps_url: string | null;
  time_display: string | null;
  set_type: string | null;
  excerpt: string | null;
  summary: string | null;
  details: string | null;
  body: string[];
  image_url: string | null;
  gallery_images: string[];
  published: boolean;
  sort_order: number;
  deleted_at: string | null;
};

export function mapRow(row: Record<string, unknown>): EventRecord {
  const body = row.body;
  return {
    id: String(row.id),
    event_type: row.event_type as EventRecord["event_type"],
    slug: row.slug ? String(row.slug) : null,
    title: String(row.title),
    date_display: String(row.date_display),
    event_date: row.event_date ? String(row.event_date) : null,
    venue: row.venue ? String(row.venue) : null,
    location: row.location ? String(row.location) : null,
    maps_url: row.maps_url ? String(row.maps_url) : null,
    time_display: row.time_display ? String(row.time_display) : null,
    set_type: row.set_type ? String(row.set_type) : null,
    excerpt: row.excerpt ? String(row.excerpt) : null,
    summary: row.summary ? String(row.summary) : null,
    details: row.details ? String(row.details) : null,
    body: Array.isArray(body) ? body.map(String) : [],
    image_url: row.image_url ? String(row.image_url) : null,
    gallery_images: Array.isArray(row.gallery_images)
      ? row.gallery_images.map(String)
      : [],
    published: Boolean(row.published),
    sort_order: Number(row.sort_order ?? 0),
    deleted_at: row.deleted_at ? String(row.deleted_at) : null,
  };
}

export function toPreviousEvent(e: EventRecord): PreviousEvent {
  return {
    id: e.id,
    slug: e.slug ?? e.id,
    title: e.title,
    date: e.date_display,
    venue: e.venue ?? "",
    excerpt: e.excerpt ?? "",
    body: e.body.length > 0 ? e.body : [e.summary ?? ""].filter(Boolean),
    imageUrl: resolveEventImageUrl(e.image_url),
    galleryImages: resolveEventImageUrls(e.gallery_images),
  };
}

export function toUpcomingEvent(e: EventRecord): UpcomingEvent {
  const location = e.location ?? e.venue ?? "";
  return {
    id: e.id,
    title: e.title,
    date: e.date_display,
    time: e.time_display ?? "",
    location,
    mapsUrl: e.maps_url ?? (location ? googleMapsSearchUrl(location) : undefined),
    imageUrl: resolveEventImageUrl(e.image_url),
    setType: e.set_type ?? "",
    summary: e.summary ?? e.excerpt ?? "",
    details: e.details ?? "",
  };
}

export async function fetchPublishedEvents(): Promise<{
  previous: EventRecord[];
  upcoming: EventRecord[];
} | null> {
  const supabase = createServerSupabase();
  if (!supabase) return null;

  const softDelete = await supportsEventSoftDelete(supabase);

  const { data, error } = await applyActiveEventFilter(
    supabase.from("events").select("*").eq("published", true),
    softDelete,
  )
    .order("sort_order", { ascending: false })
    .order("event_date", { ascending: false, nullsFirst: false });

  if (error || !data) return null;

  const rows = data.map((r) => mapRow(r as Record<string, unknown>));
  return {
    previous: rows.filter((r) => r.event_type === "previous"),
    upcoming: rows.filter((r) => r.event_type === "upcoming"),
  };
}

export async function fetchAllEventsAdmin(): Promise<EventRecord[] | null> {
  const supabase = createServerSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_type")
    .order("sort_order", { ascending: false })
    .order("event_date", { ascending: false, nullsFirst: false });

  if (error || !data) return null;
  return data.map((r) => mapRow(r as Record<string, unknown>));
}

export async function fetchPreviousEventBySlug(
  slug: string,
): Promise<EventRecord | null> {
  const supabase = createServerSupabase();
  if (!supabase) return null;

  const softDelete = await supportsEventSoftDelete(supabase);

  const { data: bySlug, error: slugError } = await applyActiveEventFilter(
    supabase
      .from("events")
      .select("*")
      .eq("published", true)
      .eq("event_type", "previous")
      .eq("slug", slug),
    softDelete,
  ).maybeSingle();

  if (slugError) return null;
  if (bySlug) return mapRow(bySlug as Record<string, unknown>);

  const { data: byId, error: idError } = await applyActiveEventFilter(
    supabase
      .from("events")
      .select("*")
      .eq("published", true)
      .eq("event_type", "previous")
      .eq("id", slug),
    softDelete,
  ).maybeSingle();

  if (idError || !byId) return null;
  return mapRow(byId as Record<string, unknown>);
}

/** Fallback when Supabase is not configured. */
export function getStaticPreviousEvents(): PreviousEvent[] {
  return previousEvents;
}

export function getStaticUpcomingEvents(): UpcomingEvent[] {
  return upcomingEvents;
}

/** Use DB lists when Supabase is available; static templates only as offline fallback. */
export function resolvePublishedEventLists(
  fromDb: { previous: EventRecord[]; upcoming: EventRecord[] } | null,
): { previous: PreviousEvent[]; upcoming: UpcomingEvent[] } {
  if (!fromDb) {
    return {
      previous: getStaticPreviousEvents(),
      upcoming: getStaticUpcomingEvents(),
    };
  }
  return {
    previous: fromDb.previous.map(toPreviousEvent),
    upcoming: fromDb.upcoming.map(toUpcomingEvent),
  };
}

export function resolvePreviousEventForSlug(
  slug: string,
  dbEvent: EventRecord | null,
): PreviousEvent | null {
  if (dbEvent) return toPreviousEvent(dbEvent);
  if (createServerSupabase()) return null;
  return getStaticPreviousEvent(slug) ?? null;
}

export function getStaticPreviousEvent(slug: string): PreviousEvent | undefined {
  return previousEvents.find((e) => e.slug === slug);
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
