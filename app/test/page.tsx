import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { TestScrollCards } from "@/components/TestScrollCards";

export const metadata: Metadata = {
  title: "Design Test | LUDZY",
  robots: { index: false, follow: false },
};

const PEXELS_CROWD =
  "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80";
const PEXELS_DJ_BOOTH =
  "https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80";
const PEXELS_VENUE =
  "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80";
const PEXELS_GARDEN =
  "https://images.pexels.com/photos/13902049/pexels-photo-13902049.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80";
const PEXELS_TERRACE =
  "https://images.pexels.com/photos/1267697/pexels-photo-1267697.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80";
const PEXELS_FESTIVAL =
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1400&q=82";

const serviceCards = [
  {
    title: "Weddings",
    copy: "Ceremony warmth through to dancefloor energy. Every set bespoke to the couple, shaped around your timeline, crowd, and must-play moments.",
    img: PEXELS_GARDEN,
  },
  {
    title: "Private parties",
    copy: "Birthdays, milestones, garden parties — tailored to the crowd and the moment. From laid-back afternoons to late-night peaks.",
    img: PEXELS_CROWD,
  },
  {
    title: "Residencies",
    copy: "Pubs, bars, restaurants, hotels — one-off performances or a consistent weekly sonic identity that fits your venue's brand.",
    img: PEXELS_VENUE,
  },
  {
    title: "Corporate",
    copy: "Product launches, awards, team events — polished pacing for receptions, showcases, and after-parties. Discrete, dependable, bespoke.",
    img: PEXELS_DJ_BOOTH,
  },
  {
    title: "Terrace sessions",
    copy: "Garden parties, beer gardens, open-air bars — daytime soul, sunset grooves, and breezy rollers calibrated for alfresco acoustics.",
    img: PEXELS_TERRACE,
  },
  {
    title: "Festivals",
    copy: "Warm-up stages, headline slots, multi-room events — high-energy sets built for festival crowds and big sound systems.",
    img: PEXELS_FESTIVAL,
  },
];

