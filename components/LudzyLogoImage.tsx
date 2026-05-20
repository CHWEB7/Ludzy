/** Official wordmark — must exist at `public/images/ludzy-logo.png` (your PNG export). */
const LOGO_PNG = "/images/ludzy-logo.png";

/**
 * Wide PNG wordmark — bottom-aligned with the sound bars (`h-12`).
 */
export function LudzyLogoImage({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-12 items-end ${className}`}>
      <img
        src={LOGO_PNG}
        alt="LUDZY"
        width={280}
        height={48}
        className="h-12 w-auto max-w-[min(280px,52vw)] object-contain object-left-bottom"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
}
