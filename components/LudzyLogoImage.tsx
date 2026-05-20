import ludzyLogo from "@/public/images/ludzy-logo.png";

/**
 * Logo sizing is in globals.css (.ludzy-header-logo) + inline height fallback
 * so production always applies the correct scale next to the sound bars.
 */
export function LudzyLogoImage({ className = "" }: { className?: string }) {
  return (
    <div className={`ludzy-header-logo-wrap flex shrink-0 items-end ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ludzyLogo.src}
        alt="LUDZY"
        width={ludzyLogo.width}
        height={ludzyLogo.height}
        decoding="async"
        fetchPriority="high"
        className="ludzy-header-logo"
        style={{ width: "9.75rem", height: "auto", maxHeight: "2.85rem" }}
      />
    </div>
  );
}
