import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/require-admin";
import { revalidatePublicFaqPages } from "@/lib/revalidate-faqs";
import { createServerSupabase } from "@/lib/supabase/server";
import { formatSupabaseFaqsError } from "@/lib/supabase/table-errors";

type Body = {
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

  const orderedIds = body.ordered_ids;
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return NextResponse.json({ error: "ordered_ids must be a non-empty array." }, { status: 400 });
  }

  const uniqueIds = [...new Set(orderedIds.map(String))];
  if (uniqueIds.length !== orderedIds.length) {
    return NextResponse.json({ error: "ordered_ids contains duplicates." }, { status: 400 });
  }

  const { data: rows, error: fetchError } = await supabase
    .from("faqs")
    .select("id")
    .in("id", uniqueIds);

  if (fetchError) {
    const formatted = formatSupabaseFaqsError(fetchError.message);
    return NextResponse.json(
      { error: formatted.message, code: formatted.code },
      { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
    );
  }

  if (!rows || rows.length !== uniqueIds.length) {
    return NextResponse.json({ error: "One or more FAQs were not found." }, { status: 400 });
  }

  const updates = uniqueIds.map((faqId, index) =>
    supabase
      .from("faqs")
      .update({ sort_order: uniqueIds.length - index })
      .eq("id", faqId),
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    const formatted = formatSupabaseFaqsError(failed.error.message);
    return NextResponse.json(
      { error: formatted.message, code: formatted.code },
      { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
    );
  }

  revalidatePublicFaqPages();

  return NextResponse.json({ ok: true });
}
