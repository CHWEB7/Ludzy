/**
 * Mixcloud iframe widget — users play in-page.
 * @see https://www.mixcloud.com/developers/widget/
 */
export function MixcloudEmbed({
  mixUrl,
  title,
  height = 120,
}: {
  mixUrl: string;
  title: string;
  height?: number;
}) {
  const feed = encodeURIComponent(mixUrl);
  const src = `https://www.mixcloud.com/widget/iframe/?hide_cover=1&light=0&feed=${feed}`;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/15 bg-black/50 ring-1 ring-white/10">
      <iframe
        title={title}
        src={src}
        width="100%"
        height={height}
        className="w-full border-0"
        allow="encrypted-media; fullscreen"
        loading="lazy"
      />
    </div>
  );
}
