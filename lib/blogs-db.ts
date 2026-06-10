import { formatBritishLongDate } from "@/lib/event-date-format";
import { resolveEventImageUrl, resolveEventImageUrls } from "@/lib/event-image-url";
import { formatBlogTags, normalizeBlogTagIds } from "@/lib/blog-tags";
import { createServerSupabase } from "@/lib/supabase/server";
import { slugify } from "@/lib/events-db";

export type BlogRecord = {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string[];
  image_url: string | null;
  gallery_images: string[];
  tags: string[];
  published: boolean;
  sort_order: number;
  published_at: string | null;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  imageUrl?: string;
  galleryImages?: string[];
  tags: string[];
  tagsLabel: string;
  date: string;
  publishedAt: string | null;
};

export function mapRow(row: Record<string, unknown>): BlogRecord {
  const body = row.body;
  const tags = row.tags;
  return {
    id: String(row.id),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: row.excerpt ? String(row.excerpt) : null,
    body: Array.isArray(body) ? body.map(String) : [],
    image_url: row.image_url ? String(row.image_url) : null,
    gallery_images: Array.isArray(row.gallery_images)
      ? row.gallery_images.map(String)
      : [],
    tags: normalizeBlogTagIds(tags),
    published: Boolean(row.published),
    sort_order: Number(row.sort_order ?? 0),
    published_at: row.published_at ? String(row.published_at) : null,
  };
}

export function toBlogPost(blog: BlogRecord): BlogPost {
  const dateSource = blog.published_at ?? blog.created_at;
  const dateIso = dateSource.slice(0, 10);

  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt ?? "",
    body: blog.body,
    imageUrl: resolveEventImageUrl(blog.image_url),
    galleryImages: resolveEventImageUrls(blog.gallery_images),
    tags: blog.tags,
    tagsLabel: formatBlogTags(blog.tags),
    date: formatBritishLongDate(dateIso),
    publishedAt: blog.published_at,
  };
}

export async function fetchPublishedBlogs(
  tag?: string | null,
): Promise<BlogRecord[] | null> {
  const supabase = createServerSupabase();
  if (!supabase) return null;

  let query = supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false });

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const { data, error } = await query;
  if (error || !data) return null;
  return data.map((row) => mapRow(row as Record<string, unknown>));
}

export async function fetchAllBlogsAdmin(): Promise<BlogRecord[] | null> {
  const supabase = createServerSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("sort_order", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !data) return null;
  return data.map((row) => mapRow(row as Record<string, unknown>));
}

export async function fetchBlogBySlug(slug: string): Promise<BlogRecord | null> {
  const supabase = createServerSupabase();
  if (!supabase) return null;

  const { data: bySlug, error: slugError } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (slugError) return null;
  if (bySlug) return mapRow(bySlug as Record<string, unknown>);

  const { data: byId, error: idError } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .eq("id", slug)
    .maybeSingle();

  if (idError || !byId) return null;
  return mapRow(byId as Record<string, unknown>);
}

export { slugify };
