export type MixcloudShow = {
  id: string;
  title: string;
  copy: string;
  embedUrl: string;
  externalUrl: string;
  imageUrl?: string;
  publishedAt: string;
};

type MixcloudTag = {
  name?: string;
};

type MixcloudCloudcast = {
  key: string;
  url: string;
  name: string;
  slug: string;
  created_time: string;
  tags?: MixcloudTag[];
  audio_length?: number;
  pictures?: {
    large?: string;
    extra_large?: string;
  };
};

type MixcloudCloudcastsResponse = {
  data?: MixcloudCloudcast[];
};

const DEFAULT_USERNAME = "DJ-Ludzy";
const DEFAULT_LIMIT = 6;

const FALLBACK_SHOWS: MixcloudShow[] = [
  {
    id: "chilled-ibiza-20260507-183957",
    title: "Chilled Ibiza",
    copy: "Downtempo edits and soulful vocal cuts — sunset energy for the terrace.",
    embedUrl: mixcloudEmbedUrl("/DJ-Ludzy/chilled-ibiza-20260507-183957/"),
    externalUrl: "https://www.mixcloud.com/DJ-Ludzy/chilled-ibiza-20260507-183957/",
    publishedAt: "2026-05-07T00:00:00Z",
  },
  {
    id: "uk-garage-thursday-night-live-with-ludzy-20260514-185716",
    title: "UK Garage — Thursday Night Live",
    copy: "Soulful garage rollers into classic house — residency energy.",
    embedUrl: mixcloudEmbedUrl(
      "/DJ-Ludzy/uk-garage-thursday-night-live-with-ludzy-20260514-185716/",
    ),
    externalUrl:
      "https://www.mixcloud.com/DJ-Ludzy/uk-garage-thursday-night-live-with-ludzy-20260514-185716/",
    publishedAt: "2026-05-14T00:00:00Z",
  },
  {
    id: "nu-disco-sampler",
    title: "Nu Disco Sampler",
    copy: "Rare groove and nu-disco flavours — polished, bright, feel-good.",
    embedUrl: mixcloudEmbedUrl("/DJ-Ludzy/nu-disco-sampler/"),
    externalUrl: "https://www.mixcloud.com/DJ-Ludzy/nu-disco-sampler/",
    publishedAt: "2026-05-01T00:00:00Z",
  },
];

export function mixcloudEmbedUrl(keyOrPath: string): string {
  const feed = keyOrPath.startsWith("/") ? keyOrPath : `/DJ-Ludzy/${keyOrPath}/`;
  return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&light=0&feed=${encodeURIComponent(feed)}`;
}

function getMixcloudUsername(): string {
  return process.env.MIXCLOUD_USERNAME?.trim() || DEFAULT_USERNAME;
}

function getMixcloudLimit(): number {
  const parsed = Number(process.env.MIXCLOUD_SHOW_LIMIT ?? DEFAULT_LIMIT);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(Math.round(parsed), 12);
}

function formatDuration(seconds: number): string {
  const totalMinutes = Math.max(1, Math.round(seconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes} min`;
}

function formatPublishedDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "Latest upload";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function buildShowCopy(cloudcast: MixcloudCloudcast): string {
  const tags = (cloudcast.tags ?? [])
    .map((tag) => tag.name?.trim())
    .filter((tag): tag is string => Boolean(tag));

  const parts: string[] = [];
  if (tags.length > 0) parts.push(tags.join(" · "));
  if (cloudcast.audio_length) parts.push(formatDuration(cloudcast.audio_length));
  parts.push(`Uploaded ${formatPublishedDate(cloudcast.created_time)}`);

  return parts.join(" — ");
}

function mapCloudcast(cloudcast: MixcloudCloudcast): MixcloudShow {
  return {
    id: cloudcast.slug,
    title: cloudcast.name,
    copy: buildShowCopy(cloudcast),
    embedUrl: mixcloudEmbedUrl(cloudcast.key),
    externalUrl: cloudcast.url,
    imageUrl: cloudcast.pictures?.extra_large ?? cloudcast.pictures?.large,
    publishedAt: cloudcast.created_time,
  };
}

export async function fetchLatestMixcloudShows(
  limit = getMixcloudLimit(),
): Promise<MixcloudShow[]> {
  const username = getMixcloudUsername();
  const url = `https://api.mixcloud.com/${encodeURIComponent(username)}/cloudcasts/?limit=${limit}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "LudzyDJ-Site/1.0 (+https://www.ludzy.online)",
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(
        "[mixcloud] API request failed:",
        res.status,
        res.statusText,
        body.slice(0, 200),
      );
      return FALLBACK_SHOWS.slice(0, limit);
    }

    const json = (await res.json()) as MixcloudCloudcastsResponse;
    const shows = (json.data ?? []).map(mapCloudcast);
    if (shows.length === 0) {
      console.warn("[mixcloud] API returned no cloudcasts; using fallback list.");
      return FALLBACK_SHOWS.slice(0, limit);
    }
    return shows;
  } catch (error) {
    console.error("[mixcloud] Failed to fetch uploads:", error);
    return FALLBACK_SHOWS.slice(0, limit);
  }
}
