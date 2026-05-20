import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPreviousEvent, previousEvents } from "@/lib/events-data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return previousEvents.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getPreviousEvent(slug);
  if (!event) return { title: "Event | LUDZY" };
  return {
    title: `${event.title} | LUDZY Events`,
    description: event.excerpt,
  };
}

export default async function PreviousEventPage({ params }: Props) {
  const { slug } = await params;
  const event = getPreviousEvent(slug);
  if (!event) notFound();

  return (
    <main className="relative min-h-screen text-paper">
      <div className="relative mx-auto max-w-3xl px-5 pb-28 pt-10 md:px-10 md:pt-14">
        <Link
          href="/events"
          className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50 transition hover:text-white"
        >
          ← All events
        </Link>

        <article className="mt-10">
          <p className="title-impact">Previous event</p>
          <h1 className="mt-4 font-display text-3xl font-semibold uppercase leading-snug tracking-[0.1em] text-white md:text-4xl">
            {event.title}
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.22em] text-white/45">
            {event.date} · {event.venue}
          </p>

          <p className="mt-8 text-lg leading-relaxed text-white/75">{event.excerpt}</p>

          <div className="mt-10 space-y-6 border-t border-white/10 pt-10">
            {event.body.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-white/65">
                {paragraph}
              </p>
            ))}
          </div>

          <p className="mt-12 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-[11px] uppercase tracking-[0.2em] text-white/40">
            Template content — replace in lib/events-data.ts
          </p>
        </article>
      </div>
    </main>
  );
}
