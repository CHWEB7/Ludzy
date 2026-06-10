import type { Metadata } from "next";
import Link from "next/link";
import { EventCoverImage } from "@/components/EventCoverImage";
import { TestUpcomingCard } from "@/components/TestUpcomingCard";
import {
  fetchPublishedEvents,
  resolvePublishedEventLists,
} from "@/lib/events-db";

export const metadata: Metadata = {
  title: "Events | DJ Ludzy",
  description:
    "Previous event recaps and upcoming bookings — DJ Ludzy house & dance music across Suffolk and East Anglia.",
};

export const revalidate = 60;

export default async function EventsPage() {
  const fromDb = await fetchPublishedEvents();
  const { previous, upcoming } = resolvePublishedEventLists(fromDb);

  return (
    <main className="relative min-h-screen text-white">
      <section className="relative flex min-h-[50vh] items-end overflow-hidden px-6 pb-16 pt-32 md:px-12 md:pb-20 lg:px-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/35">
              <li><Link href="/" className="transition hover:text-white/60">Home</Link></li>
              <li aria-hidden>/</li>
              <li className="text-white/55">Events</li>
            </ol>
          </nav>
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/40">Recaps &amp; upcoming dates</p>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-white md:text-5xl lg:text-7xl">Events</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/50 md:text-lg">Past nights and future dates. Tap a recap to read the full write-up, or expand an upcoming slot for details.</p>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">Archive</p>
          <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-[-0.01em] text-white md:text-3xl">Previous events</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {previous.map((event) => (
                <Link
                  key={event.id ?? event.slug}
                  href={`/events/${event.slug}`}
                  className="group flex max-w-[420px] flex-col border border-white/10 bg-black p-5 transition hover:border-white/25 hover:bg-white/[0.03] md:p-6"
                >
                  {event.imageUrl && (
                    <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden">
                      <EventCoverImage
                        src={event.imageUrl}
                        alt=""
                        className="h-full w-full object-cover brightness-75"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">{event.date}</p>
                    <h3 className="mt-2 font-display text-lg font-bold uppercase tracking-[0.06em] text-white/90 transition group-hover:text-white md:text-xl">{event.title}</h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{event.venue}</p>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-white/45 transition group-hover:text-white/60">{event.excerpt}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40 transition group-hover:text-white">
                    Read recap
                    <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.5 6h7M6.5 2.5 10 6l-3.5 3.5" /></svg>
                  </span>
                </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">Diary</p>
          <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-[-0.01em] text-white md:text-3xl">Upcoming events</h2>
          <div className="mt-10">
            {upcoming.map((event) => (
              <TestUpcomingCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/30">Want Ludzy at your event?</p>
          <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-[-0.01em] text-white md:text-3xl">Get in touch</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="test-btn-primary inline-flex items-center px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em]">Enquire now</Link>
            <a href="tel:07592262525" className="test-btn-ghost inline-flex items-center px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em]">07592 262525</a>
          </div>
        </div>
      </section>
    </main>
  );
}
