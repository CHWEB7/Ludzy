import ludzyLogo from "@/public/images/ludzy-logo.png";

/**
 * Native img with forced heights — Next/Image was ignoring Tailwind size classes.
 * Sound bars are h-12 (48px); logo is taller for balance, bottoms aligned via items-end.
 */
export function LudzyLogoImage({ className = "" }: { className?: string }) {
  return (
    <div className={`flex shrink-0 items-end leading-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ludzyLogo.src}
        alt="LUDZY"
        width={ludzyLogo.width}
        height={ludzyLogo.height}
        decoding="async"
        fetchPriority="high"
        className="ludzy-header-logo block !h-14 !w-auto max-w-[min(280px,58vw)] object-contain object-left-bottom mix-blend-screen sm:!h-[3.85rem] sm:max-w-[min(320px,52vw)] md:!h-[4.5rem] md:max-w-[min(360px,44vw)]"
      />
    </div>
  );
}
