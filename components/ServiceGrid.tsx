"use client";

import { useState } from "react";

type Service = {
  id: string;
  title: string;
  icon: string;
  body: string;
  detail: string;
};

const services: Service[] = [
  {
    id: "gathering",
    title: "The Gathering",
    icon: "🥂",
    body: "Weddings, birthdays, christenings, themed parties, and any other celebrations — tailored tunes for you and your guests.",
    detail: "From ceremony warmth to dancefloor energy, sets are shaped around your timeline, crowd, and must-play moments.",
  },
  {
    id: "resident",
    title: "The Resident",
    icon: "🍸",
    body: "Pubs, clubs, restaurants, hotels, leisure clubs and cocktail bars — for a one off performance or a regular booking.",
    detail: "Consistent sonic identity week to week — warm-ups, peaks, and late-night textures that fit your venue’s brand.",
  },
  {
    id: "corporate",
    title: "The Corporate",
    icon: "💼",
    body: "High end functions, corporate events, team events and private parties — bring any corporate event to life with a curated sound set.",
    detail: "Polished pacing for receptions, showcases, awards, and after-parties — discrete, dependable, bespoke.",
  },
  {
    id: "terrace",
    title: "The Terrace Session",
    icon: "⛱️",
    body: "Garden parties, beer gardens and outdoor bars — open air melodies.",
    detail: "Daytime soul, sunset grooves, and breezy rollers — calibrated for alfresco acoustics.",
  },
];

export function ServiceGrid() {
  const [active, setActive] = useState<Service | null>(null);

  return (
    <>
      <div
        id="services"
        className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
      >
        {services.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s)}
            className="group relative flex cursor-pointer flex-col rounded-3xl border border-white/15 bg-black/55 p-6 text-left outline-none backdrop-blur transition duration-300 hover:border-white hover:bg-black/65 focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <div className="mb-6 flex justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/55 text-2xl transition group-hover:border-white">
                <span aria-hidden>{s.icon}</span>
              </span>
            </div>
            <h3 className="title-impact !text-sm !tracking-[0.25em]">
              {s.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/65">{s.body}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/55 transition group-hover:text-white">
              View details <span aria-hidden>→</span>
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-modal-title"
        >
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/20 bg-black p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70 transition hover:bg-white hover:text-black"
              onClick={() => setActive(null)}
            >
              Close
            </button>
            <div className="mb-6 flex justify-center">
              <span className="text-4xl" aria-hidden>
                {active.icon}
              </span>
            </div>
            <h2
              id="service-modal-title"
              className="title-impact !text-lg !tracking-[0.28em] text-center"
            >
              {active.title}
            </h2>
            <p className="mt-6 text-center text-sm leading-relaxed text-white/70">
              {active.body}
            </p>
            <p className="mt-6 text-center text-sm leading-relaxed text-white/55">
              {active.detail}
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="#book"
                onClick={() => setActive(null)}
                className="rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white/85"
              >
                Request availability
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
