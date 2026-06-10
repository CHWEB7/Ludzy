import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/require-admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { slugify } from "@/lib/events-db";
import { formatBritishLongDate } from "@/lib/event-date-format";
import { formatSupabaseEventsError } from "@/lib/supabase/table-errors";
import { revalidatePublicEventsPages } from "@/lib/revalidate-events";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Props) {
  const auth = await requireAdminAuth(req.headers.get("authorization"));
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  const supabase = createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const body = (await req.json()) as Record<string, unknown>;
  const eventType = body.event_type as string | undefined;

  const updates: Record<string, unknown> = {};
  if (eventType === "previous" || eventType === "upcoming") updates.event_type = eventType;
  if (body.title !== undefined) updates.title = String(body.title).trim();
  if (body.event_date !== undefined) {
    updates.event_date = body.event_date || null;
    if (body.event_date) {
      updates.date_display = formatBritishLongDate(String(body.event_date));
    }
  }
  if (body.date_display !== undefined && body.event_date === undefined) {
    updates.date_display = String(body.date_display).trim();
  }
  if (body.venue !== undefined) updates.venue = body.venue || null;
  if (body.location !== undefined) updates.location = body.location || null;
  if (body.maps_url !== undefined) updates.maps_url = body.maps_url || null;
  if (body.time_display !== undefined) updates.time_display = body.time_display || null;
  if (body.set_type !== undefined) updates.set_type = body.set_type || null;
  if (body.excerpt !== undefined) updates.excerpt = body.excerpt || null;
  if (body.summary !== undefined) updates.summary = body.summary || null;
  if (body.details !== undefined) updates.details = body.details || null;
  if (body.body !== undefined) updates.body = Array.isArray(body.body) ? body.body : [];
  if (body.image_url !== undefined) updates.image_url = body.image_url || null;
  if (body.published !== undefined) updates.published = Boolean(body.published);
  if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order);

  if (body.slug !== undefined || body.title !== undefined) {
    const title = updates.title ? String(updates.title) : undefined;
    const slugInput = body.slug !== undefined ? String(body.slug).trim() : "";
    if (slugInput || title) {
      updates.slug = slugInput || (title ? slugify(title) : undefined);
    }
  }

  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const formatted = formatSupabaseEventsError(error.message);
    return NextResponse.json(
      { error: formatted.message, code: formatted.code },
      { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
    );
  }

  revalidatePublicEventsPages(
    data?.event_type === "previous" ? (data.slug as string | null) : null,
  );

  return NextResponse.json({ event: data });
}

export async function DELETE(req: Request, { params }: Props) {
  const auth = await requireAdminAuth(req.headers.get("authorization"));
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  const supabase = createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { data: existing } = await supabase
    .from("events")
    .select("slug, event_type")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) {
    const formatted = formatSupabaseEventsError(error.message);
    return NextResponse.json(
      { error: formatted.message, code: formatted.code },
      { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
    );
  }

  revalidatePublicEventsPages(
    existing?.event_type === "previous" ? existing.slug : null,
  );

  return NextResponse.json({ ok: true });
}
