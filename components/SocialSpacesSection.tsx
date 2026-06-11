import Image from "next/image";

const SOCIAL_SPACES_IMAGE = "/images/social-spaces.jpg";

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

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-white/10">
          <Image
            src={SOCIAL_SPACES_IMAGE}
            alt="Ludzy DJ providing a sophisticated soundtrack in a social space"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-[center_22%] brightness-[0.72] contrast-[1.05] saturate-0"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/35" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
        </div>
      </div>
    </section>
  );
}
