import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/require-admin";
import { mapRow } from "@/lib/faqs-db";
import { revalidatePublicFaqPages } from "@/lib/revalidate-faqs";
import { createServerSupabase } from "@/lib/supabase/server";
import { formatSupabaseFaqsError } from "@/lib/supabase/table-errors";

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
  const updates: Record<string, unknown> = {};

  if (body.question !== undefined) updates.question = String(body.question).trim();
  if (body.answer !== undefined) updates.answer = String(body.answer).trim();
  if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order);
  if (body.published !== undefined) updates.published = Boolean(body.published);

  const { data, error } = await supabase
    .from("faqs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const formatted = formatSupabaseFaqsError(error.message);
    return NextResponse.json(
      { error: formatted.message, code: formatted.code },
      { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
    );
  }

  revalidatePublicFaqPages();

  return NextResponse.json({ faq: mapRow(data as Record<string, unknown>) });
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

  const { data: existing, error: fetchError } = await supabase
    .from("faqs")
    .select("id, published")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
  }

  const { data: deleted, error } = await supabase
    .from("faqs")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    const formatted = formatSupabaseFaqsError(error.message);
    return NextResponse.json(
      { error: formatted.message, code: formatted.code },
      { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
    );
  }

  if (!deleted || deleted.length !== 1) {
    return NextResponse.json({ error: "FAQ could not be deleted" }, { status: 404 });
  }

  revalidatePublicFaqPages();

  return NextResponse.json({ ok: true, id });
}
