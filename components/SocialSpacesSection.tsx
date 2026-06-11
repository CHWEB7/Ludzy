const genres = [
  "Organic house",
  "Melodic house",
  "Soulful edits",
  "UK garage",
  "Nu disco",
  "Rare groove",
  "Downtempo",
  "Ibiza chill",
];

const environments = [
  "Cocktail bars & lounges",
  "Restaurant dining rooms",
  "Hotel lobbies & terraces",
  "Beer gardens & rooftops",
  "Members' clubs",
  "Corporate receptions",
  "Daytime socials",
];

const labels = ["Anjunadeep", "Shall Not Fade", "Glitterbox", "Defected", "Dirtybird"];

const artists = [
  "Ben Böhmer",
  "Fred again..",
  "Sammy Virji",
  "Lane 8",
  "Yotto",
  "BICEP",
  "Peggy Gou",
  "Hot Since 82",
  "Conducta",
  "Disclosure",
];

const tagClass =
  "rounded-full border border-white/15 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50";

export function SocialSpacesSection() {
  return (
    <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/40">
            Social spaces
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-[-0.01em] text-white md:text-5xl lg:text-6xl">
            Sophisticated soundscapes
          </h2>
          <p className="mt-6 text-base leading-relaxed text-white/55 md:text-lg">
            Curated background music for rooms where atmosphere matters as much as the
            playlist — restrained energy, melodic detail, and grooves that elevate social
            spaces without dominating them.
          </p>
        </div>

        <div className="mt-14 grid gap-10 border border-white/10 bg-black/30 p-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/10 md:p-8 lg:p-10">
          <div className="md:px-6 md:first:pl-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">
              The music
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              Low-slung bass, soulful vocals, and considered peaks — the same palette heard
              across Ludzy&apos;s Mixcloud sessions, from melodic house and organic grooves
              to UK garage rollers and nu-disco warmth.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span key={genre} className={tagClass}>
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div className="md:px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">
              Built for
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              Environments where conversation, service, and ambience need to work together —
              music that reads the room and holds a consistent, refined tone from afternoon
              through to evening.
            </p>
            <ul className="mt-5 space-y-2.5">
              {environments.map((environment) => (
                <li
                  key={environment}
                  className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45"
                >
                  {environment}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:px-6 md:last:pr-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">
              Labels &amp; artists
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              Selections draw from the same world as the mixes on rotation — labels like
              Anjunadeep alongside artists you&apos;ll hear woven through Ludzy&apos;s sets.
            </p>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
              Labels
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {labels.map((label) => (
                <span key={label} className={tagClass}>
                  {label}
                </span>
              ))}
            </div>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
              Artists
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {artists.map((artist) => (
                <span key={artist} className={tagClass}>
                  {artist}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
