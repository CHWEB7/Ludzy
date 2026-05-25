import type { Metadata } from "next";
import Link from "next/link";
import { PreviousEventCard } from "@/components/PreviousEventCard";
import { SwipeCarousel } from "@/components/SwipeCarousel";
import { UpcomingEventCard } from "@/components/UpcomingEventCard";
import { previousEvents, upcomingEvents } from "@/lib/events-data";

export const metadata: Metadata = {
  title: "Events | LUDZY (Legacy)",
  description:
    "Previous event recaps and upcoming bookings — DJ Ludzy house & dance music.",
};

export default function LegacyEventsPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip text-paper">
      <div className="relative mx-auto min-w-0 max-w-7xl px-5 pb-28 pt-10 md:px-10 md:pt-14">
        <header className="max-w-3xl">
          <p className="title-impact">Events</p>
          <h1 className="mt-4 font-display text-4xl font-semibold uppercase leading-[1.05] tracking-[0.08em] text-white md:text-5xl">
            Recaps &amp; dates
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
            Swipe through previous nights — each recap opens its own page. Upcoming
            slots expand in place with time, location, and set style.
          </p>
          <Link
            href="/legacy"
            className="mt-8 inline-flex text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50 transition hover:text-white"
          >
            ← Back to home
          </Link>
        </header>

        <div className="mt-16 space-y-20 md:mt-24 md:space-y-28">
          <SwipeCarousel
            label="Blog"
            title="Previous events"
            description="Event write-ups and memories — tap a card for the full recap."
          >
            {previousEvents.map((event) => (
              <PreviousEventCard key={event.slug} event={event} />
            ))}
          </SwipeCarousel>

          <SwipeCarousel
            label="Diary"
            title="Upcoming events"
            description="Confirmed and provisional dates — tap to expand."
          >
            {upcomingEvents.map((event) => (
              <UpcomingEventCard key={event.id} event={event} />
            ))}
          </SwipeCarousel>
        </div>
      </div>
    </main>
  );
}
