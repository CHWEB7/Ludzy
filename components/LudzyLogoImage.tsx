import Image from "next/image";
import ludzyLogo from "@/public/images/ludzy-logo.png";

/**
 * Logo is bundled at build time from public/images/ludzy-logo.png.
 * NOT stored in Supabase — must be committed to Git so Vercel can build it in.
 */
export function LudzyLogoImage({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex h-12 shrink-0 items-end overflow-visible ${className}`}
    >
      <Image
        src={ludzyLogo}
        alt="LUDZY"
        width={320}
        height={64}
        priority
        className="block h-12 w-auto max-w-[min(300px,48vw)] object-contain object-left-bottom mix-blend-screen"
        style={{ width: "auto", maxHeight: "3rem" }}
      />
    </div>
  );
}
