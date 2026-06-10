import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/require-admin";
import { revalidatePublicEventsPages } from "@/lib/revalidate-events";
import { createServerSupabase } from "@/lib/supabase/server";
import { formatSupabaseEventsError } from "@/lib/supabase/table-errors";
import { supportsEventSoftDelete } from "@/lib/event-soft-delete";

type Body = {
  event_type?: string;
  ordered_ids?: string[];
};

export async function POST(req: Request) {
  const auth = await requireAdminAuth(req.headers.get("authorization"));
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const eventType = body.event_type;
  if (eventType !== "previous" && eventType !== "upcoming") {
    return NextResponse.json({ error: "event_type must be previous or upcoming." }, { status: 400 });
  }

  const orderedIds = body.ordered_ids;
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return NextResponse.json({ error: "ordered_ids must be a non-empty array." }, { status: 400 });
  }

  const uniqueIds = [...new Set(orderedIds.map(String))];
  if (uniqueIds.length !== orderedIds.length) {
    return NextResponse.json({ error: "ordered_ids contains duplicates." }, { status: 400 });
  }

  const softDeleteEnabled = await supportsEventSoftDelete(supabase);

  let query = supabase
    .from("events")
    .select("id, event_type, deleted_at")
    .eq("event_type", eventType)
    .in("id", uniqueIds);

  if (softDeleteEnabled) {
    query = query.is("deleted_at", null);
  }

  const { data: rows, error: fetchError } = await query;

  if (fetchError) {
    const formatted = formatSupabaseEventsError(fetchError.message);
    return NextResponse.json(
      { error: formatted.message, code: formatted.code },
      { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
    );
  }

  if (!rows || rows.length !== uniqueIds.length) {
    return NextResponse.json(
      { error: "One or more events were not found or do not match event_type." },
      { status: 400 },
    );
  }

  const updates = uniqueIds.map((id, index) =>
    supabase
      .from("events")
      .update({ sort_order: uniqueIds.length - index })
      .eq("id", id),
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    const formatted = formatSupabaseEventsError(failed.error.message);
    return NextResponse.json(
      { error: formatted.message, code: formatted.code },
      { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
    );
  }

  revalidatePublicEventsPages();

  return NextResponse.json({ ok: true });
}
