export function InstagramCard() {
  return (
    <a
      href="https://www.instagram.com/dj_ludzy"
      target="_blank"
      rel="noopener noreferrer"
      className="group glass-panel relative flex min-h-full flex-col justify-between overflow-hidden rounded-3xl p-8 transition duration-300 hover:border-white/30 hover:shadow-[0_0_40px_-8px_rgba(164,100,230,0.4)]"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#a464e6]/30 via-[#f69845]/20 to-transparent blur-2xl transition group-hover:opacity-100"
        aria-hidden
      />
      <div>
        <p className="title-impact">Instagram</p>
        <p className="mt-6 font-script text-2xl text-white/90">Sets, previews &amp; behind the scenes</p>
        <p className="mt-4 text-sm leading-relaxed text-white/55">
          Follow for mixes, event clips, and room energy — updated regularly.
        </p>
      </div>
      <span className="mt-8 inline-flex items-center gap-3">
        <svg
          className="h-7 w-7 shrink-0 text-white/70 transition group-hover:text-[#f69845]"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z" />
        </svg>
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75 transition group-hover:text-white">
          @dj_ludzy
        </span>
        <span className="text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white" aria-hidden>
          →
        </span>
      </span>
    </a>
  );
}
