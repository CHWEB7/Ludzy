import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventGalleryDeck } from "@/components/EventGalleryDeck";
import { PreviousEventHero } from "@/components/PreviousEventHero";
import {
  fetchPreviousEventBySlug,
  resolvePreviousEventForSlug,
} from "@/lib/events-db";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dbEvent = await fetchPreviousEventBySlug(slug);
  const event = resolvePreviousEventForSlug(slug, dbEvent);
  if (!event) return { title: "Event | DJ Ludzy" };
  return { title: `${event.title} | DJ Ludzy Events`, description: event.excerpt };
}

export default async function PreviousEventPage({ params }: Props) {
  const { slug } = await params;
  const dbEvent = await fetchPreviousEventBySlug(slug);
  const event = resolvePreviousEventForSlug(slug, dbEvent);
  if (!event) notFound();

  return (
    <main className="relative min-h-screen text-white">
      <div className="border-b border-white/10 px-6 py-6 md:px-12 lg:px-20">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl">
          <ol className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/35">
            <li>
              <Link href="/" className="transition hover:text-white/60">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/events" className="transition hover:text-white/60">
                Events
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="max-w-[12rem] truncate text-white/55 sm:max-w-none">
              {event.title}
            </li>
          </ol>
        </nav>
      </div>

      <PreviousEventHero
        title={event.title}
        date={event.date}
        venue={event.venue}
        imageUrl={event.imageUrl}
      />

      <section className="px-6 pb-20 pt-14 md:px-12 md:pb-32 md:pt-20 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-white/70 md:text-xl md:leading-relaxed">
            {event.excerpt}
          </p>
          <div className="mt-10 space-y-6">
            {event.body.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-white/55">
                {paragraph}
              </p>
            ))}
          </div>

          {event.galleryImages && event.galleryImages.length > 0 && (
            <EventGalleryDeck images={event.galleryImages} alt={event.title} />
          )}

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-10">
            <Link
              href="/events"
              className="test-btn-ghost inline-flex items-center px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em]"
            >
              ← All events
            </Link>
            <Link
              href="/contact"
              className="test-btn-primary inline-flex items-center px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em]"
            >
              Book Ludzy
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
