const EVENT_IMAGES_BUCKET = "event-images";

/** Normalize stored image values to a browser-loadable public URL. */
export function resolveEventImageUrl(
  url: string | null | undefined,
): string | undefined {
  if (!url?.trim()) return undefined;

  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!supabaseUrl) return trimmed;

  const path = trimmed.replace(/^\/+/, "");
  if (path.startsWith("storage/v1/object/public/")) {
    return `${supabaseUrl}/${path}`;
  }

  return `${supabaseUrl}/storage/v1/object/public/${EVENT_IMAGES_BUCKET}/${path}`;
}

export function resolveEventImageUrls(
  urls: string[] | null | undefined,
): string[] {
  if (!urls?.length) return [];
  return urls
    .map((url) => resolveEventImageUrl(url))
    .filter((url): url is string => Boolean(url));
}

export function getEventImagePublicUrl(
  supabaseUrl: string,
  storagePath: string,
): string {
  const base = supabaseUrl.replace(/\/$/, "");
  const path = storagePath.replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/${EVENT_IMAGES_BUCKET}/${path}`;
}
