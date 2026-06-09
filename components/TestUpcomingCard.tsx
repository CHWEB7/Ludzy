"use client";

import { useState } from "react";
import { AdminEditLink } from "@/components/admin/EventsAdminBar";
import type { UpcomingEvent } from "@/lib/events-data";

export function TestUpcomingCard({
  event,
  adminEditId,
}: {
  event: UpcomingEvent;
  adminEditId?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <article className="relative border-b border-white/10">
      {adminEditId && (
        <div className="absolute right-0 top-8 z-10">
          <AdminEditLink
            eventId={adminEditId}
            className="rounded border border-emerald-500/30 bg-black/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-300/90 backdrop-blur transition hover:border-emerald-400/50 hover:text-emerald-200"
          />
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-6 py-8 text-left transition md:items-center md:py-10"
        aria-expanded={open}
      >
        <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:gap-10">
          {/* Date */}
          <p className="shrink-0 text-[11px] font-bold uppercase tracking-[0.25em] text-white/35 md:w-48">
            {event.date}
          </p>

          {/* Title + meta */}
          <div className="flex-1">
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

        {/* Toggle icon */}
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

      {/* Expandable details */}
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-8 pl-0 md:pl-[calc(12rem+2.5rem)]">
            <p className="text-sm leading-relaxed text-white/55">
              {event.summary}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/45">
              {event.details}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
