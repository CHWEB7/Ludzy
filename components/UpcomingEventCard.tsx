"use client";

import { useState } from "react";
import type { UpcomingEvent } from "@/lib/events-data";

export function UpcomingEventCard({ event }: { event: UpcomingEvent }) {
  const [open, setOpen] = useState(false);

  return (
    <article
      className={`events-carousel-card flex w-[min(88vw,340px)] shrink-0 snap-center flex-col overflow-hidden rounded-[1.75rem] border bg-black/55 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.9)] ring-1 backdrop-blur transition-all duration-500 sm:w-[320px] md:w-[360px] ${
        open
          ? "border-white/35 ring-white/20"
          : "border-white/12 ring-white/10 hover:border-white/25"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full flex-col p-6 text-left"
        aria-expanded={open}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
          {event.date}
        </p>
        <h3 className="title-impact mt-4 !text-sm !tracking-[0.2em]">{event.title}</h3>

        <dl className="mt-5 space-y-3 text-sm">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
              Time
            </dt>
            <dd className="mt-1 text-white/80">{event.time}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
              Location
            </dt>
            <dd className="mt-1 text-white/80">{event.location}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
              Set
            </dt>
            <dd className="mt-1 text-white/80">{event.setType}</dd>
          </div>
        </dl>

        <p className="mt-5 text-sm leading-relaxed text-white/60">{event.summary}</p>

        <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
          {open ? "Show less" : "More details"}
          <span
            className={`inline-block transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            aria-hidden
          >
            ↓
          </span>
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-white/10 px-6 pb-6 pt-4">
            <p className="text-sm leading-relaxed text-white/70">{event.details}</p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-white/35">
              Template — edit in lib/events-data.ts
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
