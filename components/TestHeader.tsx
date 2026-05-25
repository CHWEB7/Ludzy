"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LudzyLogoImage } from "./LudzyLogoImage";

const navLinks = [
  { href: "/test", label: "Home" },
  { href: "/test/events", label: "Events" },
  { href: "/test/faq", label: "FAQ" },
  { href: "/test/contact", label: "Contact" },
] as const;

function MiniSoundBars() {
  return (
    <div className="flex h-5 shrink-0 items-end gap-[2px]" aria-hidden>
      {[7, 13, 5, 16, 9, 12, 6].map((h, i) => (
        <span
          key={i}
          className="test-sound-bar"
          style={{
            height: `${h}px`,
            width: "2.5px",
            animationDelay: `${i * 0.09}s`,
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
      className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/90 backdrop-blur-lg"
          : "bg-transparent"
      }`}
      role="banner"
    >
      <div className="flex w-full items-center justify-between px-5 py-3 md:px-8 lg:px-12">
        {/* Left: mini soundbars + logo */}
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

        {/* Right: nav links + CTA together */}
        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          <nav className="flex items-center gap-6 lg:gap-8" aria-label="Main">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/75 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <span className="h-5 w-px bg-white/20" aria-hidden />
          <Link
            href="/test/contact"
            className="test-btn-primary inline-flex px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.25em]"
          >
            Get in touch
          </Link>
        </div>

        {/* Mobile hamburger */}
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

      {/* Mobile dropdown */}
      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-out md:hidden ${
          menuOpen ? "max-h-72" : "max-h-0"
        }`}
      >
        <nav className="border-t border-white/10 px-5 pb-4 pt-2">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-bold uppercase tracking-[0.25em] text-white/75 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/test/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-2 block w-full text-center test-btn-primary px-6 py-3 text-[11px] font-bold uppercase tracking-[0.25em]"
          >
            Get in touch
          </Link>
        </nav>
      </div>
    </header>
  );
}
