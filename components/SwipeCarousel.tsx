"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollHints = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const overflow = scrollWidth - clientWidth > 4;
    setCanScrollLeft(overflow && scrollLeft > 4);
    setCanScrollRight(overflow && scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    updateScrollHints();

    const ro = new ResizeObserver(() => updateScrollHints());
    ro.observe(el);
    Array.from(el.children).forEach((child) => ro.observe(child));

    const onResize = () => updateScrollHints();
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [updateScrollHints]);

  const scrollBy = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;

    const cards = Array.from(
      el.querySelectorAll<HTMLElement>(".events-carousel-card"),
    );
    if (cards.length === 0) {
      const amount = Math.min(el.clientWidth * 0.85, 380);
      el.scrollBy({ left: dir * amount, behavior: "smooth" });
      window.setTimeout(updateScrollHints, 450);
      return;
    }

    const scrollLeft = el.scrollLeft;
    let target: number | null = null;

    if (dir > 0) {
      const next = cards.find((card) => card.offsetLeft + 4 > scrollLeft + 8);
      if (next) target = next.offsetLeft;
    } else {
      const prev = [...cards]
        .reverse()
        .find((card) => card.offsetLeft + card.offsetWidth - 4 < scrollLeft - 8);
      if (prev) target = prev.offsetLeft;
    }

    if (target == null) {
      const amount = Math.min(el.clientWidth * 0.85, 380);
      el.scrollBy({ left: dir * amount, behavior: "smooth" });
    } else {
      el.scrollTo({ left: target, behavior: "smooth" });
    }
    window.setTimeout(updateScrollHints, 450);
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || el.scrollWidth <= el.clientWidth + 4) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (e.deltaY === 0) return;
    e.preventDefault();
    el.scrollBy({ left: e.deltaY, behavior: "auto" });
    updateScrollHints();
  };

  return (
    <section className="relative min-w-0 w-full max-w-full">
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

      <div className="relative min-w-0 w-full max-w-full">
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
          onWheel={onWheel}
          className="events-carousel-track flex w-full min-w-0 max-w-full snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-3 pt-1 touch-pan-x md:gap-5"
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
