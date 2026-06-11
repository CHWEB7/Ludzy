import Link from "next/link";
import { siteSocials } from "@/lib/site-socials";

const pageLinks = [
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/sitemap.xml", label: "Sitemap" },
] as const;

const linkClass =
  "inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40 transition hover:text-white";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-12 md:px-12 lg:px-20">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/50">DJ Ludzy</p>
          <p className="mt-3 text-[11px] leading-relaxed tracking-wide text-white/30">
            House &amp; dance music DJ — Suffolk &amp; East Anglia
          </p>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">Pages</p>
          <nav className="flex flex-col gap-2">
            {pageLinks.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">Socials</p>
          <nav className="flex flex-col gap-2">
            {siteSocials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {social.icon}
                {social.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">
          &copy; {new Date().getFullYear()} DJ Ludzy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
