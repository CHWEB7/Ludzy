import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/require-admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { mapRow, slugify } from "@/lib/events-db";
import { formatBritishLongDate } from "@/lib/event-date-format";
import { formatSupabaseEventsError } from "@/lib/supabase/table-errors";
import { revalidatePublicEventsPages } from "@/lib/revalidate-events";
import { supportsEventSoftDelete } from "@/lib/event-soft-delete";

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
  const softDeleteEnabled = await supportsEventSoftDelete(supabase);

  if (body.restore === true) {
    if (!softDeleteEnabled) {
      return NextResponse.json(
        { error: "Soft delete is not enabled. Run npm run migrate-soft-delete first." },
        { status: 503 },
      );
    }
    const { data: existing, error: fetchError } = await supabase
      .from("events")
      .select("id, deleted_at, slug, event_type")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    if (!existing.deleted_at) {
      return NextResponse.json({ error: "Event is not deleted" }, { status: 400 });
    }

    const { data: restored, error: restoreError } = await supabase
      .from("events")
      .update({ deleted_at: null })
      .eq("id", id)
      .select()
      .single();

    if (restoreError) {
      const formatted = formatSupabaseEventsError(restoreError.message);
      return NextResponse.json(
        { error: formatted.message, code: formatted.code },
        { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
      );
    }

    revalidatePublicEventsPages(
      restored.event_type === "previous" ? (restored.slug as string | null) : null,
    );

    return NextResponse.json({ event: mapRow(restored as Record<string, unknown>) });
  }

  if (softDeleteEnabled) {
    const { data: activeCheck } = await supabase
      .from("events")
      .select("deleted_at")
      .eq("id", id)
      .maybeSingle();

    if (!activeCheck) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    if (activeCheck.deleted_at) {
      return NextResponse.json({ error: "Restore this event before editing it" }, { status: 400 });
    }
  }

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
  if (body.gallery_images !== undefined) {
    updates.gallery_images = Array.isArray(body.gallery_images)
      ? body.gallery_images.map(String)
      : [];
  }
  if (body.published !== undefined) updates.published = Boolean(body.published);
  if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order);

  if (body.slug !== undefined || body.title !== undefined) {
    const title = updates.title ? String(updates.title) : undefined;
    const slugInput = body.slug !== undefined ? String(body.slug).trim() : "";
    if (slugInput || title) {
      updates.slug = slugInput || (title ? slugify(title) : undefined);
    }
  }

  if (body.archive === true) {
    const { data: existing, error: fetchError } = await supabase
      .from("events")
      .select("event_type, title, slug, venue, location, excerpt, summary")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    if (existing.event_type !== "upcoming") {
      return NextResponse.json({ error: "Only upcoming events can be archived" }, { status: 400 });
    }

    let archiveSlug = existing.slug?.trim() || slugify(String(existing.title));
    const { data: slugConflict } = await supabase
      .from("events")
      .select("id")
      .eq("event_type", "previous")
      .eq("slug", archiveSlug)
      .neq("id", id)
      .maybeSingle();

    if (slugConflict) {
      archiveSlug = `${archiveSlug}-${id.slice(0, 8)}`;
    }

    const archiveUpdates = {
      event_type: "previous",
      slug: archiveSlug,
      venue: existing.venue || existing.location || null,
      excerpt: existing.excerpt || existing.summary || String(existing.title),
      time_display: null,
      set_type: null,
      details: null,
    };

    const { data: archived, error: archiveError } = await supabase
      .from("events")
      .update(archiveUpdates)
      .eq("id", id)
      .select()
      .single();

    if (archiveError) {
      const formatted = formatSupabaseEventsError(archiveError.message);
      return NextResponse.json(
        { error: formatted.message, code: formatted.code },
        { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
      );
    }

    revalidatePublicEventsPages(archived.slug as string | null);
    return NextResponse.json({ event: archived });
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

  const softDeleteEnabled = await supportsEventSoftDelete(supabase);

  const existingResult = softDeleteEnabled
    ? await supabase
        .from("events")
        .select("slug, event_type, deleted_at")
        .eq("id", id)
        .maybeSingle()
    : await supabase
        .from("events")
        .select("slug, event_type")
        .eq("id", id)
        .maybeSingle();

  const existing = existingResult.data;

  if (existingResult.error || !existing) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (softDeleteEnabled) {
    const existingDeletedAt =
      "deleted_at" in existing ? existing.deleted_at : null;
    if (existingDeletedAt) {
      return NextResponse.json({ error: "Event is already deleted" }, { status: 400 });
    }

    const deletedAt = new Date().toISOString();
    const { data: softDeleted, error } = await supabase
      .from("events")
      .update({ deleted_at: deletedAt, published: false })
      .eq("id", id)
      .is("deleted_at", null)
      .select("id, slug, event_type, deleted_at")
      .maybeSingle();

    if (error) {
      const formatted = formatSupabaseEventsError(error.message);
      return NextResponse.json(
        { error: formatted.message, code: formatted.code },
        { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
      );
    }

    if (!softDeleted) {
      return NextResponse.json({ error: "Event could not be deleted" }, { status: 404 });
    }

    revalidatePublicEventsPages(
      existing.event_type === "previous" ? existing.slug : null,
    );

    return NextResponse.json({
      ok: true,
      id,
      deleted_at: softDeleted.deleted_at,
      softDeleteDays: 7,
    });
  }

  const { data: hardDeleted, error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    const formatted = formatSupabaseEventsError(error.message);
    return NextResponse.json(
      { error: formatted.message, code: formatted.code },
      { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
    );
  }

  if (!hardDeleted || hardDeleted.length !== 1) {
    return NextResponse.json({ error: "Event could not be deleted" }, { status: 404 });
  }

  revalidatePublicEventsPages(
    existing.event_type === "previous" ? existing.slug : null,
  );

  return NextResponse.json({ ok: true, id });
}
