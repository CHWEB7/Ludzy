import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/require-admin";
import { mapRow } from "@/lib/faqs-db";
import { revalidatePublicFaqPages } from "@/lib/revalidate-faqs";
import { createServerSupabase } from "@/lib/supabase/server";
import { formatSupabaseFaqsError } from "@/lib/supabase/table-errors";

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
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    const formatted = formatSupabaseFaqsError(error.message);
    return NextResponse.json(
      { error: formatted.message, code: formatted.code },
      { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
    );
  }

  return NextResponse.json({
    faqs: (data ?? []).map((row) => mapRow(row as Record<string, unknown>)),
  });
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
  const question = String(body.question ?? "").trim();
  const answer = String(body.answer ?? "").trim();

  if (!question) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }
  if (!answer) {
    return NextResponse.json({ error: "Answer is required" }, { status: 400 });
  }

  const published = Boolean(body.published);
  let sortOrder = Number(body.sort_order ?? 0);

  if (!sortOrder) {
    const { data: maxRow } = await supabase
      .from("faqs")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    sortOrder = Number(maxRow?.sort_order ?? 0) + 10;
  }

  const row = {
    question,
    answer,
    published,
    sort_order: sortOrder,
  };

  const { data, error } = await supabase.from("faqs").insert(row).select().single();
  if (error) {
    const formatted = formatSupabaseFaqsError(error.message);
    return NextResponse.json(
      { error: formatted.message, code: formatted.code },
      { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
    );
  }

  if (published) revalidatePublicFaqPages();

  return NextResponse.json({ faq: mapRow(data as Record<string, unknown>) }, { status: 201 });
}
