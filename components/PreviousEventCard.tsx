import Link from "next/link";
import type { PreviousEvent } from "@/lib/events-data";

export function PreviousEventCard({ event }: { event: PreviousEvent }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="events-carousel-card group flex min-h-[280px] w-[min(88vw,340px)] shrink-0 snap-center flex-col rounded-[1.75rem] border border-white/12 bg-black/55 p-6 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.9)] ring-1 ring-white/10 backdrop-blur transition duration-300 hover:border-white/35 hover:bg-black/70 hover:shadow-[0_24px_60px_-20px_rgba(164,100,230,0.25)] sm:w-[320px] md:w-[360px]"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
        {event.date}
      </p>
      <h3 className="title-impact mt-4 !text-sm !tracking-[0.2em]">{event.title}</h3>
      <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/40">
        {event.venue}
      </p>
      <p className="mt-5 flex-1 text-sm leading-relaxed text-white/65 transition group-hover:text-white/80">
        {event.excerpt}
      </p>
      <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55 transition group-hover:text-white">
        Read recap <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
