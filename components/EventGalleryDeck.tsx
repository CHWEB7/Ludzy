"use client";

import { useState } from "react";
import { EventCoverImage } from "@/components/EventCoverImage";

type EventGalleryDeckProps = {
  images: string[];
  alt?: string;
};

export function EventGalleryDeck({ images, alt = "" }: EventGalleryDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  const active = images[activeIndex] ?? images[0];
  const hasMultiple = images.length > 1;

  const goTo = (index: number) => {
    const next = (index + images.length) % images.length;
    setActiveIndex(next);
  };

  return (
    <section className="mt-12 border-t border-white/10 pt-10" aria-label="Event photo gallery">
      <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/40">
        Gallery
      </p>

      <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden">
        <EventCoverImage
          src={active}
          alt={alt}
          className="h-full w-full object-cover brightness-75"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/60 text-white transition hover:border-white/40 hover:bg-black/80"
              aria-label="Previous photo"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/60 text-white transition hover:border-white/40 hover:bg-black/80"
              aria-label="Next photo"
            >
              →
            </button>
            <p className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70">
              {activeIndex + 1} / {images.length}
            </p>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden border transition ${
                index === activeIndex
                  ? "border-white/60 ring-1 ring-white/30"
                  : "border-white/15 opacity-70 hover:border-white/35 hover:opacity-100"
              }`}
              aria-label={`View photo ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <EventCoverImage
                src={src}
                alt=""
                className="h-full w-full object-cover brightness-75"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
