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
  if (!event) return { title: "Event | DJ Ludzy" };
  return { title: `${event.title} | DJ Ludzy Events`, description: event.excerpt };
}

export default async function PreviousEventPage({ params }: Props) {
  const { slug } = await params;
  const event = getPreviousEvent(slug);
  if (!event) notFound();

  return (
    <main className="relative min-h-screen text-white">
      <section className="px-6 pb-20 pt-28 md:px-12 md:pb-32 md:pt-36 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-12">
            <ol className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/35">
              <li><Link href="/" className="transition hover:text-white/60">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/events" className="transition hover:text-white/60">Events</Link></li>
              <li aria-hidden>/</li>
              <li className="text-white/55">{event.title}</li>
            </ol>
          </nav>
          <header className="mb-12 border-b border-white/10 pb-10 md:mb-16 md:pb-14">
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/40">Event recap</p>
            <h1 className="mt-4 font-display text-3xl font-bold uppercase leading-[0.95] tracking-[-0.01em] text-white md:text-4xl lg:text-5xl">{event.title}</h1>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.25em] text-white/40">
              <span>{event.date}</span>
              <span>{event.venue}</span>
            </div>
          </header>
          <p className="text-lg leading-relaxed text-white/70 md:text-xl md:leading-relaxed">{event.excerpt}</p>
          <div className="mt-10 space-y-6">
            {event.body.map((paragraph, i) => (<p key={i} className="text-base leading-relaxed text-white/55">{paragraph}</p>))}
          </div>
          <div className="mt-16 flex items-center justify-between border-t border-white/10 pt-10">
            <Link href="/events" className="test-btn-ghost inline-flex items-center px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em]">← All events</Link>
            <Link href="/contact" className="test-btn-primary inline-flex items-center px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em]">Book Ludzy</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
