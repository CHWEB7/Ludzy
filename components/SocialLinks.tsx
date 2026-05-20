const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/dj_ludzy",
    handle: "@dj_ludzy",
    icon: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z" />
    ),
    hover: "hover:border-[#f69845]/50 hover:shadow-[0_0_24px_-4px_rgba(164,100,230,0.35)]",
  },
  {
    name: "Mixcloud",
    href: "https://www.mixcloud.com/DJ-Ludzy/",
    handle: "DJ Ludzy",
    icon: (
      <path d="M3.5 14.5c2.2-3.8 4.4-5.7 6.6-5.7 1.4 0 2.5.7 3.4 2.1.9-1.4 2-2.1 3.4-2.1 2.2 0 4.4 1.9 6.6 5.7-.5 2.8-2.2 4.2-4.1 4.2-1.2 0-2.2-.5-3-1.5-.8 1-1.8 1.5-3 1.5-1.9 0-3.6-1.4-4.1-4.2z" />
    ),
    hover: "hover:border-white/40 hover:shadow-[0_0_24px_-4px_rgba(255,255,255,0.15)]",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1BWMcvt3xe/?mibextid=wwXIfr",
    handle: "LUDZY",
    icon: (
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    ),
    hover: "hover:border-[#4267B2]/40 hover:shadow-[0_0_24px_-4px_rgba(66,103,178,0.35)]",
  },
] as const;

type SocialLinksProps = {
  layout?: "stack" | "compact";
};

export function SocialLinks({ layout = "stack" }: SocialLinksProps) {
  return (
    <ul
      className={
        layout === "compact"
          ? "flex flex-col gap-2"
          : "flex flex-col gap-2 sm:flex-row sm:flex-wrap"
      }
    >
      {socials.map((item) => (
        <li key={item.name} className={layout === "stack" ? "" : "min-w-0 flex-1 sm:max-w-[14rem]"}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center gap-3 rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white/80 ring-1 ring-white/5 transition hover:bg-white/[0.07] hover:text-white ${item.hover}`}
          >
            <svg
              className="h-[22px] w-[22px] shrink-0 text-white/65 transition group-hover:text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              {item.icon}
            </svg>
            <span>
              <span className="sr-only">{item.name} — </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                {item.name}
              </span>
              <span className="font-semibold tracking-[0.1em]">{item.handle}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
