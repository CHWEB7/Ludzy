import Image from "next/image";
import { BookingForm } from "@/components/BookingForm";
import { HeroPhotoCard } from "@/components/HeroPhotoCard";
import { ServiceGrid } from "@/components/ServiceGrid";

/** Swap to `/images/hero-light-trails.jpg` for your own long-exposure light-trails photo */
const heroMainTextureSrc =
  "https://images.unsplash.com/photo-1544984241-ec57ea16fe25?auto=format&fit=crop&w=2000&q=85";

const heroPhotos = [
  {
    title: "Evening social",
    caption: "Smoke, rim light & groove",
    /* DJ silhouette / mixer — grayscale applied in-card; swap to /images/evening-social.jpg if you upload the exact flyer photo */
    src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1400&q=80",
    alt: "Greyscale DJ performance with hands at the mixer and stage haze",
    minHeightClass: "min-h-[188px]",
  },
  {
    title: "In the booth",
    caption: "Hands on the mix",
    src: "https://images.unsplash.com/photo-1470225627910-9fb66461bbfe?auto=format&fit=crop&w=1200&q=75",
    alt: "Monochrome close-up of DJ turntables and mixer in low light",
    minHeightClass: "min-h-[208px]",
  },
  {
    title: "Lounge vignette",
    caption: "Low light, soft seats",
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=75",
    alt: "Greyscale interior of a dim lounge with sofas",
    minHeightClass: "min-h-[148px]",
  },
] as const;

