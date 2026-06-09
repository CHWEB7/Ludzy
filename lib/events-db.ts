import { googleMapsSearchUrl } from "@/lib/event-date-format";
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
  published: boolean;
  sort_order: number;
};

function mapRow(row: Record<string, unknown>): EventRecord {
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
    published: Boolean(row.published),
    sort_order: Number(row.sort_order ?? 0),
  };
}

export function toPreviousEvent(e: EventRecord): PreviousEvent {
  return {
    slug: e.slug ?? e.id,
    title: e.title,
    date: e.date_display,
    venue: e.venue ?? "",
    excerpt: e.excerpt ?? "",
    body: e.body.length > 0 ? e.body : [e.summary ?? ""].filter(Boolean),
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

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("published", true)
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

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("published", true)
    .eq("event_type", "previous")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return mapRow(data as Record<string, unknown>);
}

/** Fallback when Supabase has no rows yet. */
export function getStaticPreviousEvents(): PreviousEvent[] {
  return previousEvents;
}

export function getStaticUpcomingEvents(): UpcomingEvent[] {
  return upcomingEvents;
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
