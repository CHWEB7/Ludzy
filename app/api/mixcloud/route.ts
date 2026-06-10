import { NextResponse } from "next/server";
import { fetchLatestMixcloudShows } from "@/lib/mixcloud";

/** Debug/status endpoint — confirms Mixcloud fetch works on Vercel. */
export async function GET() {
  const shows = await fetchLatestMixcloudShows();

  return NextResponse.json({
    ok: true,
    count: shows.length,
    latest: shows.map((show) => ({
      id: show.id,
      title: show.title,
      publishedAt: show.publishedAt,
      externalUrl: show.externalUrl,
    })),
  });
}
