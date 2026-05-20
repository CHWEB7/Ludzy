"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LudzyLogoImage } from "./LudzyLogoImage";
import { SoundBars } from "./SoundBars";

const navItems = [
  { href: "#music", label: "Sound" },
  { href: "#services", label: "Services" },
  { href: "#mission", label: "Story" },
  { href: "#book", label: "Book" },
];

export function FloatingHeader() {
  const [fade, setFade] = useState(0);

  useEffect(() => {
    const maxScroll = 260;
    const onScroll = () => {
      const y = typeof window !== "undefined" ? window.scrollY : 0;
      const t = Math.min(1, y / maxScroll);
      setFade(t);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const barOpacity = useMemo(() => 1 - fade, [fade]);

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8"
      role="banner"
    >
      <div
        className="mx-auto max-w-7xl transition-opacity duration-300 ease-out"
        style={{ opacity: barOpacity }}
      >
        <div className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/15 bg-black/45 px-4 py-2.5 shadow-[0_25px_80px_-25px_rgba(0,0,0,0.85)] backdrop-blur-md sm:py-3 md:px-6">
          <Link
            href="#top"
            className="group flex cursor-pointer items-center gap-3 sm:gap-4"
            aria-label="LUDZY home"
          >
            <SoundBars />
            <LudzyLogoImage />
          </Link>

          <nav
            className="hidden items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 md:flex"
            aria-label="Primary"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="#book"
            className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-white hover:bg-white hover:text-black"
          >
            Enquire
          </Link>
        </div>

        {/* Mobile nav row */}
        <nav
          className="pointer-events-auto mt-3 flex items-center justify-center gap-2 overflow-x-auto pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 md:hidden"
          aria-label="Sections"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full border border-white/10 bg-black/55 px-3 py-2 backdrop-blur"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
