import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/require-admin";
import { normalizeBlogTagIds } from "@/lib/blog-tags";
import { mapRow, slugify } from "@/lib/blogs-db";
import { revalidatePublicBlogPages } from "@/lib/revalidate-blogs";
import { createServerSupabase } from "@/lib/supabase/server";
import { formatSupabaseBlogsError } from "@/lib/supabase/table-errors";

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
    .from("blogs")
    .select("*")
    .order("sort_order", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    const formatted = formatSupabaseBlogsError(error.message);
    return NextResponse.json(
      { error: formatted.message, code: formatted.code },
      { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
    );
  }

  return NextResponse.json({
    blogs: (data ?? []).map((row) => mapRow(row as Record<string, unknown>)),
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
  const title = String(body.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug = String(body.slug ?? "").trim() || slugify(title);
  const published = Boolean(body.published);

  const row = {
    slug,
    title,
    excerpt: body.excerpt ? String(body.excerpt) : null,
    body: Array.isArray(body.body) ? body.body : [],
    image_url: body.image_url ? String(body.image_url) : null,
    gallery_images: Array.isArray(body.gallery_images)
      ? body.gallery_images.map(String)
      : [],
    tags: normalizeBlogTagIds(body.tags),
    published,
    sort_order: Number(body.sort_order ?? 0),
    published_at: published ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase.from("blogs").insert(row).select().single();
  if (error) {
    const formatted = formatSupabaseBlogsError(error.message);
    return NextResponse.json(
      { error: formatted.message, code: formatted.code },
      { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
    );
  }

  revalidatePublicBlogPages(published ? slug : null);

  return NextResponse.json({ blog: mapRow(data as Record<string, unknown>) }, { status: 201 });
}
