"use client";

import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";

type CardItem = {
  title: string;
  copy: string;
  img?: string;
  /** For mix cards: embed URL */
  embedUrl?: string;
  /** For mix cards: link to open externally */
  externalUrl?: string;
};

type TestScrollCardsProps = {
  label: string;
  heading: string;
  items: CardItem[];
  variant?: "image" | "embed";
};

export function TestScrollCards({
  label,
  heading,
  items,
  variant = "image",
}: TestScrollCardsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sync]);

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: "smooth" });
    setTimeout(sync, 500);
  };

  return (
    <section className="px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Header row */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/40">
              {label}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[0.95] tracking-[-0.01em] text-white md:text-4xl lg:text-5xl">
              {heading}
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              disabled={!canLeft}
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition hover:border-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              disabled={!canRight}
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition hover:border-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          onScroll={sync}
          className="test-scroll-track flex gap-4 overflow-x-auto scroll-smooth pb-4 touch-pan-x md:gap-5"
        >
          {items.map((item, i) => (
            <article
              key={item.title}
              className="group relative flex w-[min(85vw,380px)] shrink-0 snap-start flex-col overflow-hidden border border-white/10 bg-black transition-colors hover:border-white/25 md:w-[420px]"
            >
              {variant === "image" && item.img && (
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 85vw, 420px"
                    className="object-cover brightness-[0.4] saturate-[0.15] transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <span className="absolute right-4 top-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/25">
                    0{i + 1}
                  </span>
                </div>
              )}

              {variant === "embed" && item.embedUrl && (
                <div className="relative w-full overflow-hidden bg-black/50">
                  <iframe
                    src={item.embedUrl}
                    title={item.title}
                    className="h-[180px] w-full border-0"
                    loading="lazy"
                    allow="autoplay"
                  />
                </div>
              )}

              <div className="flex flex-1 flex-col p-5 md:p-6">
                <h3 className="font-display text-lg font-bold uppercase tracking-[0.06em] text-white md:text-xl">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/45">
                  {item.copy}
                </p>
                {variant === "embed" && item.externalUrl && (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40 transition hover:text-white"
                  >
                    Listen on Mixcloud
                    <span aria-hidden>→</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Mobile swipe hint */}
        <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/25 sm:hidden">
          Swipe to explore
        </p>
      </div>
    </section>
  );
}
