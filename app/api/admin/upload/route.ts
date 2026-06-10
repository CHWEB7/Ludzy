import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/require-admin";
import { getEventImagePublicUrl } from "@/lib/event-image-url";
import {
  EVENT_IMAGE_ALLOWED_TYPES,
  EVENT_IMAGE_MAX_UPLOAD_BYTES,
  formatBytes,
} from "@/lib/event-image-limits";
import { createServerSupabase } from "@/lib/supabase/server";

const ALLOWED = new Set<string>(EVENT_IMAGE_ALLOWED_TYPES);
const BUCKET = "event-images";

async function ensurePublicEventImagesBucket(
  supabase: NonNullable<ReturnType<typeof createServerSupabase>>,
) {
  const { data: bucket } = await supabase.storage.getBucket(BUCKET);
  if (!bucket) {
    await supabase.storage.createBucket(BUCKET, { public: true });
    return;
  }
  if (!bucket.public) {
    await supabase.storage.updateBucket(BUCKET, { public: true });
  }
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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return NextResponse.json({ error: "Supabase URL not configured" }, { status: 503 });
  }

  await ensurePublicEventImagesBucket(supabase);

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, and WebP images allowed" },
      { status: 400 },
    );
  }

  if (file.size > EVENT_IMAGE_MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      {
        error: `Optimised image must be under ${formatBytes(EVENT_IMAGE_MAX_UPLOAD_BYTES)}. Try a smaller photo.`,
      },
      { status: 400 },
    );
  }

  const ext =
    file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "webp";
  const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const url = getEventImagePublicUrl(supabaseUrl, path);
  return NextResponse.json({ url, path });
}