function mixcloudEmbed(slug: string) {
  return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&light=0&feed=${encodeURIComponent(`/DJ-Ludzy/${slug}/`)}`;
}

const mixCards = [
  {
    title: "Chilled Ibiza",
    copy: "Downtempo edits and soulful vocal cuts — sunset energy for the terrace.",
    embedUrl: mixcloudEmbed("chilled-ibiza-20260507-183957"),
    externalUrl:
      "https://www.mixcloud.com/DJ-Ludzy/chilled-ibiza-20260507-183957/",
  },
  {
    title: "UK Garage — Thursday Night Live",
    copy: "Soulful garage rollers into classic house — residency energy.",
    embedUrl: mixcloudEmbed(
      "uk-garage-thursday-night-live-with-ludzy-20260514-185716",
    ),
    externalUrl:
      "https://www.mixcloud.com/DJ-Ludzy/uk-garage-thursday-night-live-with-ludzy-20260514-185716/",
  },
  {
    title: "Nu Disco Sampler",
    copy: "Rare groove and nu-disco flavours — polished, bright, feel-good.",
    embedUrl: mixcloudEmbed("nu-disco-sampler"),
    externalUrl: "https://www.mixcloud.com/DJ-Ludzy/nu-disco-sampler/",
  },
];

const genres = [
  "House",
  "Soulful edits",
  "UK garage",
  "Nu disco",
  "Rare groove",
  "Organic house",
];

export default function TestPage() {
  return (
    <main className="relative text-white">
      {/* ─── HERO ─── full-bleed video, Fabric-style */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.35] saturate-0"
          aria-hidden
        >
          <source
            src="https://videos.pexels.com/video-files/9003937/9003937-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
          <source
            src="https://videos.pexels.com/video-files/9003937/9003937-hd_1920_1080_25fps.mp4"
            type="video/mp4"
          />
        </video>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="relative z-10 px-6 pb-12 md:px-12 md:pb-20 lg:px-20">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.4em] text-white/50">
            House &amp; dance music DJ — Suffolk &amp; East Anglia
          </p>
          <h1 className="test-hero-title max-w-5xl font-display text-[clamp(3rem,10vw,9rem)] font-bold uppercase leading-[0.88] tracking-[-0.02em] text-white">
            DJ Ludzy
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
            Professional DJ available for hire across Suffolk — Ipswich,
            Woodbridge, Framlingham, Southwold, and beyond. Curated house,
            soulful edits, and organic grooves for weddings, private parties,
            corporate events, and venue residencies.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/test/contact"
              className="test-btn-primary inline-flex items-center px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em]"
            >
              Get in touch
            </Link>
            <Link
              href="/#music"
              className="test-btn-ghost inline-flex items-center px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em]"
            >
              Listen
            </Link>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 animate-bounce">
          <div className="h-10 w-px bg-gradient-to-b from-transparent to-white/40" />
        </div>
      </section>

      {/* ─── MARQUEE ─── rolling genre strip */}
      <section className="overflow-hidden border-y border-white/10 bg-black py-4">
        <div className="test-marquee whitespace-nowrap">
          {[...genres, ...genres, ...genres].map((g, i) => (
            <span
              key={i}
              className="mx-6 inline-block text-[11px] font-semibold uppercase tracking-[0.35em] text-white/40 md:mx-10"
            >
              {g}
            </span>
          ))}
        </div>
      </section>

      {/* ─── ABOUT ─── editorial two-column */}
      <section className="relative px-6 py-24 md:px-12 md:py-36 lg:px-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/40">
              The sound
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-[-0.01em] text-white md:text-5xl lg:text-6xl">
              Low-slung,
              <br />
              soulful,
              <br />
              organic.
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-white/55">
              Playing low-slung bass lines, soulful edits, organic house and
              rare groove. Timeless palettes for rooms that breathe — restrained
              peaks, tactile bass, melodic detail.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {genres.map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-white/15 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <Image
              src={PEXELS_DJ_BOOTH}
              alt="DJ booth with warm lighting"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover brightness-75 saturate-[0.3]"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── horizontal scroll cards */}
      <div className="border-t border-white/10">
        <TestScrollCards
          label="Services"
          heading="What we do"
          items={serviceCards}
          variant="image"
        />
      </div>

      {/* ─── MIXES ─── horizontal scroll cards with embeds */}
      <div className="border-t border-white/10">
        <TestScrollCards
          label="On rotation"
          heading="Listen"
          items={mixCards}
          variant="embed"
        />
      </div>

      {/* ─── QUOTE ─── */}
      <section className="flex min-h-[60vh] items-center justify-center border-t border-white/10 px-6 py-24 md:px-12">
        <div className="max-w-4xl text-center">
          <blockquote className="font-display text-3xl font-bold uppercase leading-[1.1] tracking-[-0.01em] text-white md:text-5xl lg:text-6xl">
            &ldquo;Crafting the perfect atmosphere for moments that matter.&rdquo;
          </blockquote>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.4em] text-white/35">
            Ludzy — House &amp; dance music DJ
          </p>
        </div>
      </section>

      {/* ─── CTA ─── full-bleed image */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <Image
          src={PEXELS_CROWD}
          alt="Crowd at a music event"
          fill
          sizes="100vw"
          className="object-cover brightness-[0.25] saturate-0"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

        <div className="relative z-10 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/40">
            Available for hire
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-white md:text-6xl lg:text-7xl">
            Book Ludzy
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/50">
            Venue, date, timings, vibe — send a brief and let&apos;s make it
            happen.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/test/contact"
              className="test-btn-primary inline-flex items-center px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em]"
            >
              Enquire now
            </Link>
            <a
              href="tel:07592262525"
              className="test-btn-ghost inline-flex items-center px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em]"
            >
              07592 262525
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── minimal */}
      <footer className="border-t border-white/10 bg-black px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/30">
            Ludzy — Design test page
          </p>
          <div className="flex gap-6">
            <a
              href="https://www.instagram.com/dj_ludzy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40 transition hover:text-white"
            >
              Instagram
            </a>
            <a
              href="https://www.mixcloud.com/DJ-Ludzy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40 transition hover:text-white"
            >
              Mixcloud
            </a>
            <a
              href="https://www.facebook.com/share/1BWMcvt3xe/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40 transition hover:text-white"
            >
              Facebook
            </a>
          </div>
          <Link
            href="/"
            className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40 transition hover:text-white"
          >
            View current site →
          </Link>
        </div>
      </footer>
    </main>
  );
}
