"use client";

import { useState } from "react";
import { EventCoverImage } from "@/components/EventCoverImage";
import type { UpcomingEvent } from "@/lib/events-data";

export function TestUpcomingCard({ event }: { event: UpcomingEvent }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-6 py-8 text-left transition md:items-center md:py-10"
        aria-expanded={open}
      >
        <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:gap-10">
          <p className="shrink-0 text-[11px] font-bold uppercase tracking-[0.25em] text-white/35 md:w-48">
            {event.date}
          </p>

          <div className="flex flex-1 gap-4 md:gap-6">
            {event.imageUrl && (
              <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden sm:block md:h-20 md:w-32">
                <EventCoverImage
                  src={event.imageUrl}
                  alt=""
                  className="h-full w-full object-cover brightness-75"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-base font-bold uppercase tracking-[0.06em] text-white/90 md:text-lg">
                {event.title}
              </h3>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.2em] text-white/35">
                <span>{event.time}</span>
                {event.mapsUrl ? (
                  <a
                    href={event.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-white/60"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {event.location}
                  </a>
                ) : (
                  <span>{event.location}</span>
                )}
                <span>{event.setType}</span>
              </div>
            </div>
          </div>
        </div>

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center border transition-all duration-300 ${
            open
              ? "rotate-45 border-white/40 text-white"
              : "border-white/15 text-white/40"
          }`}
          aria-hidden
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="8" y1="3" x2="8" y2="13" />
            <line x1="3" y1="8" x2="13" y2="8" />
          </svg>
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-8 pl-0 md:pl-[calc(12rem+2.5rem)]">
            {event.imageUrl && (
              <div className="relative mb-6 aspect-[16/9] max-w-md overflow-hidden sm:hidden">
                <EventCoverImage
                  src={event.imageUrl}
                  alt=""
                  className="h-full w-full object-cover brightness-75"
                />
              </div>
            )}
            <p className="text-sm leading-relaxed text-white/55">{event.summary}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/45">{event.details}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
