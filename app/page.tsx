import { BookingForm } from "@/components/BookingForm";
import { ServiceGrid } from "@/components/ServiceGrid";

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

      <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-32 md:px-10 md:pt-36">
        {/* Hero — bento */}
        <section className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          <div className="glass-panel relative flex flex-col overflow-hidden rounded-[2rem] p-8 lg:col-span-7 lg:min-h-[420px]">
            <div className="relative z-[1] max-w-xl">
              <p className="section-title mb-6">Introducing</p>
              <h1 className="font-display text-4xl font-semibold uppercase leading-[1.05] tracking-[0.06em] text-white md:text-5xl xl:text-6xl">
                <span className="text-outline block text-transparent [text-shadow:0_0_0_rgb(255_255_255/0.92)] [-webkit-text-stroke:1px_rgb(255_255_255/0.45)]">
                  Sophisticated
                </span>
                <span className="block text-outline mt-3 text-transparent [text-shadow:0_0_0_rgb(255_255_255/0.92)] [-webkit-text-stroke:1px_rgb(255_255_255/0.45)]">
                  Soundscapes
                </span>
                <span className="font-script mt-6 block text-3xl font-normal lowercase text-white md:text-4xl">
                  for Social Spaces.
                </span>
              </h1>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-white/65 md:text-base">
                Curated music, considered grooves, effortless atmosphere — from laid-back daytime
                sessions to elegant late-night experiences.
              </p>
            </div>
            {/* Decorative waveform */}
            <svg
              className="pointer-events-none absolute bottom-10 right-6 w-56 opacity-[0.12] lg:w-72"
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
            <div className="hero-bokeh relative min-h-[180px] flex-1 overflow-hidden rounded-[2rem] border border-white/15">
              <span className="absolute left-6 top-6 rounded-full bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/65 backdrop-blur">
                Evening social
              </span>
              <span className="absolute bottom-6 right-6 text-[10px] uppercase tracking-[0.28em] text-white/55">
                Bokeh &amp; light
              </span>
            </div>
            <div className="hero-kit relative min-h-[200px] flex-1 overflow-hidden rounded-[2rem] border border-white/15">
              <span className="absolute left-6 top-6 rounded-full bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/65 backdrop-blur">
                In the booth
              </span>
              <div className="absolute bottom-5 left-1/2 h-28 w-[78%] -translate-x-1/2 rounded-2xl border border-white/10 bg-black/65 shadow-[inset_0_0_40px_rgba(255,255,255,0.04)] backdrop-blur" />
              <span className="absolute bottom-4 right-5 text-[10px] uppercase tracking-[0.28em] text-white/45">
                Replace with venue photo
              </span>
            </div>
            <div className="hero-lounge relative min-h-[140px] overflow-hidden rounded-[2rem] border border-white/15">
              <span className="absolute left-6 top-6 rounded-full bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/65 backdrop-blur">
                Lounge vignette
              </span>
            </div>
          </div>
        </section>

        {/* Music */}
        <section id="music" className="mt-20 lg:mt-28">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-title">The sound</p>
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
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
                    On rotation
                  </p>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
                    Playing low slung bass lines, soulful edits, organic house and rare groove.
                  </p>
                </div>
              </div>
            </div>
            <div className="glass-panel flex flex-col justify-between rounded-3xl p-8">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
                Promise
              </p>
              <p className="mt-6 font-script text-2xl text-white/90">
                Effortless atmosphere — you stay in the moment.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="mt-20 lg:mt-28">
          <div className="mb-12 max-w-2xl">
            <p className="section-title">Services</p>
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
            <p className="section-title">Philosophy</p>
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

          <div id="book" className="scroll-mt-36">
            <p className="section-title mb-6">Booking</p>
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
