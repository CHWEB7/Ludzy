import Image from "next/image";

/**
 * Static logo — NOT Supabase.
 * File must live at: public/images/ludzy-logo.png
 * Served as: https://yoursite.com/images/ludzy-logo.png
 */
const LOGO_SRC = "/images/ludzy-logo.png";

/**
 * Wide wordmark, bottom-aligned with sound bars (parent uses items-end + h-12).
 * mix-blend-screen hides black PNG matte on the dark glass header.
 */
export function LudzyLogoImage({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex h-12 shrink-0 items-end overflow-visible ${className}`}
    >
      <Image
        src={LOGO_SRC}
        alt="LUDZY"
        width={320}
        height={64}
        priority
        unoptimized
        className="block h-12 w-auto max-w-[min(300px,48vw)] object-contain object-left-bottom mix-blend-screen"
        style={{ width: "auto", maxHeight: "3rem" }}
      />
    </div>
  );
}
