import { siteSocials } from "@/lib/site-socials";

const socialHandles: Record<string, string> = {
  Instagram: "@dj_ludzy",
  Mixcloud: "DJ Ludzy",
  Twitch: "djludzy",
  Facebook: "LUDZY",
};

const socialHovers: Record<string, string> = {
  Instagram: "hover:border-[#f69845]/50 hover:shadow-[0_0_24px_-4px_rgba(164,100,230,0.35)]",
  Mixcloud: "hover:border-white/40 hover:shadow-[0_0_24px_-4px_rgba(255,255,255,0.15)]",
  Twitch: "hover:border-[#9146FF]/40 hover:shadow-[0_0_24px_-4px_rgba(145,70,255,0.35)]",
  Facebook: "hover:border-[#4267B2]/40 hover:shadow-[0_0_24px_-4px_rgba(66,103,178,0.35)]",
};

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
      {siteSocials.map((item) => (
        <li key={item.name} className={layout === "stack" ? "" : "min-w-0 flex-1 sm:max-w-[14rem]"}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center gap-3 rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white/80 ring-1 ring-white/5 transition hover:bg-white/[0.07] hover:text-white ${socialHovers[item.name] ?? ""}`}
          >
            <span className="shrink-0 text-white/65 transition group-hover:text-white [&_svg]:h-[22px] [&_svg]:w-[22px]">
              {item.icon}
            </span>
            <span>
              <span className="sr-only">{item.name} — </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                {item.name}
              </span>
              <span className="font-semibold tracking-[0.1em]">{socialHandles[item.name] ?? item.name}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
