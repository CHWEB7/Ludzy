import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { fetchLatestMixcloudShows } from "@/lib/mixcloud";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const isVercelCron = req.headers.get("x-vercel-cron") === "1";

  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}` && !isVercelCron) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const shows = await fetchLatestMixcloudShows();
  revalidatePath("/");
  revalidatePath("/test");

  return NextResponse.json({
    ok: true,
    revalidated: ["/", "/test"],
    showCount: shows.length,
    latestTitle: shows[0]?.title ?? null,
    at: new Date().toISOString(),
  });
}
