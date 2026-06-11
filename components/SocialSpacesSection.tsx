import Link from "next/link";

const SOCIAL_SPACES_IMAGE = "/images/social-spaces.jpg";

export function SocialSpacesSection() {
  return (
    <section className="relative px-6 py-24 md:px-12 md:py-36 lg:px-20">
      <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16 xl:gap-20">
        <div className="order-2 lg:order-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/40">
            Social spaces
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-[-0.01em] text-white md:text-5xl lg:text-6xl">
            Sophisticated<br />
            soundscapes.
          </h2>

          <div className="mt-8 max-w-xl space-y-5 text-base leading-relaxed text-white/55">
            <p>
              Curated atmospheres for rooms where conversation and ambience matter as much as
              the playlist — restrained grooves, melodic detail, and music that elevates the
              space without dominating it.
            </p>
            <p>
              The sound draws on organic house, melodic house, soulful edits, UK garage, and
              nu disco — the same palette heard across Ludzy&apos;s Mixcloud sessions, shaped
              by labels such as Anjunadeep and artists including Ben Böhmer, Fred again..,
              Sammy Virji, Lane 8, and BICEP.
            </p>
            <p>
              Built for lounges and bars, restaurant dining rooms, hotel terraces, and
              members&apos; clubs — anywhere a refined, consistent sonic identity is needed
              from afternoon through to evening.
            </p>
          </div>

          <div className="mt-10">
            <Link
              href="/events"
              className="test-btn-ghost inline-flex items-center px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em]"
            >
              Previous events
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative overflow-hidden rounded-sm border border-white/10 bg-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SOCIAL_SPACES_IMAGE}
              alt="Ludzy DJ providing a sophisticated soundtrack in a social space"
              className="block h-auto w-full brightness-[0.78] contrast-[1.05] saturate-0"
              decoding="async"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
