"use client";

import { useEffect, useRef, useState } from "react";

type SwipeCarouselProps = {
  label: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function SwipeCarousel({
  label,
  title,
  description,
  children,
}: SwipeCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollHints = () => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
  };

  useEffect(() => {
    updateScrollHints();
    const el = trackRef.current;
    if (!el) return;
    const onResize = () => updateScrollHints();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollBy = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.88, 400);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
    window.setTimeout(updateScrollHints, 400);
  };

  return (
    <section className="relative">
      <div className="mb-8 max-w-2xl">
        <p className="title-impact">{label}</p>
        <h2 className="mt-4 font-display text-2xl font-semibold uppercase tracking-[0.16em] text-white md:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-sm leading-relaxed text-white/55 md:text-base">
            {description}
          </p>
        ) : null}
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-8 bg-gradient-to-r from-ink to-transparent md:w-14"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-8 bg-gradient-to-r from-transparent to-ink md:w-14"
          aria-hidden
        />

        <div
          ref={trackRef}
          onScroll={updateScrollHints}
          className="events-carousel-track flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-3 pt-1 md:gap-5"
          role="region"
          aria-label={`${title} carousel`}
        >
          {children}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
            Swipe or use arrows
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={!canScrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:border-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Scroll previous"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={!canScrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:border-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Scroll next"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
