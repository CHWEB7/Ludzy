import Link from "next/link";
import type { LocalArea } from "@/lib/local-seo";
import { SocialLinks } from "@/components/SocialLinks";

function FaqSection({ faqs }: { faqs: LocalArea["faqs"] }) {
  return (
    <section aria-labelledby="faq-heading" className="mt-20 lg:mt-28">
      <div className="mb-10 max-w-2xl">
        <p className="title-impact">FAQ</p>
        <h2
          id="faq-heading"
          className="mt-4 font-display text-2xl font-semibold uppercase tracking-[0.16em] text-white md:text-3xl"
        >
          Frequently asked questions
        </h2>
      </div>

      <dl className="grid gap-4 md:grid-cols-2">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-sm"
          >
            <dt className="text-sm font-semibold leading-snug text-white/90">{faq.q}</dt>
            <dd className="mt-3 text-sm leading-relaxed text-white/60">{faq.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function TownGrid({ towns, county }: { towns: string[]; county: string }) {
  return (
    <section aria-labelledby="areas-heading" className="mt-20 lg:mt-28">
      <div className="mb-10 max-w-2xl">
        <p className="title-impact">Areas covered</p>
        <h2
          id="areas-heading"
          className="mt-4 font-display text-2xl font-semibold uppercase tracking-[0.16em] text-white md:text-3xl"
        >
          DJ available across {county}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/55">
          Ludzy is available for hire in each of these areas and surrounding villages.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {towns.map((town) => (
          <li
            key={town}
            className="group flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white/80 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/[0.06]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/50 text-xs text-white/50">
              📍
            </span>
            <span className="font-semibold tracking-[0.06em]">{town}</span>
          </li>
        ))}
        <li className="group flex items-center gap-3 rounded-xl border border-dashed border-white/10 bg-transparent px-4 py-4 text-sm text-white/40">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs text-white/30">
            +
          </span>
          <span className="tracking-[0.06em]">& surrounding areas</span>
        </li>
      </ul>
    </section>
  );
}

export function LocalLandingPage({ area }: { area: LocalArea }) {
  const services = [
    {
      icon: "🥂",
      title: "Weddings",
      text: `Ceremony warmth through to dancefloor energy at venues across ${area.county}.`,
    },
    {
      icon: "🎉",
      title: "Private parties",
      text: "Birthdays, milestones, garden parties — tailored to your crowd and playlist.",
    },
    {
      icon: "💼",
      title: "Corporate events",
      text: "Product launches, awards, team celebrations — polished and professional.",
    },
    {
      icon: "🍸",
      title: "Venue residencies",
      text: "Pubs, bars, restaurants, and hotels — one-off sets or regular bookings.",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-x-clip text-paper">
      <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-10 md:px-10 md:pt-14">
        {/* Hero */}
        <header className="max-w-3xl">
          <p className="title-impact">{area.county} DJ</p>
          <h1 className="mt-5 font-display text-4xl font-semibold uppercase leading-[1.05] tracking-[0.06em] text-white md:text-5xl xl:text-6xl">
            {area.heroHeading}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            {area.heroSub}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/#enquire"
              className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-7 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-black"
            >
              Get a quote
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-transparent px-7 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/70 transition hover:border-white/40 hover:text-white"
            >
              Find out more
            </Link>
          </div>
        </header>

        {/* Intro copy — multiple paragraphs for long-tail keyword density */}
        <section aria-labelledby="about-heading" className="mt-20 lg:mt-28">
          <div className="mb-10">
            <p className="title-impact">About</p>
            <h2
              id="about-heading"
              className="mt-4 font-display text-2xl font-semibold uppercase tracking-[0.16em] text-white md:text-3xl"
            >
              Your DJ in {area.county}
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="space-y-6">
              {area.intro.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-white/70">
                  {p}
                </p>
              ))}
            </div>
            <div className="glass-panel rounded-3xl p-8">
              <p className="title-impact">Music style</p>
              <p className="mt-6 font-script text-2xl text-white/90">
                Sophisticated soundscapes for social spaces
              </p>
              <ul className="mt-6 space-y-2">
                {["House & soulful edits", "UK garage", "Nu disco & rare groove", "Organic house", "Warm-up to peak-time"].map((genre) => (
                  <li
                    key={genre}
                    className="flex items-center gap-2 text-sm text-white/65"
                  >
                    <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden />
                    {genre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Services mini grid */}
        <section aria-labelledby="services-heading" className="mt-20 lg:mt-28">
          <div className="mb-10 max-w-2xl">
            <p className="title-impact">Services</p>
            <h2
              id="services-heading"
              className="mt-4 font-display text-2xl font-semibold uppercase tracking-[0.16em] text-white md:text-3xl"
            >
              Available for hire in {area.county}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {services.map((s) => (
              <div
                key={s.title}
                className="flex flex-col rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-sm"
              >
                <span className="text-2xl" aria-hidden>
                  {s.icon}
                </span>
                <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-white">
                  {s.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Towns */}
        <TownGrid towns={area.towns} county={area.county} />

        {/* FAQ */}
        <FaqSection faqs={area.faqs} />

        {/* CTA */}
        <section className="mt-20 rounded-[2rem] border border-white/12 bg-black/65 p-10 text-center backdrop-blur lg:mt-28 lg:p-14">
          <p className="title-impact">Ready?</p>
          <h2 className="mt-5 font-display text-2xl font-semibold uppercase tracking-[0.14em] text-white md:text-3xl">
            Book Ludzy for your {area.county} event
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/60">
            Send a quick brief — venue, date, timings, and vibe. Weekend dates move quickly, so get
            in touch early to secure availability.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/#enquire"
              className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-7 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-black"
            >
              Get a quote
            </Link>
            <a
              href="tel:07592262525"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-transparent px-7 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/70 transition hover:border-white/40 hover:text-white"
            >
              Call 07592 262525
            </a>
          </div>

          <div className="mx-auto mt-10 max-w-md">
            <p className="title-impact mb-4">Socials</p>
            <SocialLinks layout="compact" />
          </div>
        </section>

        {/* Footer breadcrumb */}
        <footer className="mt-16 text-center">
          <nav aria-label="Breadcrumb" className="text-[11px] text-white/40">
            <ol className="flex flex-wrap items-center justify-center gap-1">
              <li>
                <Link href="/" className="underline decoration-white/20 underline-offset-2 transition hover:text-white/60">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <span className="text-white/55">DJ in {area.county}</span>
              </li>
            </ol>
          </nav>
        </footer>
      </div>
    </main>
  );
}
