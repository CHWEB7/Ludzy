import { unstable_noStore as noStore } from "next/cache";
import { TestScrollCards } from "@/components/TestScrollCards";
import { fetchLatestMixcloudShows } from "@/lib/mixcloud";

export async function MixcloudListenSection() {
  // Always fetch live on each request — avoids stale build-time fallback on Vercel.
  noStore();
  const shows = await fetchLatestMixcloudShows();

  return (
    <TestScrollCards
      label="On rotation"
      heading="Listen"
      items={shows.map((show) => ({
        id: show.id,
        title: show.title,
        copy: show.copy,
        embedUrl: show.embedUrl,
        externalUrl: show.externalUrl,
      }))}
      variant="embed"
    />
  );
}
