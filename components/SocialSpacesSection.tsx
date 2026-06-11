import Image from "next/image";

const PEXELS_LOUNGE =
  "https://images.pexels.com/photos/2574489/pexels-photo-2574489.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80";

const musicTags = ["Organic house", "Melodic house", "Soulful edits", "UK garage", "Nu disco"];

const builtForTags = ["Lounges & bars", "Restaurants", "Hotels & terraces", "Members' clubs"];

const labelArtistTags = [
  "Anjunadeep",
  "Ben Böhmer",
  "Fred again..",
  "Sammy Virji",
  "Lane 8",
  "BICEP",
];

const tagClass =
  "rounded-full border border-white/15 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50";

function TagGroup({ label, tags }: { label: string; tags: string[] }) {
  return (
    <div className="mt-8">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className={tagClass}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SocialSpacesSection() {
  return (
    <section className="relative px-6 py-24 md:px-12 md:py-36 lg:px-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/40">
            Social spaces
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-[-0.01em] text-white md:text-5xl lg:text-6xl">
            Sophisticated<br />
            soundscapes.
          </h2>
          <p className="mt-8 max-w-md text-base leading-relaxed text-white/55">
            Curated atmospheres for rooms where conversation and ambience matter — restrained
            grooves, melodic detail, and music that elevates the space without dominating it.
          </p>

          <TagGroup label="The music" tags={musicTags} />
          <TagGroup label="Built for" tags={builtForTags} />
          <TagGroup label="Labels & artists" tags={labelArtistTags} />
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
          <Image
            src={PEXELS_LOUNGE}
            alt="Cocktail lounge with warm ambient lighting"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover brightness-75 saturate-[0.3]"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