export default function Home() {
  return (
    <main id="top" className="relative overflow-hidden text-paper">
      {/* Ambient grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-8 md:px-10 md:pt-10">
        {/* Hero — bento */}
        <section className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          <div className="relative flex flex-col overflow-hidden rounded-[2rem] border border-white/15 bg-neutral-950/40 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:col-span-7 lg:min-h-[420px]">
            {/* Background — monochrome energy, black toward top for typography */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
              <Image
                src={heroMainTextureSrc}
                alt=""
                aria-hidden
                fill
                className="scale-105 object-cover object-center grayscale-[0.92] brightness-[0.85] contrast-[1.08] saturate-0"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
              {/* Black falloff at top */}
              <div
                className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(0,0,0,1)_0%,_rgba(0,0,0,0.88)_18%,_rgba(0,0,0,0.45)_45%,_rgba(0,0,0,0.12)_68%,_transparent_100%)]"
                aria-hidden
              />
              {/* Readability: soft side vignettes */}
              <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_120%_-10%,transparent_52%,rgba(0,0,0,0.55)_96%)]"
                aria-hidden
              />
              <div className="absolute inset-0 bg-black/35" aria-hidden />
            </div>

            <div className="relative z-[2] max-w-xl">
              <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
                <p className="title-impact shrink-0">Introducing</p>
                <span
                  className="hidden h-[2.25rem] w-px shrink-0 bg-gradient-to-b from-transparent via-white/35 to-transparent sm:block"
                  aria-hidden
                />
                <p className="text-[11px] font-semibold uppercase leading-snug tracking-[0.26em] text-white/92 [text-shadow:0_2px_20px_rgba(0,0,0,1),0_1px_2px_rgba(0,0,0,.9)] sm:max-w-md">
                  Ludzy — House &amp; Dance music DJ
                </p>
              </div>
              <h1 className="font-display text-4xl font-semibold uppercase leading-[1.05] tracking-[0.06em] text-white [text-shadow:0_4px_32px_rgba(0,0,0,1),0_2px_6px_rgba(0,0,0,.9)] md:text-5xl xl:text-6xl">
                <span className="text-outline block text-transparent [text-shadow:0_0_0_rgb(255_255_255/0.92)] [-webkit-text-stroke:1px_rgb(255_255_255/0.45)]">
                  Sophisticated
                </span>
                <span className="text-outline mt-3 block text-transparent [text-shadow:0_0_0_rgb(255_255_255/0.92)] [-webkit-text-stroke:1px_rgb(255_255_255/0.45)]">
                  Soundscapes
                </span>
                <span className="font-script mt-6 block text-3xl font-normal lowercase text-white md:text-4xl [text-shadow:0_3px_24px_rgba(0,0,0,.95)]">
                  for Social Spaces.
                </span>
              </h1>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-white/82 [text-shadow:0_2px_16px_rgba(0,0,0,.95)] md:text-base md:text-white/85">
                Curated music, considered grooves, effortless atmosphere — from laid-back daytime
                sessions to elegant late-night experiences.
              </p>
            </div>
            {/* Decorative waveform */}
            <svg
              className="pointer-events-none absolute bottom-10 right-6 z-[1] w-56 opacity-[0.14] lg:w-72"
              viewBox="0 0 420 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M0 60 Q30 15 60 60 T120 60 T180 38 T240 74 T300 54 T360 82 T420 54"
                stroke="white"
                strokeWidth="2"
              />
              <path
                d="M0 92 Q41 122 92 92 T164 104 T246 74 T332 106 T420 92"
                stroke="white"
                strokeOpacity="0.6"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-5 lg:col-span-5">
            {heroPhotos.map((tile) => (
              <HeroPhotoCard
                key={tile.title}
                title={tile.title}
                caption={tile.caption}
                src={tile.src}
                alt={tile.alt}
                minHeightClass={tile.minHeightClass}
              />
            ))}
          </div>
        </section>

        {/* Music */}
        <section id="music" className="mt-20 lg:mt-28">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="title-impact">The sound</p>
              <h2 className="mt-4 font-display text-2xl font-semibold uppercase tracking-[0.2em] text-white md:text-3xl">
                Low-slung, soulful, organic
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/55">
              Timeless palettes for rooms that breathe — restrained peaks, tactile bass, melodic
              detail.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="glass-panel rounded-3xl p-8 lg:col-span-2">
              <div className="flex flex-wrap items-start gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-black/40">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M4 22V10M9 24V8M14 18V14M19 26V6M24 20V12M28 16V10"
                      stroke="white"
                      strokeOpacity="0.85"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="title-impact">On rotation</p>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
                    Playing low slung bass lines, soulful edits, organic house and rare groove.
                  </p>
                </div>
              </div>
            </div>
            <div className="glass-panel flex flex-col justify-between rounded-3xl p-8">
              <p className="title-impact">Promise</p>
              <p className="mt-6 font-script text-2xl text-white/90">
                Effortless atmosphere — you stay in the moment.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="mt-20 lg:mt-28">
          <div className="mb-12 max-w-2xl">
            <p className="title-impact">Services</p>
            <h2 className="mt-4 font-display text-2xl font-semibold uppercase tracking-[0.2em] text-white md:text-3xl">
              Four ways we set the room
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              Tap a card for more detail — every booking is soundtracked bespoke to brief, acoustics,
              and crowd energy.
            </p>
          </div>
          <ServiceGrid />
        </section>

        {/* Mission + book */}
        <section
          id="mission"
          className="mt-20 grid gap-10 rounded-[2rem] border border-white/12 bg-black/65 p-10 backdrop-blur lg:mt-28 lg:grid-cols-2 lg:gap-14 lg:p-14"
        >
          <div>
            <p className="title-impact">Philosophy</p>
            <h2 className="mt-5 font-display text-2xl font-semibold uppercase leading-snug tracking-[0.16em] text-white md:text-3xl">
              Timeless.
              <br />
              Sophisticated.
              <br />
              Rhythm.
            </h2>
            <p className="mt-8 text-base leading-relaxed text-white/70">
              Crafting the perfect atmosphere for moments that matter. From laid-back daytime sessions
              to elegant late-night experiences — we set the tone so you can enjoy the moment.
            </p>
            <blockquote className="mt-10 border-l border-white/25 pl-6 font-script text-2xl leading-snug text-white/85">
              Let&apos;s make your event unforgettable.
            </blockquote>
          </div>

          <div id="book" className="scroll-mt-28">
            <p className="title-impact mb-6">Booking</p>
            <h3 className="font-display text-xl font-semibold uppercase tracking-[0.22em] text-white md:text-2xl">
              Let&apos;s create something memorable
            </h3>
            <p className="mt-4 text-sm text-white/55">
              Send a concise brief — venue, timings, approximate guest profile, references. Weekend
              dates move quickly.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-white/65">
              <a
                href="tel:07592262525"
                className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 transition hover:border-white hover:text-white"
              >
                <span className="text-lg" aria-hidden>
                  📞
                </span>
                <span>07592 262525</span>
              </a>
              <a
                href="mailto:info@ajeventspromotions.com"
                className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 transition hover:border-white hover:text-white"
              >
                <span className="text-lg" aria-hidden>
                  ✉️
                </span>
                <span>info@ajeventspromotions.com</span>
              </a>
            </div>
            <div className="mt-10">
              <BookingForm />
            </div>
          </div>
        </section>

        {/* Closing band */}
        <footer className="mt-24 border-t border-white/10 pt-10 text-center md:mt-32">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
            Curated music · considered vibes · effortless atmosphere
          </p>
          <p className="font-script mt-4 text-2xl text-white/85">
            LUDZY — DJ for refined social spaces
          </p>
          <p className="mx-auto mt-8 max-w-md text-[11px] leading-relaxed text-white/35">
            Replace placeholder photography with your flyer assets via{" "}
            <code className="rounded bg-white/5 px-1 py-0.5 text-[10px] text-white/50">
              public/images
            </code>{" "}
            — see README.
          </p>
        </footer>
      </div>
    </main>
  );
}
