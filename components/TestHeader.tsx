"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LudzyLogoImage } from "./LudzyLogoImage";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/#enquire", label: "Enquire" },
] as const;

function MiniSoundBars() {
  return (
    <div className="flex h-4 shrink-0 items-end gap-[2px]" aria-hidden>
      {[6, 10, 4, 12, 7, 9].map((h, i) => (
        <span
          key={i}
          className="sound-bar-spectrum"
          style={{
            height: `${h}px`,
            width: "2.5px",
            animationDelay: `0s, ${i * 0.09}s`,
          }}
        />
      ))}
    </div>
  );
}

export function TestHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-test-header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/90 backdrop-blur-lg"
          : "bg-transparent"
      }`}
      role="banner"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        {/* Left: mini soundbars + logo (smaller) */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2"
          aria-label="LUDZY home"
        >
          <MiniSoundBars />
          <div className="test-header-logo-wrap">
            <LudzyLogoImage className="test-header-logo-override" />
          </div>
        </Link>

        {/* Center: inline nav links (desktop) */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: CTA + mobile hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href="/#enquire"
            className="test-btn-primary hidden px-5 py-2 text-[10px] font-bold uppercase tracking-[0.25em] sm:inline-flex"
          >
            Get in touch
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center text-white md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="relative block h-3 w-[16px]">
              <span
                className={`absolute left-0 h-[1.5px] w-full bg-white transition-all duration-300 ${
                  menuOpen
                    ? "top-1/2 -translate-y-1/2 rotate-45"
                    : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-white transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-full bg-white transition-all duration-300 ${
                  menuOpen
                    ? "top-1/2 -translate-y-1/2 -rotate-45"
                    : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-out md:hidden ${
          menuOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        <nav className="border-t border-white/10 px-5 pb-4 pt-2">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white/60 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
