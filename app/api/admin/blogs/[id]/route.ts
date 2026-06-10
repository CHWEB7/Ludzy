import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/require-admin";
import { normalizeBlogTagIds } from "@/lib/blog-tags";
import { mapRow, slugify } from "@/lib/blogs-db";
import { revalidatePublicBlogPages } from "@/lib/revalidate-blogs";
import { createServerSupabase } from "@/lib/supabase/server";
import { formatSupabaseBlogsError } from "@/lib/supabase/table-errors";

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

  if (body.title !== undefined) updates.title = String(body.title).trim();
  if (body.excerpt !== undefined) updates.excerpt = body.excerpt || null;
  if (body.body !== undefined) updates.body = Array.isArray(body.body) ? body.body : [];
  if (body.image_url !== undefined) updates.image_url = body.image_url || null;
  if (body.gallery_images !== undefined) {
    updates.gallery_images = Array.isArray(body.gallery_images)
      ? body.gallery_images.map(String)
      : [];
  }
  if (body.tags !== undefined) updates.tags = normalizeBlogTagIds(body.tags);
  if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order);

  if (body.slug !== undefined || body.title !== undefined) {
    const title = updates.title ? String(updates.title) : undefined;
    const slugInput = body.slug !== undefined ? String(body.slug).trim() : "";
    if (slugInput || title) {
      updates.slug = slugInput || (title ? slugify(title) : undefined);
    }
  }

  if (body.published !== undefined) {
    const published = Boolean(body.published);
    updates.published = published;

    if (published) {
      const { data: existing } = await supabase
        .from("blogs")
        .select("published_at")
        .eq("id", id)
        .maybeSingle();

      if (!existing?.published_at) {
        updates.published_at = new Date().toISOString();
      }
    }
  }

  const { data, error } = await supabase
    .from("blogs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const formatted = formatSupabaseBlogsError(error.message);
    return NextResponse.json(
      { error: formatted.message, code: formatted.code },
      { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
    );
  }

  revalidatePublicBlogPages(data?.published ? (data.slug as string) : null);

  return NextResponse.json({ blog: mapRow(data as Record<string, unknown>) });
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
    .from("blogs")
    .select("slug, published")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  const { data: deleted, error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    const formatted = formatSupabaseBlogsError(error.message);
    return NextResponse.json(
      { error: formatted.message, code: formatted.code },
      { status: formatted.code === "TABLE_MISSING" ? 503 : 500 },
    );
  }

  if (!deleted || deleted.length !== 1) {
    return NextResponse.json({ error: "Blog could not be deleted" }, { status: 404 });
  }

  revalidatePublicBlogPages(existing.published ? existing.slug : null);

  return NextResponse.json({ ok: true, id });
}
