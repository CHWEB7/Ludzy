"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { LudzyLogoImage } from "./LudzyLogoImage";
import { SoundBars } from "./SoundBars";

const navItems = [
  { href: "#music", label: "Sound" },
  { href: "#services", label: "Services" },
  { href: "#mission", label: "Story" },
  { href: "#book", label: "Book" },
] as const;

const shellOuter = "rounded-[2rem]";
const shellInner = "rounded-[1.875rem]"; /* ~2rem − ring gutter */

function HamburgerGlyph({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3.5 w-[18px]" aria-hidden>
      <span
        className={`absolute left-0 h-0.5 w-full rounded-full bg-white transition-all duration-300 ease-out ${
          open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0 translate-y-0"
        }`}
      />
      <span
        className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-white transition-opacity duration-200 ease-out ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute left-0 h-0.5 w-full rounded-full bg-white transition-all duration-300 ease-out ${
          open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
        }`}
      />
    </span>
  );
}

export function FloatingHeader() {
  const [fade, setFade] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerId = useId();

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

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const barOpacity = useMemo(() => 1 - fade, [fade]);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-8" role="banner">
      <div className="mx-auto max-w-7xl transition-opacity duration-300 ease-out" style={{ opacity: barOpacity }}>
        <div className={`relative isolate mx-auto max-w-7xl ${shellOuter}`}>
          {/* Orbital surround (hero-card style) — visible in the 2px ring */}
          <div
            className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${shellOuter} transition-opacity duration-500 ${
              menuOpen ? "opacity-95" : "opacity-55"
            }`}
            aria-hidden
          >
            <div
              className={`absolute inset-[-50%] animate-spin-orbit bg-[conic-gradient(from_40deg,_rgba(163,163,163,0.12)_0deg,_rgba(255,255,255,0.88)_80deg,_rgba(82,82,82,0.5)_155deg,_rgba(255,255,255,0.45)_220deg,_rgba(212,212,212,0.65)_300deg,_rgba(163,163,163,0.12)_360deg)] motion-reduce:animate-none`}
            />
          </div>

          <div
            className={`pointer-events-auto relative z-[1] m-[2px] flex flex-col overflow-hidden ${shellInner} border border-white/15 bg-black/55 shadow-[0_25px_80px_-28px_rgba(0,0,0,0.88)] ring-1 ring-white/10 backdrop-blur-xl transition-shadow duration-500`}
          >
            <div className="flex items-end justify-between gap-3 px-4 py-3 md:gap-6 md:px-6 md:py-3.5">
              <Link
                href="#top"
                className="group flex min-w-0 cursor-pointer items-end gap-3 sm:gap-4"
                aria-label="LUDZY home"
              >
                <SoundBars />
                <LudzyLogoImage />
              </Link>

              <div className="flex flex-shrink-0 items-center gap-2 sm:gap-2.5">
                <Link
                  href="#book"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-white hover:bg-white hover:text-black"
                >
                  Enquire
                </Link>
                <button
                  type="button"
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition hover:border-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                  aria-expanded={menuOpen}
                  aria-controls={drawerId}
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  onClick={() => setMenuOpen((o) => !o)}
                >
                  <HamburgerGlyph open={menuOpen} />
                </button>
              </div>
            </div>

            <div
              id={drawerId}
              className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <nav
                  className="border-t border-white/10 px-4 pb-4 pt-1 md:px-6 md:pb-5"
                  aria-label="Site sections"
                >
                  <ul className="flex flex-col gap-0.5 pt-2">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-xl px-3 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white/75 transition hover:bg-white/10 hover:text-white"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
