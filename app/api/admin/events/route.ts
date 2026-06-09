import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/require-admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { slugify } from "@/lib/events-db";
import { formatSupabaseEventsError } from "@/lib/supabase/table-errors";
import { formatBritishLongDate } from "@/lib/event-date-format";

export async function GET(req: Request) {
  const auth = await requireAdminAuth(req.headers.get("authorization"));
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_type")
    .order("sort_order", { ascending: false })
    .order("event_date", { ascending: false, nullsFirst: false });

  if (error) {
    const formatted = formatSupabaseEventsError(error.message);
    return NextResponse.json(
      { error: formatted.message, code: formatted.code },
      { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
    );
  }

  return NextResponse.json({ events: data ?? [] });
}

export async function POST(req: Request) {
  const auth = await requireAdminAuth(req.headers.get("authorization"));
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const body = (await req.json()) as Record<string, unknown>;
  const eventType = body.event_type as string;
  if (eventType !== "previous" && eventType !== "upcoming") {
    return NextResponse.json({ error: "Invalid event_type" }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug =
    eventType === "previous"
      ? String(body.slug ?? "").trim() || slugify(title)
      : null;

  const eventDate = body.event_date ? String(body.event_date) : null;
  const dateDisplay =
    String(body.date_display ?? "").trim() ||
    (eventDate ? formatBritishLongDate(eventDate) : "");

  const row = {
    event_type: eventType,
    slug,
    title,
    date_display: dateDisplay,
    event_date: eventDate,
    venue: body.venue ? String(body.venue) : null,
    location: body.location ? String(body.location) : null,
    maps_url: body.maps_url ? String(body.maps_url) : null,
    time_display: body.time_display ? String(body.time_display) : null,
    set_type: body.set_type ? String(body.set_type) : null,
    excerpt: body.excerpt ? String(body.excerpt) : null,
    summary: body.summary ? String(body.summary) : null,
    details: body.details ? String(body.details) : null,
    body: Array.isArray(body.body) ? body.body : [],
    image_url: body.image_url ? String(body.image_url) : null,
    published: Boolean(body.published),
    sort_order: Number(body.sort_order ?? 0),
  };

  if (!row.date_display || !row.event_date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  const { data, error } = await supabase.from("events").insert(row).select().single();
  if (error) {
    const formatted = formatSupabaseEventsError(error.message);
    return NextResponse.json(
      { error: formatted.message, code: formatted.code },
      { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
    );
  }

  return NextResponse.json({ event: data }, { status: 201 });
}
