"use client";

import Image from "next/image";
import { useState } from "react";

/** Your exported PNG (preferred). Falls back to bundled SVG if PNG is missing. */
const LOGO_PNG = "/images/ludzy-logo.png";
const LOGO_SVG = "/images/ludzy-logo.svg";

/**
 * Wide wordmark — bottom-aligned with sound bars (both sit in `h-12` / `items-end`).
 */
export function LudzyLogoImage({ className = "" }: { className?: string }) {
  const [src, setSrc] = useState(LOGO_PNG);

  return (
    <div
      className={`relative h-12 w-[200px] shrink-0 sm:w-[228px] md:w-[256px] ${className}`}
    >
      <Image
        src={src}
        alt="LUDZY"
        fill
        priority
        sizes="(max-width: 768px) 200px, 256px"
        className="object-contain object-left-bottom"
        onError={() => {
          if (src !== LOGO_SVG) setSrc(LOGO_SVG);
        }}
      />
    </div>
  );
}
