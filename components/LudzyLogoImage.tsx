import Image from "next/image";
import ludzyLogo from "@/public/images/ludzy-logo.png";

/**
 * Wide wordmark — bottom-aligned with SoundBars (parent `items-end`).
 */
export function LudzyLogoImage({ className = "" }: { className?: string }) {
  return (
    <div className={`flex shrink-0 items-end ${className}`}>
      <Image
        src={ludzyLogo}
        alt="LUDZY"
        width={420}
        height={84}
        priority
        className="block h-12 w-auto max-w-[min(252px,54vw)] object-contain object-left-bottom mix-blend-screen sm:max-w-[min(288px,50vw)] md:h-14 md:max-w-[min(328px,36vw)]"
      />
    </div>
  );
}
